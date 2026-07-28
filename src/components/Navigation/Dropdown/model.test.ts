import { describe, expect, it } from "vitest";

import {
  DEFAULT_TRIGGER_KEYS,
  normalizeItems,
  resolveButtonType,
  resolveFieldNames,
  resolvePopperConfig,
  resolveSize,
  resolveTriggers,
  toStyleObject,
} from "./model";

describe("Dropdown model", () => {
  it("normalizes custom fields and nested items without mutating source data", () => {
    const source = [
      {
        text: "Workspace",
        value: "workspace",
        blocked: true,
        nodes: [{ text: "Overview", value: "overview" }],
      },
    ];
    const fields = resolveFieldNames({
      label: "text",
      command: "value",
      disabled: "blocked",
      children: "nodes",
    });

    const items = normalizeItems(source, fields);

    expect(items[0]).toMatchObject({
      key: "workspace",
      label: "Workspace",
      command: "workspace",
      disabled: true,
    });
    expect(items[0]?.children[0]).toMatchObject({
      key: "workspace/overview",
      label: "Overview",
      command: "overview",
    });
    expect(source[0]?.nodes).toHaveLength(1);
  });

  it("deduplicates supported triggers and falls back to click", () => {
    expect(resolveTriggers(["hover", "hover", "contextmenu"])).toEqual([
      "hover",
      "contextmenu",
    ]);
    expect(resolveTriggers(["invalid"])).toEqual(["click"]);
    expect(resolveTriggers(undefined)).toEqual(["click"]);
    expect(DEFAULT_TRIGGER_KEYS).toContain("ArrowDown");
  });

  it("normalizes compatibility size and button type values", () => {
    expect(resolveSize("small")).toBe("sm");
    expect(resolveSize("large")).toBe("lg");
    expect(resolveSize("unknown")).toBe("md");
    expect(resolveButtonType("danger")).toBe("danger");
    expect(resolveButtonType("brand")).toBe("default");
  });

  it("resolves popper modifiers once into a stable positioning config", () => {
    expect(
      resolvePopperConfig(
        {
          placement: "top-end",
          modifiers: [
            { name: "offset", options: { offset: [12, 18] } },
            { name: "preventOverflow", options: { padding: 10 } },
            { name: "flip", enabled: false },
          ],
        },
        "bottom-start",
      ),
    ).toMatchObject({
      placement: "top-end",
      offset: [12, 18],
      overflowPadding: 10,
      flip: false,
    });
  });

  it("normalizes inline style values and rejects non-record inputs", () => {
    expect(toStyleObject({ width: 120, color: "red" })).toEqual({
      width: "120",
      color: "red",
    });
    expect(toStyleObject(["width"])).toEqual({});
    expect(toStyleObject(null)).toEqual({});
  });
});
