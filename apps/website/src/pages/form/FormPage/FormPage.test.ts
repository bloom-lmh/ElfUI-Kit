import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";
let disabledExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageForm } = await import("./index");
  const { PageFormEx4 } = await import("./ex4");
  pageTag = ensureCustomElement(PageForm);
  disabledExampleTag = ensureCustomElement(PageFormEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms = 30): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
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
  await wait(60);
  return collectText(page);
};

describe("FormPage", () => {
  it("布局案例可以禁用并重新启用整张表单", async () => {
    const page = document.createElement(disabledExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const form = page.shadowRoot!.querySelector<HTMLElement & { disabled?: boolean }>("elf-form")!;
    const button = page.shadowRoot!.querySelector<HTMLElement>("elf-button")!;
    expect(form.disabled).toBe(false);

    button.click();
    await tick();
    await tick();
    expect(form.disabled).toBe(true);

    button.click();
    await tick();
    await tick();
    expect(form.disabled).toBe(false);
  });

  it("documents the complete form command surface with executable script", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();
    await wait();

    const commandExample = page.shadowRoot!.querySelector<HTMLElement>("elf-page-form-ex3")!;
    const playground = commandExample.shadowRoot!.querySelector<HTMLElement & { script?: string }>(
      "elf-playground",
    )!;
    expect(playground.script).toContain("scrollToField");
    expect(playground.script).toContain("setInitialValues");

    const propsPage = page.shadowRoot!.querySelector<HTMLElement>("elf-page-form-props")!;
    const tables = Array.from(
      propsPage.shadowRoot!.querySelectorAll<HTMLElement>("elf-props-table"),
    );
    const apiTables = tables as Array<
      HTMLElement & { rows?: Array<{ name?: string }>; title?: string }
    >;
    const builder = propsPage.shadowRoot!.querySelector<HTMLElement>("elf-api-builder")!;
    expect(
      Array.from(builder.shadowRoot!.querySelectorAll("h2")).map((heading) =>
        heading.textContent?.trim(),
      ),
    ).toEqual(["API"]);
    expect(apiTables.map((table) => table.rows?.length)).toEqual([17, 13, 8, 6, 10]);
    expect(apiTables.map((table) => table.title)).toContain("elf-form Expose");
    expect(apiTables.flatMap((table) => table.rows ?? []).map((row) => row.name)).toContain(
      "setInitialValue(value?)",
    );
  });

  it("renders complete Chinese docs", async () => {
    const text = await mountPage();
    expect(text).toContain("综合示例");
    expect(text).toContain("提交校验");
    expect(text).toContain("动态字段");
    expect(text).toContain("校验全部已注册字段");
  });

  it("renders complete English docs without Han characters", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountPage();
    expect(text).toContain("Comprehensive example");
    expect(text).toContain("Submit validation");
    expect(text).toContain("Dynamic fields");
    expect(text).toContain("Validate all registered fields");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
