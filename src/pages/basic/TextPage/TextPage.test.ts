import { afterEach, beforeAll, describe, expect, it } from "vitest";

let semanticExampleTag = "";
let clampExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTextEx2 } = await import("./ex2");
  const { PageTextEx3 } = await import("./ex3");
  semanticExampleTag = ensureCustomElement(PageTextEx2);
  clampExampleTag = ensureCustomElement(PageTextEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Text documentation", () => {
  it("renders a native heading, paragraph, and baseline-safe capacity unit", async () => {
    const page = document.createElement(semanticExampleTag);
    document.body.appendChild(page);
    await tick();

    const heading = page.shadowRoot!.querySelector<HTMLElement>('elf-text[tag="h2"]')!;
    const paragraph = page.shadowRoot!.querySelector<HTMLElement>('elf-text[tag="p"]')!;
    expect(heading.shadowRoot!.querySelector("h2.text")).toBeTruthy();
    expect(paragraph.shadowRoot!.querySelector("p.text")).toBeTruthy();

    const metric = page.shadowRoot!.querySelector<HTMLElement>(".text-metric-line")!;
    expect(metric.textContent?.replace(/\s+/g, " ").trim()).toBe("128 GB");
  });

  it("switches width while preserving single- and multi-line truncation contracts", async () => {
    const page = document.createElement(clampExampleTag);
    document.body.appendChild(page);
    await tick();

    const card = page.shadowRoot!.querySelector<HTMLElement>(".text-clamp-card")!;
    const single = card.querySelector<HTMLElement>("elf-text[truncated]")!;
    const multiple = card.querySelector<HTMLElement>('elf-text[line-clamp="2"]')!;

    expect(card.classList.contains("is-compact")).toBe(true);
    expect(single.getAttribute("title")).toBeTruthy();
    expect(multiple.style.getPropertyValue("--_line-clamp")).toBe("2");

    const wideButton = Array.from(page.shadowRoot!.querySelectorAll<HTMLButtonElement>(".text-width-switch button"))
      .find((button) => button.textContent?.includes("440"))!;
    wideButton.click();
    await tick();

    expect(card.classList.contains("is-wide")).toBe(true);
    expect(wideButton.getAttribute("aria-pressed")).toBe("true");
  });
});
