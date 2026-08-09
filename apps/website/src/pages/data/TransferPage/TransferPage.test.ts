import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let virtualTransferTag = "";
let pageTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTransferEx4 } = await import("./ex4");
  const { PageTransfer } = await import("./index");
  virtualTransferTag = ensureCustomElement(PageTransferEx4);
  pageTag = ensureCustomElement(PageTransfer);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const collectText = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) text += ` ${node.textContent || ""}`;
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};
const mountPage = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return collectText(page);
};

describe("TransferPage", () => {
  it("成员分配案例以虚拟窗口渲染并保留过滤空态", async () => {
    const page = document.createElement(virtualTransferTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const transfer = page.shadowRoot!.querySelector("elf-transfer")!;
    expect(transfer.shadowRoot!.querySelectorAll(".panel-left .panel-item").length).toBeLessThan(
      20,
    );
    expect(transfer.shadowRoot!.querySelectorAll(".panel-right .panel-item")).toHaveLength(3);

    const input = transfer.shadowRoot!.querySelector<HTMLInputElement>(
      ".panel-left .panel-filter input",
    )!;
    input.value = "不存在的成员";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    expect(transfer.shadowRoot!.querySelector(".panel-left .panel-empty")?.textContent).toContain(
      "没有匹配成员",
    );
  });

  it("renders complete Chinese docs", async () => {
    const text = await mountPage();
    expect(text).toContain("基础用法");
    expect(text).toContain("虚拟化与键盘操作");
    expect(text).toContain("类型化内容渲染");
    expect(text).toContain("来源数据");
  });

  it("renders complete English docs without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountPage();
    expect(text).toContain("Transfer basic usage");
    expect(text).toContain("Virtualization and keyboard controls");
    expect(text).toContain("Typed content rendering");
    expect(text).toContain("Source records");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
