import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSticky } = await import("./index");
  pageTag = ensureCustomElement(PageSticky);
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

describe("StickyPage", () => {
  it("中文页面覆盖全部案例、运行状态、源码和 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("顶部吸附与状态变化");
    expect(text).toContain("操作栏保持在容器底部");
    expect(text).toContain("目标边界、内容投放与滚动状态");
    expect(text).toContain("需要吸附的内容");
  });

  it("英文页面覆盖全部案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Top sticky with state changes");
    expect(text).toContain("The action bar stays at the bottom of the container");
    expect(text).toContain("Target boundary, teleport, and scroll state");
    expect(text).toContain("Content that becomes sticky.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
