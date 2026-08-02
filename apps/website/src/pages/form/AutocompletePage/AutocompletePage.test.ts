import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let scaleExampleTag = "";
let basicExampleTag = "";
let teleportExampleTag = "";
let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAutocompleteEx5 } = await import("./ex5");
  const { PageAutocompleteEx6 } = await import("./ex6");
  const { PageAutocompleteEx1 } = await import("./ex1");
  const { PageAutocompleteEx4 } = await import("./ex4");
  const { PageAutocomplete } = await import("./index");
  exampleTag = ensureCustomElement(PageAutocompleteEx5);
  scaleExampleTag = ensureCustomElement(PageAutocompleteEx6);
  basicExampleTag = ensureCustomElement(PageAutocompleteEx1);
  teleportExampleTag = ensureCustomElement(PageAutocompleteEx4);
  pageTag = ensureCustomElement(PageAutocomplete);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
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
  await wait(40);
  return collectText(page);
};

describe("AutocompletePage", () => {
  it("基础案例聚焦后立即显示本地建议", async () => {
    const page = document.createElement(basicExampleTag);
    document.body.appendChild(page);
    await wait();

    const autocomplete = page.shadowRoot!.querySelector<HTMLElement>("elf-autocomplete")!;
    const input = autocomplete.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.focus();
    await wait();

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(autocomplete.shadowRoot!.textContent).toContain("Vue");
    expect(autocomplete.shadowRoot!.textContent).toContain("React");
  });

  it("远程案例可从失败状态恢复为建议列表", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const autocomplete = page.shadowRoot!.querySelector<HTMLElement>("elf-autocomplete")!;
    const input = autocomplete.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.value = "error";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(1100);
    expect(autocomplete.shadowRoot!.textContent).toContain("成员服务暂时不可用");

    input.value = "Engineer";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(1100);
    expect(autocomplete.shadowRoot!.querySelector(".panel")?.getAttribute("role")).toBe("listbox");
    expect(autocomplete.shadowRoot!.textContent).toContain("Frontend Engineer");
  });

  it("长列表案例启用创建项、虚拟滚动并提供完整 Script", async () => {
    const page = document.createElement(scaleExampleTag);
    document.body.appendChild(page);
    await wait();

    const autocomplete = page.shadowRoot!.querySelector<HTMLElement>("elf-autocomplete")!;
    const playground = page.shadowRoot!.querySelector<HTMLElement>("elf-playground")!;
    expect((autocomplete as HTMLElement & { allowCreate?: boolean }).allowCreate).toBe(true);
    expect((autocomplete as HTMLElement & { virtual?: boolean }).virtual).toBe(true);
    expect(String((autocomplete as HTMLElement & { maxHeight?: number | string }).maxHeight)).toBe(
      "240",
    );
    expect((playground as HTMLElement & { script?: string }).script).toContain("onCreate");

    const input = autocomplete.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.value = "新成员";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wait();
    expect(autocomplete.shadowRoot!.querySelector('[data-create="true"]')).toBeTruthy();
  });

  it("renders complete Chinese docs", async () => {
    const text = await mountPage();
    expect(text).toContain("异步建议");
    expect(text).toContain("远程状态");
    expect(text).toContain("创建项与长列表");
    expect(text).toContain("远程空态与错误态文案");
  });

  it("renders complete English docs without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountPage();
    expect(text).toContain("Async suggestions");
    expect(text).toContain("Remote states");
    expect(text).toContain("Creatable entries and long lists");
    expect(text).toContain("Remote empty and error messages");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });

  it("promotes the teleport section title into the playground title", async () => {
    const page = document.createElement(teleportExampleTag);
    document.body.appendChild(page);
    await wait();

    const heading = page.shadowRoot!.querySelector("h2");
    const playground = page.shadowRoot!.querySelector<HTMLElement>("elf-playground")!;

    expect(heading?.hasAttribute("hidden")).toBe(true);
    expect(heading?.hasAttribute("data-promoted-to-playground")).toBe(true);
    expect(playground.shadowRoot!.querySelector(".title")?.textContent).toContain(
      "传送面板与视口定位",
    );
  });
});
