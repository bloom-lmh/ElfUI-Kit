import { describe, expect, it, vi } from "vitest";
import {
  activeTableFilterColumns,
  getTableValueAtPath,
  normalizeTableFilterOptions,
  normalizeTableFilterValues,
  normalizeTableSortOrders,
  sortTableRows,
  tableFilterSignature,
  tableRowMatchesFilters,
  type TableSortFilterColumn,
} from "./sort-filter";

const column = (prop: string, raw: Record<string, unknown> = {}): TableSortFilterColumn => ({
  prop,
  sortable: raw.sortable === "custom" ? "custom" : Boolean(raw.sortable),
  raw: { prop, ...raw },
});

describe("Table sort-filter model", () => {
  it("reads nested values and keeps filter value types distinct", () => {
    expect(getTableValueAtPath({ profile: { score: 12 } }, "profile.score")).toBe(12);
    expect(getTableValueAtPath({ profile: null }, "profile.score")).toBeUndefined();
    expect(tableFilterSignature([1, "1", true])).not.toBe(tableFilterSignature(["1", 1, true]));
  });

  it("normalizes runtime filter options, allowed values, duplicates and single selection", () => {
    const target = column("role", {
      filterMultiple: false,
      filters: [{ text: "管理员", value: "admin" }, { value: 2 }, null],
    });

    expect(normalizeTableFilterOptions(target)).toEqual([
      { text: "管理员", value: "admin" },
      { text: "2", value: 2 },
    ]);
    expect(normalizeTableFilterValues(target, ["admin", "admin", 2, "missing"])).toEqual(["admin"]);
  });

  it("matches OR values within a column and AND conditions across columns", () => {
    const columns = [
      column("role", {
        filters: [
          { text: "管理员", value: "admin" },
          { text: "访客", value: "viewer" },
        ],
      }),
      column("profile.active", {
        columnKey: "active",
        filters: [{ text: "启用", value: true }],
      }),
    ];
    const values = {
      role: ["admin", "viewer"],
      active: [true],
    };

    expect(activeTableFilterColumns(columns, values)).toHaveLength(2);
    expect(
      tableRowMatchesFilters({ role: "viewer", profile: { active: true } }, columns, values),
    ).toBe(true);
    expect(
      tableRowMatchesFilters({ role: "viewer", profile: { active: false } }, columns, values),
    ).toBe(false);
    expect(
      tableRowMatchesFilters({ role: "viewer", profile: { active: false } }, columns, {
        role: ["viewer"],
      }),
    ).toBe(true);
  });

  it("uses filterMethod safely and treats a thrown matcher as no match", () => {
    const matcher = vi.fn(
      (value: unknown, row: Record<string, unknown>) => Number(row.score) >= Number(value),
    );
    const target = column("score", {
      filters: [{ text: "及格", value: 60 }],
      filterMethod: matcher,
    });

    expect(tableRowMatchesFilters({ score: 80 }, [target], { score: [60] })).toBe(true);
    expect(matcher).toHaveBeenCalledWith(60, { score: 80 }, target.raw);

    target.raw.filterMethod = () => {
      throw new Error("invalid matcher");
    };
    expect(tableRowMatchesFilters({ score: 80 }, [target], { score: [60] })).toBe(false);
  });

  it("sorts nested values, sortBy paths and sortMethod without mutating source", () => {
    const source = [
      { id: "2", profile: { team: "B", score: 10 } },
      { id: "10", profile: { team: "A", score: 8 } },
      { id: "1", profile: { team: "A", score: 12 } },
    ];
    const byPaths = column("id", {
      sortable: true,
      sortBy: ["profile.team", "profile.score"],
    });

    expect(sortTableRows([byPaths], source, "id", "ascending").map((row) => row.id)).toEqual([
      "10",
      "1",
      "2",
    ]);
    expect(source.map((row) => row.id)).toEqual(["2", "10", "1"]);

    const method = vi.fn((left: Record<string, unknown>, right: Record<string, unknown>) =>
      String(right.id).localeCompare(String(left.id), "en", { numeric: true }),
    );
    const byMethod = column("id", { sortable: true, sortMethod: method });
    expect(sortTableRows([byMethod], source, "id", "ascending").map((row) => row.id)).toEqual([
      "10",
      "2",
      "1",
    ]);
    expect(method).toHaveBeenCalled();
  });

  it("leaves remote custom sorting untouched and normalizes sort order cycles", () => {
    const custom = column("id", {
      sortable: "custom",
      sortOrders: ["descending", null, "descending"],
    });
    const source = [{ id: 2 }, { id: 1 }];

    expect(sortTableRows([custom], source, "id", "ascending")).toEqual(source);
    expect(sortTableRows([custom], source, "id", "ascending")).not.toBe(source);
    expect(normalizeTableSortOrders(custom)).toEqual(["descending", ""]);
    expect(normalizeTableSortOrders(column("id"))).toEqual(["ascending", "descending", ""]);
  });
});
