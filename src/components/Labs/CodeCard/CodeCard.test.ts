import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { CodeCard } from "./index";
import type { CodeCardElement, CodeCardItem } from "./types";

beforeAll(() => registerComponents(CodeCard));

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const settle = async (): Promise<void> => {
  await tick();
  await new Promise((resolve) => setTimeout(resolve, 20));
  await tick();
};

const createCard = async (
  configure?: (card: CodeCardElement) => void,
): Promise<CodeCardElement> => {
  const card = document.createElement("elf-code-card");
  configure?.(card);
  document.body.appendChild(card);
  await settle();
  return card;
};

describe("elf-code-card", () => {
  it("renders syntax tokens, line numbers, and workbench actions", async () => {
    const card = await createCard((element) => {
      element.code = "const ready = true;";
      element.filename = "example.js";
      element.language = "javascript";
    });
    const root = card.shadowRoot!;

    expect(root.querySelector(".variant-workbench")).toBeTruthy();
    expect(root.querySelector(".file-mark svg path")).toBeTruthy();
    expect(root.querySelector(".card-title")?.textContent).toContain("example.js");
    expect(root.querySelector(".header-language elf-select")?.getAttribute("variant")).toBe(
      "underlined",
    );
    expect(root.querySelector("footer")).toBeTruthy();
    expect(root.querySelector("article")?.classList.contains("has-footer")).toBe(false);
    expect(root.querySelectorAll(".code-line")).toHaveLength(1);
    expect(root.querySelector("article")?.classList.contains("has-line-markers")).toBe(false);
    expect(
      Array.from(root.querySelector(".code-scroll code")!.childNodes).every(
        (node) => node.nodeType !== Node.TEXT_NODE,
      ),
    ).toBe(true);
    expect(
      Array.from(root.querySelector(".code-line")!.childNodes).every(
        (node) => node.nodeType !== Node.TEXT_NODE,
      ),
    ).toBe(true);
    expect(root.querySelector(".line-number")?.textContent).toContain("1");
    await vi.waitFor(() => {
      expect(root.querySelectorAll(".line-content span").length).toBeGreaterThan(1);
    });
    expect(root.querySelector('[aria-label="Copy code"]')).toBeTruthy();
  });

  it("assigns unique panel relationships to concurrent instances", async () => {
    const first = await createCard((element) => {
      element.code = "first";
    });
    const second = await createCard((element) => {
      element.code = "second";
    });

    const firstId = first.shadowRoot!.querySelector(".card-body")?.id;
    const secondId = second.shadowRoot!.querySelector(".card-body")?.id;
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  it("expands ranges and decorates focus, diagnostics, highlights, and diffs", async () => {
    const card = await createCard((element) => {
      element.code = "one\ntwo\nthree\nfour\nfive\nsix\nseven\neight";
      element.language = "plaintext";
      element.highlightLines = [1, [7, 8]];
      element.focusLines = [[2, 3]];
      element.errorLines = [4];
      element.warningLines = [{ start: 5, end: 5 }];
      element.diffLines = [
        { line: 6, kind: "remove" },
        { line: 7, kind: "add" },
      ];
    });
    const lines = card.shadowRoot!.querySelectorAll(".code-line");

    expect(card.shadowRoot!.querySelector("article")?.classList.contains("has-line-markers")).toBe(
      true,
    );

    expect(lines[0].classList.contains("is-highlighted")).toBe(true);
    expect(lines[0].classList.contains("is-dimmed")).toBe(true);
    expect(lines[1].classList.contains("is-focused")).toBe(true);
    expect(lines[2].classList.contains("is-focused")).toBe(true);
    expect(lines[3].classList.contains("is-error")).toBe(true);
    expect(lines[3].querySelector(".diff-marker")?.textContent).toContain("×");
    expect(lines[3].textContent).toContain("Error line");
    expect(lines[4].classList.contains("is-warning")).toBe(true);
    expect(lines[5].classList.contains("is-removed")).toBe(true);
    expect(lines[6].classList.contains("is-added")).toBe(true);
    expect(lines[7].classList.contains("is-highlighted")).toBe(true);
  });

  it("switches grouped code through accessible tabs", async () => {
    const items: CodeCardItem[] = [
      { key: "js", label: "config.js", language: "javascript", code: "export default {};" },
      {
        key: "ts",
        label: "config.ts",
        language: "typescript",
        code: "export default {} satisfies object;",
      },
    ];
    const card = await createCard((element) => {
      element.items = items;
      element.activeKey = "js";
      element.variant = "minimal";
    });
    const root = card.shadowRoot!;
    const tabs = root.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const onChange = vi.fn();
    card.addEventListener("tab-change", onChange as EventListener);

    expect(tabs).toHaveLength(2);
    expect(root.querySelector(".card-header > .code-tabs")).toBeTruthy();
    expect(root.querySelector(".card-title")).toBeNull();
    expect(root.querySelectorAll(".card-header")).toHaveLength(1);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    tabs[1].click();
    await settle();
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(root.querySelector(".line-content")?.textContent).toContain("satisfies");
    expect(onChange.mock.calls[0][0].detail.key).toBe("ts");

    tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    await settle();
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(root.activeElement).toBe(tabs[0]);

    root.querySelector<HTMLButtonElement>('[aria-label="Collapse code"]')!.click();
    await settle();
    expect(root.querySelector(".card-body")).toBeNull();
    expect(root.querySelector(".card-title")).toBeNull();
    expect(root.querySelector(".card-header > .card-actions")).toBeTruthy();
  });

  it("reveals focused context interactively and renders an optional footer slot", async () => {
    const footer = document.createElement("div");
    footer.slot = "footer";
    footer.textContent = "Reviewed by ElfUI Team";
    const card = await createCard((element) => {
      element.code = "one\ntwo\nthree";
      element.language = "plaintext";
      element.focusLines = [2];
      element.focusRevealOnHover = true;
      element.appendChild(footer);
    });
    const root = card.shadowRoot!;
    const article = root.querySelector("article")!;
    const footerSlot = root.querySelector<HTMLSlotElement>('slot[name="footer"]')!;

    expect(article.classList.contains("focus-reveal-on-hover")).toBe(true);
    expect(article.classList.contains("has-footer")).toBe(true);
    expect(footerSlot.assignedElements()).toEqual([footer]);
    expect(root.querySelector(".card-footer")?.getAttribute("part")).toBe("footer");

    card.focusRevealOnHover = false;
    await settle();
    expect(article.classList.contains("focus-reveal-on-hover")).toBe(false);
  });

  it("toggles line numbers and expansion through controlled models", async () => {
    const card = await createCard((element) => {
      element.code = "const count = 1;";
    });
    const root = card.shadowRoot!;
    const lineButton = root.querySelector<HTMLButtonElement>('[aria-label="Hide line numbers"]')!;
    const collapseButton = root.querySelector<HTMLButtonElement>('[aria-label="Collapse code"]')!;
    const onLineNumbersUpdate = vi.fn();
    const onExpandedUpdate = vi.fn();
    card.addEventListener("update:lineNumbers", onLineNumbersUpdate as EventListener);
    card.addEventListener("update:expanded", onExpandedUpdate as EventListener);

    lineButton.click();
    collapseButton.click();
    await tick();
    expect(root.querySelector('[aria-label="Show line numbers"]')).toBeTruthy();
    expect(root.querySelector('[aria-label="Expand code"]')).toBeTruthy();
    expect(root.querySelector(".line-number")).toBeNull();
    expect(root.querySelector(".code-line")?.classList.contains("has-line-numbers")).toBe(false);
    expect(onLineNumbersUpdate.mock.calls[0][0].detail).toBe(false);
    expect(onExpandedUpdate.mock.calls[0][0].detail).toBe(false);
  });

  it("copies and formats the active source through exposed methods", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const card = await createCard((element) => {
      element.code = "const value={ready:true}";
      element.language = "javascript";
    });
    const onFormat = vi.fn();
    card.addEventListener("format", onFormat as EventListener);

    await expect(card.copy()).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("const value={ready:true}");
    await expect(card.format()).resolves.toBe("const value = { ready: true };\n");
    await settle();
    expect(card.shadowRoot!.querySelector(".line-content")?.textContent).toContain(
      "const value = { ready: true };",
    );
    expect(onFormat.mock.calls[0][0].detail.originalCode).toBe("const value={ready:true}");
  });

  it("falls back when the async Clipboard API is rejected", async () => {
    const writeText = vi.fn().mockRejectedValue(new DOMException("Denied", "NotAllowedError"));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: execCommand,
    });
    const card = await createCard((element) => {
      element.code = "const fallback = true;";
    });

    await expect(card.copy()).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("const fallback = true;");
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea")).toBeNull();
  });
});
