import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let basicTag = "";
let gapsTag = "";
let offsetTag = "";
let compositionTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageGridEx1 } = await import("./ex1");
  const { PageGridEx2 } = await import("./ex2");
  const { PageGridEx3 } = await import("./ex3");
  const { PageGridEx4 } = await import("./ex4");
  basicTag = ensureCustomElement(PageGridEx1);
  gapsTag = ensureCustomElement(PageGridEx2);
  offsetTag = ensureCustomElement(PageGridEx3);
  compositionTag = ensureCustomElement(PageGridEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("GridPage examples", () => {
  it("使用大块蓝色色阶展示 12 列和三等分栅格", async () => {
    const page = document.createElement(basicTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelectorAll("elf-playground")).toHaveLength(2);
    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    expect(
      Array.from(playgrounds ?? []).every((playground) => !playground.hasAttribute("ruler")),
    ).toBe(true);
    expect(page.shadowRoot?.querySelector(".grid-ruler-stage")).toBeNull();
    expect(page.shadowRoot?.querySelector(".diagram-stage")).toBeNull();
    expect(page.shadowRoot?.querySelectorAll(".diagram-item")).toHaveLength(15);
    expect(page.shadowRoot?.querySelectorAll(".blue-grid")).toHaveLength(2);
    expect(page.shadowRoot?.querySelector(".diagram-item.alt, .diagram-item.neutral")).toBeNull();
  });

  it("通过控制台切换栅格间距，并让其它案例使用不同色阶", async () => {
    const page = document.createElement(gapsTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    const gapPlayground = playgrounds?.[0];
    const gapSelect = gapPlayground?.querySelector("elf-select");
    const grid = gapPlayground?.querySelector<HTMLElement & { gap: string }>("elf-grid");

    expect(playgrounds).toHaveLength(3);
    expect(gapPlayground?.querySelector('[slot="controls"]')).toBeTruthy();
    expect(gapPlayground?.shadowRoot?.querySelector(".workspace.has-controls")).toBeTruthy();
    expect(grid?.gap).toBe("md");
    expect(page.shadowRoot?.querySelectorAll(".diagram-item.alt")).toHaveLength(3);
    expect(page.shadowRoot?.querySelectorAll(".diagram-item.neutral")).toHaveLength(3);

    gapSelect?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "xl" }));
    await tick();
    await tick();

    expect(grid?.gap).toBe("xl");
  });

  it("通过控制台切换页面容器，并保留组合布局", async () => {
    const page = document.createElement(compositionTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    const containerPlayground = playgrounds?.[0];
    const widthSelect = containerPlayground?.querySelector("elf-select");
    const container = containerPlayground?.querySelector(".container-frame");

    expect(playgrounds).toHaveLength(2);
    expect(containerPlayground?.querySelector('[slot="controls"]')).toBeTruthy();
    expect(containerPlayground?.shadowRoot?.querySelector(".workspace.has-controls")).toBeTruthy();
    expect(container?.getAttribute("max-width")).toBe("sm");
    expect(page.shadowRoot?.querySelector("elf-container elf-grid")).toBeTruthy();
    expect(page.shadowRoot?.querySelector(".diagram-item.alt")).toBeTruthy();
    expect(page.shadowRoot?.querySelector(".diagram-item.neutral")).toBeTruthy();

    widthSelect?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "lg" }));
    await tick();
    await tick();

    expect(container?.getAttribute("max-width")).toBe("lg");
    expect(containerPlayground?.textContent).toContain("lg · 1200px");
  });

  it("通过控制台切换偏移与推拉位移", async () => {
    const page = document.createElement(offsetTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    const offsetPlayground = playgrounds?.[1];
    const modeSelect = offsetPlayground?.querySelector("elf-select");

    expect(playgrounds).toHaveLength(3);
    expect(offsetPlayground?.querySelector('[slot="controls"]')).toBeTruthy();
    expect(offsetPlayground?.shadowRoot?.querySelector(".workspace.has-controls")).toBeTruthy();
    expect(offsetPlayground?.querySelector('elf-grid-item[offset="1"]')).toBeTruthy();

    modeSelect?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "movement" }));
    await tick();
    await tick();

    expect(offsetPlayground?.querySelector('elf-grid-item[push="4"]')).toBeTruthy();
    expect(offsetPlayground?.querySelector('elf-grid-item[pull="4"]')).toBeTruthy();
    expect(offsetPlayground?.querySelector('elf-grid-item[offset="1"]')).toBeNull();
  });
});
