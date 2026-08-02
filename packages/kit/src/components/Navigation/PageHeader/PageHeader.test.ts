import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { PageHeader } from "./index";

beforeAll(() => {
  registerComponents(PageHeader);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface PageHeaderEl extends HTMLElement {
  title?: string;
  content?: string;
  icon?: string;
  titleIcon?: string;
  titleIconColor?: string;
  mode?: string;
  variant?: string;
  align?: string;
  tone?: string;
  eyebrow?: string;
  tag?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

const mount = async (patch: Partial<PageHeaderEl> = {}): Promise<PageHeaderEl> => {
  const element = document.createElement("elf-page-header") as PageHeaderEl;
  Object.assign(element, patch);
  document.body.appendChild(element);
  await tick();
  return element;
};

describe("elf-page-header", () => {
  it("renders content and emits back", async () => {
    const el = await mount({ title: "Back", content: "Detail" });
    const onBack = vi.fn();
    el.addEventListener("back", onBack as EventListener);

    expect(el.shadowRoot!.textContent).toContain("Detail");
    const button = el.shadowRoot!.querySelector(".back") as HTMLButtonElement;
    expect(button.getAttribute("aria-label")).toBe("Back");
    button.click();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders the reviewed default back icon and supports an icon prop", async () => {
    const defaultElement = await mount();
    expect(defaultElement.shadowRoot!.querySelector(".icon")?.textContent).toContain("‹");

    defaultElement.remove();
    const customElement = await mount({ icon: "←" });
    expect(customElement.shadowRoot!.querySelector(".icon")?.textContent).toContain("←");
  });

  it("renders breadcrumb slot", async () => {
    const el = document.createElement("elf-page-header") as PageHeaderEl;
    const breadcrumb = document.createElement("span");
    breadcrumb.slot = "breadcrumb";
    breadcrumb.textContent = "Home / Detail";
    el.appendChild(breadcrumb);
    document.body.appendChild(el);
    await tick();

    const slot = el.shadowRoot!.querySelector('slot[name="breadcrumb"]') as HTMLSlotElement;
    expect(slot.assignedElements()[0]).toBe(breadcrumb);
  });

  it.each(["icon", "title", "content", "extra"])("projects the %s slot", async (name) => {
    const element = document.createElement("elf-page-header") as PageHeaderEl;
    const child = document.createElement("span");
    child.slot = name;
    child.textContent = `${name} content`;
    element.appendChild(child);
    document.body.appendChild(element);
    await tick();

    const slot = element.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!;
    expect(slot.assignedElements()).toEqual([child]);
  });

  it("renders the hero structure and visual API without a back control", async () => {
    const el = await mount({
      mode: "hero",
      variant: "banner",
      align: "center",
      tone: "dark",
      title: "Toolbar",
      eyebrow: "Layout / Toolbar",
      tag: "Toolbar",
      description: "Arrange contextual tools.",
      image: "/toolbar.png",
      imageAlt: "Toolbar illustration",
    });

    expect(el.getAttribute("mode")).toBe("hero");
    expect(el.getAttribute("variant")).toBe("banner");
    expect(el.getAttribute("align")).toBe("center");
    expect(el.getAttribute("tone")).toBe("dark");
    expect(el.shadowRoot!.querySelector("header")?.classList).toContain("is-hero");
    expect(el.shadowRoot!.querySelector("header")?.classList).toContain("is-banner");
    expect(el.shadowRoot!.querySelector("header")?.classList).toContain("is-center");
    expect(el.shadowRoot!.querySelector("header")?.classList).toContain("is-dark");
    expect(el.shadowRoot!.querySelector(".back")).toBeNull();
    expect(el.shadowRoot!.querySelector(".hero-title")?.textContent).toContain("Toolbar");
    expect(el.shadowRoot!.querySelector(".hero-description")?.textContent).toContain(
      "Arrange contextual tools.",
    );
    const image = el.shadowRoot!.querySelector(".hero-visual img") as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("/toolbar.png");
    expect(image.getAttribute("alt")).toBe("Toolbar illustration");
  });

  it("renders a title icon before the hero title", async () => {
    const el = await mount({
      mode: "hero",
      title: "Toolbar",
      titleIcon: "M0 0h24v24H0z",
      titleIconColor: "#2e7d32",
    });

    const icon = el.shadowRoot!.querySelector<HTMLElement>(".hero-title-icon")!;
    expect(icon).toBeTruthy();
    expect(icon.querySelector("path")?.getAttribute("d")).toBe("M0 0h24v24H0z");
    expect(icon.style.color).toBe("#2e7d32");
  });

  it.each(["eyebrow", "tag", "description", "meta", "visual"])(
    "projects the hero %s slot",
    async (name) => {
      const element = document.createElement("elf-page-header") as PageHeaderEl;
      element.mode = "hero";
      const child = document.createElement("span");
      child.slot = name;
      child.textContent = `${name} content`;
      element.appendChild(child);
      document.body.appendChild(element);
      await tick();

      const slot = element.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!;
      expect(slot.assignedElements()).toEqual([child]);
    },
  );
});
