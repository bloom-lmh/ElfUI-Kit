import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiCodeBlock } from "./index";

beforeAll(() => registerComponents(AiCodeBlock));

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const settle = async (): Promise<void> => {
  await tick();
  await new Promise((resolve) => setTimeout(resolve, 30));
  await tick();
};

interface AiCodeBlockEl extends HTMLElement {
  code?: string;
  filename?: string;
  language?: string;
  status?: string;
  streamSpeed?: number;
  showLineNumbers?: boolean;
  copy?: () => Promise<boolean>;
  revealAll?: () => void;
  reset?: () => void;
}

const createBlock = async (overrides: Partial<AiCodeBlockEl> = {}): Promise<AiCodeBlockEl> => {
  const el = document.createElement("elf-ai-code-block") as AiCodeBlockEl;
  Object.assign(el, {
    code: "const a = 1;\nconst b = 2;",
    filename: "churn.ts",
    language: "TypeScript",
    status: "complete",
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-code-block", () => {
  it("renders the filename and all complete lines", async () => {
    const el = await createBlock();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("churn.ts");
    expect(root.querySelectorAll(".line")).toHaveLength(2);
    expect(root.textContent).toContain("const a = 1;");
  });

  it("streams lines and emits complete", async () => {
    vi.useFakeTimers();
    const el = await createBlock({ status: "streaming", streamSpeed: 10 });
    const onComplete = vi.fn();
    el.addEventListener("complete", onComplete as EventListener);
    expect(el.shadowRoot!.querySelectorAll(".line")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector(".placeholder")).toBeTruthy();
    vi.advanceTimersByTime(11);
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".line")).toHaveLength(1);
    expect(el.shadowRoot!.querySelector(".placeholder")).toBeFalsy();
    expect(el.shadowRoot!.querySelector(".status-chip")?.textContent).toContain("1/2");
    vi.advanceTimersByTime(11);
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".line")).toHaveLength(2);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("reveals everything via expose", async () => {
    const el = await createBlock({ status: "streaming" });
    el.revealAll!();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".line")).toHaveLength(2);
    expect(el.getAttribute("data-status")).toBe("streaming");
    expect(el.hasAttribute("data-streaming")).toBe(false);
  });

  it("copies the full code and emits copy", async () => {
    const el = await createBlock();
    const onCopy = vi.fn();
    el.addEventListener("copy", onCopy as EventListener);
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
    Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
    await el.copy!();
    await tick();
    expect(clipboard.writeText).toHaveBeenCalledWith("const a = 1;\nconst b = 2;");
    expect(onCopy.mock.calls[0][0].detail.filename).toBe("churn.ts");
  });

  it("renders syntax-highlighted tokens and trims blank edges", async () => {
    const el = await createBlock({
      code: "\n\nconst a = 1;\nconst b = 2;\n\n",
    });
    await settle();
    const root = el.shadowRoot!;
    expect(root.querySelectorAll(".line")).toHaveLength(2);
    await vi.waitFor(() => {
      expect(root.querySelectorAll(".line-content span").length).toBeGreaterThan(2);
    });
    expect(root.querySelectorAll(".line-content span")[0]?.getAttribute("style")).toBeTruthy();
  });
});
