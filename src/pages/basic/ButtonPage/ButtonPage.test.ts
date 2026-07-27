import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageButtonEx3 } = await import("./ex3");
  exampleTag = ensureCustomElement(PageButtonEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Button documentation", () => {
  it("locks an async action until it completes", async () => {
    vi.useFakeTimers();
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();

    const saveButton = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>("elf-button"))
      .find((button) => button.textContent?.includes("保存设置"))!;

    saveButton.click();
    await tick();
    expect((saveButton as HTMLElement & { loading?: boolean }).loading).toBe(true);
    expect(page.shadowRoot!.textContent).toContain("正在保存");

    vi.advanceTimersByTime(800);
    await tick();
    expect((saveButton as HTMLElement & { loading?: boolean }).loading).toBe(false);
    expect(page.shadowRoot!.textContent).toContain("保存完成");
  });

  it("submits and resets the outer form through the component", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await tick();

    const form = page.shadowRoot!.querySelector<HTMLFormElement>("form")!;
    const submit = form.querySelector<HTMLElement>('elf-button[type="submit"]')!;
    submit.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    await tick();
    expect(page.shadowRoot!.textContent).toContain("已提交 · 1");

    const reset = form.querySelector<HTMLElement>('elf-button[type="reset"]')!;
    reset.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    await tick();
    expect(page.shadowRoot!.textContent).toContain("表单已重置");
  });
});
