import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Footer } from "./index";

beforeAll(() => registerComponents(Footer));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-footer", () => {
  it("uses the Element Plus compatible 60px default height", async () => {
    const el = document.createElement("elf-footer");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("60px");
  });

  it("maps height attributes and property updates to the host CSS variable", async () => {
    const el = document.createElement("elf-footer") as HTMLElement & { height: string };
    el.setAttribute("height", "40px");
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("40px");

    el.height = "3.5rem";
    await tick();
    expect(el.style.getPropertyValue("--_height")).toBe("3.5rem");
  });

  it("renders default slot content", async () => {
    const el = document.createElement("elf-footer");
    el.textContent = "© ElfUI";
    document.body.appendChild(el);
    await tick();
    expect(el.textContent).toContain("ElfUI");
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });

  it("maps Vuetify-inspired surface props without changing the default height", async () => {
    const el = document.createElement("elf-footer") as HTMLElement & {
      color: string; elevation: number; rounded: boolean; padless: boolean;
    };
    Object.assign(el, { color: "primary", elevation: 4, rounded: true, padless: true });
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot?.querySelector("footer")).toBeTruthy();
    expect(el.style.getPropertyValue("--_height")).toBe("60px");
    expect(el.style.getPropertyValue("--_footer-bg")).toBe("var(--elf-primary)");
    expect(el.hasAttribute("rounded")).toBe(true);
    expect(el.hasAttribute("padless")).toBe(true);
  });

  it.each(["top", "bottom"])("projects the %s slot", async (name) => {
    const el = document.createElement("elf-footer");
    const child = document.createElement("div");
    child.slot = name;
    el.appendChild(child);
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)?.assignedElements()).toEqual([child]);
  });

  it("supports constrained and positioned footer surfaces", async () => {
    const el = document.createElement("elf-footer") as HTMLElement & {
      width: number; maxWidth: string; fixed: boolean; inset: boolean; ariaLabel: string;
    };
    Object.assign(el, { width: 720, maxWidth: "80rem", fixed: true, inset: true, ariaLabel: "Site footer" });
    document.body.appendChild(el);
    await tick();
    expect(el.style.getPropertyValue("--_width")).toBe("720px");
    expect(el.style.getPropertyValue("--_max-width")).toBe("80rem");
    expect(el.hasAttribute("fixed")).toBe(true);
    expect(el.hasAttribute("inset")).toBe(true);
    expect(el.shadowRoot!.querySelector("footer")?.getAttribute("aria-label")).toBe("Site footer");
  });
});
