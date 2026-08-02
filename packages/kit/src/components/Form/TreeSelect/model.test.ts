import { describe, expect, it } from "vitest";

import { buildTreeCollection, resolveTreeFields } from "../../Data/Tree/tree-collection";
import { normalizeTreeSelectKeys, treeSelectEntries, treeSelectModelValue } from "./model";

const fields = resolveTreeFields("id", { label: "name", children: "items" });
const collection = buildTreeCollection(
  [
    {
      id: 1,
      name: "Platform",
      items: [{ id: 11, name: "Web" }],
    },
  ],
  fields,
  false,
);

describe("tree-select model", () => {
  it("normalizes single and multiple values without losing numeric identities", () => {
    expect(normalizeTreeSelectKeys(1, false)).toEqual(["1"]);
    expect(normalizeTreeSelectKeys([1, 11], true)).toEqual(["1", "11"]);
    expect(normalizeTreeSelectKeys([], false)).toEqual([]);
  });

  it("projects collection keys back to source values and labels", () => {
    const entries = treeSelectEntries(collection, fields, ["1", "11"]);
    expect(entries.map(({ value, label }) => ({ value, label }))).toEqual([
      { value: 1, label: "Platform" },
      { value: 11, label: "Web" },
    ]);
    expect(treeSelectModelValue(entries, false)).toBe(1);
    expect(treeSelectModelValue(entries, true)).toEqual([1, 11]);
  });

  it("keeps unresolved lazy values readable until their nodes arrive", () => {
    const [entry] = treeSelectEntries(collection, fields, ["99"]);
    expect(entry).toMatchObject({ key: "99", value: "99", label: "99" });
  });
});
