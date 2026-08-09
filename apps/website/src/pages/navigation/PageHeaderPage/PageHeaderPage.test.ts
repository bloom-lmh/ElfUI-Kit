import { ensureCustomElement, registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Button } from "@elfui/kit";
import { Icon } from "@elfui/kit";
import { Playground } from "@elfui/website-components/Playground";
import { PropsTable } from "@elfui/website-components/PropsTable";
import { Container } from "@elfui/kit";
import { PageHeader } from "@elfui/kit";
import { IconProvider } from "@elfui/kit";
import { PagePageHeader } from "./index";

let pageTag = "";

beforeAll(() => {
  registerComponents(Button, Icon, Playground, PropsTable, Container, PageHeader, IconProvider);
  pageTag = ensureCustomElement(PagePageHeader);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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

const collectElements = (root: Node, selector: string): Element[] => {
  const output: Element[] = [];
  const visit = (node: Node): void => {
    if (node instanceof Element) {
      if (node.matches(selector)) output.push(node);
      if (node.shadowRoot) visit(node.shadowRoot);
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
  return output;
};

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("PageHeaderPage", () => {
  it("中文页面覆盖案例、运行状态、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("基础页头");
    expect(text).toContain("自定义页头插槽");
    expect(text).toContain("等待返回操作");
    expect(text).toContain("右侧扩展操作");
    const heroCards = collectElements(page, 'elf-page-header[mode="hero"]');
    expect(heroCards).toHaveLength(6);
    expect(heroCards.map((card) => card.getAttribute("variant"))).toEqual([
      "banner",
      "banner",
      "card",
      "banner",
      "banner",
      "banner",
    ]);
    expect(heroCards[0]?.getAttribute("title")).toBe("页头");
    expect(heroCards[0]?.getAttribute("tone")).toBe("primary");
    expect(heroCards.filter((card) => card.querySelector('[slot="icon"]'))).toHaveLength(1);
    expect(collectElements(page, 'elf-button[aria-label="收藏"]')).toHaveLength(5);
  });

  it("英文页面覆盖案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Basic page header");
    expect(text).toContain("Custom page-header slots");
    expect(text).toContain("Analytics card");
    expect(text).toContain("Workspace card");
    expect(text).toContain("Release card");
    expect(text).toContain("Design system card");
    expect(text).toContain("Security card");
    expect(text).toContain("Analytics overview");
    expect(text).toContain("Team workspace");
    expect(text).toContain("Release center");
    expect(text).toContain("Design system");
    expect(text).toContain("Security center");
    expect(text).toContain("Waiting for a back action");
    expect(text).toContain("Trailing actions.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
