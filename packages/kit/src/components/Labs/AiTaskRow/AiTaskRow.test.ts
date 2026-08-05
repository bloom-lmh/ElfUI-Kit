import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AiTaskRow } from "./index";

beforeAll(() => registerComponents(AiTaskRow));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface AiTaskRowEl extends HTMLElement {
  task?: {
    title: string;
    subtitle?: string;
    status?: string;
    steps?: Array<{ label: string; detail?: string; state?: string }>;
  };
  variant?: string;
  defaultExpanded?: boolean;
  expand?: () => void;
  collapse?: () => void;
  toggle?: () => void;
  isExpanded?: () => boolean;
}

const createTask = async (overrides: Partial<AiTaskRowEl> = {}): Promise<AiTaskRowEl> => {
  const el = document.createElement("elf-ai-task-row") as AiTaskRowEl;
  Object.assign(el, {
    task: {
      title: "Build reorder task list",
      subtitle: "7 SKUs",
      status: "running",
      steps: [
        { label: "Reading POS export", detail: "3 files" },
        { label: "Scoring stockout risk", detail: "68%" },
      ],
    },
    defaultExpanded: true,
    ...overrides,
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-ai-task-row", () => {
  it("renders the task summary and expanded steps", async () => {
    const el = await createTask();
    const root = el.shadowRoot!;
    expect(root.textContent).toContain("Build reorder task list");
    expect(root.textContent).toContain("7 SKUs");
    expect(root.querySelectorAll(".step")).toHaveLength(2);
  });

  it("marks the last step running while the task runs", async () => {
    const el = await createTask();
    const steps = el.shadowRoot!.querySelectorAll<HTMLElement>(".step");
    expect(steps[1]?.classList.contains("is-running")).toBe(true);
  });

  it("shows retry for failed tasks and emits retry", async () => {
    const el = await createTask({ task: { title: "Send emails", status: "failed" } });
    const onRetry = vi.fn();
    el.addEventListener("retry", onRetry as EventListener);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".retry")!.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("toggles expansion and reflects variant", async () => {
    const el = await createTask({ defaultExpanded: false, variant: "capsule" });
    expect(el.getAttribute("data-variant")).toBe("capsule");
    el.expand!();
    expect(el.isExpanded!()).toBe(true);
    expect(el.hasAttribute("data-expanded")).toBe(true);
    el.collapse!();
    expect(el.isExpanded!()).toBe(false);
  });
});
