import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";
let scaleExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAutocompleteEx5 } = await import("./ex5");
  const { PageAutocompleteEx6 } = await import("./ex6");
  exampleTag = ensureCustomElement(PageAutocompleteEx5);
  scaleExampleTag = ensureCustomElement(PageAutocompleteEx6);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("AutocompletePage", () => {
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
