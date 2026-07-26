import { afterEach, beforeAll, describe, expect, it } from "vitest";

let fitExampleTag = "";
let retryExampleTag = "";
let responsiveExampleTag = "";
let previewExampleTag = "";

beforeAll(async () => {
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
  it("renders all five object-fit modes in identical frames", async () => {
    const page = document.createElement(fitExampleTag);
    document.body.appendChild(page);
    await tick();

    const images = page.shadowRoot!.querySelectorAll<HTMLElement>(".image-fit-grid elf-image");
    expect(images).toHaveLength(5);
    expect(Array.from(images, (image) => image.getAttribute("fit")))
      .toEqual(["fill", "contain", "cover", "none", "scale-down"]);
    expect(Array.from(images).every((image) => image.style.getPropertyValue("--_image-width") === "180px"))
      .toBe(true);
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
    expect(image.shadowRoot!.querySelector("img")?.getAttribute("src")).toContain("data:image/svg+xml");
  });

  it("documents lazy responsive source selection", async () => {
    const page = document.createElement(responsiveExampleTag);
    document.body.appendChild(page);
    await tick();

    const image = page.shadowRoot!.querySelector<HTMLElement>("elf-image")!;
    expect(image.getAttribute("lazy")).not.toBeNull();
    expect((image as HTMLElement & { srcset?: string }).srcset).toContain("480w");
    expect(image.getAttribute("sizes")).toBe("(max-width: 720px) 100vw, 720px");
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
