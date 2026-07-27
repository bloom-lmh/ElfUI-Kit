import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDialogEx3 } = await import("./ex3");
  exampleTag = ensureCustomElement(PageDialogEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
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

const deepActiveElement = (): Element | null => {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
};

describe("DialogPage", () => {
  it("键盘案例会聚焦输入框，并在关闭后恢复打开按钮", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    const triggerHost = deepQuery<HTMLElement>(page.shadowRoot!, "elf-button");
    const triggerButton = triggerHost?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    expect(triggerButton).toBeTruthy();
    triggerButton?.focus();
    triggerHost?.click();
    await wait();

    const input = document.body.querySelector<HTMLInputElement>("#dialog-workspace-name");
    expect(input).toBeTruthy();
    expect(deepActiveElement()).toBe(input);
    expect(document.body.querySelector('[role="dialog"]')).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await wait(260);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(deepActiveElement()).toBe(triggerButton);
  });
});
