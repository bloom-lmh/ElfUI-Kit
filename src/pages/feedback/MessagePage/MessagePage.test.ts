import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageMessageEx4 } = await import("./ex4");
  exampleTag = ensureCustomElement(PageMessageEx4);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("MessagePage", () => {
  it("操作型提示能够在文档外层创建并回写页面状态", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await wait();

    const message = document.body.querySelector<HTMLElement>("elf-message");
    expect(message).toBeTruthy();
    message!.shadowRoot!.querySelector<HTMLElement>(".action")!.click();
    await wait();

    expect(page.shadowRoot!.textContent).toContain("点击了操作按钮");
  });
});
