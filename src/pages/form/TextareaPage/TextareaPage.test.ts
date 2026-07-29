import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTextarea } = await import("./index");
  pageTag = ensureCustomElement(PageTextarea);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

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

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("TextareaPage localization", () => {
  it("中文页面覆盖全部案例、运行状态、源码和 API", async () => {
    const text = collectText(await mount());
    expect(text).toContain("四行文本框");
    expect(text).toContain("字数统计与最大长度");
    expect(text).toContain("输入内容自动撑高");
    expect(text).toContain("格式化、清空与插槽");
    expect(text).toContain("模型值");
    expect(text).toContain("暴露方法");
  });

  it("英文页面覆盖全部案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Four-row textarea");
    expect(text).toContain("Character count and maximum length");
    expect(text).toContain("Autosize as content grows");
    expect(text).toContain("Formatting, clearing, and slots");
    expect(text).toContain("Model value");
    expect(text).toContain("Expose");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("keeps the controlled advanced textarea status synchronized", async () => {
    const page = await mount();
    const example = page.shadowRoot!.querySelector<HTMLElement>("elf-page-textarea-ex3")!;
    const textarea = example.shadowRoot!.querySelector<HTMLElement>("elf-textarea")!;
    textarea.dispatchEvent(new CustomEvent("update:modelValue", { detail: "新的简介" }));
    await tick();
    expect(collectText(example)).toContain("模型值 : 新的简介");
  });
});
