// cspell:ignore shiki vitesse palenight

import { defineHtml, defineStyle, useRef } from "@elfui/core";

import type {
  CodeCardCodeTheme,
  CodeCardItem,
  CodeCardLabels,
  CodeCardLanguage,
  CodeCardTheme,
  CodeCardVariant,
} from "@elfui/kit/labs";
import "@elfui/kit/labs";
import type { SelectOption } from "@elfui/kit-src/components/Form/Select";
import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";
import styles from "./style.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "代码卡片", en: "Code Card" },
  description: {
    zh: "文件型代码卡片，支持多外观、代码组、区间聚焦、重点行、诊断与差异、格式化和折叠控制。",
    en: "A file-style code card with multiple shells, groups, range focus, highlights, diagnostics, diffs, formatting, and collapse controls.",
  },
  warning: {
    zh: "实验性 API：语言和主题集合可能随 Shiki 与 Prettier 的升级而调整。",
    en: "Experimental API: language and theme sets may evolve with Shiki and Prettier upgrades.",
  },
  workbench: { zh: "工具台", en: "Workbench" },
  window: { zh: "编辑器窗口", en: "Editor window" },
  minimal: { zh: "极简卡片", en: "Minimal card" },
  annotations: { zh: "诊断、差异与重点行", en: "Diagnostics, diffs, and highlights" },
  codeGroup: { zh: "代码组", en: "Code group" },
  controls: { zh: "配置代码卡片", en: "Configure code card" },
  variant: { zh: "卡片风格", en: "Card style" },
  surfaceTheme: { zh: "卡片主题", en: "Card theme" },
  codeTheme: { zh: "代码主题", en: "Code theme" },
  language: { zh: "语法高亮", en: "Syntax highlighting" },
  lineNumbers: { zh: "显示行号", en: "Show line numbers" },
  expanded: { zh: "展开代码", en: "Expand code" },
  automatic: { zh: "跟随页面", en: "Auto" },
  light: { zh: "浅色", en: "Light" },
  dark: { zh: "深色", en: "Dark" },
  copiedStatus: { zh: "代码已复制", en: "Code copied" },
  formattedStatus: { zh: "代码已格式化", en: "Code formatted" },
  switchedStatus: { zh: "已切换代码", en: "Code tab changed" },
  readyStatus: { zh: "可以操作", en: "Ready" },
  copy: { zh: "复制代码", en: "Copy code" },
  copied: { zh: "已复制", en: "Copied" },
  copyError: { zh: "复制失败", en: "Copy failed" },
  expandAction: { zh: "展开代码", en: "Expand code" },
  collapseAction: { zh: "折叠代码", en: "Collapse code" },
  format: { zh: "格式化代码", en: "Format code" },
  formatting: { zh: "正在格式化", en: "Formatting code" },
  formatError: { zh: "格式化失败", en: "Format failed" },
  showLines: { zh: "显示行号", en: "Show line numbers" },
  hideLines: { zh: "隐藏行号", en: "Hide line numbers" },
  codeGroupLabel: { zh: "代码文件", en: "Code files" },
  errorLine: { zh: "错误行", en: "Error line" },
  warningLine: { zh: "警告行", en: "Warning line" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  methods: { zh: "方法", en: "Methods" },
  codeProp: { zh: "单卡片模式的代码内容。", en: "Source used in single-card mode." },
  itemsProp: {
    zh: "代码组标签、源码、语言和逐行标记。",
    en: "Grouped tabs with source, language, and line annotations.",
  },
  variantProp: { zh: "工具台、窗口或极简外观。", en: "Workbench, window, or minimal shell." },
  themeProp: { zh: "卡片表面的明暗主题。", en: "Light or dark card surface scheme." },
  codeThemeProp: { zh: "Shiki 代码配色系列。", en: "Shiki syntax palette family." },
  languageProp: {
    zh: "高亮与格式化所使用的语言。",
    en: "Language used for highlighting and formatting.",
  },
  lineNumbersProp: {
    zh: "显示行号，并支持 v-model:line-numbers。",
    en: "Shows line numbers and supports v-model:line-numbers.",
  },
  expandedProp: {
    zh: "展开状态，并支持 v-model:expanded。",
    en: "Expanded state with v-model:expanded support.",
  },
  highlightedProp: {
    zh: "重点行；支持单行、[start, end] 与 { start, end }。",
    en: "Highlighted lines using singles, [start, end], or { start, end } ranges.",
  },
  focusedProp: {
    zh: "聚焦指定单行或区间并弱化其余代码。",
    en: "Focuses selected lines or ranges and dims the remaining source.",
  },
  focusRevealProp: {
    zh: "鼠标移入或键盘焦点进入卡片时，临时恢复弱化代码的清晰度。",
    en: "Temporarily reveals dimmed context while the card is hovered or contains keyboard focus.",
  },
  errorProp: {
    zh: "为指定单行或区间添加错误状态。",
    en: "Marks selected lines or ranges as errors.",
  },
  warningProp: {
    zh: "为指定单行或区间添加警告状态。",
    en: "Marks selected lines or ranges as warnings.",
  },
  diffProp: {
    zh: "为指定单行或区间添加新增或删除状态。",
    en: "Marks selected lines or ranges as added or removed.",
  },
  copyEvent: {
    zh: "复制成功后返回当前代码项。",
    en: "Returns the active item after a successful copy.",
  },
  formatEvent: {
    zh: "格式化后返回原始代码和新代码。",
    en: "Returns original and formatted source.",
  },
  tabEvent: { zh: "切换代码组标签时返回目标项。", en: "Returns the selected grouped-code item." },
  toggleEvent: { zh: "展开状态改变时返回布尔值。", en: "Returns the new expanded state." },
  copyMethod: {
    zh: "复制当前代码并返回是否成功。",
    en: "Copies the active source and reports success.",
  },
  formatMethod: {
    zh: "使用当前语言策略格式化代码。",
    en: "Formats source with the active language strategy.",
  },
  selectMethod: { zh: "按 key 切换代码组标签。", en: "Selects a grouped-code tab by key." },
  slots: { zh: "插槽", en: "Slots" },
  footerSlot: {
    zh: "可选页脚内容，用于代码说明、来源或作者信息；无内容时不占高度。",
    en: "Optional footer for notes, attribution, or author details; occupies no space when empty.",
  },
  footerNote: {
    zh: "示例：直接使用 ElfUI 按钮组件。",
    en: "Example: directly using the ElfUI Button component.",
  },
  footerAuthor: { zh: "作者 · ElfUI Team", en: "Author · ElfUI Team" },
});

const variant = useRef<CodeCardVariant>("workbench");
const surfaceTheme = useRef<CodeCardTheme>("auto");
const codeTheme = useRef<CodeCardCodeTheme>("github");
const language = useRef<CodeCardLanguage>("html");
const lineNumbers = useRef(true);
const expanded = useRef(true);
const groupKey = useRef("js");
const status = useRef("");

const variantOptions = (): SelectOption[] => [
  { value: "workbench", label: t("workbench") },
  { value: "window", label: t("window") },
  { value: "minimal", label: t("minimal") },
];
const surfaceThemeOptions = (): SelectOption[] => [
  { value: "auto", label: t("automatic") },
  { value: "light", label: t("light") },
  { value: "dark", label: t("dark") },
];
const codeThemeOptions: SelectOption[] = [
  { value: "github", label: "GitHub" },
  { value: "vitesse", label: "Vitesse" },
  { value: "material", label: "Material" },
];
const languageOptions: SelectOption[] = [
  { value: "vue", label: "Vue" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "scss", label: "SCSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
  { value: "plaintext", label: "Plain text" },
];
const lineNumberOptions = (): SelectOption[] => [
  { value: "visible", label: t("showLines") },
  { value: "hidden", label: t("hideLines") },
];
const expandedOptions = (): SelectOption[] => [
  { value: "expanded", label: t("expandAction") },
  { value: "collapsed", label: t("collapseAction") },
];

const sourceLines = (...lines: string[]): string => lines.join("\n");

const workbenchSource = sourceLines(
  '<script type="module">',
  'import "@elfui/kit";',
  "</script>",
  "",
  "<elf-button>Save</elf-button>",
);

const componentLabels = (): Partial<CodeCardLabels> => ({
  copy: t("copy"),
  copied: t("copied"),
  copyError: t("copyError"),
  expand: t("expandAction"),
  collapse: t("collapseAction"),
  format: t("format"),
  formatting: t("formatting"),
  formatError: t("formatError"),
  showLineNumbers: t("showLines"),
  hideLineNumbers: t("hideLines"),
  language: t("language"),
  codeGroup: t("codeGroupLabel"),
  errorLine: t("errorLine"),
  warningLine: t("warningLine"),
});

const selectValue = (event: CustomEvent): string => String(event.detail || "");
const onVariant = (event: CustomEvent): void => variant.set(selectValue(event) as CodeCardVariant);
const onSurfaceTheme = (event: CustomEvent): void =>
  surfaceTheme.set(selectValue(event) as CodeCardTheme);
const onCodeTheme = (event: CustomEvent): void =>
  codeTheme.set(selectValue(event) as CodeCardCodeTheme);
const onLanguageSelect = (event: CustomEvent): void =>
  language.set(selectValue(event) as CodeCardLanguage);
const onLanguage = (event: CustomEvent<CodeCardLanguage>): void => language.set(event.detail);
const onLineNumbers = (event: CustomEvent<boolean>): void => lineNumbers.set(event.detail);
const onExpanded = (event: CustomEvent<boolean>): void => expanded.set(event.detail);
const onLineNumbersSelect = (event: CustomEvent): void =>
  lineNumbers.set(selectValue(event) === "visible");
const onExpandedSelect = (event: CustomEvent): void =>
  expanded.set(selectValue(event) === "expanded");
const onGroupKey = (event: CustomEvent<string>): void => groupKey.set(event.detail);
const setCopiedStatus = (): void => status.set(t("copiedStatus"));
const setFormattedStatus = (): void => status.set(t("formattedStatus"));
const setSwitchedStatus = (): void => status.set(t("switchedStatus"));

const workbenchCode = (): string =>
  sourceLines(
    "<elf-code-card",
    '  filename="elfui-button.html"',
    '  :code="source"',
    '  language="html"',
    '  variant="workbench"',
    '  theme="auto"',
    '  code-theme="github"',
    "  line-numbers",
    "  collapsible",
    ">",
    '  <div slot="footer">',
    `    <span>${t("footerNote")}</span>`,
    `    <span>${t("footerAuthor")}</span>`,
    "  </div>",
    "</elf-code-card>",
  );
const workbenchScript = sourceLines(
  'import "@elfui/kit/labs";',
  "",
  `const source = \`${workbenchSource.replace(/`/g, "\\`")}\`;`,
  "",
  'const card = document.querySelector("elf-code-card");',
  "await card.format();",
);

const windowCode = sourceLines(
  "function greet(name) {",
  "  // Say hello",
  "  const message = `Hello, ${name}!`;",
  "  console.log(message);",
  "  return message;",
  "}",
  "",
  'greet("World");',
);

const windowUsage = sourceLines(
  "<elf-code-card",
  '  :code="source"',
  '  filename="example.js"',
  '  language="javascript"',
  '  variant="window"',
  '  theme="dark"',
  '  code-theme="material"',
  '  :focus-lines="[[2, 5]]"',
  "/>",
);

const focusCode = sourceLines(
  "export default {",
  "  data() {",
  "    return {",
  '      msg: "Focused!",',
  "    };",
  "  },",
  "};",
);

const focusUsage = sourceLines(
  "<elf-code-card",
  '  :code="source"',
  '  language="javascript"',
  '  variant="minimal"',
  '  :line-numbers="false"',
  '  :focus-lines="[{ start: 4, end: 4 }]"',
  "  focus-reveal-on-hover",
  "/>",
);

const diffCode = sourceLines(
  "export default {",
  "  data() {",
  "    return {",
  '      error: "Error",',
  '      warning: "Warning",',
  '      removed: "Removed",',
  '      added: "Added",',
  '      mode: "Highlighted",',
  "    };",
  "  },",
  "};",
);

const annotationsUsage = sourceLines(
  "<elf-code-card",
  '  :code="source"',
  '  variant="minimal"',
  '  :line-numbers="false"',
  '  :error-lines="[4]"',
  '  :warning-lines="[[5, 5]]"',
  '  :highlight-lines="[{ start: 8, end: 8 }]"',
  '  :diff-lines="[',
  "    { line: 6, kind: 'remove' },",
  "    { line: 7, kind: 'add' },",
  '  ]"',
  "/>",
);

const groupUsage = sourceLines(
  "<elf-code-card",
  '  :items="codeItems"',
  '  active-key="js"',
  '  variant="minimal"',
  "/>",
);

const groupItems = (): CodeCardItem[] => [
  {
    key: "js",
    label: "config.js",
    filename: "config.js",
    language: "javascript",
    code: sourceLines(
      '/** @type {import("vitepress").UserConfig} */',
      "const config = {",
      "  // ...",
      "};",
      "",
      "export default config;",
    ),
    highlightLines: [[2, 4]],
  },
  {
    key: "ts",
    label: "config.ts",
    filename: "config.ts",
    language: "typescript",
    code: sourceLines(
      'import { defineConfig } from "vitepress";',
      "",
      "export default defineConfig({",
      '  title: "ElfUI Kit",',
      "});",
    ),
    focusLines: [[3, 5]],
  },
];

const propRows = () => [
  { name: "code", type: "string", default: "''", desc: t("codeProp") },
  { name: "items", type: "CodeCardItem[]", default: "[]", desc: t("itemsProp") },
  {
    name: "variant",
    type: "'workbench' | 'window' | 'minimal'",
    default: "'workbench'",
    desc: t("variantProp"),
  },
  { name: "theme", type: "'auto' | 'light' | 'dark'", default: "'auto'", desc: t("themeProp") },
  {
    name: "code-theme",
    type: "'github' | 'vitesse' | 'material'",
    default: "'github'",
    desc: t("codeThemeProp"),
  },
  { name: "language", type: "CodeCardLanguage", default: "'javascript'", desc: t("languageProp") },
  { name: "line-numbers", type: "boolean", default: "true", desc: t("lineNumbersProp") },
  { name: "expanded", type: "boolean", default: "true", desc: t("expandedProp") },
  {
    name: "highlight-lines",
    type: "CodeCardLineSelection[]",
    default: "[]",
    desc: t("highlightedProp"),
  },
  {
    name: "focus-lines",
    type: "CodeCardLineSelection[]",
    default: "[]",
    desc: t("focusedProp"),
  },
  {
    name: "focus-reveal-on-hover",
    type: "boolean",
    default: "true",
    desc: t("focusRevealProp"),
  },
  { name: "error-lines", type: "CodeCardLineSelection[]", default: "[]", desc: t("errorProp") },
  {
    name: "warning-lines",
    type: "CodeCardLineSelection[]",
    default: "[]",
    desc: t("warningProp"),
  },
  { name: "diff-lines", type: "CodeCardDiffLine[]", default: "[]", desc: t("diffProp") },
];

const eventRows = () => [
  { name: "copy", type: "CustomEvent<CodeCardItemDetail>", default: "-", desc: t("copyEvent") },
  {
    name: "format",
    type: "CustomEvent<CodeCardFormatDetail>",
    default: "-",
    desc: t("formatEvent"),
  },
  {
    name: "tab-change",
    type: "CustomEvent<CodeCardItemDetail>",
    default: "-",
    desc: t("tabEvent"),
  },
  { name: "toggle", type: "CustomEvent<boolean>", default: "-", desc: t("toggleEvent") },
];

const methodRows = () => [
  { name: "copy()", type: "Promise<boolean>", default: "-", desc: t("copyMethod") },
  { name: "format()", type: "Promise<string>", default: "-", desc: t("formatMethod") },
  { name: "select(key)", type: "void", default: "-", desc: t("selectMethod") },
];

const slotRows = () => [{ name: "footer", type: "slot", default: "-", desc: t("footerSlot") }];

defineStyle(articleStyles, styles);

const PageLabsCodeCard = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="CodeCard" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>

    <elf-playground class="code-card-workbench" :title=${t("workbench")} :code=${workbenchCode()} :script=${workbenchScript}>
      <span slot="status" role="status" aria-live="polite">${status.value || t("readyStatus")}</span>
      <div class="code-card-stage is-narrow">
        <elf-code-card
          :code.prop="workbenchSource"
          filename="elfui-button.html"
          :variant.prop=${variant.value}
          :theme.prop=${surfaceTheme.value}
          :codeTheme.prop=${codeTheme.value}
          :language.prop=${language.value}
          :lineNumbers.prop=${lineNumbers.value}
          :expanded.prop=${expanded.value}
          :labels.prop=${componentLabels()}
          :ariaLabel.prop=${t("workbench")}
          @update:language=${onLanguage}
          @update:lineNumbers=${onLineNumbers}
          @update:expanded=${onExpanded}
          @copy=${setCopiedStatus}
          @format=${setFormattedStatus}
        >
          <div slot="footer" class="code-card-footer-demo">
            <span>${t("footerNote")}</span>
            <span class="code-card-footer-author">${t("footerAuthor")}</span>
          </div>
        </elf-code-card>
      </div>
      <aside slot="controls" class="code-card-controls" :aria-label=${t("controls")}>
        <strong>${t("controls")}</strong>
        <label>
          <span>${t("variant")}</span>
          <elf-select :options.prop=${variantOptions()} :modelValue.prop=${variant.value} @update:modelValue=${onVariant}></elf-select>
        </label>
        <label>
          <span>${t("surfaceTheme")}</span>
          <elf-select :options.prop=${surfaceThemeOptions()} :modelValue.prop=${surfaceTheme.value} @update:modelValue=${onSurfaceTheme}></elf-select>
        </label>
        <label>
          <span>${t("codeTheme")}</span>
          <elf-select :options.prop=${codeThemeOptions} :modelValue.prop=${codeTheme.value} @update:modelValue=${onCodeTheme}></elf-select>
        </label>
        <label>
          <span>${t("language")}</span>
          <elf-select :options.prop=${languageOptions} :modelValue.prop=${language.value} @update:modelValue=${onLanguageSelect}></elf-select>
        </label>
        <label>
          <span>${t("lineNumbers")}</span>
          <elf-select :options.prop=${lineNumberOptions()} :modelValue.prop=${lineNumbers.value ? "visible" : "hidden"} @update:modelValue=${onLineNumbersSelect}></elf-select>
        </label>
        <label>
          <span>${t("expanded")}</span>
          <elf-select :options.prop=${expandedOptions()} :modelValue.prop=${expanded.value ? "expanded" : "collapsed"} @update:modelValue=${onExpandedSelect}></elf-select>
        </label>
      </aside>
    </elf-playground>

    <elf-playground :title=${t("window")} :code=${windowUsage}>
      <div class="code-card-stage is-narrow">
        <elf-code-card
          :code.prop=${windowCode}
          filename="example.js"
          language="javascript"
          variant="window"
          theme="dark"
          code-theme="material"
          :focusLines.prop=${[[2, 5]]}
          :labels.prop=${componentLabels()}
          :ariaLabel.prop=${t("window")}
        ></elf-code-card>
      </div>
    </elf-playground>

    <elf-playground :title=${t("minimal")} :code=${focusUsage}>
      <div class="code-card-stage">
        <elf-code-card
          :code.prop=${focusCode}
          filename="focus-example.js"
          language="javascript"
          variant="minimal"
          :lineNumbers.prop=${false}
          code-theme="github"
          :focusLines.prop=${[4]}
          :focusRevealOnHover.prop=${true}
          :labels.prop=${componentLabels()}
          :ariaLabel.prop=${t("minimal")}
        ></elf-code-card>
      </div>
    </elf-playground>

    <elf-playground :title=${t("annotations")} :code=${annotationsUsage}>
      <div class="code-card-stage">
        <elf-code-card
          :code.prop=${diffCode}
          filename="message.js"
          language="javascript"
          variant="minimal"
          :lineNumbers.prop=${false}
          :errorLines.prop=${[4]}
          :warningLines.prop=${[[5, 5]]}
          :highlightLines.prop=${[{ start: 8, end: 8 }]}
          :diffLines.prop=${[
            { line: 6, kind: "remove" },
            { line: 7, kind: "add" },
          ]}
          :labels.prop=${componentLabels()}
          :ariaLabel.prop=${t("annotations")}
        ></elf-code-card>
      </div>
    </elf-playground>

    <elf-playground :title=${t("codeGroup")} :code=${groupUsage}>
      <span slot="status" role="status" aria-live="polite">${t("language")}: ${groupKey.value.toUpperCase()}</span>
      <div class="code-card-stage">
        <elf-code-card
          :items.prop=${groupItems()}
          :activeKey.prop=${groupKey.value}
          variant="minimal"
          :labels.prop=${componentLabels()}
          :ariaLabel.prop=${t("codeGroup")}
          @update:activeKey=${onGroupKey}
          @tab-change=${setSwitchedStatus}
        ></elf-code-card>
      </div>
    </elf-playground>

    <section class="docs-section">
      <h2>${t("api")}</h2>
      <elf-props-table :title=${t("props")} :rows=${propRows()}></elf-props-table>
    </section>
    <section class="docs-section">
      <elf-props-table :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    </section>
    <section class="docs-section">
      <elf-props-table :title=${t("methods")} :rows=${methodRows()}></elf-props-table>
    </section>
    <section class="docs-section">
      <elf-props-table :title=${t("slots")} :rows=${slotRows()}></elf-props-table>
    </section>
  </elf-container>
`);

export { PageLabsCodeCard };
