import { describe, expect, it } from "vitest";

import { navItems, routes } from "./index";

const paths = routes.map((route) => route.path);
const groupItems = (group: string) => navItems.filter((item) => item.group === group);

describe("文档信息架构", () => {
  it("为四个新领域提供可访问路由", () => {
    expect(paths).toEqual(expect.arrayContaining([
      "/getting-started/installation",
      "/getting-started/upgrade-guide",
      "/getting-started/browser-support",
      "/getting-started/faq",
      "/directives",
      "/directives/click-outside",
      "/quality",
      "/quality/accessibility",
      "/labs"
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

  it("无障碍只在质量目录出现并保留旧地址兼容", () => {
    expect(paths).toContain("/guide/accessibility");
    expect(groupItems("Quality 质量")).toEqual(expect.arrayContaining([
      expect.objectContaining({ to: "/quality/accessibility" })
    ]));
    expect(groupItems("Guide 指南")).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ to: "/guide/accessibility" })
    ]));
  });

  it("未完成的指令和实验组件不创建空白菜单项", () => {
    expect(groupItems("Directives 指令")).toHaveLength(2);
    expect(groupItems("Labs 实验室")).toHaveLength(1);
    expect(paths).not.toEqual(expect.arrayContaining([
      "/labs/video",
      "/labs/heatmap"
    ]));
  });
});
