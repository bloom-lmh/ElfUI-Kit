import { defineHtml, defineStyle, useComponents, useRef } from "@elfui/core";

import utilityStyles from "../../../styles/utilities.scss?inline";
import pageStyles from "./style.scss?inline";
import { CATALOG, type UtilityCategory, type UtilityKey } from "./catalog";
import { PageUtilitiesDraggable } from "./draggable-demo";

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
  "无障碍类把跳转链接或补充说明留给屏幕阅读器，并可在键盘聚焦时显示。",
  "指针事件类决定覆盖层是否拦截鼠标；pass-through 适合可穿透遮罩。",
  "内容适配类控制图片裁切或完整显示；clearfix 用于包住浮动内容。"
][labState("content").groupIndex] ?? "";

const displayExplanation = (): string => [
  "Display 类切换元素的布局类型，并可从指定响应式断点开始生效。",
  "条件隐藏类按视口范围隐藏内容；print-only 与 screen-only 用于区分屏幕和打印环境。",
  "打印类只在浏览器打印或导出 PDF 时改变元素的 display，不影响普通屏幕布局。"
][labState("display").groupIndex] ?? "";

const contentControlExplanation = (): string => {
  const descriptions: Record<string, string> = {
    "d-sr-only": "仅向屏幕阅读器提供内容，视觉界面中保持隐藏。",
    "d-sr-only-focusable": "默认视觉隐藏，键盘聚焦时显示跳转入口。",
    "visually-hidden": "隐藏视觉内容，同时保留辅助技术可读取的语义。",
    "pointer-events-none": "覆盖层不拦截鼠标事件，事件会落到其下方元素。",
    "pointer-events-auto": "覆盖层按默认规则接收并拦截鼠标事件。",
    "pointer-pass-through": "覆盖层本身可穿透，但其中明确可交互的子元素仍能操作。",
    "object-cover": "图片覆盖容器，必要时裁切超出的内容。",
    "object-contain": "完整显示图片，并在比例不一致时保留空白。",
    clearfix: "清除内部浮动对父容器高度计算造成的影响。"
  };
  return descriptions[selectedClass("content")] || "内容工具类用于控制辅助语义、指针事件和媒体适配。";
};

const displayControlExplanation = (): string => {
  const current = selectedClass("display");
  const descriptions: Record<string, string> = {
    "d-none": "隐藏元素，不占据页面布局空间。",
    "d-flex": "将元素切换为 Flex 布局容器。",
    "d-md-inline-flex": "从 md 断点开始使用 inline-flex 布局。",
    "d-xxl-table": "从 xxl 断点开始使用 table 布局。",
    "hidden-xs": "仅在 xs 视口范围隐藏元素。",
    "hidden-md-and-up": "在 md 及更宽视口隐藏元素。",
    "hidden-lg-and-down": "在 lg 及更窄视口隐藏元素。",
    "hidden-print-only": "打印或导出 PDF 时隐藏，屏幕上保持可见。"
  };
  if (descriptions[current]) return descriptions[current];
  if (current.startsWith("d-print-")) {
    return `打印或导出 PDF 时将元素切换为 ${current.replace("d-print-", "")} 布局。`;
  }
  return "Display 类切换元素的布局类型，并可从指定响应式断点开始生效。";
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

const generatedCode = (key: UtilityKey): string => {
  const utility = selectedClass(key);
  const code: Record<UtilityKey, string> = {
    borders: `<article class="${classNames("surface", utility)}">Project Atlas</article>`,
    "border-radius": `<div class="${classNames("avatar", utility)}">EL</div>`,
    content: isGroup("content", 0)
      ? `<a class="${utility}" href="#main-content">Skip to content</a>`
      : isGroup("content", 1)
        ? `<div class="${utility}">Overlay</div>`
        : isSelected("content", "clearfix")
          ? `<article class="clearfix"><img class="float-start" alt="" />Article</article>`
          : `<img class="${utility}" src="cover.jpg" alt="Cover" />`,
    cursor: `<button class="${utility}">Drag card</button>`,
    display: isGroup("display", 0)
      ? `<aside class="${utility}">Responsive target</aside>`
      : isGroup("display", 1)
        ? `<aside class="${utility}">Conditionally visible</aside>`
        : `<section class="${utility}">Printable invoice</section>`,
    elevation: `<article class="${classNames("surface", utility)}">Analytics</article>`,
    flex: `<div class="${classNames("d-flex", utility)}"><div>1</div><div>2</div><div>3</div></div>`,
    float: isGroup("float", 1)
      ? `<article class="${utility}"><img class="float-start" src="cover.jpg" alt="" />Article</article>`
      : `<img class="${utility}" src="cover.jpg" alt="" />`,
    opacity: `<div class="${utility}">Deployment completed</div>`,
    overflow: `<pre class="${utility}">Long content…</pre>`,
    position: isGroup("position", 1)
      ? `<div class="position-relative"><span class="position-absolute ${utility}">8</span></div>`
      : `<span class="${utility}">8</span>`,
    sizing: `<div class="${utility}">Responsive panel</div>`,
    spacing: isGroup("spacing", 2)
      ? `<div class="d-flex ${utility}"><span>1</span><span>2</span><span>3</span></div>`
      : isGroup("spacing", 1)
        ? `<div class="${utility}"><div>Content</div></div>`
        : `<div class="${utility}">Content</div>`,
    typography: `<h2 class="${utility}">Designing with clarity</h2>`
  };
  return code[key];
};

defineStyle(`${utilityStyles}\n${pageStyles}`);

const PageUtilities = defineHtml(`
  <elf-container>
    <h1>Utilities 工具类</h1>

    <main class="utility-labs">
      <article
        v-for="entry in entries"
        :key="entry.key"
        :id="'utility-' + entry.key"
        class="utility-lab"
      >
        <elf-playground :title="entry.category.title" :code="generatedCode(entry.key)">
          <code slot="status" class="lab-pattern">{{ activeGroup(entry.key).pattern }}</code>

          <section :class="['utility-preview', 'preview-' + entry.key]" :aria-label="entry.category.title + ' 预览'">
            <div v-if="entry.key === 'borders'" :class="['border-card', selectedClass(entry.key)]">
              <span class="preview-kicker">PROJECT</span><strong>Atlas workspace</strong><small>边框定义内容区域</small>
            </div>

            <div v-else-if="entry.key === 'border-radius'" class="shape-row">
              <div :class="['shape-sample', selectedClass(entry.key)]">EL</div><div class="shape-sample rounded-lg">UI</div><div class="shape-sample rounded-circle">24</div>
            </div>

            <div v-else-if="entry.key === 'content'" class="utility-concept-demo content-demo">
              <div v-if="isGroup(entry.key, 0)" class="content-card">
                <a :class="['content-skip', selectedClass(entry.key)]" href="#utility-content-target">Skip to content</a>
                <span class="content-icon" aria-hidden="true">Aa</span><div><strong>Accessible content</strong><small id="utility-content-target">按 Tab 可聚焦跳转链接</small></div>
              </div>
              <div v-else-if="isGroup(entry.key, 1)" class="pointer-scene">
                <button type="button">底层操作按钮</button>
                <div :class="['pointer-layer', selectedClass(entry.key)]"><span>覆盖层</span></div>
              </div>
              <article v-else-if="isSelected(entry.key, 'clearfix')" class="clearfix-card clearfix">
                <span class="float-start">E</span><strong>浮动内容</strong><p>clearfix 让容器正确包住内部浮动元素。</p>
              </article>
              <div v-else class="object-fit-scene">
                <div class="object-fit-frame"><img :class="selectedClass(entry.key)" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='120'%3E%3Crect width='320' height='120' fill='%231976d2'/%3E%3Ccircle cx='80' cy='60' r='34' fill='%23ffffff' fill-opacity='.86'/%3E%3Cpath d='M150 34h120v16H150zm0 34h84v16h-84z' fill='%23ffffff' fill-opacity='.72'/%3E%3C/svg%3E" alt="内容适配示意图" /></div>
              </div>
              <p class="utility-explanation"><strong>用途</strong>{{ contentExplanation() }}</p>
            </div>

            <div v-else-if="entry.key === 'cursor'" class="cursor-board">
              <button :class="selectedClass(entry.key)" type="button"><span>⋮⋮</span> Drag card</button><button class="cursor-pointer" type="button">Open details →</button>
            </div>

            <div v-else-if="entry.key === 'display'" class="utility-concept-demo display-demo">
              <div v-if="isGroup(entry.key, 0)" class="device-row">
                <div class="device phone"><span></span><small>Phone</small></div><div class="display-target-frame"><div :class="['display-target', selectedClass(entry.key)]"><span>Target</span></div><small>Responsive</small></div><div class="device desktop"><span></span><small>Desktop</small></div>
              </div>
              <div v-else-if="isGroup(entry.key, 1)" class="visibility-scene">
                <div class="visibility-slot"><div :class="['visibility-target', selectedClass(entry.key)]">条件内容</div></div>
                <div><strong>当前浏览器视口</strong><small>{{ selectedClass(entry.key) }}</small></div>
              </div>
              <div v-else class="print-scene">
                <article><span>屏幕</span><strong>Invoice #024</strong><small>普通浏览器预览</small></article>
                <span class="print-arrow">→</span>
                <article :class="selectedClass(entry.key)"><span>打印</span><strong>Invoice #024</strong><small>打印 / PDF 时应用</small></article>
              </div>
              <p class="utility-explanation"><strong>用途</strong>{{ displayExplanation() }}</p>
            </div>

            <div v-else-if="entry.key === 'elevation'" class="elevation-row">
              <article class="elevation-0"><small>Backlog</small><strong>12</strong></article><article :class="selectedClass(entry.key)"><small>In progress</small><strong>08</strong></article><article class="elevation-1"><small>Released</small><strong>24</strong></article>
            </div>

            <div v-else-if="entry.key === 'flex'" :class="['flex-board', 'd-flex', selectedClass(entry.key)]">
              <div :class="selectedClass(entry.key)">1</div><div>2</div><div>3</div>
            </div>

            <article v-else-if="entry.key === 'float'" :class="['editorial-card', floatContainerClass()]">
              <div :class="['editorial-image', floatMediaClass()]">E</div><strong>Building calmer interfaces</strong><p>A focused example shows how editorial content wraps around a floated visual while the reading flow stays intact.</p>
            </article>

            <div v-else-if="entry.key === 'opacity'" class="status-stack">
              <div class="status-line"><i></i><span>Build queued</span></div><div :class="['status-line', 'active', selectedClass(entry.key)]"><i></i><span>Deploying production</span><strong>68%</strong></div><div class="status-line muted"><i></i><span>Verification</span></div>
            </div>

            <div v-else-if="entry.key === 'overflow'" class="terminal-frame">
              <div class="terminal-toolbar"><i></i><i></i><i></i></div><pre :class="['terminal-content', selectedClass(entry.key)]"><code>pnpm build --filter @elfui/kit\n✓ components compiled\n✓ types generated\n→ publishing release candidate with a deliberately long status line</code></pre>
            </div>

            <div v-else-if="entry.key === 'position'" class="position-canvas position-relative">
              <div class="position-avatar">EL</div><div><strong>Design review</strong><small>8 unread comments</small></div><span :class="positionBadgeClasses()">8</span>
            </div>

            <div v-else-if="entry.key === 'sizing'" class="sizing-board">
              <div class="ruler"><span>0</span><span>50</span><span>100%</span></div><div :class="['sizing-panel', selectedClass(entry.key)]"><span>Responsive panel</span><small>{{ selectedClass(entry.key) }}</small></div>
            </div>

            <div v-else-if="entry.key === 'spacing'" class="spacing-stage">
              <div v-if="isGroup(entry.key, 0)" class="spacing-margin-frame"><span>margin area</span><div :class="['spacing-target', selectedClass(entry.key)]">content</div></div>
              <div v-else-if="isGroup(entry.key, 1)" class="spacing-padding-frame"><span>padding area</span><div :class="['spacing-padding-target', selectedClass(entry.key)]"><strong>content</strong></div></div>
              <div v-else :class="['spacing-gap-frame', 'd-flex', selectedClass(entry.key)]"><span>1</span><span>2</span><span>3</span></div>
            </div>

            <article v-else class="type-specimen">
              <span>EDITORIAL / 07</span><h2 :class="selectedClass(entry.key)">Designing with clarity</h2><p>Typography builds hierarchy before decoration enters the page.</p>
            </article>
          </section>

          <div slot="controls" class="utility-controls">
            <strong>配置</strong>
            <label class="config-field">
              <span>分类</span>
              <elf-select
                :options.prop="groupOptions(entry.key)"
                :modelValue.prop="String(labState(entry.key).groupIndex)"
                @update:modelValue="selectGroup(entry.key, $event.detail)"
              ></elf-select>
            </label>
            <label class="config-field">
              <span>工具类</span>
              <elf-select
                :options.prop="classOptions(entry.key)"
                :modelValue.prop="selectedClass(entry.key)"
                @update:modelValue="selectClass(entry.key, $event.detail)"
              ></elf-select>
            </label>
            <small v-if="entry.key === 'content'" class="config-purpose">{{ contentControlExplanation() }}</small>
            <small v-if="entry.key === 'display'" class="config-purpose">{{ displayControlExplanation() }}</small>
            <p>{{ activeGroup(entry.key).values }}</p>
            <small v-if="activeGroup(entry.key).responsive">支持响应式断点前缀</small>
            <div class="config-actions"><elf-button size="sm" variant="outlined" @click="resetLab(entry.key)">重置</elf-button></div>
          </div>
        </elf-playground>
      </article>
      <page-utilities-draggable></page-utilities-draggable>
    </main>
  </elf-container>
`);

export { PageUtilities };
