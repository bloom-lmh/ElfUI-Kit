import { describe, expect, it } from "vitest";
import {
  createTableRowCollection,
  getSelectedTableRows,
  getTableDescendantRows,
  getTableSelectionSummary,
  isTableRowIndeterminate,
  normalizeTableSelection,
  toggleAllTableSelection,
  toggleTableRowSelection,
} from "./selection-model";
import type { TableTreeRow } from "./tree";

const row = (
  key: string,
  options: Partial<TableTreeRow> = {},
): TableTreeRow => ({
  key,
  index: 0,
  raw: { id: key },
  level: 0,
  parentKey: "",
  path: [key],
  hasChildren: false,
  ...options,
});

const root = row("root", { hasChildren: true });
const child = row("child", {
  level: 1,
  parentKey: "root",
  path: ["root", "child"],
});
const disabled = row("disabled", {
  level: 1,
  parentKey: "root",
  path: ["root", "disabled"],
});
const rows = [root, child, disabled];
const isSelectable = (item: TableTreeRow): boolean =>
  item.key !== "disabled";

describe("Table selection model", () => {
  it("normalizes existing keys and cascades a selected tree parent", () => {
    expect(
      normalizeTableSelection({
        keys: ["root", "missing"],
        rows,
        isTree: true,
        checkStrictly: false,
        isSelectable,
      }),
    ).toEqual(["root", "child"]);
    expect(
      normalizeTableSelection({
        keys: ["child"],
        rows,
        isTree: true,
        checkStrictly: false,
        isSelectable,
      }),
    ).toEqual(["child"]);
    expect(
      normalizeTableSelection({
        keys: ["root"],
        rows,
        isTree: true,
        checkStrictly: true,
        isSelectable,
      }),
    ).toEqual(["root"]);
  });

  it("derives descendants, row half-selection and header state", () => {
    expect(getTableDescendantRows(rows, root).map((item) => item.key)).toEqual([
      "child",
      "disabled",
    ]);
    expect(
      isTableRowIndeterminate(rows, root, ["child"], false, isSelectable),
    ).toBe(true);
    expect(
      isTableRowIndeterminate(rows, root, ["child"], true, isSelectable),
    ).toBe(false);
    expect(getTableSelectionSummary(rows, ["root"], isSelectable)).toEqual({
      selectableRows: [root, child],
      allSelected: false,
      indeterminate: true,
    });
  });

  it("toggles a row with tree cascade while respecting disabled rows", () => {
    expect(
      toggleTableRowSelection({
        keys: [],
        rows,
        row: root,
        selected: true,
        isTree: true,
        checkStrictly: false,
        isSelectable,
      }),
    ).toEqual(["root", "child"]);
    expect(
      toggleTableRowSelection({
        keys: [],
        rows,
        row: disabled,
        isTree: true,
        checkStrictly: false,
        isSelectable,
      }),
    ).toEqual([]);
  });

  it("toggles visible rows while retaining hidden and disabled selection", () => {
    const hidden = row("hidden");
    expect(
      toggleAllTableSelection({
        selectedKeys: ["hidden", "disabled"],
        visibleRows: rows,
        isSelectable,
        selectOnIndeterminate: true,
      }),
    ).toEqual(["hidden", "disabled", "root", "child"]);
    expect(
      toggleAllTableSelection({
        selectedKeys: ["hidden", "disabled", "root"],
        visibleRows: rows,
        isSelectable,
        selectOnIndeterminate: false,
      }),
    ).toEqual(["hidden", "disabled"]);
  });

  it("maps selected keys back to source rows in data order", () => {
    expect(getSelectedTableRows([...rows, row("last")], ["last", "child"]))
      .toEqual([{ id: "child" }, { id: "last" }]);
  });

  it("binds row operations to one immutable collection snapshot", () => {
    const collection = createTableRowCollection(rows, [root, child], true);

    expect(collection.resolve("child")).toBe(child);
    expect(
      collection.normalizeSelection(["root"], false, isSelectable),
    ).toEqual(["root", "child"]);
    expect(
      collection.selectionSummary(["root", "child"], isSelectable),
    ).toEqual({
      selectableRows: [root, child],
      allSelected: true,
      indeterminate: false,
    });
    expect(collection.selectedRows(["child"])).toEqual([{ id: "child" }]);
  });
});
