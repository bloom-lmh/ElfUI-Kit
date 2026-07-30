import { describe, expect, it } from "vitest";

import { navItems, routes } from "./index";

const paths = routes.map((route) => route.path);
const groupItems = (group: string) => navItems.filter((item) => item.group === group);

describe("文档信息架构", () => {
  it("为快速入门、独立指令和实验组件提供可访问路由", () => {
    expect(paths).toEqual(expect.arrayContaining([
      "/getting-started/installation",
      "/getting-started/upgrade-guide",
      "/getting-started/browser-support",
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
      "/labs/heatmap"
    ]));
  });

  it("快速入门保持任务导向的固定顺序", () => {
    expect(groupItems("Getting started 快速入门")).toEqual([
      expect.objectContaining({ to: "/getting-started/installation" }),
      expect.objectContaining({ to: "/getting-started/upgrade-guide" }),
      expect.objectContaining({ to: "/getting-started/browser-support" }),
      expect.objectContaining({ to: "/getting-started/faq" })
    ]);
  });

  it("无障碍归入指南且不再创建质量章节", () => {
    expect(paths).toContain("/guide/accessibility");
    expect(groupItems("Quality 质量")).toHaveLength(0);
    expect(groupItems("Guide 指南")).toEqual(expect.arrayContaining([
      expect.objectContaining({ to: "/guide/accessibility" })
    ]));
  });

  it("指令和实验组件只显示实际功能页面", () => {
    expect(groupItems("Directives 指令")).toHaveLength(8);
    expect(groupItems("Labs 实验室")).toHaveLength(2);
    expect(paths).toEqual(expect.arrayContaining([
      "/labs/video",
      "/labs/heatmap"
    ]));
  });
});
