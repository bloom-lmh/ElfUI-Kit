import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let touchExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTooltipEx4 } = await import("./ex4");
  const { PageTooltipEx5 } = await import("./ex5");
  const { PageTooltip } = await import("./index");
  exampleTag = ensureCustomElement(PageTooltipEx4);
  touchExampleTag = ensureCustomElement(PageTooltipEx5);
  pageTag = ensureCustomElement(PageTooltip);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const deepQuery = <T extends Element>(root: ParentNode, selector: string): T | null => {
  const direct = root.querySelector<T>(selector);
  if (direct) return direct;
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (element.shadowRoot) {
      const nested = deepQuery<T>(element.shadowRoot, selector);
      if (nested) return nested;
    }
  }
  return null;
};

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

describe("TooltipPage", () => {
  it("中文页面覆盖全部案例、运行状态、源码和 API", async () => {
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("不同弹出位置");
    expect(text).toContain("不同触发方式");
    expect(text).toContain("键盘与自动避让");
    expect(text).toContain("长按提示与手势取消");
    expect(text).toContain("触屏长按触发时间");
  });

  it("英文页面覆盖全部案例、运行状态、源码和 API 且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const page = await mountPage();
    const text = collectText(page);
    expect(text).toContain("Placements");
    expect(text).toContain("Trigger modes");
    expect(text).toContain("Keyboard and auto placement");
    expect(text).toContain("Long-press tooltip and gesture cancellation");
    expect(text).toContain("Touch long-press delay, in milliseconds.");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("键盘案例建立可访问描述，并允许 Escape 关闭提示", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const trigger = deepQuery<HTMLButtonElement>(page.shadowRoot!, ".tooltip-a11y-trigger");
    const tooltipHost = trigger?.closest<HTMLElement>("elf-tooltip") ?? null;
    expect(trigger).toBeTruthy();
    expect(tooltipHost).toBeTruthy();

    trigger!.focus();
    tooltipHost!
      .shadowRoot!.querySelector<HTMLElement>(".tooltip-container")!
      .dispatchEvent(new FocusEvent("focusin", { bubbles: true, composed: true }));
    await wait(220);

    const tooltip = tooltipHost!.shadowRoot!.querySelector<HTMLElement>("[role='tooltip']");
    expect(tooltip).toBeTruthy();
    expect(trigger!.getAttribute("aria-describedby")).toContain(tooltip!.id);
    expect(tooltip!.textContent).toContain("权限继承自上级空间");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait();

    expect(trigger!.getAttribute("aria-describedby")).toBeNull();
    expect(tooltipHost!.shadowRoot!.querySelector(".tooltip-content")?.className).toContain(
      "closing",
    );
  });

  it("触屏案例公开长按延迟、移动容差和完整脚本", async () => {
    const page = document.createElement(touchExampleTag);
    document.body.appendChild(page);
    await wait();

    const tooltip = deepQuery<HTMLElement>(page.shadowRoot!, "elf-tooltip");
    const playground = deepQuery<HTMLElement>(page.shadowRoot!, "elf-playground");
    expect(tooltip).toBeTruthy();
    expect((tooltip as HTMLElement & { touchLongPress?: boolean }).touchLongPress).toBe(true);
    expect((tooltip as HTMLElement & { longPressDelay?: number }).longPressDelay).toBe(500);
    expect((tooltip as HTMLElement & { longPressTolerance?: number }).longPressTolerance).toBe(10);
    expect((playground as HTMLElement & { script?: string }).script).toContain("onPointerDown");
  });
});
