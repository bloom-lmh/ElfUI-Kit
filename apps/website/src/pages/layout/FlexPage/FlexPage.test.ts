import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let directionTag = "";
let alignmentTag = "";
let wrappingTag = "";
let spacerTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageFlexEx1 } = await import("./ex1");
  const { PageFlexEx2 } = await import("./ex2");
  const { PageFlexEx3 } = await import("./ex3");
  const { PageFlexEx4 } = await import("./ex4");
  directionTag = ensureCustomElement(PageFlexEx1);
  alignmentTag = ensureCustomElement(PageFlexEx2);
  wrappingTag = ensureCustomElement(PageFlexEx3);
  spacerTag = ensureCustomElement(PageFlexEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("FlexPage examples", () => {
  it("通过控制台切换方向和间距，并保持三色子项", async () => {
    const page = document.createElement(directionTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    const directionPlayground = playgrounds?.[0];
    const gapPlayground = playgrounds?.[1];
    const directionSelect = directionPlayground?.querySelector("elf-select");
    const gapSelect = gapPlayground?.querySelector("elf-select");
    const directionFlex = directionPlayground?.querySelector<HTMLElement & { direction: string }>(
      "elf-flex",
    );
    const gapFlex = gapPlayground?.querySelector<HTMLElement & { gap: string }>("elf-flex");

    expect(playgrounds).toHaveLength(2);
    expect(page.shadowRoot?.querySelector(".diagram-stage")).toBeNull();
    expect(page.shadowRoot?.querySelectorAll('[slot="controls"]')).toHaveLength(2);
    expect(page.shadowRoot?.querySelectorAll(".diagram-item.alt")).toHaveLength(2);
    expect(page.shadowRoot?.querySelectorAll(".diagram-item.neutral")).toHaveLength(2);

    directionSelect?.dispatchEvent(
      new CustomEvent("update:modelValue", { detail: "column-reverse" }),
    );
    gapSelect?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "xl" }));
    await tick();
    await tick();

    expect(directionFlex?.direction).toBe("column-reverse");
    expect(directionFlex?.getAttribute("direction")).toBe("column-reverse");
    expect(gapFlex?.gap).toBe("xl");
  });

  it("通过控制台切换主轴和交叉轴对齐", async () => {
    const page = document.createElement(alignmentTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    const justifySelect = playgrounds?.[0]?.querySelector("elf-select");
    const alignSelect = playgrounds?.[1]?.querySelector("elf-select");
    const justifyFlex = playgrounds?.[0]?.querySelector<HTMLElement & { justify: string }>(
      "elf-flex",
    );
    const alignFlex = playgrounds?.[1]?.querySelector<HTMLElement & { align: string }>("elf-flex");

    justifySelect?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "space-evenly" }));
    alignSelect?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "baseline" }));
    await tick();
    await tick();

    expect(justifyFlex?.justify).toBe("space-evenly");
    expect(justifyFlex?.getAttribute("justify")).toBe("space-evenly");
    expect(alignFlex?.align).toBe("baseline");
    expect(alignFlex?.getAttribute("align")).toBe("baseline");
  });

  it("通过控制台切换换行、多行对齐和 Space 兼容输入", async () => {
    const page = document.createElement(wrappingTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const playgrounds = page.shadowRoot?.querySelectorAll<HTMLElement>("elf-playground");
    const selects = page.shadowRoot?.querySelectorAll("elf-select");

    expect(playgrounds).toHaveLength(3);
    expect(page.shadowRoot?.querySelectorAll('[slot="controls"]')).toHaveLength(3);
    expect(playgrounds?.[0]?.querySelector(".wrap-preview")).toBeTruthy();
    expect(page.shadowRoot?.querySelectorAll(".align-content-demo .diagram-item")).toHaveLength(3);
    expect(
      page.shadowRoot?.querySelectorAll(".align-content-demo .diagram-item small"),
    ).toHaveLength(3);
    expect(page.shadowRoot?.querySelector("elf-flex[alignment][size]")).toBeTruthy();

    selects?.[0]?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "wrap-reverse" }));
    selects?.[1]?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "space-evenly" }));
    selects?.[2]?.dispatchEvent(new CustomEvent("update:modelValue", { detail: "fill" }));
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelector('elf-flex[wrap="wrap-reverse"]')).toBeTruthy();
    expect(page.shadowRoot?.querySelector('elf-flex[align-content="space-evenly"]')).toBeTruthy();
    expect(page.shadowRoot?.querySelector("elf-flex[fill]")).toBeTruthy();
  });

  it("展示 Spacer 和三个编号子项", async () => {
    const page = document.createElement(spacerTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelector("elf-spacer")).toBeTruthy();
    expect(page.shadowRoot?.querySelectorAll("elf-playground")).toHaveLength(3);
    expect(page.shadowRoot?.querySelectorAll('[slot="controls"]')).toHaveLength(1);
    expect(page.shadowRoot?.querySelectorAll(".diagram-item")).toHaveLength(9);
    expect(page.shadowRoot?.querySelector(".diagram-stage")).toBeNull();
  });
});
