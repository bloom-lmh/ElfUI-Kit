import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { analyzeTypeScriptDependencies } from "./dependency-graph.mjs";

const temporaryRoots: string[] = [];

const createFixture = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), "elfui-dependency-graph-"));
  temporaryRoots.push(root);
  for (const [name, source] of Object.entries(files)) writeFileSync(join(root, name), source);
  return root;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("TypeScript dependency graph", () => {
  it("detects cycles made exclusively from type-only imports", () => {
    const root = createFixture({
      "a.ts": 'import type { B } from "./b"; export interface A { b?: B }',
      "b.ts": 'import { type A } from "./a"; export interface B { a?: A }',
    });
    const files = [join(root, "a.ts"), join(root, "b.ts")];
    const analysis = analyzeTypeScriptDependencies({
      files,
      repositoryRoot: root,
      sourceRoot: root,
    });

    expect(analysis.edges).toHaveLength(2);
    expect(analysis.edges.every(({ typeOnly }) => typeOnly)).toBe(true);
    expect(analysis.cycles).toEqual([[...files].sort()]);
  });

  it("includes dynamic imports when computing strongly connected components", () => {
    const root = createFixture({
      "entry.ts": 'export const load = () => import("./lazy");',
      "lazy.ts": 'import { load } from "./entry"; export { load };',
    });
    const files = [join(root, "entry.ts"), join(root, "lazy.ts")];
    const analysis = analyzeTypeScriptDependencies({
      files,
      repositoryRoot: root,
      sourceRoot: root,
    });

    expect(analysis.edges.some(({ dynamic }) => dynamic)).toBe(true);
    expect(analysis.cycles).toEqual([[...files].sort()]);
  });
});
