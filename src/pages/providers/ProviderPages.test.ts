import { afterEach, beforeAll, describe, expect, it } from "vitest";

let localeMatrixTag = "";
let localeNestedTag = "";
let themeNestedTag = "";
let defaultsNestedTag = "";

beforeAll(async () => {
  await import("../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLocaleProviderEx2 } = await import("./LocaleProviderPage/ex2");
  const { PageLocaleProviderEx3 } = await import("./LocaleProviderPage/ex3");
  const { PageThemeProviderEx4 } = await import("./ThemeProviderPage/ex4");
  const { PageDefaultsProviderEx3 } = await import("./DefaultsProviderPage/ex3");
  localeMatrixTag = ensureCustomElement(PageLocaleProviderEx2);
  localeNestedTag = ensureCustomElement(PageLocaleProviderEx3);
  themeNestedTag = ensureCustomElement(PageThemeProviderEx4);
  defaultsNestedTag = ensureCustomElement(PageDefaultsProviderEx3);
});

afterEach(async () => {
  const { ElfMessage } = await import("../../components/Feedback/Message");
  ElfMessage.closeAll();
  document.body.innerHTML = "";
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
const mount = async (tag: string): Promise<HTMLElement> => {
  const page = document.createElement(tag);
  document.body.appendChild(page);
  await tick();
  await tick();
  await tick();
  return page;
};

describe("Provider pages", () => {
  it("英文矩阵把常见空态与占位文案交给 LocaleProvider", async () => {
    const page = await mount(localeMatrixTag);
    const provider = page.shadowRoot!.querySelector("elf-locale-provider")!;
    const select = provider.querySelector("elf-select")!;
    const datePicker = provider.querySelector("elf-date-picker")!;
    expect(select.shadowRoot?.textContent).toContain("Select");
    expect(datePicker.shadowRoot?.textContent).toContain("Select date");
  });

  it("嵌套 locale 同时显示英文和中文格式化结果", async () => {
    const page = await mount(localeNestedTag);
    const text = collectText(page);
    expect(text).toContain("Outer English workspace");
    expect(text).toContain("$123,456.78");
    expect(text).toContain("局部中文审批区");
  });

  it("嵌套 custom 主题继承暗色表面并覆盖主色", async () => {
    const page = await mount(themeNestedTag);
    const providers = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-theme-provider");
    expect(providers).toHaveLength(2);
    expect(providers[0]!.style.getPropertyValue("--elf-bg-paper")).toBe("#1e1e1e");
    expect(providers[1]!.style.getPropertyValue("--elf-primary")).toBe("#ffb4ab");
    expect(providers[1]!.style.getPropertyValue("--elf-bg-paper")).toBe("#2b2020");
  });

  it("DefaultsProvider 页面展示继承、局部覆盖和 reset", async () => {
    const page = await mount(defaultsNestedTag);
    const providers = page.shadowRoot!.querySelectorAll("elf-defaults-provider");
    expect(providers).toHaveLength(3);
    const outerButton = providers[0]!.querySelector("elf-button") as HTMLElement & Record<string, unknown>;
    const innerButton = providers[1]!.querySelector("elf-button") as HTMLElement & Record<string, unknown>;
    const resetButton = providers[2]!.querySelector("elf-button") as HTMLElement & Record<string, unknown>;
    expect(outerButton.variant).toBe("outlined");
    expect(innerButton.color).toBe("success");
    expect(resetButton.color).toBe("warning");
    expect(resetButton.variant).toBe("contained");
  });
});
