// cspell:words syncchange infty Reskin editstart

import { defineHtml, defineStyle, useRef } from "@elfui/core";

import "@elfui/kit/labs";
import type { CodeCardItem } from "@elfui/kit-src/components/Labs/CodeCard";
import type {
  DocSyncBlock,
  DocSyncParser,
  DocSyncRenderer,
} from "@elfui/kit-src/components/Labs/DocSync";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs" },
  title: { zh: "双栏同步面板", en: "Doc Sync" },
  description: {
    zh: "内容无关的左右双栏同步面板：左侧提供内容与自定义解析器，右侧提供自定义渲染器，遵循块模型与渲染契约即可获得双向同步阅读、点击高亮与边距标记。",
    en: "Content-agnostic synchronized panels: bring content and a custom parser on the left, a custom renderer on the right, and follow the block contract to get synced reading, click highlight, and gutter markers.",
  },
  mdWord: { zh: "Markdown → Word 同步阅读", en: "Markdown → Word sync reading" },
  latexWord: { zh: "LaTeX → Word 同步阅读", en: "LaTeX → Word sync reading" },
  active: { zh: "当前激活块", en: "Active block" },
  lockScroll: { zh: "锁定滚动同步", en: "Lock scroll sync" },
  lineNumbersLabel: { zh: "行号", en: "Line numbers" },
  rulerLabel: { zh: "刻度尺", en: "Ruler" },
  editHint: {
    zh: "双击任意块可编辑，另一侧实时同步。",
    en: "Double-click any block to edit it; the other pane updates live.",
  },
  none: { zh: "无", en: "None" },
  standard: { zh: "开放标准", en: "Open standard" },
  standardLead: {
    zh: "同步不依赖任何具体格式。组件只认三层契约：块模型、解析器、渲染器。",
    en: "Sync never depends on a concrete format. The component only consumes three contracts: block model, parser, and renderer.",
  },
  minimal: { zh: "最小实现", en: "Minimal implementation" },
  minimalLead: {
    zh: "只实现解析器与渲染器两个函数，即可获得同步阅读与点击高亮。",
    en: "Implement just a parser and a renderer to get synced reading and click highlight.",
  },
  customStyle: { zh: "自定义面板样式", en: "Custom panel styling" },
  customStyleLead: {
    zh: "通过 CSS 自定义属性整体换肤，不修改组件源码。",
    en: "Reskin the whole panel with CSS custom properties, without touching component code.",
  },
  cssVars: { zh: "CSS 自定义属性", en: "CSS custom properties" },
  modelLabel: { zh: "块模型", en: "Block model" },
  parserLabel: { zh: "解析器", en: "Parser" },
  rendererLabel: { zh: "渲染器", en: "Renderer" },
  api: { zh: "API", en: "API" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "Expose", en: "Expose" },
  props: { zh: "Props", en: "Props" },
});
const pick = createDocsPicker();

const escapeHtml = (value: string): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const parseMarkdown = (source: unknown): DocSyncBlock[] => {
  const blocks: DocSyncBlock[] = [];
  let codeBuffer: string[] = [];
  let inCode = false;
  let codeStartLine = 0;
  let sourceLine = 0;
  const flushCode = (): void => {
    if (codeBuffer.length) {
      blocks.push({ type: "code", text: codeBuffer.join("\n"), line: codeStartLine });
      codeBuffer = [];
    }
  };
  for (const line of String(source ?? "").split("\n")) {
    sourceLine += 1;
    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushCode();
        inCode = true;
        codeStartLine = sourceLine;
      }
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1]!.length,
        text: heading[2] ?? "",
        line: sourceLine,
      });
      continue;
    }
    const list = line.match(/^[-*]\s+(.*)$/);
    if (list) {
      const last = blocks.at(-1);
      if (last?.type === "list" && last.items) last.items.push(list[1]!);
      else blocks.push({ type: "list", items: [list[1]!], line: sourceLine });
      continue;
    }
    const math = line.match(/^\$\$(.*)\$\$$/);
    if (math) {
      blocks.push({ type: "math", text: math[1] ?? "", line: sourceLine });
      continue;
    }
    const table = line.match(/^\|(.+)\|$/);
    if (table) {
      const cells = table[1]!.split("|").map((cell) => cell.trim());
      if (cells.some((cell) => !/^-{2,}$/.test(cell))) {
        const last = blocks.at(-1);
        if (last?.type === "table" && last.rows) last.rows.push(cells);
        else blocks.push({ type: "table", rows: [cells], line: sourceLine });
      }
      continue;
    }
    if (line.trim()) blocks.push({ type: "paragraph", text: line.trim(), line: sourceLine });
  }
  flushCode();
  return blocks;
};

const parseLatex = (source: unknown): DocSyncBlock[] => {
  const blocks: DocSyncBlock[] = [];
  let inTable = false;
  let sourceLine = 0;
  for (const line of String(source ?? "").split("\n")) {
    sourceLine += 1;
    const trimmed = line.trim();
    if (/^\\(begin|end)\{tabular\}/.test(trimmed)) {
      inTable = /^\\begin\{tabular\}/.test(trimmed);
      continue;
    }
    if (inTable) {
      if (/^\\hline$/.test(trimmed)) continue;
      if (trimmed.includes("&")) {
        const cells = trimmed
          .replace(/\\\\\s*$/, "")
          .split("&")
          .map((cell) => cell.trim());
        const last = blocks.at(-1);
        if (last?.type === "table" && last.rows) last.rows.push(cells);
        else blocks.push({ type: "table", rows: [cells], line: sourceLine });
        continue;
      }
    }
    const section = trimmed.match(/^\\(section|subsection)\{(.+)\}$/);
    if (section) {
      blocks.push({
        type: "heading",
        level: section[1] === "section" ? 1 : 2,
        text: section[2] ?? "",
        line: sourceLine,
      });
      continue;
    }
    const item = trimmed.match(/^\\item\s+(.+)$/);
    if (item) {
      const last = blocks.at(-1);
      if (last?.type === "list" && last.items) last.items.push(item[1]!);
      else blocks.push({ type: "list", items: [item[1]!], line: sourceLine });
      continue;
    }
    const math = trimmed.match(/^\$\$(.+)\$\$$/);
    if (math) {
      blocks.push({ type: "math", text: math[1] ?? "", line: sourceLine });
      continue;
    }
    if (/^\\(begin|end)\{itemize\}$/.test(trimmed)) continue;
    if (trimmed) blocks.push({ type: "paragraph", text: trimmed, line: sourceLine });
  }
  return blocks;
};

const renderWordBlock: DocSyncRenderer = (block) => {
  const text = escapeHtml(block.text ?? "");
  if (block.type === "heading") {
    const level = Math.min(4, Math.max(1, Number(block.level) || 1));
    return `<span class="doc-sync-word-heading" data-level="${level}">${text}</span>`;
  }
  if (block.type === "list")
    return `<ul class="doc-sync-word-list">${(block.items ?? [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul>`;
  if (block.type === "code") return `<pre class="doc-sync-word-code"><code>${text}</code></pre>`;
  if (block.type === "math") return `<span class="doc-sync-word-math">${text}</span>`;
  if (block.type === "table")
    return `<table class="doc-sync-word-table"><tbody>${(block.rows ?? [])
      .map(
        (row, rowIndex) =>
          `<tr>${row
            .map(
              (cell, cellIndex) =>
                `<td class="${rowIndex === 0 ? "is-head" : ""}" data-cell="${cellIndex}">${escapeHtml(cell)}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("")}</tbody></table>`;
  return `<p class="doc-sync-word-paragraph">${text || "&nbsp;"}</p>`;
};

const mdSourceZh = [
  "# 安装与快速上手",
  "",
  "使用 pnpm 安装 @elfui/kit，然后在入口注册组件。",
  "",
  "## 安装",
  "",
  "```",
  "pnpm add @elfui/kit",
  "```",
  "",
  "## 使用",
  "",
  "- 引入组件库",
  "- 注册自定义元素",
  "- 开始开发",
  "",
  "## 方案对比",
  "",
  "| 方式 | 说明 |",
  "| ---- | ---- |",
  "| CDN | 最快体验 |",
  "| pnpm | 推荐生产使用 |",
  "",
  "## 常见问题",
  "",
  "构建报错时先检查 Node 版本与 pnpm 缓存，再查看控制台堆栈。",
  "",
  "- 依赖未安装？先执行 pnpm install",
  "- 样式未生效？检查主题 Provider",
  "- 图标缺失？检查 Icon Provider 配置",
  "",
  "$$ E = mc^2 $$",
].join("\n");

const mdSourceEn = [
  "# Installation and quick start",
  "",
  "Install @elfui/kit with pnpm, then register the components at the app entry.",
  "",
  "## Install",
  "",
  "```",
  "pnpm add @elfui/kit",
  "```",
  "",
  "## Usage",
  "",
  "- Import the component library",
  "- Register the custom elements",
  "- Start building",
  "",
  "## Comparison",
  "",
  "| Option | Notes |",
  "| ------ | ----- |",
  "| CDN | Fastest to try |",
  "| pnpm | Recommended for production |",
  "",
  "## FAQ",
  "",
  "When a build fails, check the Node version and pnpm cache first, then read the console stack.",
  "",
  "- Dependencies missing? Run pnpm install",
  "- Styles not applied? Check the theme Provider",
  "- Icons missing? Check the Icon Provider",
  "",
  "$$ E = mc^2 $$",
].join("\n");

const latexSourceZh = [
  "\\section{引言}",
  "",
  "本文档演示 LaTeX 源内容如何通过同一同步面板映射到 Word 风格视图。",
  "同步建立在块模型之上，与具体排版语言无关。",
  "",
  "\\section{安装}",
  "",
  "推荐使用 pnpm 安装组件库，并在入口统一注册。",
  "",
  "\\begin{itemize}",
  "\\item 安装核心包",
  "\\item 安装扩展包",
  "\\item 配置主题",
  "\\end{itemize}",
  "",
  "安装完成后在入口注册组件，即可开始开发。",
  "",
  "\\section{公式}",
  "",
  "公式块会被识别为独立的同步单元，点击左侧公式即可定位右侧对应公式。",
  "",
  "$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$",
  "",
  "$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$",
  "",
  "\\subsection{常用记号}",
  "",
  "\\begin{itemize}",
  "\\item 标量使用斜体",
  "\\item 向量使用粗体",
  "\\item 矩阵使用大写字母",
  "\\end{itemize}",
  "",
  "\\section{表格对比}",
  "",
  "下表对比两种接入方式。",
  "",
  "\\begin{tabular}{l l}",
  "方式 & 说明 \\\\",
  "CDN & 最快体验 \\\\",
  "pnpm & 推荐生产使用 \\\\",
  "源码构建 & 深度定制 \\\\",
  "\\end{tabular}",
  "",
  "\\section{结论}",
  "",
  "双栏同步不关心内容格式，只关心块模型、解析器与渲染器三层契约。",
  "遵循标准的任意内容都能获得同步阅读与点击高亮。",
].join("\n");

const latexSourceEn = [
  "\\section{Introduction}",
  "",
  "This document demonstrates how LaTeX source maps to a Word-style view through the same sync panel.",
  "Sync is built on the block model, independent of any concrete typesetting language.",
  "",
  "\\section{Installation}",
  "",
  "Install the component library with pnpm and register it at the app entry.",
  "",
  "\\begin{itemize}",
  "\\item Install the core package",
  "\\item Install extension packages",
  "\\item Configure the theme",
  "\\end{itemize}",
  "",
  "Once installed, register the components at the entry and start building.",
  "",
  "\\section{Formula}",
  "",
  "Formula blocks become independent sync units; click one on the left to locate its counterpart.",
  "",
  "$$\\int_0^1 x^2 \\, dx = \\frac{1}{3}$$",
  "",
  "$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$",
  "",
  "\\subsection{Notation}",
  "",
  "\\begin{itemize}",
  "\\item Scalars use italics",
  "\\item Vectors use bold",
  "\\item Matrices use capitals",
  "\\end{itemize}",
  "",
  "\\section{Comparison}",
  "",
  "The table below compares two integration paths.",
  "",
  "\\begin{tabular}{l l}",
  "Option & Notes \\\\",
  "CDN & Fastest to try \\\\",
  "pnpm & Recommended for production \\\\",
  "Source build & Deep customization \\\\",
  "\\end{tabular}",
  "",
  "\\section{Conclusion}",
  "",
  "Sync never cares about the content format, only about the three contracts: block model, parser, and renderer.",
  "Any content following the standard gets synced reading and click highlight.",
].join("\n");

const demoLocaleIsEnglish = (): boolean =>
  String(document.documentElement.lang || "zh-CN")
    .toLowerCase()
    .startsWith("en");
const mdSource = (): string => (demoLocaleIsEnglish() ? mdSourceEn : mdSourceZh);
const latexSource = (): string => (demoLocaleIsEnglish() ? latexSourceEn : latexSourceZh);
const minimalSource = (): string =>
  demoLocaleIsEnglish()
    ? [
        "# Release checklist",
        "1. Build passed",
        "2. Unit tests passed",
        "3. Integration tests passed",
        "4. Package created",
        "5. Changelog generated",
        "6. Version bumped",
        "7. Code pushed",
        "8. Pipeline waiting",
        "9. Staging deployed",
        "10. Smoke test passed",
        "11. Production deployed",
        "12. Alerts configured",
        "13. Metrics checked",
        "14. Backup verified",
        "15. Docs updated",
        "16. Release announced",
      ].join("\n")
    : [
        "# 发布清单",
        "1. 编译通过",
        "2. 单元测试通过",
        "3. 集成测试通过",
        "4. 打包完成",
        "5. 生成变更日志",
        "6. 更新版本号",
        "7. 推送代码仓库",
        "8. 等待流水线",
        "9. 部署到预发布环境",
        "10. 冒烟验证通过",
        "11. 部署到生产环境",
        "12. 配置告警",
        "13. 核对监控指标",
        "14. 验证备份",
        "15. 更新文档",
        "16. 发布公告",
      ].join("\n");
const minimalParse: DocSyncParser = (source) =>
  String(source)
    .split("\n")
    .map((line, index) => {
      const isHeading = line.startsWith("#");
      const block: DocSyncBlock = {
        id: `sync-${index}`,
        type: isHeading ? "heading" : "paragraph",
        text: line.replace(/^#\s*/, ""),
        line: index + 1,
      };
      if (isHeading) block.level = 1;
      return block;
    });
const minimalRender: DocSyncRenderer = (block) =>
  block.type === "heading"
    ? `<strong>${block.text ?? ""}</strong>`
    : `<span>${block.text ?? ""}</span>`;

const lock = useRef(false);
const showLines = useRef(true);
const showRuler = useRef(true);
const mdActive = useRef("");
const latexActive = useRef("");
const onLock = (event: CustomEvent<boolean>): void => lock.set(Boolean(event.detail));
const onLines = (event: CustomEvent<boolean>): void => showLines.set(Boolean(event.detail));
const onRuler = (event: CustomEvent<boolean>): void => showRuler.set(Boolean(event.detail));
const onMdActivate = (event: CustomEvent): void => mdActive.set(String(event.detail ?? ""));
const onLatexActivate = (event: CustomEvent): void => latexActive.set(String(event.detail ?? ""));
const minimalActive = useRef("");
const onMinimalActivate = (event: CustomEvent): void =>
  minimalActive.set(String(event.detail ?? ""));
const customActive = useRef("");
const onCustomActivate = (event: CustomEvent): void => customActive.set(String(event.detail ?? ""));

const mdWordCode = `<elf-doc-sync
  :source.prop="markdownSource"
  :parse.prop="parseMarkdown"
  :render-right.prop="renderWordBlock"
  left-label="Markdown"
  right-label="Word"
/>`;
const mdWordScript = `const parseMarkdown = (source) => {
  // 任意内容 → 标准块模型（相同输入必须产出相同 id）
  return String(source).split("\\n").map((line, index) => ({
    id: \`sync-\${index}\`,
    type: line.startsWith("#") ? "heading" : "paragraph",
    text: line,
  }));
};

const renderWordBlock = (block) => {
  if (block.type === "heading")
    return \`<h2>\${block.text}</h2>\`;
  return \`<p>\${block.text ?? ""}</p>\`;
};`;
const latexWordCode = `<elf-doc-sync
  :source.prop="latexSource"
  :parse.prop="parseLatex"
  :render-right.prop="renderWordBlock"
  left-label="LaTeX"
  right-label="Word"
/>`;
const latexWordScript = `const parseLatex = (source) => {
  const blocks = [];
  for (const line of String(source).split("\\n")) {
    const section = line.trim().match(/^\\\\(section|subsection)\\\\{(.+)\\\\}$/);
    if (section) blocks.push({
      type: "heading",
      level: section[1] === "section" ? 1 : 2,
      text: section[2],
    });
    else if (line.trim()) blocks.push({ type: "paragraph", text: line.trim() });
  }
  return blocks;
};`;

const minimalCode = `<elf-doc-sync
  :source.prop="source"
  :parse.prop="parse"
  :render-right.prop="render"
  left-label="Source"
  right-label="Preview"
/>`;
const minimalScript = `// 解析器：任意内容 → 标准块模型
const parse = (source) =>
  String(source).split("\\n").map((line, index) => ({
    id: \`sync-\${index}\`,
    type: line.startsWith("#") ? "heading" : "paragraph",
    text: line.replace(/^#\\s*/, ""),
  }));

// 渲染器：块 → 渲染内容（字符串视为可信 HTML）
const render = (block) =>
  block.type === "heading"
    ? \`<strong>\${block.text}</strong>\`
    : \`<span>\${block.text}</span>\`;`;
const customStyleCode = `<elf-doc-sync
  class="doc-sync-custom"
  :source.prop="markdownSource"
  :parse.prop="parseMarkdown"
  :render-right.prop="renderWordBlock"
  left-label="Markdown"
  right-label="Word"
/>`;
const customStyleScript = `.doc-sync-custom {
  --doc-sync-bg: #f3e8d2;
  --doc-sync-pane-bg: #fffaf1;
  --doc-sync-header-bg: #fdebd0;
  --doc-sync-header-color: #92400e;
  --doc-sync-accent: #b45309;
  --doc-sync-font: Georgia, "Times New Roman", serif;
  --doc-sync-heading-font: Georgia, "Times New Roman", serif;
  --doc-sync-source-bg: #3b2f1f;
  --doc-sync-source-color: #f5ead6;
  --doc-sync-source-muted: rgb(245 234 214 / 45%);
  --doc-sync-source-header-bg: #463824;
  --doc-sync-ruler-bg: #3f3320;
}`;

const modelCode = `{
  "version": 1,
  "blocks": [
    { "id": "sync-heading-a1b2c3d4", "type": "heading", "level": 1, "text": "Install" },
    { "id": "sync-paragraph-9f8e7d6c", "type": "paragraph", "text": "Install with pnpm." }
  ]
}`;
const parserCode = `// 契约一：解析器  source → DocSyncBlock[]
const parse = (source) => {
  const lines = String(source).split("\\n");
  return lines.map((line, index) => ({
    id: \`sync-\${index}\`, // 建议内容哈希，内容变化时 id 随之变化
    type: line.startsWith("#") ? "heading" : "paragraph",
    text: line,
  }));
};`;
const rendererCode = `// 契约二：渲染器  block → Node | string（字符串视为可信 HTML）
const renderRight = (block, index) => {
  if (block.type === "heading")
    return \`<h2>\${block.text}</h2>\`;
  return \`<p>\${block.text ?? ""}</p>\`;
};`;
const standardItems = (): CodeCardItem[] => [
  {
    key: "model",
    label: t("modelLabel"),
    filename: "sync-model.json",
    language: "json",
    code: modelCode,
  },
  {
    key: "parser",
    label: t("parserLabel"),
    filename: "parser.ts",
    language: "typescript",
    code: parserCode,
  },
  {
    key: "renderer",
    label: t("rendererLabel"),
    filename: "renderer.ts",
    language: "typescript",
    code: rendererCode,
  },
];

const propsRows = () => [
  {
    name: "blocks",
    type: "DocSyncBlock[]",
    default: "[]",
    desc: pick(
      "直接提供共享块模型（与 source/parse 二选一）",
      "Provide the shared block model directly (alternative to source/parse).",
    ),
  },
  {
    name: "source / parse",
    type: "unknown / (source) => DocSyncBlock[]",
    default: "null",
    desc: pick(
      "原始内容与自定义解析器，解析结果自动归一化为带稳定 id 的块模型",
      "Raw content and a custom parser; parsed blocks are normalized with stable ids.",
    ),
  },
  {
    name: "renderLeft / renderRight",
    type: "(block, index) => Node | string",
    default: pick("内置 source / preview", "built-in source / preview"),
    desc: pick(
      "自定义渲染器，返回字符串视为可信 HTML；缺省使用内置渲染",
      "Custom pane renderers; strings are trusted HTML; built-in rendering is the fallback.",
    ),
  },
  {
    name: "editable",
    type: "boolean",
    default: "true",
    desc: pick(
      "双击块进入编辑，另一侧实时同步；Esc 取消，Ctrl/⌘+Enter 或失焦保存",
      "Double-click a block to edit with live sync; Esc cancels, Ctrl/⌘+Enter or blur saves.",
    ),
  },
  {
    name: "lineNumbers",
    type: "boolean",
    default: "true",
    desc: pick(
      "源码面板显示行号列（多行块显示起止行）",
      "Show a line-number gutter in the source pane.",
    ),
  },
  {
    name: "ruler",
    type: "boolean",
    default: "true",
    desc: pick("源码面板顶部显示刻度尺", "Show a ruler above the source pane."),
  },
  {
    name: "leftMode / rightMode",
    type: "source | preview",
    default: "source / preview",
    desc: pick("内置渲染模式：源码视图或文档预览", "Built-in rendering mode: source or preview."),
  },
  {
    name: "leftLabel / rightLabel",
    type: "string",
    default: "''",
    desc: pick("面板标题", "Pane header labels."),
  },
  {
    name: "lockScroll",
    type: "boolean",
    default: "false",
    desc: pick("关闭双向滚动跟随", "Disable bidirectional scroll following."),
  },
  {
    name: "overscan / estimatedHeight",
    type: "number",
    default: "6 / 28",
    desc: pick(
      "虚拟滚动预渲染窗口与首屏高度预估",
      "Virtual-window overscan and initial height estimate.",
    ),
  },
  {
    name: "split / height",
    type: "number / string | number",
    default: "50 / 420",
    desc: pick("初始分割比例与面板高度", "Initial split ratio and panel height."),
  },
  {
    name: "ariaLabel",
    type: "string",
    default: "Synchronized document panels",
    desc: pick("面板无障碍名称", "Accessible panel name."),
  },
];
const eventRows = () => [
  {
    name: "activate",
    type: "string | null",
    desc: pick("块被点击或键盘激活", "A block was activated by click or keyboard."),
  },
  {
    name: "syncchange",
    type: "{ side, id }",
    desc: pick(
      "滚动锚点变化，另一侧将跟随",
      "The scroll anchor changed and the other pane follows.",
    ),
  },
  {
    name: "editstart",
    type: "{ id, side }",
    desc: pick("块进入编辑状态", "A block entered edit mode."),
  },
  {
    name: "edit",
    type: "{ id, side, block }",
    desc: pick("编辑提交，携带更新后的块", "An edit was committed with the updated block."),
  },
  {
    name: "swap",
    type: "void",
    desc: pick(
      "点击分割线中央把手，左右面板角色互换",
      "The panes were swapped via the divider handle.",
    ),
  },
];
const exposeRows = () => [
  {
    name: "activate(id)",
    type: "void",
    desc: pick("激活并标记指定块", "Activate and mark a block."),
  },
  { name: "clearActive()", type: "void", desc: pick("清除当前标记", "Clear the active marker.") },
  {
    name: "scrollTo(id, side)",
    type: "void",
    desc: pick("滚动指定面板到块", "Scroll a pane to a block."),
  },
];
const cssVarRows = () => [
  { name: "--doc-sync-bg", desc: pick("面板容器背景", "Panel container background.") },
  { name: "--doc-sync-pane-bg", desc: pick("左右面板背景", "Left and right pane background.") },
  {
    name: "--doc-sync-header-bg / --doc-sync-header-color",
    desc: pick("面板标题栏背景与文字色", "Pane header background and text color."),
  },
  { name: "--doc-sync-border", desc: pick("容器与分割线颜色", "Container and divider color.") },
  { name: "--doc-sync-radius", desc: pick("容器圆角", "Container radius.") },
  { name: "--doc-sync-shadow", desc: pick("容器阴影", "Container shadow.") },
  {
    name: "--doc-sync-accent",
    desc: pick(
      "强调色：激活块、边距条与分割条悬停",
      "Accent used for active blocks, markers, and the divider hover.",
    ),
  },
  {
    name: "--doc-sync-font / --doc-sync-heading-font",
    desc: pick("正文字体与标题字体", "Body font and heading font."),
  },
  {
    name: "--doc-sync-source-bg / --doc-sync-source-color / --doc-sync-source-muted",
    desc: pick(
      "源码面板背景、文字与弱化文字色",
      "Source-pane background, text, and muted text colors.",
    ),
  },
  {
    name: "--doc-sync-source-header-bg / --doc-sync-ruler-bg",
    desc: pick("源码面板标题栏与刻度尺背景", "Source-pane header and ruler background."),
  },
  {
    name: "--doc-sync-source-font",
    desc: pick("源码面板等宽字体", "Source-pane monospace font."),
  },
  { name: "--_doc-sync-height", desc: pick("面板高度", "Panel height.") },
];

defineStyle(
  articleStyles,
  `
  .doc-sync-stage {
    width: 100%;
  }
  .doc-sync-stage elf-doc-sync {
    --doc-sync-border: transparent;
    --doc-sync-radius: 10px;
    --doc-sync-shadow: none;
  }
  .doc-sync-playground {
    --elf-playground-demo-padding: 0;
  }
  .doc-sync-controls {
    display: grid;
    align-content: start;
    gap: 8px;
    justify-items: start;
  }
  .doc-sync-status {
    color: var(--elf-text-secondary);
    font-size: 12px;
  }
  .doc-sync-custom {
    --doc-sync-bg: #f3e8d2;
    --doc-sync-pane-bg: #fffaf1;
    --doc-sync-header-bg: #fdebd0;
    --doc-sync-header-color: #92400e;
    --doc-sync-accent: #b45309;
    --doc-sync-font: Georgia, "Times New Roman", serif;
    --doc-sync-heading-font: Georgia, "Times New Roman", serif;
  }

  .doc-sync-word-heading {
    display: block;
    color: var(--elf-text-primary);
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 700;
    line-height: 1.3;
  }
  .doc-sync-word-heading[data-level="1"] {
    padding-bottom: 6px;
    border-bottom: 2px solid var(--elf-border-strong);
    font-size: 22px;
  }
  .doc-sync-word-heading[data-level="2"] {
    margin-top: 10px;
    font-size: 18px;
  }
  .doc-sync-word-heading[data-level="3"],
  .doc-sync-word-heading[data-level="4"] {
    font-size: 15px;
  }
  .doc-sync-word-paragraph {
    margin: 4px 0;
    font-family: Georgia, "Times New Roman", serif;
    line-height: 1.7;
    text-align: justify;
  }
  .doc-sync-word-list {
    margin: 4px 0;
    padding-inline-start: 22px;
    font-family: Georgia, "Times New Roman", serif;
    line-height: 1.7;
  }
  .doc-sync-word-code {
    margin: 4px 0;
    padding: 8px 10px;
    overflow-x: auto;
    border-radius: 4px;
    background: color-mix(in srgb, var(--elf-text-primary) 7%, transparent);
    font-size: 12px;
  }
  .doc-sync-word-math {
    display: inline-block;
    margin: 6px 0;
    padding: 8px 14px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--elf-primary) 7%, transparent);
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 17px;
    font-style: italic;
  }
  .doc-sync-word-table {
    width: 100%;
    margin: 6px 0;
    border-collapse: collapse;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 13px;
  }
  .doc-sync-word-table td {
    padding: 5px 9px;
    border: 1px solid var(--elf-border);
  }
  .doc-sync-word-table td.is-head {
    background: color-mix(in srgb, var(--elf-text-primary) 6%, transparent);
    font-weight: 700;
  }
  `,
);

const PageLabsDocSync = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="DocSync" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <elf-playground class="doc-sync-playground" :title=${t("mdWord")} :code=${mdWordCode} :script=${mdWordScript}>
      <span slot="status" class="doc-sync-status">${t("active")}: ${mdActive.value || t("none")}</span>
      <div slot="controls" class="demo-controls doc-sync-controls">
        <span class="doc-sync-status">${t("editHint")}</span>
        <elf-checkbox :label=${t("lockScroll")} :modelValue.prop=${lock.value} @update:modelValue=${onLock}></elf-checkbox>
        <elf-checkbox :label=${t("lineNumbersLabel")} :modelValue.prop=${showLines.value} @update:modelValue=${onLines}></elf-checkbox>
        <elf-checkbox :label=${t("rulerLabel")} :modelValue.prop=${showRuler.value} @update:modelValue=${onRuler}></elf-checkbox>
      </div>
      <div class="doc-sync-stage">
        <elf-doc-sync height="520" :source.prop=${mdSource()} :parse.prop=${parseMarkdown} :renderRight.prop=${renderWordBlock} :lockScroll.prop=${lock.value} :lineNumbers.prop=${showLines.value} :ruler.prop=${showRuler.value} left-label="Markdown" right-label="Word" @activate=${onMdActivate}></elf-doc-sync>
      </div>
    </elf-playground>

    <elf-playground class="doc-sync-playground" :title=${t("latexWord")} :code=${latexWordCode} :script=${latexWordScript}>
      <span slot="status" class="doc-sync-status">${t("active")}: ${latexActive.value || t("none")}</span>
      <div class="doc-sync-stage">
        <elf-doc-sync height="520" :source.prop=${latexSource()} :parse.prop=${parseLatex} :renderRight.prop=${renderWordBlock} left-label="LaTeX" right-label="Word" @activate=${onLatexActivate}></elf-doc-sync>
      </div>
    </elf-playground>

    <section class="docs-section">
      <h2>${t("standard")}</h2>
      <elf-quote type="info" variant="soft" :compact.prop=${true}><p>${t("standardLead")}</p></elf-quote>
      <elf-playground class="doc-sync-playground" :title=${t("minimal")} :code=${minimalCode} :script=${minimalScript}>
        <span slot="status" class="doc-sync-status">${t("active")}: ${minimalActive.value || t("none")}</span>
        <div class="doc-sync-stage">
          <elf-doc-sync height="520" :source.prop=${minimalSource()} :parse.prop=${minimalParse} :renderRight.prop=${minimalRender} left-label="Source" right-label="Preview" @activate=${onMinimalActivate}></elf-doc-sync>
        </div>
      </elf-playground>
      <elf-quote type="info" variant="soft" :compact.prop=${true}><p>${t("minimalLead")}</p></elf-quote>
      <elf-playground class="doc-sync-playground" :title=${t("customStyle")} :code=${customStyleCode} :script=${customStyleScript}>
        <span slot="status" class="doc-sync-status">${t("active")}: ${customActive.value || t("none")}</span>
        <div class="doc-sync-stage">
          <elf-doc-sync class="doc-sync-custom" height="520" :source.prop=${mdSource()} :parse.prop=${parseMarkdown} :renderRight.prop=${renderWordBlock} left-label="Markdown" right-label="Word" @activate=${onCustomActivate}></elf-doc-sync>
        </div>
      </elf-playground>
      <elf-quote type="info" variant="soft" :compact.prop=${true}><p>${t("customStyleLead")}</p></elf-quote>
      <elf-code-card class="guide-code" variant="workbench" :items.prop=${standardItems()} :lineNumbers.prop=${false}></elf-code-card>
    </section>

    <section class="docs-section">
      <h2>${t("api")}</h2>
      <elf-props-table :title=${t("props")} :rows=${propsRows()} />
      <elf-props-table :title=${t("events")} :rows=${eventRows()} />
      <elf-props-table :title=${t("expose")} :rows=${exposeRows()} />
      <elf-props-table :title=${t("cssVars")} :rows=${cssVarRows()} />
    </section>
  </elf-container>
`);

export { PageLabsDocSync };
