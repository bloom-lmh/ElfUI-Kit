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
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms = 30): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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
    const playground = commandExample.shadowRoot!.querySelector<HTMLElement & { script?: string }>("elf-playground")!;
    expect(playground.script).toContain("scrollToField");
    expect(playground.script).toContain("setInitialValues");

    const propsPage = page.shadowRoot!.querySelector<HTMLElement>("elf-page-form-props")!;
    const tables = Array.from(propsPage.shadowRoot!.querySelectorAll<HTMLElement>("elf-props-table"));
    const apiTables = tables as Array<HTMLElement & { rows?: Array<{ name?: string }>; title?: string }>;
    expect(apiTables.map((table) => table.rows?.length)).toEqual([15, 13, 7, 5, 9]);
    expect(apiTables.map((table) => table.title)).toContain("elf-form Exposes");
    expect(apiTables.flatMap((table) => table.rows ?? []).map((row) => row.name)).toContain("setInitialValue(value?)");
  });
});
