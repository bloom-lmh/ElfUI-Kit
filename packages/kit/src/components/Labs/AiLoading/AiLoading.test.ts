import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiLoading } from "./index";

beforeAll(() => registerComponents(AiLoading));

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const createLoading = async (overrides: Record<string, unknown> = {}): Promise<HTMLElement> => {
  const el = document.createElement("elf-ai-loading") as HTMLElement & {
    label?: string;
    variant?: string;
    showTimer?: boolean;
    resetTimer?: () => void;
  };
  Object.assign(el, { label: "Churning", ...overrides });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-loading", () => {
  it("renders the label, nine cells, and a timer", async () => {
    const el = await createLoading();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Churning");
    expect(root.querySelectorAll(".cell")).toHaveLength(9);
    expect(root.querySelector(".timer")).toBeTruthy();
    expect(el.getAttribute("aria-label")).toContain("Churning");
  });

  it("reflects the variant on the host", async () => {
    const el = await createLoading({ variant: "dots" });
    expect(el.getAttribute("data-variant")).toBe("dots");
    expect(el.shadowRoot!.querySelector(".cell")?.classList.contains("is-round")).toBe(true);
  });

  it("hides the timer when show-timer is false", async () => {
    const el = await createLoading({ showTimer: false });
    expect(el.shadowRoot!.querySelector(".timer")).toBeFalsy();
    expect(el.hasAttribute("data-timer")).toBe(false);
  });

  it("keeps the orbit center dim and exposes resetTimer", async () => {
    vi.useFakeTimers();
    const el = await createLoading({ variant: "orbit" });
    const cells = el.shadowRoot!.querySelectorAll<HTMLElement>(".cell");
    expect(cells[4]?.classList.contains("is-dim")).toBe(true);
    expect(typeof (el as { resetTimer?: () => void }).resetTimer).toBe("function");
    (el as { resetTimer: () => void }).resetTimer();
    await tick();
    expect(el.shadowRoot!.querySelector(".timer")?.textContent).toBe("0.0s");
  });
});
