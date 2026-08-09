import { defineHtml, defineStyle, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "实验室组件", en: "Labs component" },
  title: { zh: "AI Sidebar Nav 侧栏导航", en: "AI Sidebar Nav" },
  description: {
    zh: "Agent 工作区侧栏：身份区、快捷搜索、分组导航与 New task，activeKey 由父级控制。",
    en: "Agent workspace sidebar with identity, quick search, grouped navigation, and New task; activeKey stays parent-owned.",
  },
  warning: {
    zh: "实验性 API：导航模型可能在稳定版前调整。",
    en: "Experimental API: the navigation model may change before stabilization.",
  },
  demo: { zh: "工作区侧栏", en: "Workspace sidebar" },

  status: { zh: "状态", en: "Status" },
  lastItem: { zh: "最近选择", en: "Last selected" },
  none: { zh: "无", en: "None" },
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  events: { zh: "事件", en: "Events" },
  expose: { zh: "方法", en: "Methods" },
  workspaceDesc: {
    zh: "工作区身份（name / subtitle / avatar）。",
    en: "Workspace identity with name, subtitle, and avatar.",
  },
  sectionsDesc: { zh: "分组导航（label + items）。", en: "Grouped sections with items." },
  activeKeyDesc: { zh: "当前高亮项的 key。", en: "Key of the highlighted item." },
  labelsDesc: { zh: "文案覆盖。", en: "Label overrides." },
  ariaLabelDesc: { zh: "无障碍标签。", en: "Accessible label." },
  selectEvent: { zh: "选择某个导航项。", en: "A navigation item is selected." },
  newTaskEvent: { zh: "点击 New task。", en: "New task is requested." },
  queryEvent: { zh: "搜索词变化。", en: "The search query changes." },
  focusMethod: { zh: "聚焦搜索框。", en: "Focuses the search input." },
  clearMethod: { zh: "清空搜索。", en: "Clears the search query." },
  getMethod: { zh: "返回搜索词。", en: "Returns the search query." },
});

const lastItem = useRef("");
const onSelectItem = (event: CustomEvent<{ label: string }>): void => {
  lastItem.set(event.detail.label);
};
const sidebarWorkspace = { name: "Creamery Ops", subtitle: "Production Workspace", avatar: "C" };
const sidebarSections = [
  {
    label: "Workspace",
    items: [
      { key: "home", label: "Home" },
      { key: "tasks", label: "Agent tasks", badge: 4 },
      { key: "inbox", label: "Inbox" },
    ],
  },
  {
    label: "Objects",
    items: [
      { key: "suppliers", label: "Suppliers" },
      { key: "inventory", label: "Inventory" },
    ],
  },
];

const code = `<elf-ai-sidebar-nav
  :workspace="workspace"
  :sections="sections"
  active-key="home"
  @select="onSelect"
  @new-task="onNewTask"
/>`;
const script = `const workspace = { name: "Creamery Ops", subtitle: "Production Workspace" };
const sections = [
  { label: "Workspace", items: [{ key: "home", label: "Home" }] },
];
const onSelect = (event) => console.log(event.detail);`;

const propRows = () => [
  { name: "workspace", type: "AiSidebarWorkspace", default: "{}", desc: t("workspaceDesc") },
  { name: "sections", type: "AiSidebarSection[]", default: "[]", desc: t("sectionsDesc") },
  { name: "active-key", type: "string", default: "''", desc: t("activeKeyDesc") },
  {
    name: "new-task-label",
    type: "string",
    default: "''",
    desc: t("labelsDesc"),
  },
  {
    name: "search-placeholder",
    type: "string",
    default: "''",
    desc: t("labelsDesc"),
  },
  { name: "show-search", type: "boolean", default: "true", desc: t("labelsDesc") },
  { name: "show-new-task", type: "boolean", default: "true", desc: t("labelsDesc") },
  { name: "labels", type: "Partial<AiSidebarNavLabels>", default: "{}", desc: t("labelsDesc") },
  { name: "aria-label", type: "string", default: "''", desc: t("ariaLabelDesc") },
];

const eventRows = () => [
  { name: "select", type: "CustomEvent<AiSidebarItem>", default: "—", desc: t("selectEvent") },
  { name: "new-task", type: "CustomEvent<void>", default: "—", desc: t("newTaskEvent") },
  { name: "query-change", type: "CustomEvent<string>", default: "—", desc: t("queryEvent") },
];

const exposeRows = () => [
  { name: "focusSearch", desc: t("focusMethod") },
  { name: "clearSearch", desc: t("clearMethod") },
  { name: "getQuery", desc: t("getMethod") },
];

defineStyle(
  articleStyles,
  `
  .ai-sidebar-stage { width: min(100%, 320px); }
  .ai-sidebar-note {
    margin: 10px 0 0;
    color: var(--elf-text-secondary, #64748b);
    font-size: 12.5px;
  }
  `,
);

const PageLabsAiSidebarNav = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="labs" tag="AI Sidebar Nav" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <p class="docs-callout is-warning labs-warning">${t("warning")}</p>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status">${t("lastItem")}: ${lastItem || t("none")}</span>
      <div class="ai-sidebar-stage">
        <elf-ai-sidebar-nav
          :workspace=${sidebarWorkspace}
          :sections=${sidebarSections}
          active-key="home"
          @select=${onSelectItem}
        ></elf-ai-sidebar-nav>
      </div>
    </elf-playground>
    <elf-api-builder component="elf-ai-sidebar-nav" title="API">
    <elf-props-table role="props" :title=${t("props")} :rows=${propRows()}></elf-props-table>
    <elf-props-table role="events" :title=${t("events")} :rows=${eventRows()}></elf-props-table>
    <elf-props-table role="methods" :title=${t("expose")} :rows=${exposeRows()}></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageLabsAiSidebarNav };
