import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Heatmap } from "./index";

beforeAll(() => registerComponents(Heatmap));

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface HeatmapEl extends HTMLElement {
  rows?: Array<{ key: string; label: string }>;
  columns?: Array<{ key: string; label: string }>;
  items?: Array<{ row: string; column: string; value: number | null; label?: string }>;
  thresholds?: Array<{ max: number; color: string }>;
  focusCell?: (row: string, column: string) => void;
  getCell?: (row: string, column: string) => HTMLButtonElement | null;
}

const createHeatmap = async (): Promise<HeatmapEl> => {
  const el = document.createElement("elf-heatmap") as HeatmapEl;
  el.rows = [{ key: "w1", label: "Week 1" }, { key: "w2", label: "Week 2" }];
  el.columns = [{ key: "mon", label: "Mon" }, { key: "tue", label: "Tue" }];
  el.items = [{ row: "w1", column: "mon", value: 8, label: "8 contributions" }];
  el.thresholds = [{ max: 4, color: "#c6dbff" }, { max: 12, color: "#3b82f6" }];
  document.body.appendChild(el);
  await tick();
  return el;
};

describe("elf-heatmap", () => {
  it("renders matrix headers and threshold-colored cells", async () => {
    const el = await createHeatmap();
    const cells = el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".cell");
    expect(cells).toHaveLength(4);
    expect(el.shadowRoot!.textContent).toContain("Week 1");
    expect(cells[0].getAttribute("style")).toContain("#3b82f6");
    expect(cells[0].getAttribute("aria-label")).toContain("8 contributions");
  });

  it("emits cell details and exposes focus lookup", async () => {
    const el = await createHeatmap();
    const onClick = vi.fn();
    el.addEventListener("cell-click", onClick as EventListener);
    const cell = el.getCell!("w1", "mon")!;
    cell.click();
    await tick();

    expect(onClick.mock.calls[0][0].detail.item.value).toBe(8);
    el.focusCell!("w2", "tue");
    expect(el.shadowRoot!.activeElement).toBe(el.getCell!("w2", "tue"));
  });

  it("moves focus by arrow key without leaving the matrix", async () => {
    const el = await createHeatmap();
    const first = el.getCell!("w1", "mon")!;
    first.focus();
    first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(el.shadowRoot!.activeElement).toBe(el.getCell!("w1", "tue"));
  });
});
