import { afterEach, beforeAll, describe, expect, it } from "vitest";

let providerExampleTag = "";
let accessibilityExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageIconEx2 } = await import("./ex2");
  const { PageIconEx3 } = await import("./ex3");
  providerExampleTag = ensureCustomElement(PageIconEx2);
  accessibilityExampleTag = ensureCustomElement(PageIconEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Icon documentation", () => {
  it("switches the provider set and keeps an explicit missing-icon fallback", async () => {
    const page = document.createElement(providerExampleTag);
    document.body.appendChild(page);
    await tick();

    const provider = page.shadowRoot!.querySelector<HTMLElement>("elf-icon-provider")!;
    const account = provider.querySelector<HTMLElement>('elf-icon[name="$account"]')!;
    const initialPath = account.shadowRoot!.querySelector("path")!.getAttribute("d");
    const missing = provider.querySelector<HTMLElement>('elf-icon[name="unknown"]')!;
    expect(missing.shadowRoot!.querySelector(".fallback-icon")?.textContent).toBe("?");

    const toggle = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>("elf-button"))
      .find((button) => button.textContent?.includes("切换图标集"))!;
    toggle.click();
    await tick();

    expect(provider.getAttribute("data-icon-set")).toBe("filled");
    expect(account.shadowRoot!.querySelector("path")!.getAttribute("d")).not.toBe(initialPath);
  });

  it("puts the accessible name on the icon-only button and hides its decorative icon", async () => {
    const page = document.createElement(accessibilityExampleTag);
    document.body.appendChild(page);
    await tick();

    const button = page.shadowRoot!.querySelector<HTMLElement>("elf-button")!;
    expect(button.shadowRoot!.querySelector("button")?.getAttribute("aria-label")).toBe("刷新数据");

    const icon = button.querySelector<HTMLElement>("elf-icon")!;
    expect(icon.shadowRoot!.querySelector("[part='icon']")?.getAttribute("aria-hidden")).toBe("true");
  });
});
