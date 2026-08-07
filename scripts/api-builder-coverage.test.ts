// 审计：所有元素组件文档页的 API 表（props.ts 或内联在 index.ts）都必须接入 elf-api-builder。
//
// 纯函数式服务页（Message/Notification/MessageBox）与指令/指南页没有可生成
// 元素片段的表格，保持普通 PropsTable 展示，不参与构建器。

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pagesRoot = resolve("apps/website/src/pages");
const SKIP_PAGES = new Set([
  "feedback/MessagePage",
  "feedback/NotificationPage",
  "feedback/MessageBoxPage",
  "directives/ClickOutsidePage",
  "directives/IntersectPage",
  "directives/MutatePage",
  "directives/ResizePage",
  "directives/RipplePage",
  "directives/ScrollPage",
  "directives/TooltipPage",
  "directives/TouchPage",
  "guide/AccessibilityPage",
  "guide/BuildStylesPage",
]);

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry === "props.ts" || entry === "index.ts") out.push(full);
  }
  return out;
};

const propsFiles = walk(pagesRoot)
  .map((file) => ({
    page: relative(pagesRoot, file)
      .replace(/\\/g, "/")
      .replace(/\/[^/]+$/, ""),
    source: readFileSync(file, "utf8"),
  }))
  .filter(({ source }) => source.includes("<elf-props-table"));

describe("API builder coverage", () => {
  it("wraps every element-component API table in elf-api-builder", () => {
    const unwrapped = propsFiles
      .filter(({ page }) => !SKIP_PAGES.has(page))
      .filter(({ source }) => !source.includes("<elf-api-builder"))
      .map(({ page }) => page);
    expect(unwrapped).toEqual([]);
  });

  it("keeps service/directive/guide pages as plain reference tables", () => {
    for (const page of SKIP_PAGES) {
      const file = propsFiles.find((item) => item.page === page);
      expect(file, page).toBeTruthy();
      expect(file!.source).not.toContain("<elf-api-builder");
    }
  });

  it("gives every builder a component tag and at least one selectable role", () => {
    const broken = propsFiles
      .filter(({ source }) => source.includes("<elf-api-builder"))
      .filter(({ source }) => {
        const builder = source.match(/<elf-api-builder\b([^>]*)>/);
        const hasComponent = /component="elf-[a-z0-9-]+"/.test(builder?.[1] ?? "");
        const hasRole = /<elf-props-table\b[^>]*\brole="/.test(source);
        return !hasComponent || !hasRole;
      })
      .map(({ page }) => page);
    expect(broken).toEqual([]);
  });
});
