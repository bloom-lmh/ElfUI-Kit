import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let fitExampleTag = "";
let retryExampleTag = "";
let responsiveExampleTag = "";
let previewExampleTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageImageEx1 } = await import("./ex1");
  const { PageImageEx2 } = await import("./ex2");
  const { PageImageEx3 } = await import("./ex3");
  const { PageImageEx4 } = await import("./ex4");
  fitExampleTag = ensureCustomElement(PageImageEx1);
  retryExampleTag = ensureCustomElement(PageImageEx2);
  responsiveExampleTag = ensureCustomElement(PageImageEx3);
  previewExampleTag = ensureCustomElement(PageImageEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Image documentation", () => {
  it("provides a Playground console for every image example", async () => {
    for (const tag of [fitExampleTag, retryExampleTag, responsiveExampleTag, previewExampleTag]) {
      const page = document.createElement(tag);
      document.body.appendChild(page);
      await tick();
      const playground = page.shadowRoot!.querySelector<HTMLElement>("elf-playground")!;
      expect(page.shadowRoot!.querySelector('[slot="controls"]')).toBeTruthy();
      expect(playground.shadowRoot!.querySelector(".workspace.has-controls")).toBeTruthy();
      page.remove();
    }
  });

  it("drives object fit and dimensions from the Playground console", async () => {
    const page = document.createElement(fitExampleTag);
    document.body.appendChild(page);
    await tick();

    const playground = page.shadowRoot!.querySelector<HTMLElement>("elf-playground")!;
    const image = page.shadowRoot!.querySelector<HTMLElement>(".image-fit-stage elf-image")!;
    const controls = page.shadowRoot!.querySelector<HTMLElement>('[slot="controls"]')!;
    const select = controls.querySelector("elf-select")!;

    expect(playground.shadowRoot!.querySelector(".workspace.has-controls")).toBeTruthy();
    expect(image.getAttribute("src")).toContain("images.unsplash.com");
    expect(image.getAttribute("fit")).toBe("cover");
    select.dispatchEvent(new CustomEvent("update:modelValue", { detail: "contain" }));
    await tick();
    expect(image.getAttribute("fit")).toBe("contain");
  });

  it("recovers the failed image through the custom retry action", async () => {
    const page = document.createElement(retryExampleTag);
    document.body.appendChild(page);
    await tick();

    const image = page.shadowRoot!.querySelector<HTMLElement>("elf-image")!;
    image.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("error"));
    await tick();
    expect(page.shadowRoot!.querySelector(".image-retry-error")).toBeTruthy();

    page.shadowRoot!.querySelector<HTMLElement>(".image-retry-error elf-button")!.click();
    await tick();
    expect(image.shadowRoot!.querySelector("img")?.getAttribute("src")).toContain(
      "images.unsplash.com",
    );
  });

  it("documents lazy responsive source selection", async () => {
    const page = document.createElement(responsiveExampleTag);
    document.body.appendChild(page);
    await tick();

    const image = page.shadowRoot!.querySelector<HTMLElement>("elf-image")!;
    expect(image.getAttribute("lazy")).not.toBeNull();
    expect((image as HTMLElement & { srcset?: string }).srcset).toContain("480w");
    expect(image.getAttribute("sizes")).toBe("(max-width: 720px) 100vw, 720px");
    expect(page.shadowRoot!.querySelector('elf-playground [slot="controls"]')).toBeTruthy();
  });

  it("opens the preview from the keyboard and updates page state", async () => {
    const page = document.createElement(previewExampleTag);
    document.body.appendChild(page);
    await tick();

    const image = page.shadowRoot!.querySelector<HTMLElement>("elf-image")!;
    image.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("load"));
    await tick();
    const trigger = image.shadowRoot!.querySelector<HTMLElement>(".image")!;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));
    await tick();
    await tick();

    expect(document.body.querySelector(".elf-image-preview")).toBeTruthy();
    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("预览已打开");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", cancelable: true }));
    await tick();
    expect(document.body.querySelector(".elf-image-preview")).toBeNull();
  });
});
