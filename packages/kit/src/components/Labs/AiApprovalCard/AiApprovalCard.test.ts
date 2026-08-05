import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiApprovalCard } from "./index";

beforeAll(() => registerComponents(AiApprovalCard));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiApprovalEl extends HTMLElement {
  questions?: Array<{
    id?: string | number;
    title: string;
    options: Array<{ label: string; value: string }>;
    customPlaceholder?: string;
  }>;
  required?: boolean;
  confirm?: () => boolean;
  next?: () => boolean;
  previous?: () => boolean;
  reset?: () => void;
}

const createApproval = async (overrides: Partial<AiApprovalEl> = {}): Promise<AiApprovalEl> => {
  const el = document.createElement("elf-ai-approval-card") as AiApprovalEl;
  Object.assign(el, {
    questions: [
      {
        id: 1,
        title: "How many flavors should we launch?",
        options: [
          { label: "Three (core line)", value: "three" },
          { label: "Five (full case)", value: "five" },
        ],
        customPlaceholder: "Type something…",
      },
      { id: 2, title: "Which market first?", options: [{ label: "North", value: "north" }] },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-approval-card", () => {
  it("renders the first question and options", async () => {
    const el = await createApproval();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("How many flavors should we launch?");
    expect(root.querySelectorAll(".option")).toHaveLength(2);
  });

  it("emits confirm with the selected value", async () => {
    const el = await createApproval();
    const onConfirm = vi.fn();
    el.addEventListener("confirm", onConfirm as EventListener);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".option")[0]!.click();
    el.shadowRoot!.querySelector<HTMLButtonElement>(".confirm")!.click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm.mock.calls[0][0].detail).toMatchObject({
      index: 0,
      value: "three",
      custom: false,
    });
  });

  it("blocks confirm while required and empty", async () => {
    const el = await createApproval();
    const onConfirm = vi.fn();
    el.addEventListener("confirm", onConfirm as EventListener);
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".confirm")!.disabled).toBe(true);
    expect(el.confirm!()).toBe(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("navigates questions and exposes methods", async () => {
    const el = await createApproval();
    const onChange = vi.fn();
    el.addEventListener("question-change", onChange as EventListener);
    expect(el.next!()).toBe(true);
    await tick();
    expect(el.shadowRoot!.textContent).toContain("Which market first?");
    expect(el.previous!()).toBe(true);
    expect(el.next!()).toBe(true);
    expect(el.next!()).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("accepts a custom answer", async () => {
    const el = await createApproval();
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".custom-input")!;
    input.value = "Just one hero";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".confirm")!.disabled).toBe(false);
    expect(el.confirm!()).toBe(true);
  });
});
