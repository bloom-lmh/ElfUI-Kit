import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInputNumber } = await import("./index");
  pageTag = ensureCustomElement(PageInputNumber);
}, 30_000);

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

const mountText = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return collectText(page);
};

describe("InputNumberPage", () => {
  it("中文 API 描述完整", async () => {
    expect(await mountText()).toContain("严格步长与小数精度");
  });

  it("英文 API 描述完整且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountText();
    expect(text).toContain("Strict stepping and decimal precision.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
