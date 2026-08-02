import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { defineLocaleAdapter } from "../../../adapters";
import { mergeElfUIConfig } from "../config";
import { LocaleProviderProbe } from "../LocaleProvider/probe.test-component";
import { ConfigProviderProbe } from "./probe.test-component";

beforeAll(async () => {
  await import("../index");
  registerComponents(ConfigProviderProbe, LocaleProviderProbe);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise((resolve) => queueMicrotask(resolve));
  await new Promise((resolve) => queueMicrotask(resolve));
};

describe("elf-config-provider", () => {
  it("合并 blueprint，并把配置传递给子 Provider 和组件", async () => {
    const provider = document.createElement("elf-config-provider") as HTMLElement & {
      blueprint?: Record<string, unknown>;
      config?: Record<string, unknown>;
    };
    provider.blueprint = {
      theme: {
        theme: "ocean",
        themes: {
          ocean: {
            tokens: { primary: "#1769aa" },
          },
        },
      },
      defaults: { "elf-button": { variant: "outlined" } },
      goTo: { duration: 480, offset: 12 },
    };
    provider.config = {
      locale: { name: "en-US" },
      defaults: { "elf-button": { color: "secondary" } },
      motion: "reduced",
      goTo: { easing: "ease-out" },
    };
    provider.innerHTML = `
      <elf-config-provider-probe></elf-config-provider-probe>
      <elf-button id="button">Configured</elf-button>
    `;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const button = provider.querySelector("#button") as HTMLElement & Record<string, unknown>;
    expect(button.variant).toBe("outlined");
    expect(button.color).toBe("secondary");
    expect(provider.getAttribute("data-motion")).toBe("reduced");
    expect(provider.getAttribute("lang")).toBe("en-US");
    expect(
      provider.shadowRoot
        ?.querySelector("elf-theme-provider")
        ?.style.getPropertyValue("--elf-primary"),
    ).toBe("#1769aa");
    const probeText =
      provider.querySelector("elf-config-provider-probe")?.shadowRoot?.textContent ?? "";
    expect(probeText).toContain("480");
    expect(probeText).toContain("ease-out");
  });

  it("暴露响应式 display 与 reduced-motion 状态", async () => {
    const provider = document.createElement("elf-config-provider") as HTMLElement & {
      config?: Record<string, unknown>;
    };
    provider.config = {
      display: { mobileBreakpoint: 1200 },
      motion: "reduced",
    };
    provider.innerHTML = `<elf-config-provider-probe></elf-config-provider-probe>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const output =
      provider.querySelector("elf-config-provider-probe")?.shadowRoot?.textContent ?? "";
    expect(output).toContain("reduced");
    expect(output).toMatch(/mobile|desktop/);
    expect(provider.shadowRoot?.querySelector("elf-theme-provider")).toBeTruthy();
  });

  it("通过 ConfigProvider 向 LocaleProvider 传递外部翻译策略", async () => {
    const provider = document.createElement("elf-config-provider") as HTMLElement & {
      config?: Record<string, unknown>;
    };
    const adapter = defineLocaleAdapter({
      translate: (path) => (path === "common.confirm" ? "External confirm" : undefined),
    });
    provider.config = { locale: { name: "fr-FR", adapter } };
    provider.innerHTML = `<elf-locale-provider-probe></elf-locale-provider-probe>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    expect(provider.querySelector("elf-locale-provider-probe")?.shadowRoot?.textContent).toContain(
      "fr-FR|ltr|External confirm",
    );
  });

  it("将嵌套 adapter 作为原子策略替换", () => {
    const parentAdapter = defineLocaleAdapter({
      translate: () => "parent",
      formatNumber: () => "parent number",
    });
    const childAdapter = defineLocaleAdapter({
      translate: () => "child",
    });
    const merged = mergeElfUIConfig(
      { locale: { adapter: parentAdapter } },
      { locale: { adapter: childAdapter } },
    );

    expect(merged.locale?.adapter).toBe(childAdapter);
    expect(merged.locale?.adapter?.formatNumber).toBeUndefined();
  });
});

export {};
