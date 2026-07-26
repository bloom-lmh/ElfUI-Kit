import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { registerComponents } from "@elfui/core";

import { Empty } from "./index";

beforeAll(() => {
  registerComponents(Empty);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface EmptyEl extends HTMLElement {
  description?: string;
  imageSize?: number | string;
  image?: string;
  size?: string;
}

describe("elf-empty", () => {
  it("renders description and image size", async () => {
    const el = document.createElement("elf-empty") as EmptyEl;
    el.description = "Nothing here";
    el.imageSize = 120;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.textContent).toContain("Nothing here");
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("120px");
    expect(el.shadowRoot!.querySelector(".illustration")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders default slot actions", async () => {
    const el = document.createElement("elf-empty");
    el.innerHTML = "<button>Reload</button>";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.hasAttribute("has-actions")).toBe(true);
    expect(
      (el.shadowRoot!.querySelector(".bottom") as HTMLElement).style.display
    ).not.toBe("none");
  });

  it("forwards image source and accepts a CSS image size", async () => {
    const el = document.createElement("elf-empty") as EmptyEl;
    el.image = "https://example.com/empty.svg";
    el.imageSize = "6rem";
    document.body.appendChild(el);
    await tick();

    const image = el.shadowRoot!.querySelector("img")!;
    expect(image.getAttribute("src")).toBe("https://example.com/empty.svg");
    expect(image.getAttribute("alt")).toBe("");
    expect(image.getAttribute("decoding")).toBe("async");
    expect(el.shadowRoot!.querySelector(".illustration")).toBeNull();
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("6rem");
  });

  it("normalizes numeric strings, minimum sizes, and non-finite values", async () => {
    const el = document.createElement("elf-empty") as EmptyEl;
    document.body.appendChild(el);
    await tick();

    el.imageSize = "96";
    await tick();
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("96px");

    el.imageSize = 12;
    await tick();
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("40px");

    el.imageSize = Number.NaN;
    await tick();
    expect(el.style.getPropertyValue("--_empty-image-size")).toBe("160px");
  });

  it("projects image and description slots", async () => {
    const el = document.createElement("elf-empty");
    el.innerHTML = '<span slot="image">◎</span><strong slot="description">No matches</strong>';
    document.body.appendChild(el);
    await tick();

    const imageSlot = el.shadowRoot!.querySelector('slot[name="image"]') as HTMLSlotElement;
    const descriptionSlot = el.shadowRoot!.querySelector('slot[name="description"]') as HTMLSlotElement;
    expect(imageSlot.assignedNodes()[0]?.textContent).toContain("◎");
    expect(descriptionSlot.assignedNodes()[0]?.textContent).toContain("No matches");
    expect(el.hasAttribute("has-description")).toBe(true);
  });

  it("hides empty action and description regions without leaving layout gaps", async () => {
    const el = document.createElement("elf-empty") as EmptyEl;
    el.description = " ";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.hasAttribute("has-actions")).toBe(false);
    expect(el.hasAttribute("has-description")).toBe(false);
    expect((el.shadowRoot!.querySelector(".bottom") as HTMLElement).style.display).toBe("none");
    expect((el.shadowRoot!.querySelector(".description") as HTMLElement).style.display).toBe("none");
  });

  it("tracks dynamic action content", async () => {
    const el = document.createElement("elf-empty");
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.hasAttribute("has-actions")).toBe(false);

    el.innerHTML = "<button>Retry</button>";
    await tick();
    await tick();
    expect(el.hasAttribute("has-actions")).toBe(true);

    el.replaceChildren();
    await tick();
    await tick();
    expect(el.hasAttribute("has-actions")).toBe(false);
  });

  it("normalizes compact and invalid size values", async () => {
    const el = document.createElement("elf-empty") as EmptyEl;
    el.size = "compact";
    document.body.appendChild(el);
    await tick();
    expect(el.getAttribute("size")).toBe("compact");

    el.size = "roomy";
    await tick();
    expect(el.getAttribute("size")).toBe("default");
  });

  it("uses a polite atomic status for the description", async () => {
    const el = document.createElement("elf-empty");
    document.body.appendChild(el);
    await tick();

    const status = el.shadowRoot!.querySelector(".description")!;
    expect(status.getAttribute("role")).toBe("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("aria-atomic")).toBe("true");
  });
});
