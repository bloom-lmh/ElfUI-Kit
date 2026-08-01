import { beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../index");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-sparkline", () => {
  it("renders normalized line and area paths with an accessible name", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: number[];
      fill: boolean;
      ariaLabel: string;
    };
    Object.assign(el, { modelValue: [4, 8, 2, 10], fill: true, ariaLabel: "Page views" });
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".line")?.getAttribute("d")).toContain("M");
    expect(el.shadowRoot!.querySelector(".area")?.getAttribute("d")).toContain("Z");
    expect(el.shadowRoot!.querySelector("svg")?.getAttribute("aria-label")).toBe("Page views");
  });

  it("supports smooth paths and first-draw animation", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: number[];
      smooth: number;
      autoDraw: string;
    };
    Object.assign(el, { modelValue: [1, 4, 2, 8], smooth: 4, autoDraw: "once" });
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".line")?.getAttribute("d")).toContain("C");
    expect(el.shadowRoot!.querySelector(".line")?.classList.contains("is-auto-draw")).toBe(true);
  });
});
