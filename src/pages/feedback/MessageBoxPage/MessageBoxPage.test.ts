import { afterEach, beforeAll, describe, expect, it } from "vitest";

import type { MessageBoxElement } from "../../../components/Feedback/MessageBox/types";

let pageTag = "";
let providerExampleTag = "";
let promptExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageMessageBox } = await import("./index");
  const { PageMessageBoxEx4 } = await import("./ex4");
  const { PageMessageBoxEx2 } = await import("./ex2");
  pageTag = ensureCustomElement(PageMessageBox);
  providerExampleTag = ensureCustomElement(PageMessageBoxEx4);
  promptExampleTag = ensureCustomElement(PageMessageBoxEx2);
});

const wait = (ms = 20): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

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

const deepQuery = <T extends Element>(
  root: ParentNode,
  selector: string,
): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (!element.shadowRoot) continue;
    const nested = deepQuery<T>(element.shadowRoot, selector);
    if (nested) return nested;
  }
  return null;
};

const deepQueryAll = <T extends Element>(
  root: Node,
  selector: string,
): T[] => {
  const matches: T[] = [];
  const visit = (node: Node): void => {
    if (node instanceof Element) {
      if (node.matches(selector)) matches.push(node as T);
      if (node.shadowRoot) visit(node.shadowRoot);
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
  return matches;
};

const mount = async (tag: string): Promise<HTMLElement> => {
  const element = document.createElement(tag);
  document.body.appendChild(element);
  await wait();
  await wait();
  return element;
};

afterEach(async () => {
  const { ElfMessageBox } = await import("../../../components/Feedback");
  ElfMessageBox.closeAll();
  await wait(220);
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  document.documentElement.lang = "zh-CN";
});

describe("MessageBoxPage", () => {
  it("keeps every example status in the playground title area", async () => {
    const page = await mount(pageTag);
    const playgrounds = deepQueryAll<HTMLElement>(page, "elf-playground");
    expect(playgrounds).toHaveLength(4);
    for (const playground of playgrounds) {
      expect(playground.querySelector(':scope > [slot="status"]')).toBeTruthy();
    }
  });

  it("中文页面覆盖四类案例、源码和 API", async () => {
    const page = await mount(pageTag);
    const text = collectText(page);

    expect(text).toContain("提醒与确认");
    expect(text).toContain("输入与校验");
    expect(text).toContain("异步关闭与关闭原因");
    expect(text).toContain("ConfigProvider 服务默认值");
    expect(text).toContain("文档级浮层主题变量");
  });

  it("英文页面没有案例和 API 汉字泄漏", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(pageTag);
    const text = collectText(page);

    expect(text).toContain("Alert and confirm");
    expect(text).toContain("Prompt and validation");
    expect(text).toContain("Async close and close reasons");
    expect(text).toContain("ConfigProvider service defaults");
    expect(text).toContain("Theme tokens for the document-level overlay.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/);
  });

  it("服务实例读取最近 ConfigProvider 的 MessageBox 默认值", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(providerExampleTag);
    const trigger = deepQuery<HTMLElement>(page.shadowRoot!, "elf-button");
    expect(trigger).toBeTruthy();

    trigger!.click();
    await wait();

    const box = document.body.querySelector<MessageBoxElement>("elf-message-box");
    expect(box).toBeTruthy();
    expect(box!.type).toBe("warning");
    expect(box!.shadowRoot!.querySelector(".panel")?.classList.contains("is-center"))
      .toBe(true);
    expect(box!.shadowRoot!.querySelector(".confirm")?.textContent).toContain("Leave anyway");
    expect(box!.shadowRoot!.querySelector(".cancel")?.textContent).toContain("Stay here");

    box!.shadowRoot!.querySelector<HTMLButtonElement>(".cancel")!.click();
  });

  it("输入案例把校验后的值写回页面状态", async () => {
    document.documentElement.lang = "en-US";
    const page = await mount(promptExampleTag);
    deepQuery<HTMLElement>(page.shadowRoot!, "elf-button")!.click();
    await wait();

    const box = document.body.querySelector<MessageBoxElement>("elf-message-box")!;
    const input = box.shadowRoot!.querySelector<HTMLInputElement>(".input")!;
    input.value = "team@elfui.dev";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    box.shadowRoot!.querySelector<HTMLButtonElement>(".confirm")!.click();
    await wait(220);

    expect(collectText(page)).toContain("Invited: team@elfui.dev");
  });
});
