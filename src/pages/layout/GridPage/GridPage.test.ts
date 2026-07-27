import { afterEach, beforeAll, describe, expect, it } from "vitest";

let basicTag = "";
let compositionTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageGridEx1 } = await import("./ex1");
  const { PageGridEx4 } = await import("./ex4");
  basicTag = ensureCustomElement(PageGridEx1);
  compositionTag = ensureCustomElement(PageGridEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("GridPage examples", () => {
  it("使用统一编号结构图展示等分和非等分栅格", async () => {
    const page = document.createElement(basicTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelectorAll("elf-playground")).toHaveLength(2);
    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    expect(Array.from(playgrounds ?? []).every((playground) => !playground.hasAttribute("ruler"))).toBe(true);
    expect(page.shadowRoot?.querySelector(".grid-ruler-stage")).toBeNull();
    expect(page.shadowRoot?.querySelectorAll(".diagram-item")).toHaveLength(6);
    expect(page.shadowRoot?.querySelector(".diagram-item.alt, .diagram-item.neutral")).toBeNull();
  });

  it("在 Grid 页面包含 Container 和组合布局", async () => {
    const page = document.createElement(compositionTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot?.querySelectorAll(".container-bar")).toHaveLength(3);
    expect(page.shadowRoot?.querySelector("elf-container elf-grid")).toBeTruthy();
  });
});
