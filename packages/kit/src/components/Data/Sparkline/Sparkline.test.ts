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

  it("renders bars with reversed gradient stops and labels", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: number[];
      type: string;
      gradient: string[];
      gradientDirection: string;
      labels: string[];
      showLabels: boolean;
      labelSize: number;
      autoLineWidth: boolean;
      smooth: number;
    };
    Object.assign(el, {
      modelValue: [2, 5, 3, 8],
      type: "bar",
      gradient: ["#112233", "#445566"],
      gradientDirection: "left",
      labels: ["Mon", "Tue", "Wed", "Thu"],
      showLabels: true,
      labelSize: 10,
      autoLineWidth: true,
      smooth: 3,
    });
    document.body.appendChild(el);
    await tick();
    await tick();

    const shadow = el.shadowRoot!;
    expect(shadow.querySelectorAll(".bar").length).toBe(4);
    const gradient = shadow.querySelector("linearGradient")!;
    expect(gradient.getAttribute("x1")).toBe("100%");
    expect(gradient.getAttribute("x2")).toBe("0");
    const stops = shadow.querySelectorAll("linearGradient stop");
    expect(stops[0]?.getAttribute("stop-color")).toBe("#445566");
    expect(shadow.querySelectorAll(".sparkline-label").length).toBe(4);
    expect(shadow.querySelector(".sparkline-label")?.textContent).toBe("Mon");
    expect(shadow.querySelector(".bar")?.getAttribute("rx")).toBe("3");
  });

  it("applies min and max to the trend scale", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: number[];
      min: number;
      max: number;
    };
    Object.assign(el, { modelValue: [10, 20, 30], min: 0, max: 40 });
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".line")?.getAttribute("d")).toContain("75.00");
  });

  it("renders markers and extends the line when inset", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: number[];
      showMarkers: boolean;
      inset: boolean;
      padding: number;
      markerSize: number;
    };
    Object.assign(el, {
      modelValue: [1, 4, 2, 8],
      showMarkers: true,
      inset: true,
      padding: 10,
      markerSize: 6,
    });
    document.body.appendChild(el);
    await tick();
    await tick();

    const shadow = el.shadowRoot!;
    const markers = shadow.querySelectorAll(".sparkline-marker");
    expect(markers.length).toBe(4);
    expect(markers[0]?.getAttribute("style")).toContain("left:");
    const d = shadow.querySelector(".line")?.getAttribute("d") ?? "";
    expect(d).toContain("M0.00,");
    expect(d).toContain("300.00,");
  });

  it("supports monotone smoothing and object items via item-value", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: Array<{ value: number }>;
      itemValue: string;
      smooth: number;
      smoothMode: string;
    };
    Object.assign(el, {
      modelValue: [{ value: 2 }, { value: 5 }, { value: 3 }, { value: 8 }],
      itemValue: "value",
      smooth: 16,
      smoothMode: "monotone",
    });
    document.body.appendChild(el);
    await tick();
    await tick();

    const shadow = el.shadowRoot!;
    expect(shadow.querySelector(".line")?.getAttribute("d")).toContain("C");
    expect(shadow.querySelector(".line")?.getAttribute("d")).toContain("M0.00,100.00");
  });

  it("emits current index changes for interactive charts", async () => {
    const el = document.createElement("elf-sparkline") as HTMLElement & {
      modelValue: number[];
      interactive: boolean;
    };
    Object.assign(el, { modelValue: [1, 4, 2], interactive: true });
    document.body.appendChild(el);
    await tick();
    await tick();

    const events: Array<number | null> = [];
    el.addEventListener("update:currentIndex", (event) => {
      events.push((event as CustomEvent).detail as number);
    });
    const wrap = el.shadowRoot!.querySelector<HTMLElement>(".sparkline-svg-wrap")!;
    wrap.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    wrap.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    expect(events.at(-1)).toBe(1);
    wrap.dispatchEvent(new Event("pointerleave", { bubbles: true }));
    await tick();
    expect(events.at(-1)).toBe(null);
  });
});
