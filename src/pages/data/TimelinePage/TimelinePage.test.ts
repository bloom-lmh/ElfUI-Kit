import { ensureCustomElement } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { PropsTable } from "../../../components/Common/PropsTable";
import { PageTimeline } from "./index";

let pageTag = "";

beforeAll(() => {
  ensureCustomElement(PropsTable);
  pageTag = ensureCustomElement(PageTimeline);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const collect = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

const mount = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return collect(page);
};

describe("TimelinePage locale", () => {
  it("renders Chinese docs", async () => {
    const text = await mount();
    expect(text).toContain("填充警告");
    expect(text).toContain("交替卡片");
    expect(text).toContain("彩色卡片");
    expect(text).toContain("订单活动");
    expect(text).toContain("时间轴数据");
  });

  it("renders strict English docs", async () => {
    document.documentElement.lang = "en-US";
    const text = await mount();
    expect(text).toContain("Filled alerts");
    expect(text).toContain("Alternating cards");
    expect(text).toContain("Color cards");
    expect(text).toContain("Order activity");
    expect(text).toContain("Timeline data");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
