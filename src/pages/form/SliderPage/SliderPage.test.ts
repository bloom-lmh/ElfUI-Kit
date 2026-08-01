import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSlider } = await import("./index");
  pageTag = ensureCustomElement(PageSlider);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const collectText = (root: Node): string => {
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output.replace(/\s+/g, " ").trim();
};

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("SliderPage localization", () => {
  it("中文页面覆盖全部案例、状态、源码和 API", async () => {
    const text = collectText(await mount());
    expect(text).toContain("单值、提示与受控值");
    expect(text).toContain("范围、步进、刻度与间断点");
    expect(text).toContain("自定义温度节点 0 / 30 / 100 ℃");
    expect(text).toContain("当前音量");
    expect(text).toContain("暴露方法");
  });

  it("英文页面覆盖全部案例、状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Single value, tooltip, and controlled state");
    expect(text).toContain("Range, steps, marks, and stops");
    expect(text).toContain("Custom temperature marks at 0 / 30 / 100 °C");
    expect(text).toContain("Current volume");
    expect(text).toContain("Expose");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("keeps the controlled value status synchronized", async () => {
    const page = await mount();
    const example = page.shadowRoot!.querySelector<HTMLElement>("elf-page-slider-ex1")!;
    const slider = example.shadowRoot!.querySelector<HTMLElement>("elf-slider")!;
    slider.dispatchEvent(new CustomEvent("update:modelValue", { detail: 55 }));
    await tick();
    expect(collectText(example)).toContain("当前值 : 55");
  });

  it("renders the season range with visible track segments", async () => {
    const page = await mount();
    const example = page.shadowRoot!.querySelector<HTMLElement>("elf-page-slider-ex9")!;
    const slider = example.shadowRoot!.querySelector<HTMLElement>("elf-slider")!;
    expect(slider.hasAttribute("segmented")).toBe(true);
    expect(slider.shadowRoot!.querySelectorAll(".segment")).toHaveLength(3);
    expect((slider as HTMLElement & { min?: number }).min).toBe(0);
    expect((slider as HTMLElement & { max?: number }).max).toBe(3);
    expect((slider as HTMLElement & { step?: number }).step).toBe(1);
    expect((slider as HTMLElement & { modelValue?: number[] }).modelValue).toEqual([0, 2]);
    expect(
      example.shadowRoot!.querySelector('elf-icon[slot="thumb-label-start"][name="snow"]'),
    ).toBeTruthy();
    expect(
      example.shadowRoot!.querySelector('elf-icon[slot="thumb-label-end"][name="sun"]'),
    ).toBeTruthy();
  });
});
