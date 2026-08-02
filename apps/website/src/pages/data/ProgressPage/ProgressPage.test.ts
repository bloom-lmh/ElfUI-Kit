import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageProgress } = await import("./index");
  pageTag = ensureCustomElement(PageProgress);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 25): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
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

const shadowAll = (root: Node, selector: string): HTMLElement[] => {
  const found: HTMLElement[] = [];
  const visit = (node: Node): void => {
    if (node instanceof Element && node.shadowRoot) {
      found.push(...Array.from(node.shadowRoot.querySelectorAll<HTMLElement>(selector)));
      visit(node.shadowRoot);
    }
    node.childNodes.forEach(visit);
  };
  visit(root);
  return found;
};

const mount = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("ProgressPage", () => {
  it("renders Chinese configuration, formatting, slots, and circular examples", async () => {
    const text = collectText(await mount());
    expect(text).toContain("标签、数值与不确定状态");
    expect(text).toContain("容量与队列格式");
    expect(text).toContain("自定义标签、数值与中心内容");
    expect(text).toContain("自动增长与状态反馈");
    expect(text).toContain("线性进度");
    expect(text).not.toContain("切换预览明暗");
  });

  it("renders English examples without Chinese copy", async () => {
    document.documentElement.lang = "en-US";
    const text = collectText(await mount());
    expect(text).toContain("Labels, values, and indeterminate state");
    expect(text).toContain("Capacity and queue formats");
    expect(text).toContain("Custom labels, values, and center content");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("uses internal components in the first playground controls", async () => {
    const page = await mount();
    const example = page.shadowRoot!.querySelector("page-progress-ex1");
    const root = example?.shadowRoot ?? page.shadowRoot!;

    expect(shadowAll(root, "elf-select").length).toBeGreaterThanOrEqual(2);
    expect(shadowAll(root, "elf-slider").length).toBeGreaterThanOrEqual(1);
    expect(shadowAll(root, "elf-radio-group").length).toBeGreaterThanOrEqual(1);
    expect(shadowAll(root, "elf-checkbox").length).toBeGreaterThanOrEqual(3);
    expect(root.querySelectorAll("select")).toHaveLength(0);
    expect(root.querySelectorAll('input[type="range"]')).toHaveLength(0);
    expect(root.querySelectorAll('input[type="checkbox"]')).toHaveLength(0);
  });
});
