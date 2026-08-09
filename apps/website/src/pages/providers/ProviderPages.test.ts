import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let localeMatrixTag = "";
let localeNestedTag = "";
let themeNestedTag = "";
let defaultsNestedTag = "";
let configProviderTag = "";
let defaultsProviderTag = "";
let localeProviderTag = "";
let themeProviderTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLocaleProviderEx2 } = await import("./LocaleProviderPage/ex2");
  const { PageLocaleProviderEx3 } = await import("./LocaleProviderPage/ex3");
  const { PageThemeProviderEx4 } = await import("./ThemeProviderPage/ex4");
  const { PageDefaultsProviderEx3 } = await import("./DefaultsProviderPage/ex3");
  const { PageConfigProvider } = await import("./ConfigProviderPage/index");
  const { PageDefaultsProvider } = await import("./DefaultsProviderPage/index");
  const { PageLocaleProvider } = await import("./LocaleProviderPage/index");
  const { PageThemeProvider } = await import("./ThemeProviderPage/index");
  localeMatrixTag = ensureCustomElement(PageLocaleProviderEx2);
  localeNestedTag = ensureCustomElement(PageLocaleProviderEx3);
  themeNestedTag = ensureCustomElement(PageThemeProviderEx4);
  defaultsNestedTag = ensureCustomElement(PageDefaultsProviderEx3);
  configProviderTag = ensureCustomElement(PageConfigProvider);
  defaultsProviderTag = ensureCustomElement(PageDefaultsProvider);
  localeProviderTag = ensureCustomElement(PageLocaleProvider);
  themeProviderTag = ensureCustomElement(PageThemeProvider);
}, 60_000);

afterEach(async () => {
  const { ElfMessage } = await import("@elfui/kit");
  ElfMessage.closeAll();
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
const mount = async (tag: string): Promise<HTMLElement> => {
  const page = document.createElement(tag);
  document.body.appendChild(page);
  await tick();
  await tick();
  await tick();
  return page;
};

describe("Provider pages", () => {
  it("英文覆盖把登录表单的标签切换为英文", async () => {
    const page = await mount(localeMatrixTag);
    const provider = page.shadowRoot!.querySelector("elf-locale-provider")!;
    const inputs = Array.from(provider.querySelectorAll<HTMLElement>("elf-input"));
    expect(inputs).toHaveLength(2);
    expect(inputs[0]?.getAttribute("label")).toBe("Email");
    expect(inputs[1]?.getAttribute("label")).toBe("Password");
    expect(provider.textContent).toContain("Sign in");
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
    expect(providers[0]!.style.getPropertyValue("--elf-bg-paper")).toBe("#111827");
    expect(providers[1]!.style.getPropertyValue("--elf-primary")).toBe("#ffb4ab");
    expect(providers[1]!.style.getPropertyValue("--elf-bg-paper")).toBe("#2b2020");
  });

  it("DefaultsProvider 页面展示继承、局部覆盖和 reset", async () => {
    const page = await mount(defaultsNestedTag);
    const providers = page.shadowRoot!.querySelectorAll("elf-defaults-provider");
    expect(providers).toHaveLength(3);
    const outerButton = providers[0]!.querySelector("elf-button") as HTMLElement &
      Record<string, unknown>;
    const innerButton = providers[1]!.querySelector("elf-button") as HTMLElement &
      Record<string, unknown>;
    const resetButton = providers[2]!.querySelector("elf-button") as HTMLElement &
      Record<string, unknown>;
    expect(outerButton.variant).toBe("outlined");
    expect(innerButton.color).toBe("success");
    expect(resetButton.color).toBe("warning");
    expect(resetButton.variant).toBe("contained");
  });

  it("ConfigProvider 中文页面展示一站式配置、命名主题和断点", async () => {
    const page = await mount(configProviderTag);
    const text = collectText(page);
    expect(text).toContain("配置优先级");
    expect(text).toContain("目标按钮");
    expect(text).toContain("当前生效值");
    expect(text).toContain("移动端阈值");
    expect(text).toContain("完整动效");
    expect(text).toContain("减少动效");
    expect(text).toContain("可复用的基础预设；config 中的同名配置会覆盖它");
    expect(text).toContain("命名主题");
    expect(text).toContain("显示与动效偏好");
    expect(text).toContain("共享滚动策略");
  });

  it("ConfigProvider 英文页面覆盖案例、预览和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(configProviderTag);
    const text = collectText(page);
    expect(text).toContain("Config priority");
    expect(text).toContain("Precedence: explicit props > app config > blueprint");
    expect(text).toContain("Mobile threshold");
    expect(text).toContain("Full motion");
    expect(text).toContain("Reduced motion");
    expect(text).toContain("Reusable base preset; matching config values override it.");
    expect(text).toContain("Named theme");
    expect(text).toContain("Display and motion preferences");
    expect(text).toContain("Shared scroll strategy");
    expect(text).toContain("Field value semantics");
    expect(text).toContain("Shared emptyValues and valueOnClear semantics across fields.");
    expect(text).toContain("Reusable base preset; matching config values override it.");
    expect(text).not.toContain("配置优先级：基础预设 → 应用配置 → 显式属性");
  });

  it("DefaultsProvider 英文页面覆盖三个策略案例和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(defaultsProviderTag);
    const text = collectText(page);
    expect(text).toContain("Propagating default props");
    expect(text).toContain("Overwrite strategy");
    expect(text).toContain("Nested overrides and reset");
    expect(text).toContain("Default props keyed by component name.");
    expect(text).not.toContain("默认属性下发");
  });

  it("LocaleProvider 英文页面覆盖切换、矩阵和嵌套作用域", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(localeProviderTag);
    const text = collectText(page);
    expect(text).toContain("Switching locale and RTL");
    expect(text).toContain("Component-level English override");
    expect(text).toContain("Nested scopes and formatting");
    expect(text).toContain("External i18n");
    expect(text).toContain("Adaptateur i18n externe");
    expect(text).toContain("Valider");
    expect(text).toContain("Lokaler deutscher Freigabebereich");
    expect(text).toContain("Localized messages merged with the defaults.");
    expect(text).not.toContain("英文工作区中的中文审批区");
  });

  it("ThemeProvider 英文页面覆盖局部、动态、皮肤和服务浮层案例", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(themeProviderTag);
    const text = collectText(page);
    expect(text).toContain("Local dark theme");
    expect(text).toContain("Custom primary color");
    expect(text).toContain("Multiple theme skins");
    expect(text).toContain("Nested themes and service overlays");
    expect(text).toContain("Coral approval scope");
    expect(text).toContain("Named theme definitions.");
    expect(text).not.toContain("局部暗色主题");
  });
});
