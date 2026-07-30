import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { AppBar } from "./index";

beforeAll(() => registerComponents(AppBar));
afterEach(() => { document.body.innerHTML = ""; });

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-app-bar", () => {
  it("renders the title and application-bar semantics", async () => {
    const element = document.createElement("elf-app-bar") as HTMLElement & { title: string };
    element.title = "Workspace";
    document.body.appendChild(element);
    await tick();
    expect(element.shadowRoot?.querySelector("header")?.getAttribute("aria-label")).toBe("Application bar");
    expect(element.shadowRoot?.textContent).toContain("Workspace");
  });

  it("normalizes density and maps surface configuration", async () => {
    const element = document.createElement("elf-app-bar") as HTMLElement & {
      color: string; density: string; elevation: number; rounded: boolean;
    };
    Object.assign(element, { color: "primary", density: "compact", elevation: 4, rounded: true });
    document.body.appendChild(element);
    await tick();
    expect(element.getAttribute("density")).toBe("compact");
    expect(element.hasAttribute("rounded")).toBe(true);
    expect(element.style.getPropertyValue("--_app-bar-bg")).toBe("var(--elf-primary)");
    expect(element.style.getPropertyValue("--_app-bar-shadow")).toBe("var(--elf-shadow-2)");
  });

  it.each(["prepend", "title", "append", "extension", "background"])("projects the %s slot", async (name) => {
    const element = document.createElement("elf-app-bar");
    const child = document.createElement(name === "background" ? "img" : "span");
    child.slot = name;
    element.appendChild(child);
    document.body.appendChild(element);
    await tick();
    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`);
    expect(slot?.assignedElements()).toEqual([child]);
  });

  it("renders a prominent image background with configurable framing", async () => {
    const element = document.createElement("elf-app-bar") as HTMLElement & {
      density: string; image: string; imageAlt: string; imagePosition: string; imageOpacity: number;
    };
    Object.assign(element, {
      density: "prominent",
      image: "/media/city.jpg",
      imageAlt: "City skyline",
      imagePosition: "center 30%",
      imageOpacity: 0.7
    });
    document.body.appendChild(element);
    await tick();
    const image = element.shadowRoot!.querySelector<HTMLImageElement>("img.background-image")!;
    expect(element.getAttribute("density")).toBe("prominent");
    expect(image.getAttribute("src")).toBe("/media/city.jpg");
    expect(image.getAttribute("alt")).toBe("City skyline");
    expect(element.style.getPropertyValue("--_app-bar-image-position")).toBe("center 30%");
    expect(element.style.getPropertyValue("--_app-bar-image-opacity")).toBe("0.7");
  });

  it("reacts to scroll behavior tokens and emits scroll details", async () => {
    const target = document.createElement("div");
    Object.defineProperty(target, "scrollTop", { configurable: true, writable: true, value: 0 });
    document.body.appendChild(target);
    const element = document.createElement("elf-app-bar") as HTMLElement & {
      scrollBehavior: string; scrollTarget: HTMLElement; scrollThreshold: number;
    };
    Object.assign(element, {
      scrollBehavior: "hide collapse elevate fade-image",
      scrollTarget: target,
      scrollThreshold: 80
    });
    document.body.appendChild(element);
    await tick();
    target.scrollTop = 96;
    target.dispatchEvent(new Event("scroll"));
    await tick();
    expect(element.hasAttribute("data-scroll-hidden")).toBe(true);
    expect(element.hasAttribute("data-scroll-collapsed")).toBe(true);
    expect(element.hasAttribute("data-scroll-elevated")).toBe(true);
    expect(element.style.getPropertyValue("--_app-bar-image-opacity")).toBe("0");
  });
});
