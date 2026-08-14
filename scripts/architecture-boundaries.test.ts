import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  analyzeTypeScriptDependencies,
  isTypeScriptSource,
  isTypeScriptTestSource,
  readTypeScriptModuleSpecifiers,
  resolveTypeScriptModule,
} from "./dependency-graph.mjs";

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
    return isTypeScriptSource(path) && !isTypeScriptTestSource(path) ? [path] : [];
  });

/** Converts an absolute path to the stable slash-separated repository path. */
const toRepositoryPath = (path: string): string =>
  relative(repositoryRoot, path).replaceAll("\\", "/");

/** Extracts static import and re-export specifiers from a TypeScript module. */
const readModuleSpecifiers = (path: string): string[] => {
  return readTypeScriptModuleSpecifiers(path).map(({ specifier }) => specifier);
};

/** Resolves a relative TypeScript import while ignoring style and package imports. */
const resolveTypeScriptImport = resolveTypeScriptModule;

const allKitSources = collectTypeScriptFiles(kitSourceRoot);
const lowerLayerSources = allKitSources;

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

const dependencyAnalysis = analyzeTypeScriptDependencies({
  files: allKitSources,
  repositoryRoot,
  sourceRoot: kitSourceRoot,
});

const lowerLayerNames = new Set(["adapters", "composables", "directives", "types", "utils"]);
const componentFoundationNames = new Set(["Common", "Providers"]);
const kitPathSegments = (path: string): string[] =>
  relative(kitSourceRoot, path).replaceAll("\\", "/").split("/");

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

  it("keeps lower layers independent from pages", () => {
    const pageImports = lowerLayerSources.flatMap((source) =>
      readModuleSpecifiers(source)
        .map((specifier) => resolveTypeScriptImport(source, specifier))
        .filter((path): path is string => Boolean(path))
        .filter((path) => toRepositoryPath(path).startsWith("apps/website/src/pages/"))
        .map((path) => `${toRepositoryPath(source)} -> ${toRepositoryPath(path)}`),
    );
    expect(pageImports).toEqual([]);
  });

  it("keeps the full non-test TypeScript graph acyclic and lower layers below components", () => {
    const cycles = dependencyAnalysis.cycles.map((component) =>
      component.map(toRepositoryPath).sort(),
    );
    const reverseComponentImports = dependencyAnalysis.edges
      .filter(({ source, target }) => {
        const sourceSegments = kitPathSegments(source);
        const targetSegments = kitPathSegments(target);
        return (
          lowerLayerNames.has(sourceSegments[0] ?? "") &&
          targetSegments[0] === "components" &&
          !componentFoundationNames.has(targetSegments[1] ?? "")
        );
      })
      .map(
        ({ source, target, typeOnly, dynamic }) =>
          `${toRepositoryPath(source)} -> ${toRepositoryPath(target)}` +
          `${typeOnly ? " [type-only]" : ""}${dynamic ? " [dynamic]" : ""}`,
      )
      .sort();

    expect(dependencyAnalysis.unresolvedRelativeImports).toEqual([]);
    expect(cycles).toEqual([]);
    expect(reverseComponentImports).toEqual([]);
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
