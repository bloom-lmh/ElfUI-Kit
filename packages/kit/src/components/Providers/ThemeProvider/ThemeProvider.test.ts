import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { ThemeProviderProbe } from "./probe.test-component";

beforeAll(async () => {
  await import("../../../register-all").then(({ registerAllComponents }) =>
    registerAllComponents(),
  );
  registerComponents(ThemeProviderProbe);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface ThemeProviderEl extends HTMLElement {
  theme?: string;
  primary?: string;
  surface?: string;
}

describe("elf-theme-provider", () => {
  it("把主题 token 写成局部 CSS 变量", async () => {
    const provider = document.createElement("elf-theme-provider") as ThemeProviderEl;
    provider.theme = "dark";
    provider.primary = "#006a6a";
    provider.surface = "#102020";

    document.body.appendChild(provider);
    await tick();
    await tick();

    expect(provider.getAttribute("data-theme")).toBe("dark");
    expect(provider.style.getPropertyValue("--elf-primary")).toBe("#006a6a");
    expect(provider.style.getPropertyValue("--elf-bg-paper")).toBe("#102020");
    expect(provider.style.getPropertyValue("--elf-text-primary")).toContain("255");
    expect(provider.style.getPropertyValue("--elf-field-bg")).toContain("255");
  });

  it("custom 主题只写入覆盖 token", async () => {
    const provider = document.createElement("elf-theme-provider") as ThemeProviderEl;
    provider.theme = "custom";
    provider.primary = "#6750a4";

    document.body.appendChild(provider);
    await tick();

    expect(provider.style.getPropertyValue("--elf-primary")).toBe("#6750a4");
    expect(provider.style.getPropertyValue("--elf-bg-default")).toBe("");
  });

  it("嵌套 custom 主题继承暗色语义并覆盖局部 token", async () => {
    const outer = document.createElement("elf-theme-provider") as ThemeProviderEl;
    outer.theme = "dark";
    outer.innerHTML = `
      <elf-theme-provider id="inner" theme="custom"></elf-theme-provider>
    `;
    const inner = outer.querySelector("#inner") as HTMLElement & Record<string, unknown>;
    inner.tokens = { primary: "#ffb4ab" };
    inner.innerHTML = `<elf-theme-provider-probe></elf-theme-provider-probe>`;
    document.body.appendChild(outer);
    await tick();
    await tick();

    const probe = inner.querySelector("elf-theme-provider-probe")!;
    expect(probe.shadowRoot?.textContent).toContain("custom|true|#ffb4ab|#1e1e1e");
  });

  it("可以把当前主题 token 转发给 document 级浮层", async () => {
    const provider = document.createElement("elf-theme-provider") as ThemeProviderEl;
    provider.theme = "dark";
    provider.primary = "#80cbc4";
    provider.innerHTML = `<elf-theme-provider-probe></elf-theme-provider-probe>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const probe = provider.querySelector("elf-theme-provider-probe") as HTMLElement & {
      applyTo(target: HTMLElement): void;
    };
    const overlay = document.createElement("div");
    probe.applyTo(overlay);
    expect(overlay.style.getPropertyValue("--elf-primary")).toBe("#80cbc4");
    expect(overlay.style.getPropertyValue("--elf-bg-paper")).toBe("#1e1e1e");
    expect(overlay.getAttribute("data-theme")).toBe("dark");
  });
});
