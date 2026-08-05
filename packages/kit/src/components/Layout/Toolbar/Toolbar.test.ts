import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Toolbar } from "./index";

beforeAll(() => registerComponents(Toolbar));
afterEach(() => {
  document.body.innerHTML = "";
});
const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-toolbar", () => {
  it("renders toolbar semantics and title", async () => {
    const element = document.createElement("elf-toolbar") as HTMLElement & {
      title: string;
      ariaLabel: string;
    };
    Object.assign(element, { title: "Photos", ariaLabel: "Photo actions" });
    document.body.appendChild(element);
    await tick();
    expect(element.shadowRoot?.querySelector('[role="toolbar"]')?.getAttribute("aria-label")).toBe(
      "Photo actions",
    );
    expect(element.shadowRoot?.textContent).toContain("Photos");
  });

  it("reflects density, collapse position and surface props", async () => {
    const element = document.createElement("elf-toolbar") as HTMLElement & {
      density: string;
      collapsePosition: string;
      collapsed: boolean;
      elevation: number;
    };
    Object.assign(element, {
      density: "compact",
      collapsePosition: "start",
      collapsed: true,
      elevation: 8,
    });
    document.body.appendChild(element);
    await tick();
    expect(element.getAttribute("density")).toBe("compact");
    expect(element.getAttribute("collapse-position")).toBe("start");
    expect(element.hasAttribute("collapsed")).toBe(true);
    expect(element.style.getPropertyValue("--_toolbar-shadow")).toBe("var(--elf-shadow-2)");
  });

  it.each(["prepend", "title", "append", "extension", "background"])(
    "projects the %s slot",
    async (name) => {
      const element = document.createElement("elf-toolbar");
      const child = document.createElement(name === "background" ? "img" : "span");
      child.slot = name;
      element.appendChild(child);
      document.body.appendChild(element);
      await tick();
      expect(
        element.shadowRoot
          ?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)
          ?.assignedElements(),
      ).toEqual([child]);
    },
  );

  it("supports image backgrounds, custom collapse width, and positioned overlays", async () => {
    const element = document.createElement("elf-toolbar") as HTMLElement & {
      image: string;
      imageAlt: string;
      collapseWidth: number;
      absolute: boolean;
      location: string;
    };
    Object.assign(element, {
      image: "/media/toolbar.jpg",
      imageAlt: "Abstract blue artwork",
      collapseWidth: 132,
      absolute: true,
      location: "bottom-end",
    });
    document.body.appendChild(element);
    await tick();
    expect(element.shadowRoot!.querySelector("img")?.getAttribute("src")).toBe(
      "/media/toolbar.jpg",
    );
    expect(element.style.getPropertyValue("--_toolbar-collapse-width")).toBe("132px");
    expect(element.hasAttribute("absolute")).toBe(true);
    expect(element.getAttribute("location")).toBe("bottom-end");
  });

  it("supports prominent density, explicit extended, and flat states", async () => {
    const element = document.createElement("elf-toolbar") as HTMLElement & {
      density: string;
      extended: boolean;
      flat: boolean;
    };
    Object.assign(element, { density: "prominent", extended: true, flat: true });
    document.body.appendChild(element);
    await tick();

    expect(element.getAttribute("density")).toBe("prominent");
    expect(element.hasAttribute("extended")).toBe(true);
    expect(element.hasAttribute("flat")).toBe(true);
    expect(element.shadowRoot!.querySelector(".extension")).toBeTruthy();
  });

  it("auto-detects the extension slot and hides it when extended is false", async () => {
    const element = document.createElement("elf-toolbar");
    const tab = document.createElement("span");
    tab.slot = "extension";
    element.appendChild(tab);
    document.body.appendChild(element);
    await tick();

    expect(element.hasAttribute("extended")).toBe(true);
    (element as HTMLElement & { extended: boolean }).extended = false;
    await tick();
    expect(element.hasAttribute("extended")).toBe(false);
  });

  it("keeps both prepend and append visible when collapsed", async () => {
    const element = document.createElement("elf-toolbar") as HTMLElement & {
      collapsed: boolean;
      collapsePosition: string;
    };
    const prepend = document.createElement("span");
    prepend.slot = "prepend";
    const append = document.createElement("span");
    append.slot = "append";
    element.append(prepend, append);
    Object.assign(element, { collapsed: true, collapsePosition: "start" });
    document.body.appendChild(element);
    await tick();

    expect(element.getAttribute("collapse-position")).toBe("start");
    expect(element.hasAttribute("collapsed")).toBe(true);
    expect(element.shadowRoot!.querySelector('slot[name="prepend"]')?.assignedElements()).toEqual([
      prepend,
    ]);
    expect(element.shadowRoot!.querySelector('slot[name="append"]')?.assignedElements()).toEqual([
      append,
    ]);
  });
});
