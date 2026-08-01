import { beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSparkline } = await import("./index");
  pageTag = ensureCustomElement(PageSparkline);
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("SparklinePage", () => {
  it("renders the Vuetify animation scenario and switches periods", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();
    const example = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex1")!;
    expect(example.shadowRoot!.querySelector("elf-playground")).toBeTruthy();
    expect(
      example.shadowRoot!.querySelector("elf-sparkline")?.getAttribute("animation"),
    ).not.toBeNull();
    const segmented = example.shadowRoot!.querySelector<HTMLElement>("elf-segmented")!;
    const buttons = segmented.shadowRoot!.querySelectorAll<HTMLButtonElement>(".option");
    buttons[1]!.click();
    await tick();
    await tick();
    expect(
      segmented
        .shadowRoot!.querySelectorAll<HTMLButtonElement>(".option")[1]!
        .classList.contains("is-active"),
    ).toBe(true);
    const sparkline = example.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect((sparkline as HTMLElement & { modelValue?: number[] }).modelValue).toEqual([
      48, 72, 62, 98, 84, 118, 91, 132, 108, 148, 126, 166,
    ]);
  });
});
