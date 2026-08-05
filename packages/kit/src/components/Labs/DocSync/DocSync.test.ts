// cspell:words syncchange

import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Splitter } from "../../Layout/Splitter";
import { blockMarkup, normalizeBlocks, resolveBlockId } from "./model";
import { DocSync } from "./index";
import type { DocSyncBlock } from "./types";

beforeAll(() => registerComponents(DocSync, Splitter));
afterEach(() => {
  document.body.innerHTML = "";
});
const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const sampleBlocks: DocSyncBlock[] = [
  { type: "heading", level: 1, text: "安装" },
  { type: "paragraph", text: "使用 pnpm 安装组件库。" },
  { type: "list", items: ["安装核心", "安装工具"] },
  { type: "math", text: "E = mc^2" },
  {
    type: "table",
    rows: [
      ["列 A", "列 B"],
      ["1", "2"],
    ],
  },
  { type: "code", text: "pnpm add @elfui/kit" },
];

const mount = async (
  blocks: DocSyncBlock[] = sampleBlocks,
): Promise<HTMLElement & { blocks: DocSyncBlock[] }> => {
  const element = document.createElement("elf-doc-sync") as HTMLElement & {
    blocks: DocSyncBlock[];
  };
  element.blocks = blocks;
  document.body.appendChild(element);
  await tick();
  await tick();
  await wait();
  return element;
};

describe("doc-sync model", () => {
  it("generates deterministic content-addressed ids", () => {
    const first = normalizeBlocks([{ type: "paragraph", text: "hello" }]);
    const second = normalizeBlocks([{ type: "paragraph", text: "hello" }]);
    const changed = normalizeBlocks([{ type: "paragraph", text: "world" }]);
    expect(first[0]!.id).toBe(second[0]!.id);
    expect(first[0]!.id).not.toBe(changed[0]!.id);
    expect(first[0]!.id).toMatch(/^sync-paragraph-[0-9a-f]{8}$/);
  });

  it("keeps explicit ids and renders source/preview markup", () => {
    const block = { id: "custom-1", type: "heading", level: 2, text: "标题" };
    expect(resolveBlockId(block, 0)).toBe("custom-1");
    expect(blockMarkup(block, "source")).toContain("doc-sync-source-tag");
    expect(blockMarkup(block, "preview")).toContain("<h2");
  });
});

describe("elf-doc-sync", () => {
  it("renders a virtual window with sync ids and measures heights", async () => {
    const many: DocSyncBlock[] = Array.from({ length: 200 }, (_, index) => ({
      type: index % 5 === 0 ? "heading" : "paragraph",
      level: index % 5 === 0 ? 2 : undefined,
      text: `块 ${index}`,
    }));
    const element = await mount(many);
    const blocks = element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block");
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.length).toBeLessThan(80);
    expect(blocks[0]!.dataset.syncId).toBe(many[0]!.id ?? normalizeBlocks([many[0]!])[0]!.id);
    expect(blocks[0]!.dataset.syncType).toBe("heading");
  });

  it("activates a block on click and marks both panes", async () => {
    const element = await mount();
    const onActivate = vi.fn();
    element.addEventListener("activate", onActivate as EventListener);
    const leftBlocks = element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block");
    const target = leftBlocks[1]!;
    target.click();
    await tick();

    const id = target.dataset.syncId!;
    expect(element.getAttribute("active-id")).toBe(id);
    expect((onActivate.mock.calls[0]![0] as CustomEvent).detail).toBe(id);
    const marked = element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block.is-synced");
    expect(marked.length).toBeGreaterThanOrEqual(2);
    expect(
      element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-marker").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("syncs the opposite pane to the anchor block on scroll", async () => {
    const element = await mount();
    const viewports = element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-viewport");
    const left = viewports[0]!;
    const right = viewports[1]!;
    const blocks = (element as HTMLElement & { blocks: DocSyncBlock[] }).blocks;
    const normalized = normalizeBlocks(blocks);
    const onSync = vi.fn();
    element.addEventListener("syncchange", onSync as EventListener);

    left.scrollTop = 150;
    left.dispatchEvent(new Event("scroll"));
    await tick();

    expect(onSync).toHaveBeenCalled();
    const detail = (onSync.mock.calls[0]![0] as CustomEvent).detail as {
      side: "left" | "right";
      id: string;
    };
    expect(detail.side).toBe("left");
    const anchorIndex = normalized.findIndex((block) => block.id === detail.id);
    expect(anchorIndex).toBeGreaterThan(0);
    expect(right.scrollTop).toBeGreaterThan(0);
    expect(
      Array.from(right.querySelectorAll<HTMLElement>(".doc-sync-block")).some(
        (block) => block.dataset.syncId === normalized[anchorIndex]!.id,
      ),
    ).toBe(true);
  });

  it("moves activation with arrow keys", async () => {
    const element = await mount();
    const first = element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block")[0]!;
    first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await tick();
    await wait();

    const marked = element.shadowRoot!.querySelectorAll<HTMLElement>(".doc-sync-block.is-synced");
    expect(marked.length).toBeGreaterThanOrEqual(2);
    expect(marked[0]!.dataset.syncId).not.toBe(first.dataset.syncId);
  });

  it("parses source through a custom parser and renders custom renderers", async () => {
    const element = document.createElement("elf-doc-sync") as HTMLElement & {
      source: string;
      parse: (source: unknown) => DocSyncBlock[];
      renderLeft: (block: DocSyncBlock) => string;
      renderRight: (block: DocSyncBlock) => string;
    };
    element.source = "# 标题\n正文";
    element.parse = (source) =>
      String(source)
        .split("\n")
        .map((line, index) => ({
          type: line.startsWith("#") ? "heading" : "paragraph",
          level: line.startsWith("#") ? 1 : undefined,
          text: line.replace(/^#\s*/, ""),
          id: `parsed-${index}`,
        }));
    element.renderLeft = (block) => `<b>L:${block.text}</b>`;
    element.renderRight = (block) => `<i>R:${block.text}</i>`;
    document.body.appendChild(element);
    await tick();
    await tick();
    await wait();

    const panes = element.shadowRoot!.querySelectorAll(".doc-sync-pane");
    const leftBlocks = panes[0]!.querySelectorAll<HTMLElement>(".doc-sync-block");
    expect(leftBlocks.length).toBe(2);
    expect(leftBlocks[0]!.dataset.syncId).toBe("parsed-0");
    expect(leftBlocks[0]!.textContent).toContain("L:标题");
    expect(panes[1]!.textContent).toContain("R:正文");
  });

  it("falls back to blocks and built-in markup without parser or renderers", async () => {
    const element = await mount();
    const left = element.shadowRoot!.querySelector<HTMLElement>(".doc-sync-pane")!;
    expect(left.textContent).toContain("安装");
    expect(left.querySelector(".doc-sync-source-tag")).toBeTruthy();
  });

  it("edits a block on double-click and syncs both panes", async () => {
    const element = await mount();
    const onEdit = vi.fn();
    element.addEventListener("edit", onEdit as EventListener);
    const leftPane = element.shadowRoot!.querySelectorAll(".doc-sync-pane")[0]!;
    const block = leftPane.querySelectorAll<HTMLElement>(".doc-sync-block")[1]!;
    block.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();

    const editors = element.shadowRoot!.querySelectorAll<HTMLTextAreaElement>(".doc-sync-editor");
    expect(editors.length).toBeGreaterThanOrEqual(2);
    editors[0]!.value = "新的段落内容";
    editors[0]!.dispatchEvent(new Event("input", { bubbles: true }));
    editors[0]!.dispatchEvent(new Event("blur", { bubbles: true }));
    await tick();
    await wait();

    expect(element.shadowRoot!.textContent).toContain("新的段落内容");
    expect(onEdit).toHaveBeenCalled();
    expect((onEdit.mock.calls[0]![0] as CustomEvent).detail.block.text).toBe("新的段落内容");
  });

  it("cancels editing with Escape and keeps the original text", async () => {
    const element = await mount();
    const block = element.shadowRoot!.querySelector<HTMLElement>(".doc-sync-block")!;
    block.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    await tick();
    const editor = element.shadowRoot!.querySelector<HTMLTextAreaElement>(".doc-sync-editor")!;
    editor.value = "不应保存";
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    editor.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await tick();

    expect(element.shadowRoot!.querySelector(".doc-sync-editor")).toBeNull();
    expect(element.shadowRoot!.textContent).not.toContain("不应保存");
  });

  it("renders a source gutter with line numbers and a ruler", async () => {
    const element = await mount();
    const panes = element.shadowRoot!.querySelectorAll(".doc-sync-pane");
    const leftLines = panes[0]!.querySelectorAll<HTMLElement>(".doc-sync-line");
    expect(leftLines.length).toBeGreaterThan(0);
    expect(leftLines[0]!.textContent).toBe("1");
    expect(panes[0]!.querySelector(".doc-sync-ruler")).toBeTruthy();
    expect(panes[0]!.querySelectorAll(".doc-sync-ruler-mark").length).toBeGreaterThan(0);
    expect(panes[1]!.querySelector(".doc-sync-line")).toBeNull();
    expect(element.shadowRoot!.querySelectorAll(".doc-sync-scrollbar").length).toBe(2);
    expect(element.shadowRoot!.querySelector(".doc-sync-progress")).toBeTruthy();
    expect(element.shadowRoot!.querySelector(".doc-sync-swap")).toBeTruthy();
  });

  it("hides the line gutter and ruler when disabled", async () => {
    const element = document.createElement("elf-doc-sync") as HTMLElement & {
      blocks: DocSyncBlock[];
      lineNumbers: boolean;
      ruler: boolean;
    };
    element.blocks = sampleBlocks;
    Object.assign(element, { lineNumbers: false, ruler: false });
    document.body.appendChild(element);
    await tick();
    await tick();
    await wait();

    expect(element.shadowRoot!.querySelector(".doc-sync-line")).toBeNull();
    expect(element.shadowRoot!.querySelector(".doc-sync-ruler")).toBeNull();
  });

  it("swaps pane roles when the circular handle is clicked", async () => {
    const element = document.createElement("elf-doc-sync") as HTMLElement & {
      blocks: DocSyncBlock[];
      leftLabel: string;
      rightLabel: string;
    };
    element.blocks = sampleBlocks;
    Object.assign(element, { leftLabel: "Source", rightLabel: "Preview" });
    document.body.appendChild(element);
    await tick();
    await tick();
    await wait();

    const onSwap = vi.fn();
    element.addEventListener("swap", onSwap as EventListener);
    const panes = element.shadowRoot!.querySelectorAll(".doc-sync-pane");
    expect(panes[0]!.querySelector(".doc-sync-pane-head")!.textContent).toContain("Source");

    element.shadowRoot!.querySelector<HTMLButtonElement>(".doc-sync-swap")!.click();
    await tick();
    await tick();

    expect(onSwap).toHaveBeenCalled();
    expect(panes[0]!.querySelector(".doc-sync-pane-head")!.textContent).toContain("Preview");
    expect(panes[0]!.classList.contains("is-source")).toBe(false);
    expect(panes[1]!.classList.contains("is-source")).toBe(true);
  });
});
