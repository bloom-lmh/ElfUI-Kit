import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageDebug } = await import("./index");
  pageTag = ensureCustomElement(PageDebug);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
});

const wait = (ms = 20): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const mountText = async (): Promise<string> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await wait();
  await wait();
  const labels = Array.from(page.shadowRoot?.querySelectorAll("elf-checkbox") ?? [], (item) => item.getAttribute("label"));
  return `${page.shadowRoot?.textContent || ""} ${labels.join(" ")}`;
};

describe("DebugPage", () => {
  it("中文调试标签完整", async () => {
    expect(await mountText()).toContain("隐藏状态");
  });

  it("英文调试标签完整且无汉字", async () => {
    document.documentElement.lang = "en-US";
    const text = await mountText();
    expect(text).toContain("visible state");
    expect(text).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
