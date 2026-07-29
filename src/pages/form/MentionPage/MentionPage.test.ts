import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageMention } = await import("./index");
  pageTag = ensureCustomElement(PageMention);
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
const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("MentionPage", () => {
  it("中文页面覆盖全部案例、运行状态、源码与 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("提及操作台");
    expect(text).toContain("自定义触发前缀与行数");
    expect(text).toContain("键盘选择");
    expect(text).toContain("聚焦或失焦原生文本框");
  });

  it("英文页面覆盖全部案例、运行状态、源码与 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Mention playground");
    expect(text).toContain("Custom trigger prefix and row count");
    expect(text).toContain("Keyboard selection");
    expect(text).toContain("Focus or blur the native text box.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
