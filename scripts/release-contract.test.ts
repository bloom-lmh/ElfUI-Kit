import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { RELEASE_STEPS } from "./release-check.mjs";

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;

describe("release contract", () => {
  it("has one ordered release gate containing every required check", () => {
    expect(RELEASE_STEPS.map((step) => step.script)).toEqual([
      "format:check",
      "lint",
      "spellcheck",
      "typecheck",
      "test:contracts",
      "test:kit",
      "test:website",
      "docs:locale-audit:strict",
      "build:website",
      "build:lib",
      "verify:package:built",
      "verify:tarball",
    ]);
  });

  it("routes both publish hooks through release:check", () => {
    const workspace = readJson("package.json");
    const kit = readJson("packages/kit/package.json");
    const workspaceScripts = workspace.scripts as Record<string, string>;
    const kitScripts = kit.scripts as Record<string, string>;

    expect(workspaceScripts.release).toBeUndefined();
    expect(workspaceScripts["release:check"]).toBe("node scripts/release-check.mjs");
    expect(workspaceScripts.prepublishOnly).toBe("pnpm release:check");
    expect(kitScripts.prepublishOnly).toBe("pnpm --dir ../.. release:check");
  });

  it("uses release:check as the only workflow validation command", () => {
    for (const path of [".github/workflows/ci.yml", ".github/workflows/release.yml"]) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain("run: pnpm release:check");
      expect(source).not.toMatch(/run: pnpm (?:test|build|typecheck|docs:locale-audit)\b/);
    }
  });
});
