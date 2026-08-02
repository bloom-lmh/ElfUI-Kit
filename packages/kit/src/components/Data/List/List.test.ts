import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ListItem } from "../ListItem";
import type { ListExposes } from "./types";
import { List } from "./index";

beforeAll(() => {
  registerComponents(List, ListItem);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("elf-list", () => {
  it("renders data-driven items and updates their content", async () => {
    const list = document.createElement("elf-list") as HTMLElement & {
      items: Array<{ id: string; label: string }>;
      renderItem: (item: { label: string }) => string;
    };
    list.items = [
      { id: "a", label: "Alpha" },
      { id: "b", label: "Beta" },
    ];
    list.renderItem = (item) => item.label;
    document.body.appendChild(list);
    await tick();

    const rows = list.shadowRoot!.querySelectorAll(".item");
    expect(rows).toHaveLength(2);
    expect(rows[0]!.textContent).toBe("Alpha");
    expect(rows[1]!.textContent).toBe("Beta");

    list.items = [{ id: "c", label: "Gamma" }];
    await tick();
    expect(list.shadowRoot!.querySelectorAll(".item")).toHaveLength(1);
    expect(list.shadowRoot!.textContent).toContain("Gamma");
  });

  it("exposes localized empty and loading states without showing stale rows", async () => {
    const list = document.createElement("elf-list") as HTMLElement & {
      emptyText: string;
      loading: boolean;
      loadingText: string;
    };
    list.emptyText = "No tasks";
    document.body.appendChild(list);
    await tick();
    expect(list.shadowRoot!.querySelector(".empty")?.textContent).toContain("No tasks");

    list.loading = true;
    list.loadingText = "Fetching tasks";
    await tick();
    const region = list.shadowRoot!.querySelector(".list")!;
    expect(region.getAttribute("aria-busy")).toBe("true");
    expect(list.hasAttribute("loading")).toBe(true);
    expect(list.shadowRoot!.querySelector(".loading")?.textContent).toContain("Fetching tasks");
    expect(list.shadowRoot!.querySelector(".empty")).toBeNull();
  });

  it("supports custom empty and loading slots", async () => {
    const list = document.createElement("elf-list") as HTMLElement & { loading: boolean };
    list.innerHTML = [
      '<strong slot="empty">Nothing assigned</strong>',
      '<strong slot="loading">Syncing queue</strong>',
    ].join("");
    document.body.appendChild(list);
    await tick();

    const emptySlot = list.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="empty"]')!;
    expect(emptySlot.assignedNodes()[0]?.textContent).toContain("Nothing assigned");

    list.loading = true;
    await tick();
    const loadingSlot = list.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="loading"]')!;
    expect(loadingSlot.assignedNodes()[0]?.textContent).toContain("Syncing queue");
  });

  it("moves focus with arrow and boundary keys while skipping disabled items", async () => {
    const list = document.createElement("elf-list") as HTMLElement & ListExposes;
    const first = document.createElement("elf-list-item");
    const disabled = document.createElement("elf-list-item");
    const last = document.createElement("elf-list-item");
    first.setAttribute("clickable", "");
    first.setAttribute("title", "First");
    disabled.setAttribute("clickable", "");
    disabled.setAttribute("disabled", "");
    disabled.setAttribute("title", "Disabled");
    last.setAttribute("clickable", "");
    last.setAttribute("title", "Last");
    list.append(first, disabled, last);
    document.body.appendChild(list);
    await tick();

    list.focusFirst();
    expect(first.shadowRoot!.activeElement).toBe(first.shadowRoot!.querySelector("button"));

    first.shadowRoot!.querySelector("button")!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        composed: true,
      }),
    );
    await tick();
    expect(last.shadowRoot!.activeElement).toBe(last.shadowRoot!.querySelector("button"));

    last.shadowRoot!.querySelector("button")!.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Home",
        bubbles: true,
        composed: true,
      }),
    );
    await tick();
    expect(first.shadowRoot!.activeElement).toBe(first.shadowRoot!.querySelector("button"));
  });
});

describe("elf-list-item", () => {
  it("reflects selection semantics and emits one semantic select event", async () => {
    const item = document.createElement("elf-list-item") as HTMLElement & {
      active: boolean;
      clickable: boolean;
      value: string;
    };
    item.clickable = true;
    item.active = true;
    item.value = "design";
    item.setAttribute("title", "Design review");
    const onSelect = vi.fn();
    item.addEventListener("select", onSelect);
    document.body.appendChild(item);
    await tick();

    const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    expect(button.getAttribute("aria-pressed")).toBe("true");
    button.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0]![0] as CustomEvent).detail).toBe("design");
  });

  it("removes empty leading and trailing columns and restores them on slot changes", async () => {
    const item = document.createElement("elf-list-item");
    item.setAttribute("title", "Release");
    document.body.appendChild(item);
    await tick();

    const surface = item.shadowRoot!.querySelector(".item")!;
    expect(surface.classList.contains("has-leading")).toBe(false);
    expect(surface.classList.contains("has-trailing")).toBe(false);

    const leading = document.createElement("span");
    leading.slot = "leading";
    leading.textContent = "RC";
    const trailing = document.createElement("span");
    trailing.slot = "trailing";
    trailing.textContent = "Open";
    item.append(leading, trailing);
    await tick();
    expect(surface.classList.contains("has-leading")).toBe(true);
    expect(surface.classList.contains("has-trailing")).toBe(true);
  });

  it("does not focus or select a disabled item", async () => {
    const item = document.createElement("elf-list-item") as HTMLElement & {
      clickable: boolean;
      disabled: boolean;
      focusItem: () => void;
    };
    item.clickable = true;
    item.disabled = true;
    const onSelect = vi.fn();
    item.addEventListener("select", onSelect);
    document.body.appendChild(item);
    await tick();

    item.focusItem();
    const button = item.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    expect(button.disabled).toBe(true);
    expect(item.shadowRoot!.activeElement).toBeNull();
    button.click();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
