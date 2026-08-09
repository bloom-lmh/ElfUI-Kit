import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageBadgeEx2 } = await import("./ex2");
  exampleTag = ensureCustomElement(PageBadgeEx2);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Badge documentation", () => {
  it("updates the count and switches the logical direction", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();

    const buttons = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>("elf-button"));
    buttons.find((button) => button.textContent?.trim() === "+")!.click();
    await tick();

    const panel = page.shadowRoot!.querySelector<HTMLElement>(".badge-dynamic-panel")!;
    const countBadge = panel.querySelector<HTMLElement>("elf-badge")!;
    expect((countBadge as HTMLElement & { value?: number }).value).toBe(1);

    buttons.find((button) => button.textContent?.includes("切换方向"))!.click();
    await tick();
    expect(panel.getAttribute("dir")).toBe("rtl");

    const longBadge = panel.querySelectorAll<HTMLElement>("elf-badge")[1]!;
    expect(longBadge.shadowRoot!.querySelector(".badge")?.getAttribute("aria-label")).toContain(
      "需要人工复核",
    );
  });
});
