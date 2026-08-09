import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageRadio } = await import("./index");
  pageTag = ensureCustomElement(PageRadio);
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

describe("RadioPage", () => {
  it("中文页面覆盖全部案例和 API", async () => {
    const text = await mountText();
    expect(text).toContain("声明式选项与字段映射");
    expect(text).toContain("选项字段别名");
  });

  it("英文页面覆盖全部案例和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountText();
    expect(text).toContain("Declarative options and field mapping");
    expect(text).toContain("Option field aliases.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
