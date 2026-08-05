import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLabsDocSync } = await import("./index");
  pageTag = ensureCustomElement(PageLabsDocSync);
}, 60_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const wait = (ms = 30): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const collectText = (root: Node): string => {
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output.replace(/\s+/g, " ").trim();
};

describe("DocSyncPage", () => {
  it("renders both content-agnostic demos and the open standard", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait();
    await wait();

    const text = collectText(page);
    expect(text).toContain("Markdown → Word 同步阅读");
    expect(text).toContain("LaTeX → Word 同步阅读");
    expect(text).toContain("开放标准");
    expect(text).toContain("最小实现");
    expect(text).toContain("自定义面板样式");
    const syncs = page.shadowRoot!.querySelectorAll<HTMLElement>("elf-doc-sync");
    expect(syncs.length).toBe(4);
    expect(typeof (syncs[0] as HTMLElement & { parse?: unknown }).parse).toBe("function");
    expect(typeof (syncs[0] as HTMLElement & { renderRight?: unknown }).renderRight).toBe(
      "function",
    );
    expect(page.shadowRoot!.querySelectorAll("elf-playground")).toHaveLength(4);
    const minimal = syncs[2]!;
    expect((minimal as HTMLElement & { source?: string }).source).toContain("#");
    expect(minimal.shadowRoot!.querySelectorAll(".doc-sync-block").length).toBeGreaterThan(0);
    const first = syncs[0]!;
    expect(first.shadowRoot!.querySelector(".doc-sync-line")).toBeTruthy();
    expect(first.shadowRoot!.querySelector(".doc-sync-ruler")).toBeTruthy();
    expect(first.shadowRoot!.querySelectorAll(".doc-sync-top-progress").length).toBe(2);
    expect(page.shadowRoot!.querySelector(".doc-sync-custom")).toBeTruthy();
  });

  it("edits a block on double-click and syncs both panes", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait();
    await wait();

    const sync = page.shadowRoot!.querySelector<HTMLElement>("elf-doc-sync")!;
    const block = sync.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block")[1]!;
    block.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await wait();

    const editors = sync.shadowRoot!.querySelectorAll<HTMLTextAreaElement>(".doc-sync-editor");
    expect(editors.length).toBeGreaterThanOrEqual(2);
    editors[0]!.value = "编辑后的同步内容";
    editors[0]!.dispatchEvent(new Event("input", { bubbles: true }));
    editors[0]!.dispatchEvent(new Event("blur", { bubbles: true }));
    await wait();
    await wait();

    expect(sync.shadowRoot!.textContent).toContain("编辑后的同步内容");
  });

  it("swaps the panes when the circular handle is clicked", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait();
    await wait();

    const sync = page.shadowRoot!.querySelector<HTMLElement>("elf-doc-sync")!;
    const heads = sync.shadowRoot!.querySelectorAll(".doc-sync-pane-head");
    expect(heads[0]!.textContent).toContain("Markdown");
    sync.shadowRoot!.querySelector<HTMLButtonElement>(".doc-sync-swap")!.click();
    await wait();
    await wait();

    expect(heads[0]!.textContent).toContain("Word");
    expect(heads[1]!.textContent).toContain("Markdown");
  });

  it("lets users disable line numbers and the ruler", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait();
    await wait();

    const sync = page.shadowRoot!.querySelector<HTMLElement>("elf-doc-sync")!;
    expect(sync.shadowRoot!.querySelector(".doc-sync-line")).toBeTruthy();
    expect(sync.shadowRoot!.querySelector(".doc-sync-ruler")).toBeTruthy();

    const switches = page.shadowRoot!.querySelectorAll(
      'elf-playground [slot="controls"] elf-checkbox',
    );
    expect(switches.length).toBe(3);
    switches[1]!.shadowRoot!.querySelector<HTMLElement>(".box")!.click();
    await wait();
    expect(sync.shadowRoot!.querySelector(".doc-sync-line")).toBeNull();
    switches[2]!.shadowRoot!.querySelector<HTMLElement>(".box")!.click();
    await wait();
    expect(sync.shadowRoot!.querySelector(".doc-sync-ruler")).toBeNull();
  });

  it("activates blocks on click and marks both panes", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait();
    await wait();

    const sync = page.shadowRoot!.querySelector<HTMLElement>("elf-doc-sync")!;
    const blocks = sync.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block");
    blocks[1]!.click();
    await wait();

    const marked = sync.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block.is-synced");
    expect(marked.length).toBeGreaterThanOrEqual(2);
    expect(sync.getAttribute("active-id")).toBe(blocks[1]!.dataset.syncId);
  });

  it("renders English copy without Chinese leakage", async () => {
    document.documentElement.lang = "en-US";
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await wait();
    await wait();

    const text = collectText(page);
    expect(text).toContain("Markdown → Word sync reading");
    expect(text).toContain("Open standard");
    expect(text).toContain("Minimal implementation");
    expect(text).toContain("Custom panel styling");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
