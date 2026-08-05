import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiStreamingText } from "./index";

beforeAll(() => registerComponents(AiStreamingText));

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiStreamingEl extends HTMLElement {
  content?: string;
  sources?: Array<{ label: string; url?: string; domain?: string }>;
  actions?: Array<{ label: string; value?: string; tone?: string }>;
  followUps?: string[];
  streaming?: boolean;
  streamSpeed?: number;
  revealAll?: () => void;
  reset?: () => void;
}

const createStream = async (overrides: Partial<AiStreamingEl> = {}): Promise<AiStreamingEl> => {
  const el = document.createElement("elf-ai-streaming-text") as AiStreamingEl;
  Object.assign(el, {
    content: "Pistachio is your fastest-growing flavor this month.",
    sources: [{ label: "Scoop Data", url: "https://scoopdata.io", domain: "scoopdata.io" }],
    actions: [{ label: "Action", value: "a1" }],
    followUps: ["Which flavors sell best in winter?"],
    streaming: false,
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-streaming-text", () => {
  it("renders the full answer, sources, actions, and follow-ups", async () => {
    const el = await createStream();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Pistachio is your fastest-growing");
    expect(root.textContent).toContain("Scoop Data");
    expect(root.querySelectorAll(".action")).toHaveLength(1);
    expect(root.querySelectorAll(".follow-up")).toHaveLength(1);
  });

  it("streams words and emits complete", async () => {
    vi.useFakeTimers();
    const el = await createStream({ streaming: true, streamSpeed: 10 });
    const onComplete = vi.fn();
    el.addEventListener("complete", onComplete as EventListener);
    const before = el.shadowRoot!.querySelector(".answer")?.textContent?.trim() || "";
    expect(before.split(/\s+/u).filter(Boolean).length).toBeLessThan(8);
    vi.advanceTimersByTime(80 * 10);
    await tick();
    expect(el.shadowRoot!.querySelector(".answer")?.textContent).toContain("flavor this month.");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("emits action and follow-up values", async () => {
    const el = await createStream();
    const onAction = vi.fn();
    const onFollowUp = vi.fn();
    el.addEventListener("action", onAction as EventListener);
    el.addEventListener("follow-up", onFollowUp as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".action")!.click();
    el.shadowRoot!.querySelector<HTMLButtonElement>(".follow-up")!.click();
    expect(onAction.mock.calls[0][0].detail).toMatchObject({ label: "Action" });
    expect(onFollowUp.mock.calls[0][0].detail).toBe("Which flavors sell best in winter?");
  });

  it("reveals everything via expose", async () => {
    const el = await createStream({ streaming: true });
    el.revealAll!();
    await tick();
    expect(el.shadowRoot!.querySelector(".answer")?.textContent).toContain("this month.");
    expect(el.hasAttribute("data-streaming")).toBe(false);
  });
});
