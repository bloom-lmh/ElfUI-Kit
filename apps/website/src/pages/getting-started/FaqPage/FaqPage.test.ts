import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageFaq } = await import("./index");
  pageTag = ensureCustomElement(PageFaq);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("FaqPage", () => {
  it("renders expanded Q&A cards grouped by category", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const root = page.shadowRoot!;
    expect(root.querySelectorAll("elf-collapse")).toHaveLength(0);
    expect(root.querySelectorAll(".faq-item")).toHaveLength(10);
    expect(root.querySelectorAll(".docs-section")).toHaveLength(4);
    expect(root.querySelector(".faq-toolbar")).toBeNull();
    expect(root.querySelectorAll(".faq-filters elf-button")).toHaveLength(0);
  });
});
