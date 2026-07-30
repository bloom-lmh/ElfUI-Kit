import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { BottomNavigation } from "./index";
import type { BottomNavigationItem } from "./types";

beforeAll(() => registerComponents(BottomNavigation));
afterEach(() => { document.body.innerHTML = ""; });
const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface BottomNavigationElement extends HTMLElement {
  items: BottomNavigationItem[];
  modelValue: string | number | null;
  grow: boolean;
  rounded: boolean;
  fixed: boolean;
  mandatory: boolean;
}

const items: BottomNavigationItem[] = [
  { label: "Recent", value: "recent", icon: "R" },
  { label: "Favorites", value: "favorites", icon: "F" },
  { label: "Nearby", value: "nearby", icon: "N", disabled: true }
];

const mount = async (): Promise<BottomNavigationElement> => {
  const element = document.createElement("elf-bottom-navigation") as BottomNavigationElement;
  element.items = items;
  element.modelValue = "recent";
  document.body.appendChild(element);
  await tick();
  return element;
};

describe("elf-bottom-navigation", () => {
  it("renders items and controlled selection semantics", async () => {
    const element = await mount();
    const buttons = element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.item");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]!.getAttribute("aria-current")).toBe("page");
    expect(buttons[2]!.disabled).toBe(true);
  });

  it("emits model and change events when selecting an item", async () => {
    const element = await mount();
    const onModel = vi.fn();
    const onChange = vi.fn();
    element.addEventListener("update:modelValue", onModel as EventListener);
    element.addEventListener("change", onChange as EventListener);
    element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.item")[1]!.click();
    await tick();
    expect((onModel.mock.calls[0]![0] as CustomEvent).detail).toBe("favorites");
    expect((onChange.mock.calls[0]![0] as CustomEvent).detail).toEqual(["favorites", expect.objectContaining({ label: "Favorites" })]);
  });

  it("moves focus with arrow keys and reflects layout flags", async () => {
    const element = await mount();
    element.grow = true;
    await tick();
    const first = element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.item")[0]!;
    const second = element.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.item")[1]!;
    first.focus();
    first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(element.shadowRoot!.activeElement).toBe(second);
    expect(element.hasAttribute("grow")).toBe(true);
  });

  it("supports fixed, rounded, safe-area, badge, and mandatory states", async () => {
    const element = document.createElement("elf-bottom-navigation") as BottomNavigationElement;
    element.items = [{ label: "Inbox", value: "inbox", icon: "I", badge: 3 }];
    Object.assign(element, { rounded: true, fixed: true, mandatory: true });
    document.body.appendChild(element);
    await tick();
    expect(element.hasAttribute("rounded")).toBe(true);
    expect(element.hasAttribute("fixed")).toBe(true);
    expect(element.hasAttribute("safe-area")).toBe(true);
    expect(element.shadowRoot!.querySelector("button")?.getAttribute("aria-current")).toBe("page");
    expect(element.shadowRoot!.querySelector(".badge")?.textContent).toBe("3");
  });
});
