import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiRecommendationCard } from "./index";

beforeAll(() => registerComponents(AiRecommendationCard));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiRecommendationEl extends HTMLElement {
  title?: string;
  segments?: Array<{ text: string; code?: boolean }>;
  confidence?: string;
  alternatives?: Array<{ label: string; signal: string; signalKind?: string }>;
}

const createCard = async (
  overrides: Partial<AiRecommendationEl> = {},
): Promise<AiRecommendationEl> => {
  const el = document.createElement("elf-ai-recommendation-card") as AiRecommendationEl;
  Object.assign(el, {
    title: "Want me to place this restock order?",
    segments: [
      { text: "Reorder waffle cones from " },
      { text: "cone_king", code: true },
      { text: " with lead time " },
      { text: "7_days", code: true },
      { text: "." },
    ],
    confidence: "high",
    alternatives: [
      { label: "Switch to vanilla_madagascar", signal: "Needs review", signalKind: "review" },
      { label: "Full restock across every SKU", signal: "No signal", signalKind: "none" },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-recommendation-card", () => {
  it("renders the title, code fragments, and alternatives", async () => {
    const el = await createCard();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Want me to place this restock order?");
    expect(root.textContent).toContain("cone_king");
    expect(root.querySelectorAll(".alternative")).toHaveLength(2);
    expect(root.querySelectorAll(".inline-code")).toHaveLength(2);
  });

  it("reflects confidence and emits accept", async () => {
    const el = await createCard();
    const onAccept = vi.fn();
    el.addEventListener("accept", onAccept as EventListener);
    expect(el.getAttribute("data-confidence")).toBe("high");
    el.shadowRoot!.querySelector<HTMLButtonElement>(".primary")!.click();
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("emits the selected alternative", async () => {
    const el = await createCard();
    const onSelect = vi.fn();
    el.addEventListener("alternative-select", onSelect as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".alternative")[1]!.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].detail).toMatchObject({
      label: "Full restock across every SKU",
    });
  });
});
