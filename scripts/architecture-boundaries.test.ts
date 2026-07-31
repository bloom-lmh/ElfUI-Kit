import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const architecturePath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "2026-07-31-layering-and-state-ownership.md",
);
const architecture = readFileSync(architecturePath, "utf8");

/** Recursively returns TypeScript source files below a repository directory. */
const collectTypeScriptFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTypeScriptFiles(path);
    return path.endsWith(".ts") && !path.includes(".test.") ? [path] : [];
  });

/** Converts an absolute path to the stable slash-separated repository path. */
const toRepositoryPath = (path: string): string =>
  relative(repositoryRoot, path).replaceAll("\\", "/");

/** Extracts static import and re-export specifiers from a TypeScript module. */
const readModuleSpecifiers = (path: string): string[] => {
  const source = readFileSync(path, "utf8");
  const matches = source.matchAll(
    /\b(?:import|export)\s+(?:type\s+)?(?:[^"'`;]*?\s+from\s+)?["']([^"']+)["']/g,
  );
  return [...matches].map((match) => match[1] as string);
};

/** Resolves a relative TypeScript import while ignoring style and package imports. */
const resolveTypeScriptImport = (source: string, specifier: string): string | null => {
  if (!specifier.startsWith(".")) return null;
  const base = resolve(dirname(source), specifier.split("?")[0] as string);
  const candidates = [base, `${base}.ts`, join(base, "index.ts")];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
};

/** Returns a cycle from a directed graph, or an empty list when it is acyclic. */
const findCycle = (graph: Map<string, string[]>): string[] => {
  const visited = new Set<string>();
  const active = new Set<string>();
  const path: string[] = [];

  const visit = (node: string): string[] => {
    if (active.has(node)) return [...path.slice(path.indexOf(node)), node];
    if (visited.has(node)) return [];
    visited.add(node);
    active.add(node);
    path.push(node);
    for (const dependency of graph.get(node) ?? []) {
      const cycle = visit(dependency);
      if (cycle.length > 0) return cycle;
    }
    path.pop();
    active.delete(node);
    return [];
  };

  for (const node of graph.keys()) {
    const cycle = visit(node);
    if (cycle.length > 0) return cycle;
  }
  return [];
};

const sourceRoots = ["src/components", "src/composables", "src/utils", "src/adapters"].map((path) =>
  join(repositoryRoot, path),
);
const lowerLayerSources = sourceRoots.flatMap(collectTypeScriptFiles);

const foundationPaths = [
  "src/utils/virtual-window.ts",
  "src/adapters/date.ts",
  "src/components/Common/focus/focus-scope.ts",
  "src/components/Common/overlay/anchored-overlay.ts",
  "src/components/Common/overlay/modal-overlay-controller.ts",
  "src/components/Common/overlay/modal-overlay-stack.ts",
  "src/components/Common/overlay/overlay-interaction-controller.ts",
  "src/components/Common/overlay/overlay-protocol.ts",
  "src/components/Common/overlay/overlay-stack.ts",
  "src/composables/date.ts",
  "src/composables/field-values.ts",
  "src/composables/form.ts",
  "src/composables/useDismissibleOverlay.ts",
  "src/composables/useModalOverlay.ts",
  "src/components/Providers/config.ts",
  "src/components/Providers/service-defaults.ts",
].map((path) => join(repositoryRoot, path));

describe("architecture boundaries", () => {
  it("documents all domain owners, admitted patterns and explicit migration gaps", () => {
    for (const domain of [
      "## 1. Overlay",
      "## 2. Field and Form",
      "## 3. Collection",
      "## 4. Virtual Window",
      "## 5. Date",
      "## 6. Upload",
      "## 7. Layout",
      "## 8. Services",
    ]) {
      expect(architecture).toContain(domain);
    }
    for (const pattern of ["State Machine", "Strategy", "Adapter", "Controller", "Facade"]) {
      expect(architecture).toContain(`| ${pattern}`);
    }
    expect(architecture).toContain("src/components/Feedback/Loading/service.ts");
    expect(architecture).toContain("There is no authoritative owner");
    expect(architecture).toContain("does not mean `EP-04` is complete");
  });

  it("keeps lower layers independent from pages and the foundation graph acyclic", () => {
    const pageImports = lowerLayerSources.flatMap((source) =>
      readModuleSpecifiers(source)
        .map((specifier) => resolveTypeScriptImport(source, specifier))
        .filter((path): path is string => Boolean(path))
        .filter((path) => toRepositoryPath(path).startsWith("src/pages/"))
        .map((path) => `${toRepositoryPath(source)} -> ${toRepositoryPath(path)}`),
    );
    expect(pageImports).toEqual([]);

    const foundation = new Set(foundationPaths);
    const graph = new Map(
      foundationPaths.map((source) => [
        source,
        readModuleSpecifiers(source)
          .map((specifier) => resolveTypeScriptImport(source, specifier))
          .filter((path): path is string => Boolean(path) && foundation.has(path)),
      ]),
    );
    expect(findCycle(graph).map(toRepositoryPath)).toEqual([]);
  });

  it("keeps pure and Common foundation owners below component implementations", () => {
    for (const pureOwner of ["src/utils/virtual-window.ts", "src/adapters/date.ts"]) {
      expect(readModuleSpecifiers(join(repositoryRoot, pureOwner))).toEqual([]);
    }

    expect(
      readFileSync(join(repositoryRoot, "src/components/Data/virtual-window.ts"), "utf8").trim(),
    ).toBe('export * from "../../utils/virtual-window";');

    const commonSources = foundationPaths.filter((path) =>
      toRepositoryPath(path).startsWith("src/components/Common/"),
    );
    const invalidCommonImports = commonSources.flatMap((source) =>
      readModuleSpecifiers(source)
        .map((specifier) => resolveTypeScriptImport(source, specifier))
        .filter((path): path is string => Boolean(path))
        .filter((path) => !toRepositoryPath(path).startsWith("src/components/Common/"))
        .map((path) => `${toRepositoryPath(source)} -> ${toRepositoryPath(path)}`),
    );
    expect(invalidCommonImports).toEqual([]);
  });

  it("keeps Provider service defaults policy-only", () => {
    const source = readFileSync(
      join(repositoryRoot, "src/components/Providers/service-defaults.ts"),
      "utf8",
    );
    for (const forbiddenResource of [
      "document.",
      "window.",
      "addEventListener",
      "setTimeout",
      "setInterval",
      "XMLHttpRequest",
      "appendChild",
    ]) {
      expect(source).not.toContain(forbiddenResource);
    }
    expect(source).toContain("resolveServiceOptions");
    expect(source).toContain("useServiceDefaults");
  });

  it("prevents duplicate Loading service scroll-lock ownership", () => {
    const directBodyLockOwners = lowerLayerSources
      .filter((path) => readFileSync(path, "utf8").includes("document.body.style.overflow"))
      .map(toRepositoryPath)
      .sort();
    const localLockCounterOwners = lowerLayerSources
      .filter((path) => readFileSync(path, "utf8").includes("bodyLockCount"))
      .map(toRepositoryPath)
      .sort();

    expect(directBodyLockOwners).toEqual([]);
    expect(localLockCounterOwners).toEqual([]);
    expect(architecture).toContain(
      "Core `useScrollLock` owns both declarative and service-created Loading locks",
    );
  });
});
