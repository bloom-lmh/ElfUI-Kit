import { registerAllComponents } from "@elfui/kit";
import { beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSparkline } = await import("./index");
  pageTag = ensureCustomElement(PageSparkline);
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("SparklinePage", () => {
  it("renders the animation scenario and switches periods", async () => {
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
    const sparkline = example.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect((sparkline as HTMLElement & { modelValue?: number[] }).modelValue).toEqual([
      640, 820, 550, 910, 770, 1050, 680, 1120, 860, 1240, 930, 1180,
    ]);
    buttons[2]!.click();
    await tick();
    await tick();
    expect(
      segmented
        .shadowRoot!.querySelectorAll<HTMLButtonElement>(".option")[1]!
        .classList.contains("is-active"),
    ).toBe(false);
    expect(
      segmented
        .shadowRoot!.querySelectorAll<HTMLButtonElement>(".option")[2]!
        .classList.contains("is-active"),
    ).toBe(true);
    expect((sparkline as HTMLElement & { modelValue?: number[] }).modelValue).toEqual([
      3100, 5800, 4200, 7600, 6100, 3800,
    ]);
  });

  it("renders the bar and dashboard examples", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const ex2 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex2")!;
    const bar = ex2.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect(bar.getAttribute("type")).toBe("bar");
    expect((bar as HTMLElement & { modelValue?: number[] }).modelValue).toEqual([
      4.2, 6.8, 5.4, 8.1, 6.2, 9.4, 7.6,
    ]);

    const ex3 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex3")!;
    expect(ex3.shadowRoot!.querySelectorAll("elf-card.metric-card").length).toBe(4);
    expect(ex3.shadowRoot!.querySelectorAll("elf-sparkline").length).toBe(4);
  });

  it("renders the interactive and heart-rate examples", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const ex4 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex4")!;
    const interactive = ex4.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect(interactive.getAttribute("interactive")).not.toBeNull();
    expect((interactive as HTMLElement & { modelValue?: number[] }).modelValue?.length).toBe(8);

    const ex5 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex5")!;
    const heart = ex5.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect(heart.getAttribute("show-markers")).not.toBeNull();
    expect((heart as HTMLElement & { smoothMode?: string }).smoothMode).toBe("monotone");
    expect(Array.isArray((heart as HTMLElement & { modelValue?: number[] }).modelValue)).toBe(true);
  });

  it("renders custom labels, gradient playground, and inset expenses examples", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const ex6 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex6")!;
    const sales = ex6.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect(sales.getAttribute("padding")).toBe("24");
    expect(sales.getAttribute("smooth")).toBe("8");
    expect((sales as HTMLElement & { labels?: string[] }).labels?.length).toBe(7);

    const ex7 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex7")!;
    expect(ex7.shadowRoot!.querySelectorAll(".gradient-chip").length).toBe(6);
    expect(ex7.shadowRoot!.querySelector("elf-checkbox")).toBeTruthy();
    expect(ex7.shadowRoot!.querySelectorAll("elf-slider").length).toBe(3);

    const ex8 = page.shadowRoot!.querySelector<HTMLElement>("elf-page-sparkline-ex8")!;
    const inset = ex8.shadowRoot!.querySelector<HTMLElement>("elf-sparkline")!;
    expect(inset.hasAttribute("inset")).toBe(true);
    expect(inset.hasAttribute("interactive")).toBe(true);
    expect(inset.hasAttribute("show-markers")).toBe(true);
  });
});
