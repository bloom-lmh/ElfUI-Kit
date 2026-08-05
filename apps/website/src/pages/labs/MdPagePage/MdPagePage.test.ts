import { afterEach, beforeAll, describe, expect, it } from "vitest";

let pageTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageLabsMdPage } = await import("./index");
  pageTag = ensureCustomElement(PageLabsMdPage);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("MD Page documentation", () => {
  it("renders a configurable markdown page with headings, tables, code, and embedded components", async () => {
    const page = document.createElement(pageTag);
    document.body.appendChild(page);
    await tick();

    const mdPage = page.shadowRoot!.querySelector<HTMLElement>("elf-md-page");
    expect(mdPage).toBeTruthy();
    expect(mdPage?.getAttribute("max-width")).toBe("720px");
    expect(mdPage?.getAttribute("code-theme")).toBe("material");

    const content = mdPage?.shadowRoot?.querySelector<HTMLElement>(".md-content");
    expect(content?.querySelector("h2")?.textContent).toContain("快速开始");
    expect(content?.querySelector("table")).toBeTruthy();
    expect(content?.querySelector("blockquote")).toBeTruthy();
    expect(content?.querySelector("pre code")).toBeTruthy();
    expect(content?.querySelector("elf-tag")).toBeTruthy();
    expect(content?.querySelector(".md-container.is-tip")).toBeTruthy();
    expect(content?.querySelector('input[type="checkbox"]')).toBeTruthy();
    expect(content?.querySelector(".footnotes")).toBeTruthy();
    expect(content?.querySelector(".md-code-group")).toBeTruthy();
    const outline = page.shadowRoot!.querySelector<HTMLElement>("elf-md-outline");
    expect(outline?.getAttribute("target")).toBe("md-demo");
    expect(outline?.shadowRoot?.querySelectorAll(".md-outline-link").length).toBeGreaterThanOrEqual(
      3,
    );
    const defaults = page.shadowRoot!.querySelector<HTMLElement>("elf-defaults-provider");
    expect(defaults).toBeTruthy();
    const paperPage = defaults?.querySelector<HTMLElement>('elf-md-page[theme="paper"]');
    expect(paperPage?.getAttribute("code-theme")).toBe("material");
    const custom = page.shadowRoot!.querySelector<HTMLElement>(".md-custom-demo");
    expect(custom?.shadowRoot?.textContent).toContain("v1.2.3-custom");
    expect(custom?.shadowRoot?.textContent).toContain("pnpm build && pnpm test");
    expect(page.shadowRoot!.querySelector(".md-remote-demo")?.getAttribute("src")).toBe(
      "/md-page-demo.md",
    );
    expect(page.shadowRoot!.textContent).toContain("elf-md-outline API");
  });
});
