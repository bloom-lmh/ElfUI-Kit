import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

import { describe, expect, it } from "vitest";

const pagesRoot = join(process.cwd(), "src", "pages");
const sourceExtensions = new Set([".css", ".html", ".scss", ".ts"]);

const collectSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return sourceExtensions.has(extname(entry.name)) ? [path] : [];
  });

describe("documentation visual policy", () => {
  it("keeps page examples free of CSS gradients", () => {
    const offenders = collectSourceFiles(pagesRoot)
      .filter((path) => !path.endsWith("no-demo-gradients.test.ts"))
      .filter((path) =>
        /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/i.test(readFileSync(path, "utf8")),
      )
      .map((path) => path.slice(pagesRoot.length + 1));

    expect(offenders).toEqual([]);
  });
});
