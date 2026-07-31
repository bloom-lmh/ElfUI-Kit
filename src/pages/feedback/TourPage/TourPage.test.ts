import { ensureCustomElement } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Button } from "../../../components/Basic/Button";
import { Playground } from "../../../components/Common/Playground";
import { PropsTable } from "../../../components/Common/PropsTable";
import { Tour } from "../../../components/Feedback/Tour";
import { Container } from "../../../components/Layout/Container";
import { PageTourEx3 } from "./ex3";
import { PageTour } from "./index";

let exampleTag = "";
let pageTag = "";

beforeAll(() => {
  for (const component of [Button, Playground, PropsTable, Tour, Container]) {
    ensureCustomElement(component);
  }
  exampleTag = ensureCustomElement(PageTourEx3);
  pageTag = ensureCustomElement(PageTour);
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

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  return page;
};

describe("TourPage", () => {
  it("中文页面覆盖全部案例、运行状态、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("跟随目标的基础引导");
    expect(text).toContain("键盘导航与焦点管理");
    expect(text).toContain("动态目标卸载保护");
    expect(text).toContain("目标元素选择器");
    expect(text).toContain("完成引导");
  });

  it("英文页面覆盖全部案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Basic target-following tour");
    expect(text).toContain("Keyboard navigation and focus management");
    expect(text).toContain("Dynamic target removal");
    expect(text).toContain("Target element selector.");
    expect(text).toContain("Finish the tour.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("目标卸载后文档状态和安全遮罩同步更新", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await vi.waitFor(
      () => {
        expect(page.shadowRoot!.textContent).toContain("目标已卸载 · 引导仍可继续");
      },
      { timeout: 2000, interval: 20 },
    );
    await vi.waitFor(() => {
      expect(document.body.querySelector(".tour-highlight")).toBeNull();
      expect(document.body.querySelector(".tour-backdrop")).toBeTruthy();
    });
  });
});
