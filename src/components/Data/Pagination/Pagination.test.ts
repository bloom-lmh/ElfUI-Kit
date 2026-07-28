import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Pagination } from "./index";

beforeAll(() => {
  registerComponents(Pagination);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface PaginationEl extends HTMLElement {
  total?: number;
  currentPage?: number;
  defaultCurrentPage?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageCount?: number;
  pageSizes?: number[];
  pagerCount?: number;
  prevText?: string;
  nextText?: string;
  prevIcon?: string;
  nextIcon?: string;
  size?: string;
  disabled?: boolean;
  teleported?: boolean;
  appendSizeTo?: string | HTMLElement;
  popperClass?: string;
  popperStyle?: string | Record<string, string | number>;
  hideOnSinglePage?: boolean;
  openSizeMenu?: () => void;
  closeSizeMenu?: () => void;
}

const mount = async (setup?: (el: PaginationEl) => void): Promise<PaginationEl> => {
  const el = document.createElement("elf-pagination") as PaginationEl;
  el.total = 95;
  setup?.(el);
  document.body.appendChild(el);
  await tick();
  await tick();
  return el;
};

describe("elf-pagination", () => {
  it("keeps a stable pager window when a boundary page is selected", async () => {
    const el = await mount((pagination) => {
      pagination.total = 90;
      pagination.pagerCount = 7;
    });
    const labels = (): string[] => Array.from(
      el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page"),
      (button) => button.textContent?.trim() || ""
    );

    expect(labels()).toEqual(["1", "2", "3", "4", "5", "6", "7", "...", "9"]);
    const pageSeven = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page"))
      .find((button) => button.textContent?.trim() === "7")!;
    pageSeven.click();
    await tick();

    expect(labels()).toEqual(["1", "2", "3", "4", "5", "6", "7", "...", "9"]);
    expect(el.shadowRoot!.querySelectorAll(".page")).toHaveLength(9);
    expect(el.shadowRoot!.querySelector(".page.is-active")).toBe(pageSeven);
  });

  it("does not move a clicked page while it is already visible", async () => {
    const el = await mount((pagination) => {
      pagination.total = 70;
      pagination.pagerCount = 7;
    });
    const buttons = (): HTMLButtonElement[] =>
      Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page"));
    const pageFive = buttons().find((button) => button.textContent?.trim() === "5")!;
    const index = buttons().indexOf(pageFive);

    pageFive.click();
    await tick();

    expect(buttons().map((button) => button.textContent?.trim() || "")).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
    expect(buttons()[index]).toBe(pageFive);
    expect(pageFive.classList.contains("is-active")).toBe(true);
  });

  it("渲染总数和页码", async () => {
    const el = await mount();

    expect(el.shadowRoot!.textContent).toContain("共 95 条");
    expect(el.shadowRoot!.querySelectorAll(".page").length).toBeGreaterThan(1);
  });

  it("点击页码触发 currentPage 更新", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:currentPage", onUpdate as EventListener);

    const page1 = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page")).find(
      (button) => button.textContent?.trim() === "1"
    )!;
    const page2 = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".page")).find(
      (button) => button.textContent?.trim() === "2"
    )!;
    expect(page1.classList.contains("is-active")).toBe(true);
    page2.click();
    await tick();

    expect(onUpdate).toHaveBeenCalled();
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(2);
    expect(page1.classList.contains("is-active")).toBe(false);
    expect(page2.classList.contains("is-active")).toBe(true);
    expect(page2.getAttribute("aria-current")).toBe("page");
  });

  it("上一页和下一页可切换页码", async () => {
    const el = await mount((pagination) => {
      pagination.currentPage = 2;
    });
    const onCurrent = vi.fn();
    el.addEventListener("current-change", onCurrent as EventListener);

    const prev = el.shadowRoot!.querySelector(".nav") as HTMLButtonElement;
    prev.click();
    await tick();

    expect((onCurrent.mock.calls[0]![0] as CustomEvent).detail).toBe(1);
  });

  it("修改 pageSize 触发 size-change", async () => {
    const el = await mount((pagination) => {
      pagination.pageSizes = [5, 10, 20];
    });
    const onSize = vi.fn();
    el.addEventListener("size-change", onSize as EventListener);

    el.shadowRoot!.querySelector<HTMLButtonElement>(".size-trigger")!.click();
    await tick();
    const option = Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[role="option"]'))
      .find((button) => button.textContent?.includes("20"))!;
    option.click();
    await tick();

    expect((onSize.mock.calls[0]![0] as CustomEvent).detail).toBe(20);
  });

  it("jumper 支持跳转到指定页", async () => {
    const el = await mount();
    const onUpdate = vi.fn();
    el.addEventListener("update:currentPage", onUpdate as EventListener);

    const input = el.shadowRoot!.querySelector(".jumper input") as HTMLInputElement;
    input.value = "5";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe(5);
  });

  it("hideOnSinglePage 单页时隐藏", async () => {
    const el = await mount((pagination) => {
      pagination.total = 8;
      pagination.hideOnSinglePage = true;
    });

    expect(el.shadowRoot!.querySelector(".pagination")).toBeFalsy();
  });

  it("uses default state only as the uncontrolled initial value", async () => {
    const el = await mount((pagination) => {
      pagination.setAttribute("default-current-page", "3");
      pagination.setAttribute("default-page-size", "20");
    });

    const active = el.shadowRoot!.querySelector<HTMLButtonElement>(".page.is-active")!;
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".size-trigger")!;
    expect(active.textContent?.trim()).toBe("3");
    expect(trigger.textContent).toContain("20 条/页");

    active.previousElementSibling?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await tick();
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".page.is-active")!.textContent?.trim()).toBe("2");
  });

  it("uses explicit page-count and exposes customized accessible navigation", async () => {
    const el = await mount((pagination) => {
      pagination.total = 0;
      pagination.pageCount = 4;
      pagination.prevText = "Back";
      pagination.nextText = "Forward";
      pagination.size = "large";
    });

    const root = el.shadowRoot!;
    expect(root.querySelectorAll(".page")).toHaveLength(4);
    expect(root.querySelector(".pagination")?.classList.contains("is-large")).toBe(true);
    expect(root.querySelector<HTMLButtonElement>(".arrow-left, .nav")?.getAttribute("aria-label")).toBe("Back");
    expect(root.querySelectorAll<HTMLButtonElement>(".nav")[1].getAttribute("aria-label")).toBe("Forward");
  });

  it("size dropdown exposes teleported popper metadata and styling", async () => {
    const el = await mount((pagination) => {
      pagination.appendSizeTo = "#overlay-root";
      pagination.popperClass = "custom-size-popper";
      pagination.popperStyle = { maxHeight: "120px" };
    });

    el.openSizeMenu?.();
    await tick();
    await tick();
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".size-trigger")!;
    const panel = el.shadowRoot!.querySelector<HTMLElement>(".size-panel")!;
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.getAttribute("popover")).toBe("manual");
    expect(panel.getAttribute("data-append-size-to")).toBe("#overlay-root");
    expect(panel.classList.contains("custom-size-popper")).toBe(true);
    expect(panel.style.maxHeight).toBe("120px");
  });

  it("non-teleported size dropdown remains in-tree", async () => {
    const el = await mount((pagination) => {
      pagination.teleported = false;
    });
    el.openSizeMenu?.();
    await tick();
    const panel = el.shadowRoot!.querySelector<HTMLElement>(".size-panel")!;
    expect(panel.getAttribute("popover")).toBeNull();
    expect(panel.classList.contains("is-teleported")).toBe(false);
  });

  it("size trigger supports keyboard selection and Escape", async () => {
    const el = await mount((pagination) => {
      pagination.pageSizes = [10, 20, 50];
    });
    const onSize = vi.fn();
    el.addEventListener("size-change", onSize as EventListener);
    const trigger = el.shadowRoot!.querySelector<HTMLButtonElement>(".size-trigger")!;

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await tick();
    expect((onSize.mock.calls[0]![0] as CustomEvent).detail).toBe(20);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("supports navigation icon props and SVG slots", async () => {
    const el = await mount((pagination) => {
      pagination.prevIcon = "←";
      pagination.nextIcon = "→";
    });
    expect(Array.from(el.shadowRoot!.querySelectorAll(".prop-icon"), (icon) => icon.textContent)).toEqual(["←", "→"]);

    const previousSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    previousSvg.setAttribute("slot", "prev-icon");
    el.appendChild(previousSvg);
    await tick();
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="prev-icon"]');
    expect(slot?.assignedElements()).toEqual([previousSvg]);
  });

  it("clicking outside closes the size dropdown", async () => {
    const el = await mount();
    el.openSizeMenu?.();
    await tick();
    expect(el.shadowRoot!.querySelector(".size-panel")).toBeTruthy();

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".size-panel")).toBeNull();
  });

  it("gives one outside click to only the topmost size dropdown", async () => {
    const first = await mount();
    const second = await mount();
    first.openSizeMenu?.();
    second.openSizeMenu?.();
    await tick();
    expect(first.shadowRoot!.querySelector(".size-panel")).toBeTruthy();
    expect(second.shadowRoot!.querySelector(".size-panel")).toBeTruthy();

    document.body.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      composed: true
    }));
    await tick();
    expect(first.shadowRoot!.querySelector(".size-panel")).toBeTruthy();
    expect(second.shadowRoot!.querySelector(".size-panel")).toBeNull();

    document.body.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      composed: true
    }));
    await tick();
    expect(first.shadowRoot!.querySelector(".size-panel")).toBeNull();
  });

  it("keeps size-panel scrolling usable and closes on external page motion", async () => {
    const el = await mount();
    el.openSizeMenu?.();
    await tick();
    const panel = el.shadowRoot!.querySelector(".size-panel") as HTMLElement;

    panel.dispatchEvent(new Event("scroll", { bubbles: true, composed: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".size-panel")).toBeTruthy();

    document.body.dispatchEvent(new Event("wheel", { bubbles: true, composed: true }));
    await tick();
    expect(el.shadowRoot!.querySelector(".size-panel")).toBeNull();
  });

  it("disabled size trigger cannot open", async () => {
    const el = await mount((pagination) => {
      pagination.disabled = true;
    });
    el.openSizeMenu?.();
    await tick();
    expect(el.shadowRoot!.querySelector(".size-panel")).toBeNull();
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".size-trigger")!.disabled).toBe(true);
  });
});
