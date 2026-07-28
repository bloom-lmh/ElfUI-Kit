import { describe, expect, it } from "vitest";

import { normalizeCompositionItems } from "./composition-adapter";

describe("Menu composition adapter", () => {
  it("maps light-DOM menu elements into the same view contract", () => {
    const host = document.createElement("div");
    const submenu = document.createElement("elf-sub-menu") as HTMLElement & {
      index?: string;
      title?: string;
      popperOffset?: number;
    };
    submenu.index = "workspace";
    submenu.title = "Workspace";
    submenu.popperOffset = 12;

    const group = document.createElement("elf-menu-item-group") as HTMLElement & {
      title?: string;
    };
    group.title = "Delivery";
    const item = document.createElement("elf-menu-item") as HTMLElement & {
      index?: string;
      title?: string;
      disabled?: boolean;
    };
    item.index = "projects";
    item.title = "Projects";
    item.disabled = true;
    group.append(item);
    submenu.append(group);
    host.append(submenu);

    const items = normalizeCompositionItems(host);

    expect(items[0]).toMatchObject({
      index: "workspace",
      label: "Workspace",
      popperOffset: 12,
      hasChildren: true,
    });
    expect(items[0]?.children[0]).toMatchObject({
      group: true,
      label: "Delivery",
    });
    expect(items[0]?.children[0]?.children[0]).toMatchObject({
      index: "projects",
      label: "Projects",
      disabled: true,
      indexPath: ["workspace"],
    });
  });
});
