import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

interface PackageManifest {
  sideEffects?: string[];
}

describe("package side-effect contract", () => {
  it("preserves source component registration in production builds", () => {
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8")
    ) as PackageManifest;

    expect(manifest.sideEffects).toEqual(expect.arrayContaining([
      "./src/components/index.ts",
      "./src/components/**/index.ts",
      "./lib-dist/elfui-kit.js"
    ]));
  });
});
