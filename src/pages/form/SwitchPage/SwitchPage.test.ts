import { afterEach, beforeAll, describe, expect, it } from "vitest";
let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageSwitch } = await import("./index");
  pageTag = ensureCustomElement(PageSwitch);
}, 30_000);
afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});
const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
const mountText = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  let output = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) output += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(page);
  return output;
};
describe("SwitchPage", () => {
  it("中文页面覆盖案例与 API", async () => expect(await mountText()).toContain("切换前守卫"));
  it("英文页面覆盖案例与 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const value = await mountText();
    expect(value).toContain("Guard invoked before changing.");
    expect(value).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
