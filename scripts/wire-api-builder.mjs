// 一次性迁移工具：为所有组件文档页的 API 表接入 elf-api-builder。
//
// 规则：
// - 按页面目录映射主组件标签；
// - 每张 elf-props-table 根据标题/翻译键推断 role（props/events/slots/methods）；
// - 子组件表（如 elf-checkbox-group、elf-form-item）通过 component 属性归组；
// - Parts/Service/Directive/FormRule/函数式 API 等非元素表不参与勾选；
// - Message/Notification/MessageBox 为纯函数式服务页，保持原样。

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const pagesRoot = resolve("apps/website/src/pages");

const PAGE_TAGS = {
  "basic/AvatarPage": "elf-avatar",
  "basic/BadgePage": "elf-badge",
  "basic/ButtonPage": "elf-button",
  "basic/TagPage": "elf-tag",
  "basic/TextPage": "elf-text",
  "data/CarouselPage": "elf-carousel",
  "data/CollapsePage": "elf-collapse",
  "data/DescriptionsPage": "elf-descriptions",
  "data/DividerPage": "elf-divider",
  "data/EmptyPage": "elf-empty",
  "data/ImagePage": "elf-image",
  "data/InfiniteScrollPage": "elf-infinite-scroll",
  "data/ListPage": "elf-list",
  "data/PaginationPage": "elf-pagination",
  "data/ParallaxPage": "elf-parallax",
  "data/ProgressPage": "elf-progress",
  "data/ResultPage": "elf-result",
  "data/SkeletonPage": "elf-skeleton",
  "data/StatisticPage": "elf-statistic",
  "data/TablePage": "elf-table",
  "data/TimelinePage": "elf-timeline",
  "data/TransferPage": "elf-transfer",
  "data/TreePage": "elf-tree",
  "data/VirtualTablePage": "elf-table-v2",
  "data/WatermarkPage": "elf-watermark",
  "feedback/AlertPage": "elf-alert",
  "feedback/DialogPage": "elf-dialog",
  "feedback/DrawerPage": "elf-drawer",
  "feedback/LoadingPage": "elf-loading",
  "feedback/PopConfirmPage": "elf-pop-confirm",
  "feedback/TooltipPage": "elf-tooltip",
  "feedback/TourPage": "elf-tour",
  "form/AutocompletePage": "elf-autocomplete",
  "form/CascaderPage": "elf-cascader",
  "form/CheckboxPage": "elf-checkbox",
  "form/FormPage": "elf-form",
  "form/InputNumberPage": "elf-input-number",
  "form/InputOtpPage": "elf-input-otp",
  "form/InputPage": "elf-input",
  "form/InputTagPage": "elf-input-tag",
  "form/MentionPage": "elf-mention",
  "form/RadioPage": "elf-radio",
  "form/SegmentedPage": "elf-segmented",
  "form/SelectPage": "elf-select",
  "form/SliderPage": "elf-slider",
  "form/SwitchPage": "elf-switch",
  "form/TextareaPage": "elf-textarea",
  "form/TreeSelectPage": "elf-tree-select",
  "layout/FlexPage": "elf-flex",
  "layout/GridPage": "elf-grid",
  "layout/LayoutShellPage": "elf-layout",
  "layout/ScrollbarPage": "elf-scrollbar",
  "layout/SplitterPage": "elf-splitter",
  "layout/StickyPage": "elf-sticky",
  "navigation/AnchorPage": "elf-anchor",
  "navigation/BackTopPage": "elf-back-top",
  "navigation/BreadcrumbPage": "elf-breadcrumb",
  "navigation/MenuPage": "elf-menu",
  "navigation/StepsPage": "elf-steps",
  "navigation/TabsPage": "elf-tabs",
  "picker/CalendarPage": "elf-calendar",
  "picker/DatePickerPage": "elf-date-picker",
  "picker/DateTimePickerPage": "elf-date-time-picker",
  "picker/TimePickerPage": "elf-time-picker",
  "picker/TimeSelectPage": "elf-time-select",
};

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

// 内联 API 表页面（表格直接写在 index.ts 中，没有 props.ts）
const INLINE_PAGE_TAGS = {
  "basic/IconPage": "elf-icon",
  "basic/LinkPage": "elf-link",
  "basic/QuotePage": "elf-quote",
  "data/SparklinePage": "elf-sparkline",
  "data/VirtualListPage": "elf-virtual-list",
  "form/RatePage": "elf-rate",
  "form/UploadPage": "elf-upload",
  "layout/MasonryPage": "elf-masonry",
  "layout/ToolbarPage": "elf-toolbar",
  "navigation/AppBarPage": "elf-app-bar",
  "navigation/BottomNavigationPage": "elf-bottom-navigation",
  "navigation/DropdownPage": "elf-dropdown",
  "navigation/FooterPage": "elf-footer",
  "navigation/PageHeaderPage": "elf-page-header",
  "picker/ColorPickerPage": "elf-color-picker",
  "providers/ConfigProviderPage": "elf-config-provider",
  "providers/DefaultsProviderPage": "elf-defaults-provider",
  "providers/LocaleProviderPage": "elf-locale-provider",
  "providers/ThemeProviderPage": "elf-theme-provider",
  "labs/AiApprovalPage": "elf-ai-approval-card",
  "labs/AiChatPage": "elf-ai-chat",
  "labs/AiCodeBlockPage": "elf-ai-code-block",
  "labs/AiCommandSearchPage": "elf-ai-command-search",
  "labs/AiContextCardPage": "elf-ai-context-card",
  "labs/AiDiffTablePage": "elf-ai-diff-table",
  "labs/AiFilterTablePage": "elf-ai-filter-table",
  "labs/AiFineTunePage": "elf-ai-fine-tune-card",
  "labs/AiInsightCardPage": "elf-ai-insight-card",
  "labs/AiLoadingPage": "elf-ai-loading",
  "labs/AiRecommendationPage": "elf-ai-recommendation-card",
  "labs/AiRecordsTablePage": "elf-ai-records-table",
  "labs/AiSidebarNavPage": "elf-ai-sidebar-nav",
  "labs/AiStreamingTextPage": "elf-ai-streaming-text",
  "labs/AiTaskRowPage": "elf-ai-task-row",
  "labs/AiThinkingPage": "elf-ai-thinking",
  "labs/AiToolChipsPage": "elf-ai-tool-chips",
  "labs/ChatComposerPage": "elf-chat-composer",
  "labs/ChatMessagePage": "elf-chat-message",
  "labs/ChatToolCallPage": "elf-chat-tool-call",
  "labs/CodeCardPage": "elf-code-card",
  "labs/DocSyncPage": "elf-doc-sync",
  "labs/HeatmapPage": "elf-heatmap",
  "labs/MdPagePage": "elf-md-page",
  "labs/VideoPage": "elf-video",
};

const KEY_ROLES = {
  props: "props",
  events: "events",
  slots: "slots",
  methods: "methods",
  exposes: "methods",
  expose: "methods",
  itemProps: "props",
  itemSlots: "slots",
  itemExposes: "methods",
  groupProps: "props",
  collapseProps: "props",
  collapseEvents: "events",
  panel: "props",
  iconProps: "props",
  providerProps: "props",
  slotsLabel: "slots",
  outlineProps: "props",
  outlineEvents: "events",
  outlineMethods: "methods",
};

const SKIP_KEYS = new Set([
  "column",
  "directives",
  "functionApi",
  "options",
  "api",
  "contract",
  "cssVars",
]);

const KEY_COMPONENTS = {
  "basic/AvatarPage": { groupProps: "elf-avatar-group" },
  "data/CarouselPage": { itemProps: "elf-carousel-item" },
  "data/CollapsePage": {
    itemProps: "elf-collapse-item",
    itemSlots: "elf-collapse-item",
    itemExposes: "elf-collapse-item",
  },
  "data/DescriptionsPage": {
    itemProps: "elf-descriptions-item",
    itemSlots: "elf-descriptions-item",
  },
  "data/ListPage": { itemProps: "elf-list-item" },
  "form/CascaderPage": { panel: "elf-cascader-panel" },
  "basic/IconPage": { providerProps: "elf-icon-provider" },
  "labs/MdPagePage": {
    outlineProps: "elf-md-outline",
    outlineEvents: "elf-md-outline",
    outlineMethods: "elf-md-outline",
  },
};

const TITLE_ROLES = [
  [/\bprops\b/i, "props"],
  [/\bevents\b/i, "events"],
  [/\bslots\b/i, "slots"],
  [/\b(?:expose|methods)\b/i, "methods"],
];

const SKIP_TITLES = [
  /\bparts\b/i,
  /^service$/i,
  /^directive$/i,
  /\bformrule\b/i,
  /\boptions\b/i,
  /^timelineitem$/i,
  /^tourstep$/i,
  /config$/i,
  /context$/i,
];

const TITLE_ROLE_OVERRIDES = {
  "MenuItemGroup API": "props",
};

const TITLE_COMPONENTS = {
  "data/StatisticPage": [["Countdown", "elf-countdown"]],
  "form/FormPage": [
    ["elf-form-item", "elf-form-item"],
    ["elf-form", "elf-form"],
  ],
  "navigation/MenuPage": [
    ["MenuItem Props / Events", "elf-menu-item"],
    ["MenuItemGroup", "elf-menu-item-group"],
    ["SubMenu", "elf-sub-menu"],
  ],
  "navigation/StepsPage": [["StepItem", "elf-step"]],
  "navigation/BreadcrumbPage": [["BreadcrumbItem", "elf-breadcrumb-item"]],
  "navigation/AnchorPage": [["AnchorLink", "elf-anchor-link"]],
  "navigation/DropdownPage": [["DropdownItem", "elf-dropdown-item"]],
};

const TABLE_RE = /<\s*elf-props-table\b([^>]*?)(\/?>)/g;
const TEMPLATE_RE = /(defineHtml\([\s\S]*?`)([\s\S]*)`([\s\S]*)$/;

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry === "props.ts" || entry === "index.ts") out.push(full);
  }
  return out;
};

const classify = (page, titleExpr, existingRole) => {
  if (existingRole) return { role: existingRole, component: null, skip: false };

  const keyMatch = titleExpr.match(/^t\("([^"]+)"\)$/);
  if (keyMatch) {
    const key = keyMatch[1];
    if (SKIP_KEYS.has(key)) return { skip: true };
    const role = KEY_ROLES[key];
    if (!role) return { skip: true };
    return { role, component: KEY_COMPONENTS[page]?.[key] ?? null, skip: false };
  }

  const title = titleExpr.replace(/^"|"$/g, "");
  if (SKIP_TITLES.some((re) => re.test(title))) return { skip: true };

  let role = TITLE_ROLE_OVERRIDES[title] ?? null;
  if (!role) role = TITLE_ROLES.find(([re]) => re.test(title))?.[1] ?? null;
  if (!role && /^elf-/.test(title)) role = "props";
  if (!role) return { skip: true };

  let component = null;
  if (/^elf-/.test(title)) {
    component = title.split(/\s/)[0];
  } else {
    const match = (TITLE_COMPONENTS[page] ?? []).find(([needle]) => title.includes(needle));
    component = match?.[1] ?? null;
  }
  return { role, component, skip: false };
};

const transform = (file) => {
  const fileName = file.split(/[\\/]/).pop();
  const isProps = fileName === "props.ts";
  const page = relative(pagesRoot, file)
    .replace(/\\/g, "/")
    .replace(/\/[^/]+$/, "");
  if (SKIP_PAGES.has(page)) return null;
  const src = readFileSync(file, "utf8");
  if (src.includes("<elf-api-builder")) return null;
  const mainTag = isProps ? PAGE_TAGS[page] : INLINE_PAGE_TAGS[page];
  if (!mainTag) return null;

  const match = TEMPLATE_RE.exec(src);
  if (!match) throw new Error(`No template found in ${file}`);

  const [, prefix, template, suffix] = match;
  const infos = [];
  for (const tableMatch of template.matchAll(TABLE_RE)) {
    const attrs = tableMatch[1];
    const titleExpr =
      attrs.match(/:title=\$\{([^}]+)\}/)?.[1] ?? attrs.match(/title="([^"]*)"/)?.[1] ?? "";
    const existingRole = attrs.match(/role="([^"]*)"/)?.[1] ?? "";
    infos.push(classify(page, titleExpr, existingRole));
  }
  if (infos.length === 0) throw new Error(`No tables found in ${file}`);
  if (infos.every((info) => info.skip)) return null;

  let index = 0;
  const newTemplate = template
    .replace(TABLE_RE, (full, attrs, closer) => {
      const info = infos[index++] ?? { skip: true };
      let extra = "";
      if (!info.skip) {
        extra = ` role="${info.role}"`;
        if (info.component && info.component !== mainTag) {
          extra += ` component="${info.component}"`;
        }
      }
      return `<elf-props-table${extra}${attrs}${closer}`;
    })
    .replace(
      isProps ? /<h2[^>]*>[\s\S]*?<\/h2>/ : /<h2[^>]*>\s*(?:API|\$\{t\("api"\)\})\s*<\/h2>/,
      `<elf-api-builder component="${mainTag}" title="API">`,
    );

  // 精确找到最后一张表结束位置（自闭合或配对）
  let insertAt = -1;
  for (const tableMatch of newTemplate.matchAll(TABLE_RE)) {
    let end = tableMatch.index + tableMatch[0].length;
    if (!tableMatch[2].includes("/")) {
      const close = newTemplate.indexOf("</elf-props-table>", end);
      if (close >= 0) end = close + "</elf-props-table>".length;
    }
    insertAt = Math.max(insertAt, end);
  }
  if (insertAt < 0) throw new Error(`Cannot find table end in ${file}`);
  const wrapped =
    newTemplate.slice(0, insertAt) + "\n  </elf-api-builder>" + newTemplate.slice(insertAt);

  const newSrc =
    src.slice(0, match.index) +
    prefix +
    wrapped +
    "`" +
    suffix +
    src.slice(match.index + match[0].length);
  writeFileSync(file, newSrc);
  return { page, mainTag, tables: infos };
};

const files = walk(pagesRoot);
const changed = [];
const skipped = [];
for (const file of files) {
  const result = transform(file);
  if (result) changed.push(result);
  else skipped.push(relative(pagesRoot, file));
}

console.log(`Wired elf-api-builder into ${changed.length} pages.`);
for (const item of changed) {
  const roles = item.tables.map((info) =>
    info.skip ? "-" : `${info.role}${info.component ? `:${info.component}` : ""}`,
  );
  console.log(`  ${item.page} (${item.mainTag}) :: ${roles.join(", ")}`);
}
console.log(`Skipped ${skipped.length} pages: ${skipped.join(", ")}`);
