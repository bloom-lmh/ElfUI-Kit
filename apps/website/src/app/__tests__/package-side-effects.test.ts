import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

interface PackageManifest {
  sideEffects?: boolean | string[];
  exports?: Record<string, unknown>;
}

describe("package side-effect contract", () => {
  it("keeps the single package root free of import-time registration", () => {
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), "packages", "kit", "package.json"), "utf8"),
    ) as PackageManifest;

    expect(manifest.sideEffects).toBe(false);
    expect(Object.keys(manifest.exports ?? {})).toEqual(["."]);
  });
});
