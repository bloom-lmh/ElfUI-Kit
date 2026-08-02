import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const kitSourceRoot = join(repositoryRoot, "packages", "kit", "src");
const kitSourcePath = (path: string): string => join(kitSourceRoot, path);
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

const sourceRoots = ["components", "composables", "utils", "adapters"].map(kitSourcePath);
const lowerLayerSources = sourceRoots.flatMap(collectTypeScriptFiles);

const foundationPaths = [
  "utils/virtual-window.ts",
  "adapters/date.ts",
  "components/Common/focus/focus-scope.ts",
  "components/Common/overlay/anchored-overlay.ts",
  "components/Common/overlay/modal-overlay-controller.ts",
  "components/Common/overlay/modal-overlay-stack.ts",
  "components/Common/overlay/overlay-interaction-controller.ts",
  "components/Common/overlay/overlay-protocol.ts",
  "components/Common/overlay/overlay-stack.ts",
  "composables/date.ts",
  "composables/field-values.ts",
  "composables/form.ts",
  "composables/useDismissibleOverlay.ts",
  "composables/useModalOverlay.ts",
  "components/Providers/config.ts",
  "components/Providers/service-defaults.ts",
].map(kitSourcePath);

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
        .filter((path) => toRepositoryPath(path).startsWith("apps/website/src/pages/"))
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
    for (const pureOwner of ["utils/virtual-window.ts", "adapters/date.ts"]) {
      expect(readModuleSpecifiers(kitSourcePath(pureOwner))).toEqual([]);
    }

    expect(readFileSync(kitSourcePath("components/Data/virtual-window.ts"), "utf8").trim()).toBe(
      'export * from "../../utils/virtual-window";',
    );

    const commonSources = foundationPaths.filter((path) =>
      toRepositoryPath(path).startsWith("packages/kit/src/components/Common/"),
    );
    const invalidCommonImports = commonSources.flatMap((source) =>
      readModuleSpecifiers(source)
        .map((specifier) => resolveTypeScriptImport(source, specifier))
        .filter((path): path is string => Boolean(path))
        .filter((path) => !toRepositoryPath(path).startsWith("packages/kit/src/components/Common/"))
        .map((path) => `${toRepositoryPath(source)} -> ${toRepositoryPath(path)}`),
    );
    expect(invalidCommonImports).toEqual([]);
  });

  it("keeps Provider service defaults policy-only", () => {
    const source = readFileSync(kitSourcePath("components/Providers/service-defaults.ts"), "utf8");
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

  it("keeps Parallax observers owned by Core and shared controllers", () => {
    const source = readFileSync(kitSourcePath("components/Data/Parallax/index.ts"), "utf8");
    const rootObserver = readFileSync(
      kitSourcePath("components/Data/Parallax/root-observer.ts"),
      "utf8",
    );

    expect(source).toContain("useResizeObserver(host, scheduleUpdate)");
    expect(rootObserver).toMatch(
      /import \{ createMutateController \} from "\.\.\/\.\.\/\.\.\/directives\/observers";/,
    );
    expect(source).toContain("subscribeRootMutations(root");
    expect(rootObserver).toContain("createMutateController(root");
    expect(source).toContain("mutationAffectsScrollOwnership");
    expect(source).not.toContain("new ResizeObserver");
    expect(source).not.toContain("new MutationObserver");
    expect(rootObserver).not.toContain("new MutationObserver");
  });
});
