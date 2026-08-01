import { ensureCustomElement, registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Quote } from "../../../components/Basic/Quote";
import { Playground } from "../../../components/Common/Playground";
import { PropsTable } from "../../../components/Common/PropsTable";
import { Alert } from "../../../components/Feedback/Alert";
import { Container } from "../../../components/Layout/Container";
import { PageQuote } from "./index";

let pageTag = "";

beforeAll(() => {
  registerComponents(Quote, Playground, PropsTable, Alert, Container);
  pageTag = ensureCustomElement(PageQuote);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 20));

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
  await wait();
  return page;
};

describe("QuotePage", () => {
  it("documents Quote independently from runtime alerts", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("引用");
    expect(text).toContain("Quote 与 Alert");
    expect(text).toContain("静态内容 · 不可关闭 · 可标注来源");
    expect(text).toContain("状态反馈 · 可关闭 · 可承载操作");
    expect(page.shadowRoot?.querySelectorAll("elf-playground")).toHaveLength(2);
    expect(page.shadowRoot?.querySelector("elf-alert[closable]")).toBeTruthy();
  });

  it("renders complete English copy without Chinese leakage", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Quote and Alert");
    expect(text).toContain("Persistent content · not dismissible · supports citations");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
