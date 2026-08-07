import { describe, expect, it } from "vitest";

import { navItems, routes } from "./index";

const paths = routes.map((route) => route.path);
const groupItems = (group: string) => navItems.filter((item) => item.group === group);

describe("文档信息架构", () => {
  it("将组件总览作为侧栏首个独立菜单项", () => {
    expect(navItems[0]).toEqual({ to: "/overview", text: "Overview 组件总览" });
    expect(navItems[0]?.group).toBeUndefined();
    expect(navItems.find((item) => item.to === "/theme-studio")).toEqual({
      to: "/theme-studio",
      text: "Theme Studio 主题调色板",
      group: "Guide 指南",
    });
  });

  it("保留独立首页，并从首页进入组件总览", async () => {
    const homeRoute = routes.find((route) => route.path === "/");
    const overviewRoute = routes.find((route) => route.path === "/overview");
    expect(homeRoute?.name).toBe("home");
    expect(overviewRoute?.name).toBe("overview");

    const loadHome = homeRoute?.component as () => Promise<Record<string, unknown>>;
    const loadOverview = overviewRoute?.component as () => Promise<Record<string, unknown>>;
    expect(await loadHome()).toHaveProperty("PageHome");
    expect(await loadOverview()).toHaveProperty("PageOverview");
  });

  it("为快速入门、独立指令和实验组件提供可访问路由", () => {
    expect(paths).toEqual(
      expect.arrayContaining([
        "/getting-started/installation",
        "/getting-started/upgrade-guide",
        "/getting-started/faq",
        "/directives/click-outside",
        "/directives/intersect",
        "/directives/mutate",
        "/directives/resize",
        "/directives/ripple",
        "/directives/scroll",
        "/directives/tooltip",
        "/directives/touch",
        "/labs/video",
        "/labs/heatmap",
        "/labs/code-card",
      ]),
    );
  });

  it("快速入门保持任务导向的固定顺序", () => {
    expect(groupItems("Getting started 快速入门")).toEqual([
      expect.objectContaining({ to: "/getting-started/installation" }),
      expect.objectContaining({ to: "/getting-started/upgrade-guide" }),
      expect.objectContaining({ to: "/getting-started/faq" }),
    ]);
  });

  it("无障碍归入指南且不再创建质量章节", () => {
    expect(paths).toContain("/guide/accessibility");
    expect(groupItems("Quality 质量")).toHaveLength(0);
    expect(groupItems("Guide 指南")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ to: "/guide/accessibility" }),
        expect.objectContaining({ to: "/theme-studio" }),
      ]),
    );
  });

  it("将 Quote 作为独立基础组件公开", async () => {
    const quoteRoute = routes.find((route) => route.path === "/basic/quote");
    expect(groupItems("Basic 基础")).toEqual(
      expect.arrayContaining([expect.objectContaining({ to: "/basic/quote" })]),
    );
    expect(quoteRoute).toBeDefined();
    const loadQuote = quoteRoute?.component as () => Promise<Record<string, unknown>>;
    expect(await loadQuote()).toHaveProperty("PageQuote");
  });

  it("指令和实验组件只显示实际功能页面，AI 组件独立成组", () => {
    expect(groupItems("Directives 指令")).toHaveLength(8);
    expect(groupItems("Labs 实验室")).toHaveLength(4);
    expect(groupItems("AI 组件")).toHaveLength(21);
    expect(navItems[0]).toEqual({ to: "/overview", text: "Overview 组件总览" });
    expect(navItems[1]?.group).toBe("AI 组件");
    expect(paths).toEqual(
      expect.arrayContaining([
        "/labs/video",
        "/labs/heatmap",
        "/labs/code-card",
        "/labs/md-page",
        "/labs/ai-chat",
        "/labs/chat-message",
        "/labs/chat-tool-call",
        "/labs/chat-composer",
        "/labs/ai-loading",
        "/labs/ai-thinking",
        "/labs/ai-approval",
        "/labs/ai-task-row",
        "/labs/ai-context-card",
        "/labs/ai-recommendation",
        "/labs/ai-command-search",
        "/labs/ai-code-block",
        "/labs/ai-streaming-text",
        "/labs/ai-tool-chips",
        "/labs/ai-diff-table",
        "/labs/ai-records-table",
        "/labs/ai-filter-table",
        "/labs/ai-sidebar-nav",
        "/labs/ai-insight-card",
        "/labs/ai-fine-tune-card",
        "/labs/ai-showcase",
      ]),
    );
    const aiRoutes = paths.filter(
      (path) => path.startsWith("/labs/ai-") || path.startsWith("/labs/chat-"),
    );
    expect(aiRoutes).toHaveLength(21);
    expect(aiRoutes.every((path) => groupItems("AI 组件").some((item) => item.to === path))).toBe(
      true,
    );
  });
});
