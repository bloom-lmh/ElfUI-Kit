import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageTourEx3 } = await import("./ex3");
  exampleTag = ensureCustomElement(PageTourEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe("TourPage", () => {
  it("目标卸载后文档状态和安全遮罩同步更新", async () => {
    const page = document.createElement(exampleTag);
    document.body.appendChild(page);
    await wait();

    page.shadowRoot!.querySelector<HTMLElement>("elf-button")!.click();
    await wait(1050);

    expect(page.shadowRoot!.textContent).toContain("目标已卸载 · 引导仍可继续");
    expect(document.body.querySelector(".tour-highlight")).toBeNull();
    expect(document.body.querySelector(".tour-backdrop")).toBeTruthy();
  });
});
