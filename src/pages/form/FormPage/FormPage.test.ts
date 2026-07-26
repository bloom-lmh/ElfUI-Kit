import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageForm } = await import("./index");
  pageTag = ensureCustomElement(PageForm);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const wait = (ms = 30): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("FormPage", () => {
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
