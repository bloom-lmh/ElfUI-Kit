import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let providerExampleTag = "";
let accessibilityExampleTag = "";
let galleryExampleTag = "";
let rawSvgExampleTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageIconEx2 } = await import("./ex2");
  const { PageIconEx3 } = await import("./ex3");
  const { PageIconEx4 } = await import("./ex4");
  const { PageIconEx5 } = await import("./ex5");
  providerExampleTag = ensureCustomElement(PageIconEx2);
  accessibilityExampleTag = ensureCustomElement(PageIconEx3);
  galleryExampleTag = ensureCustomElement(PageIconEx4);
  rawSvgExampleTag = ensureCustomElement(PageIconEx5);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const searchInputOf = (page: HTMLElement): HTMLInputElement => {
  const search = page.shadowRoot!.querySelector<HTMLElement>('[slot="status"] elf-input')!;
  return search.shadowRoot!.querySelector<HTMLInputElement>("input")!;
};

describe("Icon documentation", () => {
  it("renders a 72-icon gallery and filters it from the header search box", async () => {
    const page = document.createElement(galleryExampleTag);
    document.body.appendChild(page);
    await tick();

    expect(page.shadowRoot!.querySelectorAll(".icon-gallery-token").length).toBe(72);
    expect(page.shadowRoot!.querySelector('[slot="status"] elf-input')).toBeTruthy();

    const input = searchInputOf(page);
    input.value = "star";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await tick();

    const filtered = page.shadowRoot!.querySelectorAll(".icon-gallery-token");
    expect(filtered.length).toBe(1);
    expect(filtered[0]!.textContent).toContain("star");

    input.value = "zzzz";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await tick();

    expect(page.shadowRoot!.querySelectorAll(".icon-gallery-token").length).toBe(0);
    expect(page.shadowRoot!.querySelector(".icon-gallery-empty")).toBeTruthy();

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await tick();

    expect(page.shadowRoot!.querySelectorAll(".icon-gallery-token").length).toBe(72);
  });

  it("copies the icon code when a gallery token is clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const page = document.createElement(galleryExampleTag);
    document.body.appendChild(page);
    await tick();

    const star = Array.from(
      page.shadowRoot!.querySelectorAll<HTMLElement>(".icon-gallery-token"),
    ).find((token) => token.dataset.name === "star")!;
    star.click();
    await tick();

    expect(writeText).toHaveBeenCalledWith('<elf-icon name="star" size="20"></elf-icon>');
    const updated = Array.from(
      page.shadowRoot!.querySelectorAll<HTMLElement>(".icon-gallery-token"),
    ).find((token) => token.dataset.name === "star")!;
    expect(updated.querySelector("small")?.textContent).toContain("已复制");
  });

  it("copies the icon code with Enter on a focused gallery token", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const page = document.createElement(galleryExampleTag);
    document.body.appendChild(page);
    await tick();

    const home = Array.from(
      page.shadowRoot!.querySelectorAll<HTMLElement>(".icon-gallery-token"),
    ).find((token) => token.dataset.name === "home")!;
    home.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();

    expect(writeText).toHaveBeenCalledWith('<elf-icon name="home" size="20"></elf-icon>');
  });

  it("renders third-party SVG through the default slot with size and color control", async () => {
    const page = document.createElement(rawSvgExampleTag);
    document.body.appendChild(page);
    await tick();

    expect(page.shadowRoot!.querySelector(".icon-brand-panel")).toBeTruthy();
    expect(page.shadowRoot!.querySelectorAll(".icon-brand-button")).toHaveLength(3);
    expect(page.shadowRoot!.querySelectorAll(".icon-brand-spec-item")).toHaveLength(3);
    expect(page.shadowRoot!.querySelectorAll(".icon-brand-button svg path")).toHaveLength(3);
  });

  it("switches the provider set and keeps an explicit missing-icon fallback", async () => {
    const page = document.createElement(providerExampleTag);
    document.body.appendChild(page);
    await tick();

    const provider = page.shadowRoot!.querySelector<HTMLElement>("elf-icon-provider")!;
    const account = provider.querySelector<HTMLElement>('elf-icon[name="$account"]')!;
    const initialPath = account.shadowRoot!.querySelector("path")!.getAttribute("d");
    const missing = provider.querySelector<HTMLElement>('elf-icon[name="unknown"]')!;
    expect(missing.shadowRoot!.querySelector(".fallback-icon")?.textContent).toBe("?");

    const toggle = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>("elf-button")).find(
      (button) => button.textContent?.includes("切换图标集"),
    )!;
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
    expect(icon.shadowRoot!.querySelector("[part='icon']")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
