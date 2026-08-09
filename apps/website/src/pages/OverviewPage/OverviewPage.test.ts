import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Breadcrumb } from "@elfui/kit";
import { OverviewCard } from "@elfui/website-components/OverviewCard";
import { DocsHero } from "@elfui/website-components/DocsHero";
import { resolveAppMenuIcon } from "../../app/menu-icons";
import { filterOverviewGroups, overviewCatalogGroups } from "./catalog";
import { PageOverview } from "./index";

beforeAll(() => {
  document.documentElement.lang = "zh-CN";
  registerComponents(OverviewCard, PageOverview, Breadcrumb, DocsHero);
});

afterEach(() => {
  document.body.innerHTML = "";
  history.replaceState(null, "", "/");
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));
const pageTag = (): string =>
  String(
    (PageOverview as typeof PageOverview & { __elfDefinition?: { tag?: string } }).__elfDefinition
      ?.tag,
  );

const mountPage = async (): Promise<HTMLElement> => {
  const page = document.createElement(pageTag());
  document.body.appendChild(page);
  await tick();
  await tick();
  await new Promise((resolve) => setTimeout(resolve, 20));
  return page;
};

describe("OverviewPage", () => {
  it("lists the documented component groups and links the Button card", async () => {
    window.location.hash = "#/overview";
    const page = await mountPage();
    const root = page.shadowRoot!;
    const cards = root.querySelectorAll("elf-overview-card");
    const button = Array.from(cards).find((card) => card.getAttribute("href") === "/basic/button");

    const hero = root.querySelector<HTMLElement>("elf-docs-hero")!;
    expect(hero).toBeTruthy();
    const pageHeader = Array.from(hero.shadowRoot!.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && Boolean(child.shadowRoot?.querySelector("h1")),
    )!;
    expect(pageHeader.shadowRoot?.querySelector("h1")?.textContent).toContain("组件总览");
    expect(pageHeader.shadowRoot?.querySelector(".hero-title-icon path")?.getAttribute("d")).toBe(
      resolveAppMenuIcon("/overview"),
    );
    const breadcrumb = hero.shadowRoot!.querySelector<HTMLElement>(".docs-hero-breadcrumb");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb?.shadowRoot?.textContent).toContain("首页");
    expect(breadcrumb?.shadowRoot?.textContent).toContain("组件总览");
    expect(root.querySelectorAll(".catalog-group")).toHaveLength(11);
    expect(cards.length).toBeGreaterThan(80);
    expect(cards[0]?.getAttribute("href")).toBe("/basic/button");
    expect(button?.getAttribute("title")).toContain("按钮");
    expect(button?.shadowRoot?.querySelector(".sr-only")?.textContent).toContain("打开");
    expect(button?.querySelector("[data-preview='action'][data-detail='button']")).toBeTruthy();
    expect(root.textContent).toContain("Providers 全局能力");
    expect(root.textContent).toContain("AI 组件");
  });

  it("assigns component-specific previews instead of ambiguous fallbacks", () => {
    const items = overviewCatalogGroups.flatMap((group) => group.items);
    const byPath = (path: string) => items.find((item) => item.to === path);

    expect(byPath("/basic/link")?.preview).toBe("link");
    expect(byPath("/basic/quote")?.previewDetail).toBe("quote");
    expect(byPath("/basic/tag")?.preview).toBe("tag");
    expect(byPath("/basic/badge")?.preview).toBe("badge");
    expect(byPath("/form/upload")?.preview).toBe("surface");
    expect(byPath("/feedback/message-box")?.preview).toBe("overlay");
    expect(byPath("/data/divider")?.previewDetail).toBe("divider");
    expect(byPath("/labs/code-card")?.preview).toBe("surface");
    expect(byPath("/labs/ai-chat")?.preview).toBe("chat");
    expect(byPath("/labs/chat-composer")?.preview).toBe("chat");
    expect(byPath("/labs/ai-loading")?.preview).toBe("progress");
    expect(byPath("/labs/ai-diff-table")?.preview).toBe("data");
    expect(byPath("/labs/ai-sidebar-nav")?.preview).toBe("navigation");
    expect(byPath("/labs/ai-tool-chips")?.preview).toBe("tag");
    expect(byPath("/labs/ai-command-search")?.preview).toBe("field");
    expect(byPath("/labs/ai-task-row")?.preview).toBe("list");
    expect(byPath("/labs/ai-approval")?.preview).toBe("surface");
    expect(byPath("/labs/md-page")?.preview).toBe("text");
    expect(items.every((item) => item.previewDetail !== "unknown")).toBe(true);
  });

  it("filters across English names and restores the complete catalog", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;
    const search = root.querySelector<HTMLInputElement>("#overview-search")!;

    search.value = "cascader";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(root.querySelectorAll("elf-overview-card")).toHaveLength(1);
    expect(root.querySelector("elf-overview-card")?.getAttribute("title")).toContain("级联选择器");

    search.value = "";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(root.querySelectorAll("elf-overview-card").length).toBeGreaterThan(80);
  });

  it("returns an empty state for unmatched terms", async () => {
    const page = await mountPage();
    const root = page.shadowRoot!;
    const search = root.querySelector<HTMLInputElement>("#overview-search")!;

    search.value = "not-a-real-component";
    search.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(root.querySelector(".empty-state")?.textContent).toContain("没有匹配的组件");
  });

  it("keeps the pure catalog filter bilingual", () => {
    const chinese = filterOverviewGroups(overviewCatalogGroups, "日期");
    const english = filterOverviewGroups(overviewCatalogGroups, "datepicker");
    expect(chinese.flatMap((group) => group.items).some((item) => item.to === "/picker/date")).toBe(
      true,
    );
    expect(english.flatMap((group) => group.items).some((item) => item.to === "/picker/date")).toBe(
      true,
    );
  });
});
