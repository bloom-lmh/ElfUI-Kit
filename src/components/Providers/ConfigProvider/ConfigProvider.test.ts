import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { ConfigProviderProbe } from "./probe.test-component";

beforeAll(async () => {
  await import("../index");
  registerComponents(ConfigProviderProbe);
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
    expect(provider.shadowRoot?.querySelector("elf-locale-provider")?.getAttribute("lang")).toBe("en-US");
    expect(provider.shadowRoot?.querySelector("elf-theme-provider")?.style.getPropertyValue("--elf-primary"))
      .toBe("#1769aa");
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
});

export {};
