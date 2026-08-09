import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let customExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PagePopConfirmEx2 } = await import("./ex2");
  const { PagePopConfirmEx3 } = await import("./ex3");
  const { PagePopConfirm } = await import("./index");
  exampleTag = ensureCustomElement(PagePopConfirmEx2);
  customExampleTag = ensureCustomElement(PagePopConfirmEx3);
  pageTag = ensureCustomElement(PagePopConfirm);
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

describe("PopConfirmPage", () => {
  it("中文页面覆盖全部案例、源码和 API 文案", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("基础用法");
    expect(text).toContain("定位与异步确认");
    expect(text).toContain("浮层与自定义操作");
    expect(text).toContain("确认前守卫");
  });

  it("英文页面覆盖全部案例、源码和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Basic usage");
    expect(text).toContain("Placement and async confirmation");
    expect(text).toContain("Overlay and custom actions");
    expect(text).toContain(
      "Guard confirmation; false, a thrown error, or rejection keeps the popover open.",
    );
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("异步案例先展示失败并允许原地重试", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const popConfirm = page.shadowRoot!.querySelector<HTMLElement & { visible?: boolean }>(
      'elf-pop-confirm[trigger="manual"]',
    )!;
    popConfirm.visible = true;
    await wait();

    popConfirm.shadowRoot!.querySelector<HTMLButtonElement>(".pop-confirm-action.primary")!.click();
    await wait(950);
    expect(page.shadowRoot!.textContent).toContain("校验失败，请在气泡内重试");
    expect(popConfirm.shadowRoot!.querySelector(".pop-confirm-popover")).toBeTruthy();

    popConfirm.shadowRoot!.querySelector<HTMLButtonElement>(".pop-confirm-action.primary")!.click();
    await wait(950);
    expect(page.shadowRoot!.textContent).toContain("已提交审批");
  });

  it("teleport 案例通过 actions 插槽驱动公开确认方法", async () => {
    const page = document.createElement(customExampleTag);
    document.body.appendChild(page);
    await wait();

    const playground = page.shadowRoot!.querySelector<HTMLElement & { code?: string }>(
      "elf-playground",
    )!;
    expect(playground.code).toContain("teleported");
    expect(playground.code).toContain('slot="actions"');
    const popConfirm = page.shadowRoot!.querySelector<HTMLElement>(".custom-confirm")!;
    popConfirm.shadowRoot!.querySelector<HTMLElement>(".pop-confirm")!.click();
    await wait();

    const actions = popConfirm.querySelectorAll<HTMLElement>('[slot="actions"] elf-button');
    expect(actions).toHaveLength(2);
    actions[1]!.click();
    await wait();
    expect(page.shadowRoot!.textContent).toContain("版本已发布");
  });
});
