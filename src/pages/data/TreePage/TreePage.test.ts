import { afterEach, beforeAll, describe, expect, it } from "vitest";

let lazyTreeTag = "";
let virtualTreeTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTreeEx4 } = await import("./ex4");
  const { PageTreeEx5 } = await import("./ex5");
  lazyTreeTag = ensureCustomElement(PageTreeEx4);
  virtualTreeTag = ensureCustomElement(PageTreeEx5);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (duration: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, duration));

describe("TreePage", () => {
  it("异步目录只在展开时加载子节点", async () => {
    const page = document.createElement(lazyTreeTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const tree = page.shadowRoot!.querySelector("elf-tree")!;
    expect(tree.shadowRoot!.querySelectorAll(".tree-node")).toHaveLength(2);

    tree.shadowRoot!.querySelector<HTMLButtonElement>(".tree-switch")!.click();
    await wait(280);
    await tick();

    expect(tree.shadowRoot!.querySelectorAll(".tree-node")).toHaveLength(4);
    expect(tree.shadowRoot!.textContent).toContain("API gateway");
  });

  it("两千项分层资产目录只渲染可视窗口并在首屏展示多个目录", async () => {
    const page = document.createElement(virtualTreeTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const tree = page.shadowRoot!.querySelector("elf-tree")!;
    const renderedRows = tree.shadowRoot!.querySelectorAll(".tree-node");
    expect(renderedRows.length).toBeGreaterThan(8);
    expect(renderedRows.length).toBeLessThan(30);
    expect(tree.shadowRoot!.textContent).toContain("设计资源 0001");
    expect(tree.shadowRoot!.textContent).toContain("项目目录 02");
    expect(tree.shadowRoot!.textContent).not.toContain("设计资源 1670");
  });
});
