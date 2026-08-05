import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiInsightCard } from "./index";

beforeAll(() => registerComponents(AiInsightCard));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiInsightEl extends HTMLElement {
  insights?: Array<{
    id?: string | number;
    segments: Array<{ text: string; code?: boolean; mention?: boolean }>;
    sparks?: Array<{ label: string; change: string; amount?: string; tone?: string }>;
    cta?: string;
  }>;
  defaultIndex?: number;
  next?: () => boolean;
  previous?: () => boolean;
  goTo?: (index: number) => boolean;
}

const createCard = async (overrides: Partial<AiInsightEl> = {}): Promise<AiInsightEl> => {
  const el = document.createElement("elf-ai-insight-card") as AiInsightEl;
  Object.assign(el, {
    insights: [
      {
        id: 1,
        segments: [
          { text: "The worst performer in your " },
          { text: "@Creamery", mention: true },
          { text: " is Rocky Road — down " },
          { text: "-6%", code: true },
        ],
        sparks: [
          { label: "Mint Chip", change: "-4.41%", amount: "-$2,377.66", tone: "bad" },
          { label: "Pistachio", change: "+1.15%", amount: "+$617.22", tone: "good" },
        ],
        cta: "Should I rebalance flavors?",
      },
      { id: 2, segments: [{ text: "Second insight" }] },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-insight-card", () => {
  it("renders segments, sparks, and the CTA", async () => {
    const el = await createCard();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("@Creamery");
    expect(root.textContent).toContain("Mint Chip");
    expect(root.textContent).toContain("-6%");
    expect(root.textContent).toContain("Should I rebalance flavors?");
  });

  it("pages through insights and emits change", async () => {
    const el = await createCard();
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    expect(el.next!()).toBe(true);
    await tick();
    expect(el.shadowRoot!.textContent).toContain("Second insight");
    expect(el.previous!()).toBe(true);
    expect(el.next!()).toBe(true);
    expect(el.next!()).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("emits cta with index and text", async () => {
    const el = await createCard();
    const onCta = vi.fn();
    el.addEventListener("cta", onCta as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".cta")!.click();
    expect(onCta).toHaveBeenCalledTimes(1);
    expect(onCta.mock.calls[0][0].detail).toMatchObject({
      index: 0,
      cta: "Should I rebalance flavors?",
    });
  });
});
