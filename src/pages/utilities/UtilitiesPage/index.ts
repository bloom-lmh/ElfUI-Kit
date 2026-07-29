import { defineHtml, defineStyle, useComponents, useRef } from "@elfui/core";

import utilityStyles from "../../../styles/utilities.scss?inline";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";
import { createUtilityCatalog, type UtilityCategory, type UtilityKey } from "./catalog";
import { PageUtilitiesDraggable } from "./draggable-demo";

const t = createDocsTranslator({
  title: { zh: "工具类", en: "Utilities" },
  preview: { zh: "预览", en: "preview" },
  borderRegion: { zh: "边框定义内容区域", en: "Borders define the content region" },
  skip: { zh: "跳到主要内容", en: "Skip to main content" },
  accessibleContent: { zh: "无障碍内容", en: "Accessible content" },
  focusSkip: { zh: "按 Tab 可聚焦跳转链接", en: "Press Tab to focus the skip link" },
  baseAction: { zh: "底层操作按钮", en: "Underlying action button" },
  overlay: { zh: "覆盖层", en: "Overlay" },
  floatedContent: { zh: "浮动内容", en: "Floated content" },
  clearfixDescription: { zh: "clearfix 让容器正确包住内部浮动元素。", en: "clearfix makes the container wrap its floated children correctly." },
  objectFitAlt: { zh: "内容适配示意图", en: "Content fitting illustration" },
  purpose: { zh: "用途", en: "Purpose" },
  dragCard: { zh: "拖动卡片", en: "Drag card" },
  openDetails: { zh: "打开详情", en: "Open details" },
  phone: { zh: "手机", en: "Phone" },
  target: { zh: "目标", en: "Target" },
  responsive: { zh: "响应式", en: "Responsive" },
  desktop: { zh: "桌面端", en: "Desktop" },
  conditionalContent: { zh: "条件内容", en: "Conditional content" },
  currentViewport: { zh: "当前浏览器视口", en: "Current browser viewport" },
  screen: { zh: "屏幕", en: "Screen" },
  invoice: { zh: "发票 #024", en: "Invoice #024" },
  browserPreview: { zh: "普通浏览器预览", en: "Regular browser preview" },
  print: { zh: "打印", en: "Print" },
  printApplied: { zh: "打印 / PDF 时应用", en: "Applied during print / PDF export" },
  backlog: { zh: "待办", en: "Backlog" },
  inProgress: { zh: "进行中", en: "In progress" },
  released: { zh: "已发布", en: "Released" },
  editorialTitle: { zh: "构建更平静的界面", en: "Building calmer interfaces" },
  editorialDescription: { zh: "这个示例展示编辑内容如何环绕浮动图片，同时保持自然阅读顺序。", en: "A focused example shows how editorial content wraps around a floated visual while the reading flow stays intact." },
  buildQueued: { zh: "构建已排队", en: "Build queued" },
  deploying: { zh: "正在部署生产环境", en: "Deploying production" },
  verification: { zh: "验证", en: "Verification" },
  compiled: { zh: "组件编译完成", en: "components compiled" },
  typesGenerated: { zh: "类型生成完成", en: "types generated" },
  publishing: { zh: "正在发布包含超长状态文本的候选版本", en: "publishing release candidate with a deliberately long status line" },
  designReview: { zh: "设计评审", en: "Design review" },
  unreadComments: { zh: "8 条未读评论", en: "8 unread comments" },
  responsivePanel: { zh: "响应式面板", en: "Responsive panel" },
  marginArea: { zh: "外边距区域", en: "margin area" },
  paddingArea: { zh: "内边距区域", en: "padding area" },
  content: { zh: "内容", en: "content" },
  typographyTitle: { zh: "清晰地设计", en: "Designing with clarity" },
  typographyDescription: { zh: "排版在装饰介入之前建立信息层级。", en: "Typography builds hierarchy before decoration enters the page." },
  configuration: { zh: "配置", en: "Configuration" },
  category: { zh: "分类", en: "Category" },
  utilityClass: { zh: "工具类", en: "Utility class" },
  responsivePrefix: { zh: "支持响应式断点前缀", en: "Supports responsive breakpoint prefixes" },
  reset: { zh: "重置", en: "Reset" }
});
const pick = createDocsPicker();
const CATALOG = createUtilityCatalog(pick);

useComponents({
  "page-utilities-draggable": PageUtilitiesDraggable
});

interface UtilityEntry {
  key: UtilityKey;
  category: UtilityCategory;
}

interface UtilityLabState {
  groupIndex: number;
  selectedClass: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const entries = Object.entries(CATALOG).map(([key, category]) => ({
  key: key as UtilityKey,
  category
})) as UtilityEntry[];

const defaultState = (category: UtilityCategory): UtilityLabState => ({
  groupIndex: 0,
  selectedClass: category.groups[0]?.examples[0] ?? ""
});

const createInitialLabs = (): Record<UtilityKey, UtilityLabState> =>
  Object.fromEntries(entries.map(({ key, category }) => [key, defaultState(category)])) as Record<UtilityKey, UtilityLabState>;

const labs = useRef<Record<UtilityKey, UtilityLabState>>(createInitialLabs());

const labState = (key: UtilityKey): UtilityLabState => labs.value[key];

const selectedClass = (key: UtilityKey): string => labState(key).selectedClass;

const isGroup = (key: UtilityKey, index: number): boolean => labState(key).groupIndex === index;

const isSelected = (key: UtilityKey, className: string): boolean => selectedClass(key) === className;

const floatContainerClass = (): string => selectedClass("float") === "clearfix" ? "clearfix" : "";

const floatMediaClass = (): string => selectedClass("float") === "clearfix" ? "float-start" : selectedClass("float");

const positionBadgeClasses = (): string[] => [
  "position-badge",
  isGroup("position", 1) ? "position-absolute" : "",
  selectedClass("position")
];

const contentExplanation = (): string => [
  pick("无障碍类把跳转链接或补充说明留给屏幕阅读器，并可在键盘聚焦时显示。", "Accessibility classes preserve skip links or supplemental descriptions for screen readers and can reveal them on keyboard focus."),
  pick("指针事件类决定覆盖层是否拦截鼠标；pass-through 适合可穿透遮罩。", "Pointer-event classes determine whether an overlay intercepts the pointer; pass-through is suited to transparent masks."),
  pick("内容适配类控制图片裁切或完整显示；clearfix 用于包住浮动内容。", "Content-fitting classes crop or fully display images; clearfix wraps floated content.")
][labState("content").groupIndex] ?? "";

const displayExplanation = (): string => [
  pick("Display 类切换元素的布局类型，并可从指定响应式断点开始生效。", "Display classes switch an element's layout type and can apply from a selected responsive breakpoint."),
  pick("条件隐藏类按视口范围隐藏内容；print-only 与 screen-only 用于区分屏幕和打印环境。", "Conditional visibility classes hide content by viewport range; print-only and screen-only distinguish screen and print output."),
  pick("打印类只在浏览器打印或导出 PDF 时改变元素的 display，不影响普通屏幕布局。", "Print classes change display only during browser printing or PDF export without affecting the regular screen layout.")
][labState("display").groupIndex] ?? "";

const contentControlExplanation = (): string => {
  const descriptions: Record<string, string> = {
    "d-sr-only": pick("仅向屏幕阅读器提供内容，视觉界面中保持隐藏。", "Provides content only to screen readers while keeping it visually hidden."),
    "d-sr-only-focusable": pick("默认视觉隐藏，键盘聚焦时显示跳转入口。", "Visually hidden by default and reveals the skip entry on keyboard focus."),
    "visually-hidden": pick("隐藏视觉内容，同时保留辅助技术可读取的语义。", "Hides visual content while preserving semantics for assistive technology."),
    "pointer-events-none": pick("覆盖层不拦截鼠标事件，事件会落到其下方元素。", "The overlay does not intercept pointer events, so they reach the element below."),
    "pointer-events-auto": pick("覆盖层按默认规则接收并拦截鼠标事件。", "The overlay receives and intercepts pointer events using default behavior."),
    "pointer-pass-through": pick("覆盖层本身可穿透，但其中明确可交互的子元素仍能操作。", "The overlay itself passes events through while explicitly interactive children remain operable."),
    "object-cover": pick("图片覆盖容器，必要时裁切超出的内容。", "The image covers its container and crops overflow when needed."),
    "object-contain": pick("完整显示图片，并在比例不一致时保留空白。", "The complete image remains visible, with empty space when aspect ratios differ."),
    clearfix: pick("清除内部浮动对父容器高度计算造成的影响。", "Clears the effect of internal floats on the parent container's calculated height.")
  };
  return descriptions[selectedClass("content")] || pick("内容工具类用于控制辅助语义、指针事件和媒体适配。", "Content utilities control assistive semantics, pointer events, and media fitting.");
};

const displayControlExplanation = (): string => {
  const current = selectedClass("display");
  const descriptions: Record<string, string> = {
    "d-none": pick("隐藏元素，不占据页面布局空间。", "Hides the element without occupying layout space."),
    "d-flex": pick("将元素切换为 Flex 布局容器。", "Switches the element to a Flex layout container."),
    "d-md-inline-flex": pick("从 md 断点开始使用 inline-flex 布局。", "Uses inline-flex from the md breakpoint upward."),
    "d-xxl-table": pick("从 xxl 断点开始使用 table 布局。", "Uses table layout from the xxl breakpoint upward."),
    "hidden-xs": pick("仅在 xs 视口范围隐藏元素。", "Hides the element only in the xs viewport range."),
    "hidden-md-and-up": pick("在 md 及更宽视口隐藏元素。", "Hides the element at md and wider viewports."),
    "hidden-lg-and-down": pick("在 lg 及更窄视口隐藏元素。", "Hides the element at lg and narrower viewports."),
    "hidden-print-only": pick("打印或导出 PDF 时隐藏，屏幕上保持可见。", "Hides during printing or PDF export while remaining visible on screen.")
  };
  if (descriptions[current]) return descriptions[current];
  if (current.startsWith("d-print-")) {
    return pick(
      `打印或导出 PDF 时将元素切换为 ${current.replace("d-print-", "")} 布局。`,
      `Switches the element to ${current.replace("d-print-", "")} layout during printing or PDF export.`
    );
  }
  return pick("Display 类切换元素的布局类型，并可从指定响应式断点开始生效。", "Display classes switch an element's layout type and can apply from a selected responsive breakpoint.");
};

const activeGroup = (key: UtilityKey) => {
  const category = CATALOG[key];
  return category.groups[labState(key).groupIndex] ?? category.groups[0];
};

const groupOptions = (key: UtilityKey): SelectOption[] =>
  CATALOG[key].groups.map((group, index) => ({ label: group.title, value: String(index) }));

const classOptions = (key: UtilityKey): SelectOption[] =>
  activeGroup(key).examples.map((className) => ({ label: `.${className}`, value: className }));

const replaceLab = (key: UtilityKey, next: UtilityLabState): void => {
  labs.set({ ...labs.peek(), [key]: next });
};

const selectGroup = (key: UtilityKey, value: unknown): void => {
  const groupIndex = Math.max(0, Number(value) || 0);
  const group = CATALOG[key].groups[groupIndex];
  if (!group) return;
  replaceLab(key, { groupIndex, selectedClass: group.examples[0] ?? "" });
};

const selectClass = (key: UtilityKey, value: unknown): void => {
  const className = String(value ?? "");
  if (!activeGroup(key).examples.includes(className)) return;
  replaceLab(key, { ...labState(key), selectedClass: className });
};

const resetLab = (key: UtilityKey): void => replaceLab(key, defaultState(CATALOG[key]));

const classNames = (...values: Array<string | undefined>): string => values.filter(Boolean).join(" ");

const previewLabel = (title: string): string => `${title} ${t("preview")}`;

const generatedCode = (key: UtilityKey): string => {
  const utility = selectedClass(key);
  const code: Record<UtilityKey, string> = {
    borders: `<article class="${classNames("surface", utility)}">${pick("Atlas 项目", "Project Atlas")}</article>`,
    "border-radius": `<div class="${classNames("avatar", utility)}">EL</div>`,
    content: isGroup("content", 0)
      ? `<a class="${utility}" href="#main-content">${t("skip")}</a>`
      : isGroup("content", 1)
        ? `<div class="${utility}">${t("overlay")}</div>`
        : isSelected("content", "clearfix")
          ? `<article class="clearfix"><img class="float-start" alt="" />${pick("文章", "Article")}</article>`
          : `<img class="${utility}" src="cover.jpg" alt="${pick("封面", "Cover")}" />`,
    cursor: `<button class="${utility}">${t("dragCard")}</button>`,
    display: isGroup("display", 0)
      ? `<aside class="${utility}">${pick("响应式目标", "Responsive target")}</aside>`
      : isGroup("display", 1)
        ? `<aside class="${utility}">${pick("条件显示", "Conditionally visible")}</aside>`
        : `<section class="${utility}">${pick("可打印发票", "Printable invoice")}</section>`,
    elevation: `<article class="${classNames("surface", utility)}">${pick("数据分析", "Analytics")}</article>`,
    flex: `<div class="${classNames("d-flex", utility)}"><div>1</div><div>2</div><div>3</div></div>`,
    float: isGroup("float", 1)
      ? `<article class="${utility}"><img class="float-start" src="cover.jpg" alt="" />${pick("文章", "Article")}</article>`
      : `<img class="${utility}" src="cover.jpg" alt="" />`,
    opacity: `<div class="${utility}">${pick("部署完成", "Deployment completed")}</div>`,
    overflow: `<pre class="${utility}">${pick("很长的内容…", "Long content…")}</pre>`,
    position: isGroup("position", 1)
      ? `<div class="position-relative"><span class="position-absolute ${utility}">8</span></div>`
      : `<span class="${utility}">8</span>`,
    sizing: `<div class="${utility}">${t("responsivePanel")}</div>`,
    spacing: isGroup("spacing", 2)
      ? `<div class="d-flex ${utility}"><span>1</span><span>2</span><span>3</span></div>`
      : isGroup("spacing", 1)
        ? `<div class="${utility}"><div>${t("content")}</div></div>`
        : `<div class="${utility}">${t("content")}</div>`,
    typography: `<h2 class="${utility}">${t("typographyTitle")}</h2>`
  };
  return code[key];
};

defineStyle(`${utilityStyles}\n${pageStyles}`);

const PageUtilities = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>

    <main class="utility-labs">
      <article
        v-for="entry in entries"
        :key="entry.key"
        :id="'utility-' + entry.key"
        class="utility-lab"
      >
        <elf-playground :title="entry.category.title" :code="generatedCode(entry.key)">
          <code slot="status" class="lab-pattern">{{ activeGroup(entry.key).pattern }}</code>

          <section :class="['utility-preview', 'preview-' + entry.key]" :aria-label="previewLabel(entry.category.title)">
            <div v-if="entry.key === 'borders'" :class="['border-card', selectedClass(entry.key)]">
              <span class="preview-kicker">${pick("项目", "PROJECT")}</span><strong>${pick("Atlas 工作区", "Atlas workspace")}</strong><small>${t("borderRegion")}</small>
            </div>

            <div v-else-if="entry.key === 'border-radius'" class="shape-row">
              <div :class="['shape-sample', selectedClass(entry.key)]">EL</div><div class="shape-sample rounded-lg">UI</div><div class="shape-sample rounded-circle">24</div>
            </div>

            <div v-else-if="entry.key === 'content'" class="utility-concept-demo content-demo">
              <div v-if="isGroup(entry.key, 0)" class="content-card">
                <a :class="['content-skip', selectedClass(entry.key)]" href="#utility-content-target">${t("skip")}</a>
                <span class="content-icon" aria-hidden="true">Aa</span><div><strong>${t("accessibleContent")}</strong><small id="utility-content-target">${t("focusSkip")}</small></div>
              </div>
              <div v-else-if="isGroup(entry.key, 1)" class="pointer-scene">
                <button type="button">${t("baseAction")}</button>
                <div :class="['pointer-layer', selectedClass(entry.key)]"><span>${t("overlay")}</span></div>
              </div>
              <article v-else-if="isSelected(entry.key, 'clearfix')" class="clearfix-card clearfix">
                <span class="float-start">E</span><strong>${t("floatedContent")}</strong><p>${t("clearfixDescription")}</p>
              </article>
              <div v-else class="object-fit-scene">
                <div class="object-fit-frame"><img :class="selectedClass(entry.key)" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='120'%3E%3Crect width='320' height='120' fill='%231976d2'/%3E%3Ccircle cx='80' cy='60' r='34' fill='%23ffffff' fill-opacity='.86'/%3E%3Cpath d='M150 34h120v16H150zm0 34h84v16h-84z' fill='%23ffffff' fill-opacity='.72'/%3E%3C/svg%3E" :alt=${t("objectFitAlt")} /></div>
              </div>
              <p class="utility-explanation"><strong>${t("purpose")}</strong>{{ contentExplanation() }}</p>
            </div>

            <div v-else-if="entry.key === 'cursor'" class="cursor-board">
              <button :class="selectedClass(entry.key)" type="button"><span>⋮⋮</span> ${t("dragCard")}</button><button class="cursor-pointer" type="button">${t("openDetails")} →</button>
            </div>

            <div v-else-if="entry.key === 'display'" class="utility-concept-demo display-demo">
              <div v-if="isGroup(entry.key, 0)" class="device-row">
                <div class="device phone"><span></span><small>${t("phone")}</small></div><div class="display-target-frame"><div :class="['display-target', selectedClass(entry.key)]"><span>${t("target")}</span></div><small>${t("responsive")}</small></div><div class="device desktop"><span></span><small>${t("desktop")}</small></div>
              </div>
              <div v-else-if="isGroup(entry.key, 1)" class="visibility-scene">
                <div class="visibility-slot"><div :class="['visibility-target', selectedClass(entry.key)]">${t("conditionalContent")}</div></div>
                <div><strong>${t("currentViewport")}</strong><small>{{ selectedClass(entry.key) }}</small></div>
              </div>
              <div v-else class="print-scene">
                <article><span>${t("screen")}</span><strong>${t("invoice")}</strong><small>${t("browserPreview")}</small></article>
                <span class="print-arrow">→</span>
                <article :class="selectedClass(entry.key)"><span>${t("print")}</span><strong>${t("invoice")}</strong><small>${t("printApplied")}</small></article>
              </div>
              <p class="utility-explanation"><strong>${t("purpose")}</strong>{{ displayExplanation() }}</p>
            </div>

            <div v-else-if="entry.key === 'elevation'" class="elevation-row">
              <article class="elevation-0"><small>${t("backlog")}</small><strong>12</strong></article><article :class="selectedClass(entry.key)"><small>${t("inProgress")}</small><strong>08</strong></article><article class="elevation-1"><small>${t("released")}</small><strong>24</strong></article>
            </div>

            <div v-else-if="entry.key === 'flex'" :class="['flex-board', 'd-flex', selectedClass(entry.key)]">
              <div :class="selectedClass(entry.key)">1</div><div>2</div><div>3</div>
            </div>

            <article v-else-if="entry.key === 'float'" :class="['editorial-card', floatContainerClass()]">
              <div :class="['editorial-image', floatMediaClass()]">E</div><strong>${t("editorialTitle")}</strong><p>${t("editorialDescription")}</p>
            </article>

            <div v-else-if="entry.key === 'opacity'" class="status-stack">
              <div class="status-line"><i></i><span>${t("buildQueued")}</span></div><div :class="['status-line', 'active', selectedClass(entry.key)]"><i></i><span>${t("deploying")}</span><strong>68%</strong></div><div class="status-line muted"><i></i><span>${t("verification")}</span></div>
            </div>

            <div v-else-if="entry.key === 'overflow'" class="terminal-frame">
              <div class="terminal-toolbar"><i></i><i></i><i></i></div><pre :class="['terminal-content', selectedClass(entry.key)]"><code>pnpm build --filter @elfui/kit\n✓ ${t("compiled")}\n✓ ${t("typesGenerated")}\n→ ${t("publishing")}</code></pre>
            </div>

            <div v-else-if="entry.key === 'position'" class="position-canvas position-relative">
              <div class="position-avatar">EL</div><div><strong>${t("designReview")}</strong><small>${t("unreadComments")}</small></div><span :class="positionBadgeClasses()">8</span>
            </div>

            <div v-else-if="entry.key === 'sizing'" class="sizing-board">
              <div class="ruler"><span>0</span><span>50</span><span>100%</span></div><div :class="['sizing-panel', selectedClass(entry.key)]"><span>${t("responsivePanel")}</span><small>{{ selectedClass(entry.key) }}</small></div>
            </div>

            <div v-else-if="entry.key === 'spacing'" class="spacing-stage">
              <div v-if="isGroup(entry.key, 0)" class="spacing-margin-frame"><span>${t("marginArea")}</span><div :class="['spacing-target', selectedClass(entry.key)]">${t("content")}</div></div>
              <div v-else-if="isGroup(entry.key, 1)" class="spacing-padding-frame"><span>${t("paddingArea")}</span><div :class="['spacing-padding-target', selectedClass(entry.key)]"><strong>${t("content")}</strong></div></div>
              <div v-else :class="['spacing-gap-frame', 'd-flex', selectedClass(entry.key)]"><span>1</span><span>2</span><span>3</span></div>
            </div>

            <article v-else class="type-specimen">
              <span>${pick("编辑 / 07", "EDITORIAL / 07")}</span><h2 :class="selectedClass(entry.key)">${t("typographyTitle")}</h2><p>${t("typographyDescription")}</p>
            </article>
          </section>

          <div slot="controls" class="utility-controls">
            <strong>${t("configuration")}</strong>
            <label class="config-field">
              <span>${t("category")}</span>
              <elf-select
                :options.prop="groupOptions(entry.key)"
                :modelValue.prop="String(labState(entry.key).groupIndex)"
                @update:modelValue="selectGroup(entry.key, $event.detail)"
              ></elf-select>
            </label>
            <label class="config-field">
              <span>${t("utilityClass")}</span>
              <elf-select
                :options.prop="classOptions(entry.key)"
                :modelValue.prop="selectedClass(entry.key)"
                @update:modelValue="selectClass(entry.key, $event.detail)"
              ></elf-select>
            </label>
            <small v-if="entry.key === 'content'" class="config-purpose">{{ contentControlExplanation() }}</small>
            <small v-if="entry.key === 'display'" class="config-purpose">{{ displayControlExplanation() }}</small>
            <p>{{ activeGroup(entry.key).values }}</p>
            <small v-if="activeGroup(entry.key).responsive">${t("responsivePrefix")}</small>
            <div class="config-actions"><elf-button size="sm" variant="outlined" @click="resetLab(entry.key)">${t("reset")}</elf-button></div>
          </div>
        </elf-playground>
      </article>
      <page-utilities-draggable></page-utilities-draggable>
    </main>
  </elf-container>
`);

export { PageUtilities };
