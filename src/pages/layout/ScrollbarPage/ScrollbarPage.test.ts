import { afterEach, beforeAll, describe, expect, it } from "vitest";

let commandExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageScrollbarEx3 } = await import("./ex3");
  const { PageScrollbar } = await import("./index");
  commandExampleTag = ensureCustomElement(PageScrollbarEx3);
  pageTag = ensureCustomElement(PageScrollbar);
}, 30_000);

afterEach(() => {
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

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("ScrollbarPage", () => {
  it("中文页面覆盖全部案例、运行数据、源码与 API", async () => {
    const text = collectText(await mountPage());
    expect(text).toContain("消息列表与滚动事件");
    expect(text).toContain("项目进度");
    expect(text).toContain("回到顶部");
    expect(text).toContain("需要滚动的内容");
  });

  it("英文页面覆盖全部案例、运行数据、源码与 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mountPage());
    expect(text).toContain("Message list and scroll event");
    expect(text).toContain("Project update");
    expect(text).toContain("Scroll to top");
    expect(text).toContain("Scrollable content.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("moves the real scroll wrapper to the bottom and back to the top", async () => {
    const page = document.createElement(commandExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const scrollbar = page.shadowRoot!.querySelector("elf-scrollbar")!;
    const wrap = scrollbar.shadowRoot!.querySelector(".wrap") as HTMLElement;
    Object.defineProperty(wrap, "scrollHeight", { value: 800, configurable: true });
    Object.defineProperty(wrap, "clientHeight", { value: 220, configurable: true });
    Object.defineProperty(wrap, "scrollTop", { value: 0, configurable: true, writable: true });

    const buttons = Array.from(page.shadowRoot!.querySelectorAll("elf-button"));
    buttons.find((button) => button.textContent?.includes("滚动到底部"))!.click();
    expect(wrap.scrollTop).toBe(800);

    buttons.find((button) => button.textContent?.includes("回到顶部"))!.click();
    expect(wrap.scrollTop).toBe(0);
  });
});
