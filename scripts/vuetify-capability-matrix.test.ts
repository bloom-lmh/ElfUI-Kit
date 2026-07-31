// cspell:words vuetifyjs

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const matrixPath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "2026-07-31-vuetify-capability-matrix.md",
);
const matrix = readFileSync(matrixPath, "utf8");

const categories = [
  "Defaults",
  "Theme",
  "Locale",
  "Icons",
  "Display",
  "Layout",
  "Platform",
  "Date",
  "GoTo",
  "Overlay",
  "Services",
  "Directives",
  "Aliases",
  "Tokens",
  "SSR",
] as const;

type Status = "supported" | "equivalent" | "missing" | "not applicable";

interface MatrixRow {
  category: string;
  authority: string;
  kit: string;
  consumers: string;
  status: Status;
  followUp: string;
  boundary: string;
}

/** Parses the fixed seven-column table so adding a category cannot silently omit a field. */
const readRows = (): MatrixRow[] => {
  return matrix
    .split("\n")
    .filter((line) => line.startsWith("| **"))
    .map((line) => {
      const columns = line
        .split("|")
        .slice(1, -1)
        .map((column) => column.trim());
      const [categoryCell, authority, kit, consumers, statusCell, followUp, boundary] = columns;
      const category = categoryCell?.match(/^\*\*(.+?)\*\*$/)?.[1] ?? "";
      const status = statusCell?.replaceAll("`", "") as Status;
      return { category, authority, kit, consumers, status, followUp, boundary };
    });
};

const expectedStatuses: Record<(typeof categories)[number], Status> = {
  Defaults: "equivalent",
  Theme: "equivalent",
  Locale: "equivalent",
  Icons: "equivalent",
  Display: "equivalent",
  Layout: "missing",
  Platform: "missing",
  Date: "equivalent",
  GoTo: "equivalent",
  Overlay: "equivalent",
  Services: "not applicable",
  Directives: "equivalent",
  Aliases: "missing",
  Tokens: "equivalent",
  SSR: "missing",
};

describe("Vuetify capability matrix", () => {
  it("covers the complete cross-component capability taxonomy", () => {
    const rows = readRows();
    expect(rows).toHaveLength(categories.length);
    expect(rows.map((row) => row.category)).toEqual([...categories]);
    expect(new Set(rows.map((row) => row.category)).size).toBe(categories.length);
  });

  it("records an authority, Kit owner, consumers, status, and follow-up for every row", () => {
    const rows = readRows();
    for (const row of rows) {
      expect(row.authority).toContain("v4.1.7");
      expect(row.kit.length).toBeGreaterThan(10);
      expect(row.consumers.length).toBeGreaterThan(5);
      expect(row.followUp.length).toBeGreaterThan(3);
      expect(row.boundary.length).toBeGreaterThan(10);
      expect(expectedStatuses[row.category as (typeof categories)[number]]).toBe(row.status);
    }
  });

  it("keeps local owners and official source links real", () => {
    const localOwners = [
      "src/components/Providers/DefaultsProvider/index.ts",
      "src/components/Providers/ThemeProvider/index.ts",
      "src/components/Providers/LocaleProvider/index.ts",
      "src/components/Providers/IconProvider/index.ts",
      "src/components/Providers/ConfigProvider/index.ts",
      "src/adapters/date.ts",
      "src/composables/goTo.ts",
      "src/components/Common/overlay/overlay-protocol.ts",
      "src/components/Providers/service-defaults.ts",
      "src/directives/index.ts",
      "src/styles/_tokens.scss",
    ];
    for (const owner of localOwners) {
      expect(existsSync(join(repositoryRoot, owner))).toBe(true);
      expect(matrix).toContain(owner);
    }

    expect(
      matrix.match(/https:\/\/github\.com\/vuetifyjs\/vuetify\/blob\/v4\.1\.7/g)?.length,
    ).toBeGreaterThanOrEqual(categories.length);
    expect(matrix).toContain("vuetify@4.1.7");
  });

  it("preserves explicit gaps and does not inflate parity with empty APIs", () => {
    expect(matrix).toContain("No shared Kit owner");
    expect(matrix).toContain("no complete platform owner");
    expect(matrix).toContain("not applicable");
    expect(matrix).toContain("does not close `VU-02`");
    expect(matrix).toContain("Do not replace Custom Element registration");
  });
});
