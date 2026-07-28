import { beforeAll, beforeEach, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

beforeEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("virtual window", () => {
  it("exposes list-item styling hooks on declarative rows", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, unknown>;
    el.items = [{ id: 1, name: "Alpha" }];
    el.listItemClass = "custom-row";
    el.listItemStyle = { color: "rgb(1, 2, 3)", paddingInline: "18px" };
    document.body.appendChild(el);
    await tick();
    await tick();

    const row = el.shadowRoot!.querySelector<HTMLElement>(".item")!;
    expect(row.getAttribute("part")).toContain("list-item");
    expect(row.classList.contains("custom-row")).toBe(true);
    expect(row.style.color).toBe("rgb(1, 2, 3)");
    expect(row.style.getPropertyValue("padding-inline")).toBe("18px");
  });
  it("renders a regular list with a custom renderer", async () => {
    expect(customElements.get("elf-list")).toBeTruthy();
    const el = document.createElement("elf-list") as HTMLElement & Record<string, unknown>;
    el.items = [{ id: 1, name: "Alpha" }, { id: 2, name: "Beta" }];
    el.renderItem = (item: unknown) => {
      const strong = document.createElement("strong");
      strong.textContent = (item as { name: string }).name;
      return strong;
    };
    document.body.appendChild(el);
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".item")).toHaveLength(2);
    expect(el.shadowRoot!.textContent).toContain("Alpha");
  });

  it("keeps a 10,000-item virtual list DOM bounded while scrolling", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, unknown>;
    el.items = Array.from({ length: 10000 }, (_, index) => ({ id: index, name: `Item ${index}` }));
    el.itemHeight = 40;
    el.height = "240";
    el.overscan = 2;
    el.renderItem = (item: unknown) => (item as { name: string }).name;
    document.body.appendChild(el);
    await tick();
    await tick();

    const viewport = el.shadowRoot!.querySelector(".viewport") as HTMLElement;
    expect(viewport.style.height).toBe("240px");
    Object.defineProperty(viewport, "clientHeight", { configurable: true, value: 240 });
    expect(el.shadowRoot!.querySelectorAll(".item").length).toBeLessThan(40);
    expect((el.shadowRoot!.querySelector(".spacer") as HTMLElement).style.height).toBe("400000px");

    viewport.scrollTop = 20000;
    viewport.dispatchEvent(new Event("scroll"));
    viewport.scrollTop = 320000;
    viewport.dispatchEvent(new Event("scroll"));
    expect(el.shadowRoot!.textContent).toContain("Item 8000");
    expect(el.shadowRoot!.querySelectorAll(".item").length).toBeLessThan(40);
    await tick();
    expect(el.shadowRoot!.textContent).toContain("Item 8000");
    expect(el.shadowRoot!.querySelectorAll(".item").length).toBeLessThan(40);
    expect((el.shadowRoot!.querySelector(".window") as HTMLElement).style.transform)
      .toBe("translate3d(0, 319760px, 0)");
    expect((el.shadowRoot!.querySelector(".window") as HTMLElement).style.top)
      .toBe("0px");
  });

  it("recycles visible rows synchronously across continuous thumb-drag scroll events", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, unknown>;
    el.items = Array.from({ length: 10000 }, (_, index) => ({ id: index, name: `Task ${index}` }));
    el.itemHeight = 40;
    el.height = 240;
    el.overscan = 3;
    el.renderItem = (item: unknown) => (item as { name: string }).name;
    document.body.appendChild(el);
    await tick();
    await tick();

    const viewport = el.shadowRoot!.querySelector(".viewport") as HTMLElement;
    Object.defineProperty(viewport, "clientHeight", { configurable: true, value: 240 });
    const initialElements = new Set(el.shadowRoot!.querySelectorAll(".item"));
    for (let step = 1; step <= 80; step += 1) {
      viewport.scrollTop = step * 4800;
      viewport.dispatchEvent(new Event("scroll"));
      expect(el.shadowRoot!.querySelectorAll(".item").length).toBeGreaterThan(0);
      expect(el.shadowRoot!.querySelectorAll(".item").length).toBeLessThan(40);
      expect(el.shadowRoot!.querySelector(".item")?.textContent).not.toBe("");
    }

    expect(el.shadowRoot!.textContent).toContain("Task 9600");
    expect(Array.from(el.shadowRoot!.querySelectorAll(".item")).some((item) => initialElements.has(item))).toBe(true);
  });

  it("uses the same bounded window for a large table", async () => {
    const el = document.createElement("elf-table") as HTMLElement & Record<string, unknown>;
    el.data = Array.from({ length: 1000 }, (_, index) => ({ id: index, name: `Row ${index}` }));
    el.columns = [{ prop: "name", label: "Name" }];
    el.virtual = true;
    el.virtualThreshold = 0;
    el.rowHeight = 40;
    el.overscan = 2;
    el.height = "280";
    document.body.appendChild(el);
    await tick();
    await tick();

    const wrap = el.shadowRoot!.querySelector(".table-wrap") as HTMLElement;
    expect(wrap.style.height).toBe("280px");
    Object.defineProperty(wrap, "clientHeight", { configurable: true, value: 280 });
    wrap.dispatchEvent(new Event("scroll"));
    await tick();
    expect(el.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThan(20);
    expect((el.shadowRoot!.querySelector("tbody") as HTMLElement).style.height).toBe("40000px");

    wrap.scrollTop = 20000;
    wrap.dispatchEvent(new Event("scroll"));
    await tick();
    expect(el.shadowRoot!.textContent).toContain("Row 500");
    expect(el.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThan(20);
  });

  it("uses estimated offsets for dynamic-height rows and updates after appending data", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, any>;
    el.items = Array.from({ length: 100 }, (_, index) => ({ id: index, label: `Variable ${index}` }));
    el.dynamic = true;
    el.estimatedItemHeight = 42;
    el.height = 210;
    el.overscan = 2;
    el.renderItem = (item: { label: string }) => item.label;
    document.body.appendChild(el);
    await tick();
    await tick();

    expect((el.shadowRoot!.querySelector(".spacer") as HTMLElement).style.height).toBe("4200px");
    expect((el.shadowRoot!.querySelector(".item") as HTMLElement).style.minHeight).toBe("42px");
    expect(el.getVisibleRange().end).toBeLessThan(20);

    el.items = [...el.items, ...Array.from({ length: 20 }, (_, index) => ({ id: 100 + index, label: `Added ${index}` }))];
    await tick();
    expect((el.shadowRoot!.querySelector(".spacer") as HTMLElement).style.height).toBe("5040px");
  });

  it("keeps keyboard focus navigation inside the virtual window", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, any>;
    el.items = Array.from({ length: 100 }, (_, index) => ({ id: index, label: `Row ${index}` }));
    el.itemHeight = 40;
    el.height = 200;
    el.overscan = 2;
    el.renderItem = (item: { label: string }) => item.label;
    document.body.appendChild(el);
    await tick();
    await tick();

    const first = el.shadowRoot!.querySelector<HTMLElement>('.item[data-virtual-index="0"]')!;
    first.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await tick();
    await tick();

    expect(el.shadowRoot!.textContent).toContain("Row 99");
    expect(el.shadowRoot!.activeElement?.getAttribute("data-virtual-index")).toBe("99");
  });

  it("announces loading without replacing the current rows", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, unknown>;
    el.items = [{ id: 1, label: "Existing row" }];
    el.renderItem = (item: unknown) => (item as { label: string }).label;
    el.loading = true;
    el.loadingText = "Loading more";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".viewport")?.getAttribute("aria-busy")).toBe("true");
    expect(el.shadowRoot!.textContent).toContain("Existing row");
    expect(el.shadowRoot!.querySelector('[role="status"]')?.textContent).toContain("Loading more");
  });

  it("uses the configured message when the list is empty", async () => {
    const el = document.createElement("elf-virtual-list") as HTMLElement & Record<string, unknown>;
    el.items = [];
    el.emptyText = "No activity";
    document.body.appendChild(el);
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector(".empty")?.textContent).toContain("No activity");
  });
});
