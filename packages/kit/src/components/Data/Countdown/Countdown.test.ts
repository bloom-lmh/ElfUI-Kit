import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { registerComponents } from "@elfui/core";
import { Countdown } from "./index";

beforeAll(() => registerComponents(Countdown));
afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});
const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-countdown", () => {
  it("formats a target time and publishes timer semantics", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T00:00:00.000Z"));
    const el = document.createElement("elf-countdown") as HTMLElement & {
      value?: number;
      format?: string;
      title?: string;
    };
    el.value = Date.now() + 90_061_000;
    el.format = "DD [days] HH:mm:ss";
    el.title = "Launch";
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot!.querySelector(".number")?.textContent).toBe("01 days 01:01:01");
    expect(el.shadowRoot!.querySelector('[role="timer"]')?.getAttribute("aria-label")).toBe(
      "Countdown",
    );
  });

  it("emits change and finish exactly once when time elapses", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T00:00:00.000Z"));
    const el = document.createElement("elf-countdown") as HTMLElement & { value?: number };
    el.value = Date.now() + 500;
    const onChange = vi.fn();
    const onFinish = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    el.addEventListener("finish", onFinish as EventListener);
    document.body.appendChild(el);
    await tick();
    vi.advanceTimersByTime(1_000);
    await tick();
    expect(onChange).toHaveBeenCalled();
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(el.shadowRoot!.querySelector(".number")?.textContent).toBe("00:00:00");
  });
});
