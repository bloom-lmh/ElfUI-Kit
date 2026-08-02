import { describe, expect, it } from "vitest";
import {
  normalizeTableKeys,
  resolveTableRow,
  resolveTableRowKey,
  tableKeySignature,
} from "./row-model";
import type { TableTreeRow } from "./tree";

const rowView = (key: string, raw: Record<string, unknown>): TableTreeRow => ({
  key,
  raw,
  index: 0,
  level: 0,
  parentKey: "",
  path: [key],
  hasChildren: false,
});

describe("Table row model", () => {
  it("normalizes external key lists and creates stable signatures", () => {
    expect(normalizeTableKeys(["a", 2, "", null])).toEqual(["a", "2", "null"]);
    expect(normalizeTableKeys("a")).toEqual([]);
    expect(tableKeySignature(["a", "b"])).toBe("a::elf-table::b");
  });

  it("resolves nested and functional row keys with a safe fallback", () => {
    const row = { profile: { id: 7 } };
    expect(resolveTableRowKey(row, 0, "profile.id")).toBe("7");
    expect(resolveTableRowKey(row, "fallback", () => "custom")).toBe("custom");
    expect(
      resolveTableRowKey(row, "fallback", () => {
        throw new Error("invalid row");
      }),
    ).toBe("fallback");
  });

  it("resolves a row by key, raw identity or an existing row view", () => {
    const raw = { id: 1 };
    const row = rowView("1", raw);
    const rows = [row];

    expect(resolveTableRow(rows, 1)).toBe(row);
    expect(resolveTableRow(rows, raw)).toBe(row);
    expect(resolveTableRow(rows, row)).toBe(row);
    expect(resolveTableRow(rows, "missing")).toBeUndefined();
  });
});
