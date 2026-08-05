import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiFineTuneCard } from "./index";

beforeAll(() => registerComponents(AiFineTuneCard));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiFineTuneEl extends HTMLElement {
  title?: string;
  properties?: Array<{
    key: string;
    label: string;
    kind: string;
    value: number | string;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: Array<{ label: string; value: string }>;
  }>;
  getValues?: () => Record<string, number | string>;
  setValue?: (key: string, value: number | string) => void;
}

const createCard = async (overrides: Partial<AiFineTuneEl> = {}): Promise<AiFineTuneEl> => {
  const el = document.createElement("elf-ai-fine-tune-card") as AiFineTuneEl;
  Object.assign(el, {
    title: "Flavor card",
    properties: [
      {
        key: "layout",
        label: "Layout",
        kind: "select",
        value: "row",
        options: [
          { label: "row", value: "row" },
          { label: "col", value: "col" },
        ],
      },
      { key: "w", label: "W", kind: "number", value: 324, min: 0, max: 640, step: 1 },
      { key: "label", label: "Label", kind: "text", value: "Pistachio" },
    ],
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-fine-tune-card", () => {
  it("renders all property kinds", async () => {
    const el = await createCard();
    const root = el.shadowRoot!;
    expect(root.querySelectorAll(".property")).toHaveLength(3);
    expect(root.querySelectorAll(".option")).toHaveLength(2);
    expect(root.querySelector(".range")).toBeTruthy();
    expect(root.querySelector(".text-input")).toBeTruthy();
  });

  it("emits change for number and select controls", async () => {
    const el = await createCard();
    const onChange = vi.fn();
    el.addEventListener("change", onChange as EventListener);
    const range = el.shadowRoot!.querySelector<HTMLInputElement>(".range")!;
    range.value = "400";
    range.dispatchEvent(new Event("input", { bubbles: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toMatchObject({ key: "w", value: 400 });
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".option")[1]!.click();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0].detail).toMatchObject({ key: "layout", value: "col" });
  });

  it("exposes getValues and setValue", async () => {
    const el = await createCard();
    expect(el.getValues!()).toMatchObject({ w: 324, layout: "row" });
    el.setValue!("w", 512);
    await tick();
    expect(el.getValues!()["w"]).toBe(512);
    expect(el.shadowRoot!.querySelector<HTMLInputElement>(".value-input")?.value).toBe("512");
  });
});
