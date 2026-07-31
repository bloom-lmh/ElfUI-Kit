// cspell:words unpkg Cascader routerResult

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const matrixPath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "2026-07-31-element-plus-contract-matrix.md",
);
const matrix = readFileSync(matrixPath, "utf8");

const families = [
  "Form",
  "DatePicker",
  "TimePicker",
  "Tabs",
  "Upload",
  "Table",
  "Cascader",
  "Tree",
  "Menu",
  "Select",
  "Scoped Slots",
] as const;

type Status = "supported" | "equivalent" | "missing" | "not applicable";

interface MatrixRow {
  family: string;
  authority: string;
  kit: string;
  control: string;
  events: string;
  semantics: string;
  status: Status;
  followUp: string;
}

/** Parses the seven-column contract table after Prettier has aligned its cells. */
const readRows = (): MatrixRow[] =>
  matrix
    .split("\n")
    .filter((line) => line.startsWith("| **"))
    .map((line) => {
      const columns = line
        .split("|")
        .slice(1, -1)
        .map((column) => column.trim());
      const [familyCell, authority, kit, control, events, semantics, statusCell] = columns;
      const family = familyCell?.match(/^\*\*(.+?)\*\*$/)?.[1] ?? "";
      const status = statusCell?.match(/`(.+?)`/)?.[1] as Status;
      const followUp = statusCell?.split("/").slice(1).join("/").trim() ?? "";
      return { family, authority, kit, control, events, semantics, status, followUp };
    });

const expectedStatuses: Record<(typeof families)[number], Status> = {
  Form: "equivalent",
  DatePicker: "equivalent",
  TimePicker: "equivalent",
  Tabs: "equivalent",
  Upload: "equivalent",
  Table: "equivalent",
  Cascader: "missing",
  Tree: "equivalent",
  Menu: "equivalent",
  Select: "equivalent",
  "Scoped Slots": "missing",
};

describe("Element Plus public contract matrix", () => {
  it("covers every high-risk component family in plan order", () => {
    const rows = readRows();
    expect(rows).toHaveLength(families.length);
    expect(rows.map((row) => row.family)).toEqual([...families]);
    expect(new Set(rows.map((row) => row.family)).size).toBe(families.length);
  });

  it("records authority, owner, defaults, payloads, semantics, status, and follow-up", () => {
    for (const row of readRows()) {
      expect(row.authority).toContain("element-plus@2.14.3");
      expect(row.kit).toContain("src/components/");
      expect(row.control.length).toBeGreaterThan(20);
      expect(row.events.length).toBeGreaterThan(20);
      expect(row.semantics.length).toBeGreaterThan(20);
      expect(expectedStatuses[row.family as (typeof families)[number]]).toBe(row.status);
      expect(row.followUp).toMatch(/EP-|OP-/);
    }
  });

  it("references current local public-contract owners", () => {
    const owners = [
      "src/components/Form/Form/types.ts",
      "src/components/Picker/DatePicker/types.ts",
      "src/components/Picker/TimePicker/types.ts",
      "src/components/Navigation/Tabs/types.ts",
      "src/components/Form/Upload/types.ts",
      "src/components/Data/Table/types.ts",
      "src/components/Form/Cascader/types.ts",
      "src/components/Data/Tree/types.ts",
      "src/components/Navigation/Menu/types.ts",
      "src/components/Form/Select/types.ts",
      "src/components/Data/Transfer/types.ts",
      "src/components/Form/Segmented/types.ts",
      "src/components/Picker/Calendar/types.ts",
    ];
    for (const owner of owners) {
      expect(existsSync(join(repositoryRoot, owner))).toBe(true);
      expect(matrix).toContain(owner);
    }
  });

  it("keeps real gaps explicit instead of adding empty compatibility APIs", () => {
    expect(matrix).toContain("change(CascaderChangeDetail)");
    expect(matrix).toContain("Element Plus `change(value)`");
    expect(matrix).toContain("`routerResult` is Vue Router-specific");
    expect(matrix).toContain("no fake slot event or empty expose method");
    expect(matrix).toContain("Controlled inputs always win over default inputs");
    expect(matrix).toContain("does not close `EP-02` through `EP-10`");
  });
});
