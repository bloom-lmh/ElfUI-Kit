import { describe, expect, it } from "vitest";
import {
  getTableColumnSize,
  normalizeTableColumns,
  normalizeTableSize,
  tableSizeNumber,
} from "./column-model";

describe("Table column model", () => {
  it("normalizes table dimensions without depending on DOM", () => {
    expect(normalizeTableSize(120)).toBe("120px");
    expect(normalizeTableSize(" 96 ")).toBe("96px");
    expect(normalizeTableSize("min(30vw, 240px)")).toBe("min(30vw, 240px)");
    expect(normalizeTableSize(null)).toBe("");
    expect(tableSizeNumber("12.5rem")).toBe(12.5);
    expect(tableSizeNumber("auto")).toBe(0);
  });

  it("infers default columns from the first row", () => {
    const columns = normalizeTableColumns({
      columns: [],
      firstRow: { id: "1", profile: "ElfUI" },
      actionsLabel: "操作",
    });

    expect(columns.map(({ prop, label, minWidth }) => ({ prop, label, minWidth }))).toEqual([
      { prop: "id", label: "id", minWidth: "120px" },
      { prop: "profile", label: "profile", minWidth: "120px" },
    ]);
  });

  it("normalizes type, labels, alignment, sizing and sorting once", () => {
    const source = [
      { type: "selection", width: 48 },
      { type: "index" },
      { type: "unknown", align: "right", headerAlign: "center", sortable: true },
      { type: "actions", sortable: "custom" },
    ];
    const columns = normalizeTableColumns({
      columns: source,
      actionsLabel: "Actions",
    });

    expect(
      columns.map(({ type, prop, label, minWidth }) => ({
        type,
        prop,
        label,
        minWidth,
      })),
    ).toEqual([
      { type: "selection", prop: "selection", label: "", minWidth: "48px" },
      { type: "index", prop: "index", label: "#", minWidth: "64px" },
      { type: "default", prop: "unknown", label: "unknown", minWidth: "120px" },
      { type: "actions", prop: "actions", label: "Actions", minWidth: "140px" },
    ]);
    expect(columns[2]).toEqual(
      expect.objectContaining({
        align: "right",
        headerAlign: "center",
        sortable: true,
      }),
    );
    expect(columns[3]!.sortable).toBe("custom");
    expect(source[0]).toEqual({ type: "selection", width: 48 });
  });

  it("computes fixed offsets and boundaries with live width overrides", () => {
    const columns = normalizeTableColumns({
      columns: [
        { id: "select", type: "selection", width: 48, fixed: "left" },
        { id: "name", prop: "name", width: 120, fixed: "left" },
        { prop: "role", minWidth: 160 },
        { id: "score", prop: "score", width: 100, fixed: "right" },
        { id: "actions", type: "actions", fixed: "right" },
      ],
      widths: { name: 168, actions: 156 },
      actionsLabel: "操作",
    });

    expect(
      columns.map(({ id, fixedOffset, fixedLast }) => ({
        id,
        fixedOffset,
        fixedLast,
      })),
    ).toEqual([
      { id: "select", fixedOffset: "0px", fixedLast: false },
      { id: "name", fixedOffset: "48px", fixedLast: true },
      { id: "role", fixedOffset: "", fixedLast: false },
      { id: "score", fixedOffset: "156px", fixedLast: true },
      { id: "actions", fixedOffset: "0px", fixedLast: false },
    ]);
    expect(getTableColumnSize(columns[1]!, { name: 168 })).toBe(168);
    expect(getTableColumnSize(columns[2]!)).toBe(160);
  });
});
