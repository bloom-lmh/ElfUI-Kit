import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// cspell:ignore xdescribe xtest imeout

const repositoryRoot = process.cwd();
const roots = ["apps", "packages", "scripts"];
const ignoredDirectories = new Set(["dist", "lib-dist", "node_modules", "output"]);
const testFilePattern = /(?:\.(?:test|spec)|\.playwright)\.(?:[cm]?[jt]sx?)$/u;

const collectFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(path);
    return testFilePattern.test(entry.name) ? [path] : [];
  });

const files = roots.flatMap((root) => collectFiles(join(repositoryRoot, root)));
const sources = files
  .filter((path) => !path.endsWith("test-discipline.test.ts"))
  .map((path) => ({
    path: relative(repositoryRoot, path).replaceAll("\\", "/"),
    source: readFileSync(path, "utf8"),
  }));

const violations = (pattern: RegExp): string[] =>
  sources.flatMap(({ path, source }) => (pattern.test(source) ? [path] : []));

describe("test discipline", () => {
  it("contains no skipped, focused, todo, or conditionally disabled tests", () => {
    expect(
      violations(
        /\b(?:describe|it|test)\s*\.\s*(?:skip|only|todo|skipIf|runIf)\s*\(|\b(?:xdescribe|xit|xtest)\s*\(/u,
      ),
    ).toEqual([]);
  });

  it("does not hide failures with retries or expanded test timeouts", () => {
    const configurationSources = [
      "package.json",
      "vitest.config.ts",
      "playwright.baseline.config.ts",
      ".github/workflows/ci.yml",
      ".github/workflows/release.yml",
    ].map((path) => ({ path, source: readFileSync(path, "utf8") }));
    const offenders = configurationSources.flatMap(({ path, source }) => {
      const expandedTimeout = /(?:testTimeout|hookTimeout)\s*:|--(?:test|hook)[-Tt]imeout\b/u.test(
        source,
      );
      const retry = /\b(?:retry|retries)\s*:\s*[1-9]/u.test(source);
      return expandedTimeout || retry ? [path] : [];
    });
    expect(offenders).toEqual([]);
  });

  it("uses state-based Playwright synchronization instead of fixed sleeps", () => {
    expect(violations(/\.waitForTimeout\s*\(|\bsleep\s*\(/u)).toEqual([]);
  });

  it("keeps the test inventory visible", () => {
    const testDeclarations = sources.reduce(
      (count, { source }) => count + (source.match(/\b(?:it|test)\s*\(/gu)?.length ?? 0),
      0,
    );
    expect(files.length).toBeGreaterThan(0);
    expect(testDeclarations).toBeGreaterThan(0);
  });
});
