import { readFileSync } from "node:fs";
import { ensureCustomElement } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { resolveAppMenuIcon } from "../../app/menu-icons";
import { PageThemeStudio } from "./index";

let pageTag = "";

beforeAll(async () => {
  await import("../../components");
  document.documentElement.lang = "zh-CN";
  pageTag = ensureCustomElement(PageThemeStudio);
}, 60_000);

afterEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag);
  document.body.appendChild(page);
  await tick();
  await tick();
  return page;
};

describe("ThemeStudioPage", () => {
  it("renders five presets, the Material library, a token editor, and real previews", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;

    expect(root.querySelector("h1")?.textContent).toContain("主题调色板");
    expect(root.querySelector(".studio-icon path")?.getAttribute("d")).toBe(
      resolveAppMenuIcon("/theme-studio"),
    );
    const breadcrumb = root.querySelector<HTMLElement>(".theme-breadcrumb");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb?.shadowRoot?.textContent).toContain("首页");
    expect(breadcrumb?.shadowRoot?.textContent).toContain("主题调色板");
    expect(root.querySelectorAll(".preset-card")).toHaveLength(5);
    expect(root.querySelectorAll(".material-family")).toHaveLength(19);
    expect(root.querySelectorAll(".tone-grid button")).toHaveLength(14);
    expect(root.querySelectorAll(".token-row")).toHaveLength(4);
    expect(root.querySelector("elf-theme-provider")).toBeTruthy();
    expect(root.querySelector("elf-table")).toBeTruthy();
    expect(root.querySelector("elf-alert")).toBeTruthy();
  });

  it("filters Material families and applies a selected tone to a semantic token", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;
    const search = root.querySelector<HTMLInputElement>(".palette-search input")!;
    search.value = "grey";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(root.querySelectorAll(".material-family")).toHaveLength(2);

    search.value = "";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    root.querySelector<HTMLButtonElement>('[data-family="deep-orange"]')!.click();
    root.querySelector<HTMLButtonElement>('[data-target="danger"]')!.click();
    await tick();
    root.querySelector<HTMLButtonElement>('[data-tone="darken2"]')!.click();
    await tick();

    expect(root.querySelector<HTMLTextAreaElement>(".export-card textarea")?.value).toContain(
      '"danger": "#E64A19"',
    );
  });

  it("switches presets and exposes the three export formats", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;
    const violet = root.querySelector<HTMLButtonElement>('[data-preset="violet"]')!;
    violet.click();
    await tick();

    expect(violet.getAttribute("aria-pressed")).toBe("true");
    expect(root.querySelector<HTMLTextAreaElement>(".export-card textarea")?.value).toContain(
      "#673AB7",
    );
    expect(root.querySelectorAll(".format-switch button")).toHaveLength(3);
  });

  it("switches advanced tokens and the responsive preview view", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;

    root.querySelector<HTMLButtonElement>('[data-mode="advanced"]')!.click();
    await tick();
    expect(root.querySelectorAll(".token-row")).toHaveLength(19);

    root.querySelector<HTMLButtonElement>('[data-view="preview"]')!.click();
    await tick();
    expect(root.querySelector(".theme-studio")?.getAttribute("data-mobile-view")).toBe("preview");
  });

  it("keeps the studio hero flat without an outer shadow", () => {
    const source = readFileSync("apps/website/src/pages/ThemeStudioPage/style.scss", "utf8");
    const heroBlock = source.slice(source.indexOf(".studio-hero {"), source.indexOf(".eyebrow"));
    const panelBlock = source.slice(
      source.indexOf(".editor-panel,"),
      source.indexOf(".editor-panel {"),
    );

    expect(heroBlock).toContain("border: 1px solid var(--elf-border);");
    expect(heroBlock).not.toContain("box-shadow");
    expect(panelBlock).not.toContain("box-shadow");
  });
});
