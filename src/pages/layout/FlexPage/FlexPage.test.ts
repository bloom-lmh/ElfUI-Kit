import { afterEach, beforeAll, describe, expect, it } from "vitest";

let wrappingTag = "";
let spacerTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageFlexEx3 } = await import("./ex3");
  const { PageFlexEx4 } = await import("./ex4");
  wrappingTag = ensureCustomElement(PageFlexEx3);
  spacerTag = ensureCustomElement(PageFlexEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("FlexPage examples", () => {
  it("展示 wrap-reverse、align-content 和 Space 兼容输入", async () => {
    const page = document.createElement(wrappingTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelector('elf-flex[wrap="wrap-reverse"]')).toBeTruthy();
    expect(page.shadowRoot?.querySelector('elf-flex[align-content="space-between"]')).toBeTruthy();
    expect(page.shadowRoot?.querySelector('elf-flex[align-content="space-around"]')).toBeTruthy();
    expect(page.shadowRoot?.querySelector('elf-flex[align-content="space-evenly"]')).toBeTruthy();
    expect(page.shadowRoot?.querySelectorAll(".align-content-demo .diagram-item")).toHaveLength(9);
    expect(page.shadowRoot?.querySelectorAll(".diagram-line .align-content-demo")).toHaveLength(3);
    expect(page.shadowRoot?.querySelectorAll(".align-content-demo .diagram-item small")).toHaveLength(9);
    expect(page.shadowRoot?.textContent).toContain("space-evenly");
    expect(page.shadowRoot?.querySelector("elf-flex[alignment][size]")).toBeTruthy();
  });

  it("展示 Spacer 和三个编号子项", async () => {
    const page = document.createElement(spacerTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    expect(page.shadowRoot?.querySelector("elf-spacer")).toBeTruthy();
    expect(page.shadowRoot?.querySelectorAll("elf-playground")).toHaveLength(3);
    expect(page.shadowRoot?.querySelectorAll(".diagram-item").length).toBeGreaterThanOrEqual(9);
  });
});
