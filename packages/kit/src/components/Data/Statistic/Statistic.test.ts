import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Statistic } from "./index";

beforeAll(() => {
  registerComponents(Statistic);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface StatisticEl extends HTMLElement {
  value?: number;
  precision?: number;
  title?: string;
  suffix?: string;
  animated?: boolean;
  startValue?: number;
  duration?: number;
  easing?: string;
}

describe("elf-statistic", () => {
  it("formats value with precision", async () => {
    const el = document.createElement("elf-statistic") as StatisticEl;
    el.title = "Revenue";
    el.value = 1234.5;
    el.precision = 2;
    el.suffix = "USD";
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.textContent).toContain("Revenue");
    expect(el.shadowRoot!.textContent).toContain("1,234.50");
    expect(el.shadowRoot!.textContent).toContain("USD");
  });

  it("supports formatter and value-style props", async () => {
    const el = document.createElement("elf-statistic") as StatisticEl & {
      formatter?: (value: number) => string;
      valueStyle?: Record<string, string>;
    };
    el.value = 128430;
    el.formatter = (value) => `${Math.round(value / 1000)}k`;
    el.valueStyle = { color: "rgb(1, 2, 3)" };
    document.body.appendChild(el);
    await tick();

    const value = el.shadowRoot!.querySelector(".value") as HTMLElement;
    expect(value.textContent).toContain("128k");
    expect(value.getAttribute("style")).toContain("color");
  });

  it("renders title, prefix, and suffix slots without matching props", async () => {
    const el = document.createElement("elf-statistic");
    el.innerHTML = `
      <strong slot="title">CPU</strong>
      <span slot="prefix">~</span>
      <span slot="suffix">%</span>
    `;
    document.body.appendChild(el);
    await tick();

    for (const name of ["title", "prefix", "suffix"]) {
      const slot = el.shadowRoot!.querySelector(`slot[name="${name}"]`) as HTMLSlotElement;
      expect(slot.assignedNodes().length).toBeGreaterThan(0);
    }
  });

  it("animates from the configured start value with deterministic easing", async () => {
    let frameId = 0;
    const frames = new Map<number, FrameRequestCallback>();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameId += 1;
      frames.set(frameId, callback);
      return frameId;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    const runFrame = async (timestamp: number): Promise<void> => {
      const [id, callback] = [...frames.entries()][0] ?? [];
      expect(callback).toBeTypeOf("function");
      frames.delete(id!);
      callback!(timestamp);
      await tick();
    };

    const el = document.createElement("elf-statistic") as StatisticEl;
    el.value = 100;
    el.startValue = 10;
    el.duration = 1000;
    el.easing = "linear";
    el.animated = true;
    document.body.appendChild(el);
    await tick();

    const number = (): string => el.shadowRoot!.querySelector(".number")!.textContent!.trim();
    expect(number()).toBe("10");
    await runFrame(0);
    await runFrame(500);
    expect(number()).toBe("55");
    await runFrame(1000);
    expect(number()).toBe("100");
    expect(frames.size).toBe(0);
  });

  it("skips animation when reduced motion is preferred", async () => {
    const requestFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestFrame);
    vi.stubGlobal("matchMedia", () => ({ matches: true }));

    const el = document.createElement("elf-statistic") as StatisticEl;
    el.value = 2400;
    el.startValue = 1000;
    el.animated = true;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelector(".number")!.textContent).toBe("2,400");
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it("cancels a pending animation frame when disconnected", async () => {
    const cancelFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", () => 42);
    vi.stubGlobal("cancelAnimationFrame", cancelFrame);
    vi.stubGlobal("matchMedia", () => ({ matches: false }));

    const el = document.createElement("elf-statistic") as StatisticEl;
    el.value = 100;
    el.animated = true;
    document.body.appendChild(el);
    await tick();

    el.remove();
    await tick();
    expect(cancelFrame).toHaveBeenCalledWith(42);
  });
});
