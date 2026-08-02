import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageClickOutside } = await import("./index");
  pageTag = ensureCustomElement(PageClickOutside);
}, 30_000);

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ClickOutsidePage", () => {
  it("places the excluded activator in the playground title status area", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await new Promise((resolve) => setTimeout(resolve, 30));

    const playground = page.shadowRoot?.querySelector("elf-playground");
    const status = playground?.querySelector('[slot="status"]');
    expect(status?.querySelector("elf-button.outside-trigger")).toBeTruthy();
    expect(page.shadowRoot?.querySelector(".outside-demo .outside-trigger")).toBeNull();
    expect(page.shadowRoot?.querySelector('elf-quote[title="为什么排除触发按钮？"]')).toBeTruthy();
    const outside = page.shadowRoot?.querySelector<HTMLButtonElement>(".outside-zone");
    outside?.click();
    await new Promise((resolve) => queueMicrotask(resolve));
    expect(status?.textContent).toContain("1");
  });
});
