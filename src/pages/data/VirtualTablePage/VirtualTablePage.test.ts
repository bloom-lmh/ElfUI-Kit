import { afterEach, beforeAll, describe, expect, it } from "vitest";

let virtualTableTag = "";
let virtualTableAdvancedTag = "";
let virtualTableExpansionTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageVirtualTableEx1 } = await import("./ex1");
  const { PageVirtualTableEx2 } = await import("./ex2");
  const { PageVirtualTableEx3 } = await import("./ex3");
  virtualTableTag = ensureCustomElement(PageVirtualTableEx1);
  virtualTableAdvancedTag = ensureCustomElement(PageVirtualTableEx2);
  virtualTableExpansionTag = ensureCustomElement(PageVirtualTableEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const collectText = (root: Node): string => {
  let text = "";
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += `${node.textContent ?? ""}\n`;
      return;
    }
    if (node instanceof Element && node.shadowRoot) visit(node.shadowRoot);
    node.childNodes.forEach(visit);
  };
  visit(root);
  return text.replace(/\s+/g, " ").trim();
};

describe("VirtualTablePage", () => {
  it("使用窗口化行、固定列与完整 Script", async () => {
    const el = document.createElement(virtualTableTag);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const playground = el.shadowRoot!.querySelector("elf-playground")!;
    const tableV2 = el.shadowRoot!.querySelector("elf-table-v2")!;
    const table = tableV2.shadowRoot!.querySelector("elf-table")!;
    expect(playground.getAttribute("title")).toBe("5,000 行服务指标");
    expect(table.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThan(30);
    expect(table.shadowRoot!.querySelector("th.is-fixed-left")).toBeTruthy();
    expect(table.shadowRoot!.querySelector("th.is-fixed-right")).toBeTruthy();
    expect(playground.hasAttribute("script")).toBe(true);
  });

  it("固定数据案例保持连续外壳、固定表头、统一行高和状态插槽", async () => {
    const el = document.createElement(virtualTableAdvancedTag);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    const playground = el.shadowRoot!.querySelector("elf-playground")!;
    const tableV2 = el.shadowRoot!.querySelector("elf-table-v2")!;
    const root = tableV2.shadowRoot!.querySelector(".table-v2")!;
    const tables = tableV2.shadowRoot!.querySelectorAll("elf-table");
    expect(playground.getAttribute("title")).toBe("固定数据 · 状态插槽");
    expect(root.classList.contains("has-fixed-data")).toBe(true);
    expect(tables).toHaveLength(2);
    expect(tables[0]?.shadowRoot!.textContent).toContain("固定汇总");
    expect(tables[0]?.shadowRoot!.querySelector("thead")).toBeTruthy();
    expect(tables[1]?.shadowRoot!.querySelector("thead")).toBeNull();
    expect((tables[1] as HTMLElement & { rowHeight?: number }).rowHeight).toBe(44);
    expect(playground.hasAttribute("script")).toBe(true);
  });

  it("层级案例保持受控状态、键盘语义和有界窗口", async () => {
    const el = document.createElement(virtualTableExpansionTag);
    document.body.appendChild(el);
    await tick();
    await tick();
    await tick();

    expect(el.shadowRoot!.querySelector("elf-playground")?.getAttribute("title"))
      .toBe("虚拟树行 · 受控展开");
    const tableV2 = el.shadowRoot!.querySelector("elf-table-v2")!;
    const table = tableV2.shadowRoot!.querySelector("elf-table")!;
    expect(table.shadowRoot!.querySelectorAll("tbody tr").length).toBeLessThan(30);
    const toggles = table.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part~="table-v2-expand-toggle"]');
    expect(toggles[0]?.getAttribute("aria-expanded")).toBe("true");

    toggles[0]!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await tick();
    await tick();
    expect(collectText(el)).toContain("运行时 · 已收起");
    expect(table.shadowRoot!.querySelectorAll("tbody tr")).toHaveLength(2);
  });

  it("英文模式覆盖表头、状态、案例源码与固定数据", async () => {
    document.documentElement.lang = "en-US";
    const { EN_LOCALE_MESSAGES } = await import("../../../components/Providers/context");
    const provider = document.createElement("elf-locale-provider") as HTMLElement & {
      name?: string;
      messages?: Record<string, unknown>;
    };
    provider.name = "en-US";
    provider.messages = EN_LOCALE_MESSAGES;
    const basic = document.createElement(virtualTableTag);
    const advanced = document.createElement(virtualTableAdvancedTag);
    provider.append(basic, advanced);
    document.body.append(provider);
    await tick();
    await tick();
    await tick();

    const basicText = collectText(basic);
    const advancedText = collectText(advanced);
    const advancedPlayground = advanced.shadowRoot!.querySelector<
      HTMLElement & { code?: string; script?: string }
    >("elf-playground")!;
    expect(basicText).toContain("Service");
    expect(basicText).toContain("Healthy");
    expect(advancedText).toContain("Pinned summary");
    expect(advancedPlayground.code).toContain("Refreshing service metrics");
    expect(advancedPlayground.script).toContain("320 service checks today");
    expect(`${basicText} ${advancedText} ${advancedPlayground.code} ${advancedPlayground.script}`)
      .not.toMatch(/[\u3400-\u9fff]/u);
  });
});
