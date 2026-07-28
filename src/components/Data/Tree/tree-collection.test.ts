import { describe, expect, it } from "vitest";

import { buildTreeCollection, resolveTreeFields, treeKeyOf } from "./tree-collection";

const fields = resolveTreeFields("", {});
const data = [
  {
    key: "root",
    label: "Root",
    children: [
      { key: "enabled", label: "Enabled" },
      { key: "disabled", label: "Disabled", disabled: true },
    ],
  },
  {
    key: "other",
    label: "Other",
    children: [{ key: "needle", label: "Search target" }],
  },
];

describe("tree collection", () => {
  it("normalizes fields, indexes nodes, and resolves object keys", () => {
    const custom = resolveTreeFields("id", { label: "title", children: "nodes" });
    const collection = buildTreeCollection(
      [{ id: "docs", title: "Docs", nodes: [{ id: "api", title: "API" }] }],
      custom,
      false
    );

    expect(collection.rows.map((row) => row.key)).toEqual(["docs", "api"]);
    expect(collection.find("api")?.parentKey).toBe("docs");
    expect(treeKeyOf({ id: "api" }, custom)).toBe("api");
  });

  it("projects expansion and filtered ancestor paths without mutating data", () => {
    const collection = buildTreeCollection(data, fields, false);

    expect(collection.visible([], "").map((row) => row.key)).toEqual(["root", "other"]);
    expect(collection.visible(["root"], "").map((row) => row.key))
      .toEqual(["root", "enabled", "disabled", "other"]);
    expect(collection.visible([], "target").map((row) => row.key))
      .toEqual(["other", "needle"]);
    expect(collection.normalizeExpanded(["needle"], true)).toEqual(["needle", "other"]);
  });

  it("cascades checks while excluding disabled nodes and supports strict mode", () => {
    const collection = buildTreeCollection(data, fields, false);

    expect(collection.normalizeChecked(["root"], false))
      .toEqual(["root", "enabled"]);
    expect(collection.normalizeChecked(["enabled"], false))
      .toEqual(["enabled", "root"]);
    expect(collection.normalizeChecked(["root"], true))
      .toEqual(["root"]);
    expect(collection.normalizeChecked(["root"], false, true))
      .toEqual([]);
  });
});
