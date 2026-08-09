import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageInputOtp } = await import("./index");
  pageTag = ensureCustomElement(PageInputOtp);
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

describe("InputOtpPage", () => {
  it("中文页面覆盖案例、状态、源码和 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("受控值与分隔符");
    expect(text).toContain("支付验证码");
    expect(text).toContain("两种不可编辑状态");
    expect(text).toContain("管理验证码输入焦点");
  });

  it("英文页面覆盖案例、状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Controlled value and separator");
    expect(text).toContain("Payment code");
    expect(text).toContain("Two non-editable states");
    expect(text).toContain("Manage OTP input focus.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
