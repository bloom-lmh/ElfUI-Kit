import { defineDirective, defineHtml, defineStyle, useRef } from "@elfui/core";

import { scrollDirective, type ScrollDirectiveDetail } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import demoStyles from "../directive-demo.scss?inline";
import articleStyles from "../../shared/article.scss?inline";

const t = createDocsTranslator({
  kicker: { zh: "指令", en: "Directive" },
  title: { zh: "滚动", en: "Scroll" },
  description: {
    zh: "订阅指定容器或最近可滚动祖先的滚动位置，并提供进度。",
    en: "Subscribe to a specified container or nearest scrollable ancestor and receive normalized progress.",
  },
  demo: { zh: "容器滚动状态", en: "Container scroll state" },
  releases: { zh: "版本记录", en: "Releases" },
  position: { zh: "位置", en: "Position" },
  progressLabel: { zh: "进度", en: "Progress" },
  release1: { zh: "v0.0.2-beta.1", en: "v0.0.2-beta.1" },
  release2: { zh: "v0.0.2-beta.0", en: "v0.0.2-beta.0" },
  release3: { zh: "v0.0.1-beta.20", en: "v0.0.1-beta.20" },
  release4: { zh: "v0.0.1-beta.18", en: "v0.0.1-beta.18" },
  release5: { zh: "v0.0.1-beta.16", en: "v0.0.1-beta.16" },
  release6: { zh: "v0.0.1-beta.12", en: "v0.0.1-beta.12" },
  note1: {
    zh: "统一 Provider 配置入口与滚动策略。",
    en: "Unified provider config entry and scroll strategy.",
  },
  note2: {
    zh: "修复深色主题下的组件表面对比。",
    en: "Fixed component surface contrast in dark themes.",
  },
  note3: {
    zh: "新增 Alert、Quote 与 Heading 组件。",
    en: "Added Alert, Quote, and Heading components.",
  },
  note4: {
    zh: "提升表格与虚拟列表的滚动稳定性。",
    en: "Improved table and virtual list scrolling stability.",
  },
  note5: {
    zh: "补齐表单组件的键盘导航覆盖。",
    en: "Added keyboard navigation coverage for form components.",
  },
  note6: {
    zh: "发布语言工具与 Vite 插件更新。",
    en: "Released language tools and Vite plugin updates.",
  },
  api: { zh: "API", en: "API" },
  type: { zh: "类型", en: "Type" },
  desc: { zh: "说明", en: "Description" },
  handler: {
    zh: "接收轴、位置、最大值和进度。",
    en: "Receives axis, position, maximum, and progress.",
  },
  target: { zh: "容器元素、选择器或 window。", en: "Container element, selector, or window." },
  axis: { zh: "选择 x 或 y 轴。", en: "Selects the x or y axis." },
  immediate: {
    zh: "绑定完成后立即报告初始状态。",
    en: "Reports initial state immediately after binding.",
  },
});

const releases = [
  { version: t("release1"), date: "2026-08-01", note: t("note1") },
  { version: t("release2"), date: "2026-07-29", note: t("note2") },
  { version: t("release3"), date: "2026-07-25", note: t("note3") },
  { version: t("release4"), date: "2026-07-20", note: t("note4") },
  { version: t("release5"), date: "2026-07-12", note: t("note5") },
  { version: t("release6"), date: "2026-07-05", note: t("note6") },
];

defineStyle(
  articleStyles,
  demoStyles,
  `
  .release-head {
    position: sticky;
    top: 0;
    z-index: 1;
    display: grid;
    gap: 6px;
    padding: 10px 14px 8px;
    border-bottom: 1px solid var(--elf-divider);
    background: color-mix(in srgb, var(--elf-bg-paper) 92%, transparent);
    backdrop-filter: blur(8px);
  }

  .release-head__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .release-head__row strong {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--elf-text-secondary);
  }

  .release-head__row small {
    color: var(--elf-text-disabled);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .release-progress {
    height: 4px;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--elf-text-secondary) 16%, transparent);
  }

  .release-progress i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--elf-primary), var(--elf-success));
    transition: width 90ms linear;
  }

  .release-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 8px;
    list-style: none;
  }

  .release-item {
    display: grid;
    gap: 2px;
    padding: 10px 12px;
    border: 1px solid var(--elf-divider);
    border-radius: var(--elf-radius-sm);
    background: var(--elf-bg-paper);
  }

  .release-item__meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .release-item__meta strong {
    font-size: 13px;
    font-weight: 700;
    color: var(--elf-primary);
    font-variant-numeric: tabular-nums;
  }

  .release-item__meta time {
    color: var(--elf-text-disabled);
    font-size: 11px;
  }

  .release-item p {
    margin: 0;
    color: var(--elf-text-secondary);
    font-size: 12px;
    line-height: 1.5;
  }
`,
);

const scroll = defineDirective(scrollDirective);
const position = useRef("0 / 0");
const progress = useRef(0);
const onScroll = (detail: ScrollDirectiveDetail): void => {
  position.set(`${Math.round(detail.position)} / ${Math.round(detail.maximum)}`);
  progress.set(Math.round(detail.progress * 100));
};
const progressStyle = (): { width: string } => ({ width: `${progress.value}%` });
const options = () => ({ handler: onScroll, target: ".scroll-directive-view", immediate: true });
const optionRows = () => [
  { name: "handler", type: "(detail) => void", default: "—", desc: t("handler") },
  { name: "target", type: "Element | string | Window", default: "nearest", desc: t("target") },
  { name: "axis", type: "'x' | 'y'", default: "y", desc: t("axis") },
  { name: "immediate", type: "boolean", default: "true", desc: t("immediate") },
];
const code = `<div v-scroll={ handler: onScroll, target: '.releases' } class="releases">
  <header class="release-head">
    <strong>Releases</strong>
    <div class="release-progress"><i :style="progressStyle()"></i></div>
  </header>
  <ul class="release-list">
    <li v-for="item in releases" :key="item.version" class="release-item">…</li>
  </ul>
</div>`;
const script = `import { defineDirective, useRef } from "@elfui/core";
import { scrollDirective } from "@elfui/kit";

const scroll = defineDirective(scrollDirective);
const progress = useRef(0);
const onScroll = ({ progress: value }) => progress.set(Math.round(value * 100));
const progressStyle = () => ({ width: progress.value + "%" });`;

const PageScroll = defineHtml(`
  <elf-container class="docs-article">
    <elf-docs-hero category="directives" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <elf-playground :title=${t("demo")} :code=${code} :script=${script}>
      <span slot="status" class="directive-status">${t("position")} {{ position }} · ${t("progressLabel")} {{ progress }}%</span>
      <div class="directive-scroll scroll-directive-view">
        <div v-scroll=${options()} class="release-app">
          <div class="release-head">
            <div class="release-head__row">
              <strong>${t("releases")}</strong>
              <small>{{ progress }}%</small>
            </div>
            <div class="release-progress"><i :style="progressStyle()"></i></div>
          </div>
          <ul class="release-list">
            <li v-for="item in releases" :key="item.version" class="release-item">
              <span class="release-item__meta">
                <strong>{{ item.version }}</strong>
                <time>{{ item.date }}</time>
              </span>
              <p>{{ item.note }}</p>
            </li>
          </ul>
        </div>
      </div>
    </elf-playground>
    <h2>${t("api")}</h2>
    <elf-props-table :title=${t("api")} :rows=${optionRows()} />
  </elf-container>
`);
export { PageScroll };
