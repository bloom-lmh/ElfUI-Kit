import { ensureCustomElement, registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Playground } from "@elfui/website-components/Playground";
import { PropsTable } from "@elfui/website-components/PropsTable";
import { DocsHero } from "@elfui/website-components/DocsHero";
import { Container, registerAllComponents } from "@elfui/kit";
import { PageLabsCodeCard } from "./index";

type TestSelect = HTMLElement & { modelValue: string };

let pageTag = "";

beforeAll(() => {
  registerAllComponents();
  registerComponents(Container, DocsHero, Playground, PropsTable);
  pageTag = ensureCustomElement(PageLabsCodeCard);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const settle = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 40));
};

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

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await settle();
  return page;
};

describe("CodeCardPage", () => {
  it("documents every visual and line-level workflow", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;

    expect(collectText(root)).toContain("代码卡片");
    expect(root.querySelectorAll("elf-playground")).toHaveLength(5);
    expect(root.querySelectorAll("elf-code-card")).toHaveLength(5);
    expect(root.querySelectorAll("elf-props-table")).toHaveLength(4);
    expect(root.querySelector('[slot="controls"]')).toBeTruthy();
    expect(root.querySelectorAll(".code-card-controls elf-select")).toHaveLength(6);
    expect(root.querySelectorAll(".code-card-stage.is-narrow")).toHaveLength(2);
  });

  it("binds live component inputs and grouped code state as properties", async () => {
    const page = await mountPage();
    const cards = page.shadowRoot!.querySelectorAll("elf-code-card");
    const workbench = cards[0].shadowRoot!;
    const minimal = cards[2].shadowRoot!;
    const diff = cards[3].shadowRoot!;
    const group = cards[4].shadowRoot!;

    const workbenchCard = cards[0] as HTMLElement & { code: string; language: string };
    expect(workbenchCard.language).toBe("html");
    expect(workbenchCard.code.split("\n")).toEqual([
      '<script type="module">',
      'import { registerAllComponents } from "@elfui/kit";',
      "registerAllComponents();",
      "</script>",
      "",
      "<elf-button>Save</elf-button>",
    ]);
    expect(workbench.querySelector(".card-title")?.textContent).toContain("elfui-button.html");
    expect(workbench.querySelector<TestSelect>("elf-select")?.modelValue).toBe("html");
    expect(workbench.querySelector(".header-language elf-select")?.getAttribute("variant")).toBe(
      "underlined",
    );
    expect(workbench.querySelector("article")?.classList.contains("has-footer")).toBe(true);
    expect(
      workbench.querySelector<HTMLSlotElement>('slot[name="footer"]')?.assignedElements()[0]
        ?.textContent,
    ).toContain("ElfUI");
    expect(workbench.querySelector(".file-mark")).toBeTruthy();
    expect(workbench.querySelector(".line-content")?.textContent).toContain(
      '<script type="module">',
    );
    expect(workbench.querySelector("elf-select")?.getAttribute("aria-label")).toBe("语法高亮");
    expect(workbench.querySelector("article")?.getAttribute("aria-label")).toBe("工具台");
    expect(minimal.querySelector(".line-number")).toBeNull();
    expect(minimal.querySelectorAll(".is-focused")).toHaveLength(1);
    expect(minimal.querySelector(".is-dimmed")).toBeTruthy();
    expect(diff.querySelector(".line-number")).toBeNull();
    expect(diff.querySelector(".is-error")).toBeTruthy();
    expect(diff.querySelector(".is-warning")).toBeTruthy();
    expect(diff.querySelector(".is-removed")).toBeTruthy();
    expect(diff.querySelector(".is-added")).toBeTruthy();

    const controls = page.shadowRoot!.querySelectorAll<TestSelect>(
      ".code-card-controls elf-select",
    );
    expect(Array.from(controls, (control) => control.modelValue)).toEqual([
      "workbench",
      "auto",
      "github",
      "html",
      "visible",
      "expanded",
    ]);
    controls[3].dispatchEvent(
      new CustomEvent("update:modelValue", { detail: "json", bubbles: true, composed: true }),
    );
    controls[4].dispatchEvent(
      new CustomEvent("update:modelValue", { detail: "hidden", bubbles: true, composed: true }),
    );
    await settle();
    const updatedCard = page.shadowRoot!.querySelector<HTMLElement & { language: string }>(
      "elf-code-card",
    )!;
    const updatedWorkbench = updatedCard.shadowRoot!;
    expect(updatedCard.language).toBe("json");
    expect(updatedWorkbench.querySelector<TestSelect>("elf-select")?.modelValue).toBe("json");
    expect(updatedWorkbench.querySelector(".card-title")?.textContent).toContain(
      "elfui-button.html",
    );
    expect(updatedWorkbench.querySelector(".line-content")?.textContent).toContain(
      '<script type="module">',
    );
    expect(updatedWorkbench.querySelector(".line-number")).toBeNull();

    expect(group.querySelector(".card-header > .code-tabs")).toBeTruthy();
    expect(group.querySelector(".card-title")).toBeNull();
    group.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1].click();
    await settle();
    expect(group.querySelectorAll('[role="tab"]')[1].getAttribute("aria-selected")).toBe("true");
    expect(group.querySelector(".line-content")?.textContent).toContain("defineConfig");

    group.querySelector<HTMLButtonElement>('[aria-label="折叠代码"]')!.click();
    await settle();
    expect(group.querySelector(".card-body")).toBeNull();
    expect(group.querySelector(".card-title")).toBeNull();
    expect(group.querySelectorAll(".card-header")).toHaveLength(1);
  });

  it("renders English documentation without Chinese leakage", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);

    expect(text).toContain("Code Card");
    expect(text).toContain("Diagnostics, diffs, and highlights");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
