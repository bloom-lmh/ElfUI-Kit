import { describe, expect, it } from "vitest";

import {
  findMenuItem,
  flattenMenuItems,
  getVisibleMenuItems,
  normalizeMenuItems,
  resolveMenuFieldNames,
  resolveMenuRoutePath,
  resolveMenuTrigger,
  toMenuStyle,
} from "./model";

describe("Menu model", () => {
  it("normalizes custom fields, groups and dividers without changing the source", () => {
    const source = [
      { key: "overview", text: "Overview", to: "/overview" },
      {
        section: "Workspace",
        nodes: [{ key: "projects", text: "Projects" }],
      },
      { separator: true },
    ];
    const fields = resolveMenuFieldNames({
      index: "key",
      label: "text",
      group: "section",
      children: "nodes",
      divider: "separator",
      route: "to",
    });

    const items = normalizeMenuItems(source, fields);

    expect(items[0]).toMatchObject({
      index: "overview",
      label: "Overview",
      route: "/overview",
    });
    expect(items[1]).toMatchObject({
      label: "Workspace",
      group: true,
      hasChildren: true,
    });
    expect(items[1]?.children[0]).toMatchObject({
      index: "projects",
      indexPath: [],
      label: "Projects",
    });
    expect(items[2]).toMatchObject({
      divider: true,
      hasChildren: false,
    });
    expect(source[1]?.nodes).toHaveLength(1);
  });

  it("finds, flattens and projects opened or searched branches", () => {
    const items = normalizeMenuItems(
      [
        {
          index: "workspace",
          label: "Workspace",
          children: [
            { index: "projects", label: "Projects" },
            { index: "archive", label: "Archive" },
          ],
        },
        { index: "settings", label: "Settings" },
      ],
      resolveMenuFieldNames(),
    );

    expect(findMenuItem(items, "projects")?.indexPath).toEqual(["workspace"]);
    expect(flattenMenuItems(items).map((item) => item.index)).toEqual([
      "workspace",
      "projects",
      "archive",
      "settings",
    ]);
    expect(
      getVisibleMenuItems(items, {
        collapsed: false,
        opened: ["workspace"],
        searchable: false,
        searchText: "",
      }).map((item) => item.index),
    ).toEqual(["workspace", "projects", "archive", "settings"]);
    expect(
      getVisibleMenuItems(items, {
        collapsed: false,
        opened: [],
        searchable: true,
        searchText: "project",
      }).map((item) => item.index),
    ).toEqual(["workspace", "projects"]);
  });

  it("normalizes triggers, styles and route objects at the model boundary", () => {
    expect(resolveMenuTrigger("hover", "click")).toBe("hover");
    expect(resolveMenuTrigger("invalid", "hover")).toBe("click");
    expect(toMenuStyle("width: 240px; --accent: blue")).toEqual({
      width: "240px",
      "--accent": "blue",
    });
    expect(toMenuStyle({ width: 240 })).toEqual({ width: "240" });
    expect(toMenuStyle(["width"])).toEqual({});
    expect(resolveMenuRoutePath({ index: "fallback", route: { path: "/docs" } })).toBe("/docs");
    expect(resolveMenuRoutePath({ index: "fallback", route: null })).toBe("fallback");
  });
});
