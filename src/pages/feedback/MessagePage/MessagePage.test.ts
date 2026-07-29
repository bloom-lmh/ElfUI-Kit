import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let notificationRichTag = "";
let messagePageTag = "";
let notificationPageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageMessageEx4 } = await import("./ex4");
  const { PageMessage } = await import("./index");
  const { PageNotificationEx4 } = await import("../NotificationPage/ex4");
  const { PageNotification } = await import("../NotificationPage/index");
  exampleTag = ensureCustomElement(PageMessageEx4);
  notificationRichTag = ensureCustomElement(PageNotificationEx4);
  messagePageTag = ensureCustomElement(PageMessage);
  notificationPageTag = ensureCustomElement(PageNotification);
});

afterEach(async () => {
  const { ElfMessage, ElfNotification } = await import("../../../components/Feedback");
  ElfMessage.closeAll();
  ElfNotification.closeAll();
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
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
  await tick();
  await tick();
  await tick();
  return page;
};

describe("MessagePage", () => {
  it("中文页面覆盖案例、源码和 API 文案", async () => {
    const page = await mount(messagePageTag);
    const text = collectText(page);
    expect(text).toContain("基础类型");
    expect(text).toContain("等待交互");
    expect(text).toContain("文档级浮层主题变量");
  });

  it("英文页面覆盖案例、源码和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(messagePageTag);
    const text = collectText(page);
    expect(text).toContain("Basic types");
    expect(text).toContain("Waiting for interaction");
    expect(text).toContain("Theme tokens applied to the document-level host.");
    expect(text).not.toContain("基础类型");
  });

  it("操作型提示能够在文档外层创建并回写页面状态", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await wait();

    const message = document.body.querySelector<HTMLElement>("elf-message");
    expect(message).toBeTruthy();
    message!.shadowRoot!.querySelector<HTMLElement>(".action")!.click();
    await wait();

    expect(page.shadowRoot!.textContent).toContain("点击了操作按钮");
  });
});

describe("NotificationPage", () => {
  it("英文页面覆盖位置、服务选项、安全内容和 API 文案", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(notificationPageTag);
    const text = collectText(page);
    expect(text).toContain("Basic usage");
    expect(text).toContain("Screen positions");
    expect(text).toContain("Duration and service options");
    expect(text).toContain("Safe rich content");
    expect(text).toContain("Text or trusted DOM content; HTML strings are never parsed.");
    expect(text).not.toContain("基础用法");
  });

  it("英文安全富内容案例把本地化运行时内容交给服务浮层", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(notificationRichTag);
    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await tick();
    await tick();

    const notification = document.body.querySelector<HTMLElement>("elf-notification");
    expect(notification).toBeTruthy();
    const text = collectText(notification!);
    expect(text).toContain("Trusted DOM content");
    expect(text).toContain("The build completed. Its artifacts are ready to review.");
    expect(text).toContain("View details");
  });
});
