import { afterEach, beforeAll, describe, expect, it } from "vitest";

let dynamicListTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageVirtualListEx3 } = await import("./ex3");
  dynamicListTag = ensureCustomElement(PageVirtualListEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("VirtualListPage", () => {
  it("动态信息流保持有界 DOM 并提供追加、定位和空态控制", async () => {
    const page = document.createElement(dynamicListTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const list = page.shadowRoot!.querySelector("elf-virtual-list")!;
    expect(list.hasAttribute("dynamic")).toBe(true);
    expect(list.shadowRoot!.querySelectorAll(".item").length).toBeLessThan(30);
    expect(list.shadowRoot!.textContent).toContain("动态记录 #001");

    const buttons = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-button");
    expect(buttons).toHaveLength(3);
    expect((list as unknown as { emptyText: string }).emptyText).toBe("暂无活动记录");
  });
});
