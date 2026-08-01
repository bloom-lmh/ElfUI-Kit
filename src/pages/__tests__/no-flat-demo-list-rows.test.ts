import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

import { describe, expect, it } from "vitest";

const pagesRoot = join(process.cwd(), "src", "pages");

const collectTypeScriptFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTypeScriptFiles(path);
    return extname(entry.name) === ".ts" ? [path] : [];
  });

describe("documentation list visual policy", () => {
  it("does not render repeated demo rows as flat overlay blocks", () => {
    const repeatedOverlayRow = /v-for[\s\S]{0,500}background\s*:\s*var\(--elf-bg-overlay\)/i;
    const offenders = collectTypeScriptFiles(pagesRoot)
      .filter((path) => !path.endsWith("no-flat-demo-list-rows.test.ts"))
      .filter((path) => repeatedOverlayRow.test(readFileSync(path, "utf8")))
      .map((path) => path.slice(pagesRoot.length + 1));

    expect(offenders).toEqual([]);
  });
});
