import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { CollapseItem } from "./index";

beforeAll(() => {
  registerComponents(CollapseItem);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-collapse-item", () => {
  it("renders slot content and requests a parent toggle", async () => {
    const el = document.createElement("elf-collapse-item") as HTMLElement & {
      title?: string;
      active?: boolean;
      toggle?: () => void;
    };
    el.title = "Details";
    el.active = true;
    el.innerHTML = "<span>Body content</span>";
    const onToggle = vi.fn();
    el.addEventListener("elf-collapse-toggle", onToggle as EventListener);
    document.body.appendChild(el);
    await tick();

    const header = el.shadowRoot!.querySelector(".header") as HTMLButtonElement;
    const body = el.shadowRoot!.querySelector(".body") as HTMLElement;
    expect(header.getAttribute("aria-expanded")).toBe("true");
    expect(el.shadowRoot!.querySelector("slot:not([name])")?.assignedNodes()).toHaveLength(1);
    expect(body.getAttribute("aria-hidden")).toBe("false");
    expect(body.hasAttribute("inert")).toBe(false);
    expect(el.shadowRoot!.querySelector(".body-content")).toBeTruthy();
    header.click();
    expect(onToggle).toHaveBeenCalledTimes(1);
    el.toggle?.();
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("disables interaction and exposes header-region relationships", async () => {
    const el = document.createElement("elf-collapse-item") as HTMLElement & { disabled?: boolean };
    el.disabled = true;
    document.body.appendChild(el);
    await tick();

    const header = el.shadowRoot!.querySelector(".header") as HTMLButtonElement;
    const body = el.shadowRoot!.querySelector('[role="region"]') as HTMLElement;
    expect(header.disabled).toBe(true);
    expect(body.getAttribute("aria-labelledby")).toBe(header.id);
    expect(body.getAttribute("aria-hidden")).toBe("true");
    expect(body.hasAttribute("inert")).toBe(true);
  });

  it("requests parent focus navigation and exposes focusHeader", async () => {
    const el = document.createElement("elf-collapse-item") as HTMLElement & {
      focusHeader?: () => void;
    };
    const onNavigate = vi.fn();
    el.addEventListener("elf-collapse-navigate", onNavigate as EventListener);
    document.body.appendChild(el);
    await tick();

    const header = el.shadowRoot!.querySelector<HTMLButtonElement>(".header")!;
    header.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true, composed: true }),
    );
    expect((onNavigate.mock.calls[0]![0] as CustomEvent).detail).toBe("last");

    el.focusHeader?.();
    expect(el.shadowRoot!.activeElement).toBe(header);
  });
});
