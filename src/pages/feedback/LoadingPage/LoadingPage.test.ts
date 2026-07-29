import { afterEach, beforeAll, describe, expect, it } from "vitest";

let controlledExampleTag = "";
let serviceExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLoadingEx1 } = await import("./ex1");
  const { PageLoadingEx7 } = await import("./ex7");
  const { PageLoading } = await import("./index");
  controlledExampleTag = ensureCustomElement(PageLoadingEx1);
  serviceExampleTag = ensureCustomElement(PageLoadingEx7);
  pageTag = ensureCustomElement(PageLoading);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
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

const mount = async (tag: string): Promise<HTMLElement> => {
  const page = document.createElement(tag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("LoadingPage", () => {
  it("中文页面覆盖全部案例、源码和 API 文案", async () => {
    const page = await mount(pageTag);
    const text = collectText(page);
    expect(text).toContain("局部加载与受控状态");
    expect(text).toContain("四种加载动效");
    expect(text).toContain("命令式服务");
    expect(text).toContain("被加载遮罩覆盖的内容");
  });

  it("英文页面覆盖全部案例、源码和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(pageTag);
    const text = collectText(page);
    expect(text).toContain("Local loading and controlled state");
    expect(text).toContain("Four loading variants");
    expect(text).toContain("Imperative service");
    expect(text).toContain("Content covered by the loading overlay.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("受控案例会切换局部加载状态", async () => {
    const page = await mount(controlledExampleTag);
    const loading = page.shadowRoot!.querySelector<HTMLElement>("elf-loading")!;
    expect(loading.shadowRoot!.querySelector(".overlay")).toBeNull();

    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await wait();
    expect(loading.shadowRoot!.querySelector(".overlay")?.textContent).toContain("正在加载组件数据");
  });

  it("英文命令式服务会进入全屏层并可主动退出", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(serviceExampleTag);
    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await wait();

    const loading = document.body.querySelector<HTMLElement>("elf-loading[data-loading-service]")!;
    expect(loading).toBeTruthy();
    expect(collectText(loading)).toContain("Syncing workspace");
    const closeButton = loading.shadowRoot!.querySelector<HTMLButtonElement>(".close")!;
    expect(closeButton.getAttribute("aria-label")).toBe("Exit fullscreen loading");
    closeButton.click();
    expect(loading.isConnected).toBe(false);
  });
});
