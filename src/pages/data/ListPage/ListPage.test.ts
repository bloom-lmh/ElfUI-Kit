import { afterEach, beforeAll, describe, expect, it } from "vitest";

let groupsExampleTag = "";
let selectionExampleTag = "";
let stateExampleTag = "";
let boundaryExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageListEx1 } = await import("./ex1");
  const { PageListEx2 } = await import("./ex2");
  const { PageListEx3 } = await import("./ex3");
  const { PageListEx4 } = await import("./ex4");
  groupsExampleTag = ensureCustomElement(PageListEx1);
  selectionExampleTag = ensureCustomElement(PageListEx2);
  stateExampleTag = ensureCustomElement(PageListEx3);
  boundaryExampleTag = ensureCustomElement(PageListEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("List documentation", () => {
  it("renders grouped lists and reports trailing actions", async () => {
    const page = document.createElement(groupsExampleTag);
    document.body.appendChild(page);
    await tick();

    expect(page.shadowRoot!.querySelectorAll(".list-group-card")).toHaveLength(2);
    expect(page.shadowRoot!.querySelectorAll("elf-list-item")).toHaveLength(4);
    const action = page.shadowRoot!.querySelector<HTMLButtonElement>(".list-row-action")!;
    action.click();
    await tick();
    expect(page.shadowRoot!.querySelector("[slot='status']")?.textContent).toContain("设计评审");
  });

  it("keeps selection controlled and exposes disabled state", async () => {
    const page = document.createElement(selectionExampleTag);
    document.body.appendChild(page);
    await tick();

    const items = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-list-item");
    expect(items).toHaveLength(4);
    expect(items[0]!.hasAttribute("active")).toBe(true);
    expect(items[2]!.hasAttribute("disabled")).toBe(true);

    items[1]!.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    await tick();
    expect(items[1]!.hasAttribute("active")).toBe(true);
    expect(page.shadowRoot!.querySelector("[slot='status']")?.textContent).toContain("工程协作");
  });

  it("switches between loaded, empty, error, and loading states", async () => {
    const page = document.createElement(stateExampleTag);
    document.body.appendChild(page);
    await tick();

    const list = page.shadowRoot!.querySelector<HTMLElement>("elf-list")!;
    expect(page.shadowRoot!.querySelectorAll("elf-list-item")).toHaveLength(3);
    const buttons = page.shadowRoot!.querySelectorAll<HTMLButtonElement>(".list-demo-actions button");

    buttons[1]!.click();
    await tick();
    await tick();
    expect(page.shadowRoot!.querySelectorAll("elf-list-item")).toHaveLength(0);
    expect(page.shadowRoot!.querySelector("[slot='status']")?.textContent).toContain("当前没有待处理任务");

    buttons[2]!.click();
    await tick();
    await tick();
    expect(page.shadowRoot!.querySelector("[slot='status']")?.textContent).toContain("同步失败");

    buttons[0]!.click();
    await tick();
    expect(list.hasAttribute("loading")).toBe(true);
    expect(list.shadowRoot!.querySelector(".loading")).toBeTruthy();
  });

  it("uses VirtualList for the 1,000-row mode", async () => {
    const page = document.createElement(boundaryExampleTag);
    document.body.appendChild(page);
    await tick();

    expect(page.shadowRoot!.querySelector("elf-list")).toBeTruthy();
    const virtualButton = page.shadowRoot!.querySelector<HTMLButtonElement>(
      "[data-list-mode='virtual']"
    )!;
    virtualButton.click();
    await tick();

    const virtualList = page.shadowRoot!.querySelector<HTMLElement>("elf-virtual-list")!;
    expect(virtualList).toBeTruthy();
    expect((virtualList as HTMLElement & { items: unknown[] }).items).toHaveLength(1_000);
    expect(virtualList.shadowRoot!.querySelectorAll(".item").length).toBeLessThan(1_000);
  });
});
