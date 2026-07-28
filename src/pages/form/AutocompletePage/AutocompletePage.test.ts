import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let scaleExampleTag = "";
let basicExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAutocompleteEx5 } = await import("./ex5");
  const { PageAutocompleteEx6 } = await import("./ex6");
  const { PageAutocompleteEx1 } = await import("./ex1");
  exampleTag = ensureCustomElement(PageAutocompleteEx5);
  scaleExampleTag = ensureCustomElement(PageAutocompleteEx6);
  basicExampleTag = ensureCustomElement(PageAutocompleteEx1);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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
    expect(String((autocomplete as HTMLElement & { maxHeight?: number | string }).maxHeight)).toBe("240");
    expect((playground as HTMLElement & { script?: string }).script).toContain("onCreate");

    const input = autocomplete.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    input.value = "新成员";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wait();
    expect(autocomplete.shadowRoot!.querySelector('[data-create="true"]')).toBeTruthy();
  });
});
