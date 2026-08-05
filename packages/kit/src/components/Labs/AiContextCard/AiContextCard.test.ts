import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiContextCard } from "./index";

beforeAll(() => registerComponents(AiContextCard));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiContextCardEl extends HTMLElement {
  title?: string;
  content?: string;
  characters?: number;
  sourceKind?: string;
  sourceName?: string;
  selectable?: boolean;
}

const createCard = async (overrides: Partial<AiContextCardEl> = {}): Promise<AiContextCardEl> => {
  const el = document.createElement("elf-ai-context-card") as AiContextCardEl;
  Object.assign(el, {
    title: "Vendor onboarding rule",
    content: "Cold-chain certification must be verified before a new dairy is added.",
    characters: 290,
    sourceKind: "pdf",
    sourceName: "Dairy Onboarding SOP.pdf",
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-context-card", () => {
  it("renders title, characters, content, and source", async () => {
    const el = await createCard();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Vendor onboarding rule");
    expect(root.textContent).toContain("290 characters");
    expect(root.textContent).toContain("Dairy Onboarding SOP.pdf");
  });

  it("reflects the source kind on the host", async () => {
    const el = await createCard({ sourceKind: "csv" });
    expect(el.getAttribute("data-kind")).toBe("csv");
  });

  it("emits select from the selectable action", async () => {
    const el = await createCard({ selectable: true });
    const onSelect = vi.fn();
    el.addEventListener("select", onSelect as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".select")!.click();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("hides the select action when not selectable", async () => {
    const el = await createCard();
    expect(el.shadowRoot!.querySelector(".select")).toBeFalsy();
    expect(el.hasAttribute("data-selectable")).toBe(false);
  });
});
