import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";
import type { ScrollbarExpose } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  section: { zh: "基础用法", en: "Basic usage" },
  title: { zh: "容器阈值与平滑返回顶部", en: "Container threshold and smooth return" },
  visible: { zh: "按钮", en: "Button" },
  shown: { zh: "已显示", en: "visible" },
  hidden: { zh: "未显示", en: "hidden" },
  clicks: { zh: "点击", en: "Clicks" },
  appTitle: { zh: "版本记录 · ElfUI Kit", en: "Changelog · ElfUI Kit" },
  r1: { zh: "v0.0.2-beta.1", en: "v0.0.2-beta.1" },
  r2: { zh: "v0.0.2-beta.0", en: "v0.0.2-beta.0" },
  r3: { zh: "v0.0.1-beta.20", en: "v0.0.1-beta.20" },
  r4: { zh: "v0.0.1-beta.18", en: "v0.0.1-beta.18" },
  r5: { zh: "v0.0.1-beta.16", en: "v0.0.1-beta.16" },
  r6: { zh: "v0.0.1-beta.12", en: "v0.0.1-beta.12" },
  n1: {
    zh: "统一 Provider 配置入口与共享滚动策略。",
    en: "Unified provider config entry and shared scroll strategy.",
  },
  n2: {
    zh: "修复深色主题下的组件表面对比。",
    en: "Fixed component surface contrast in dark themes.",
  },
  n3: {
    zh: "新增 Alert、Quote 与 Heading 组件。",
    en: "Added Alert, Quote, and Heading components.",
  },
  n4: {
    zh: "提升表格与虚拟列表的滚动稳定性。",
    en: "Improved table and virtual list scrolling stability.",
  },
  n5: {
    zh: "补齐表单组件的键盘导航覆盖。",
    en: "Added keyboard navigation coverage for form components.",
  },
  n6: {
    zh: "发布语言工具与 Vite 插件更新。",
    en: "Released language tools and Vite plugin updates.",
  },
  tagFeature: { zh: "新特性", en: "Feature" },
  tagFix: { zh: "修复", en: "Fix" },
  tagComponent: { zh: "组件", en: "Component" },
  tagPerf: { zh: "性能", en: "Perf" },
  tagA11y: { zh: "无障碍", en: "A11y" },
  tagTools: { zh: "工具", en: "Tools" },
});

const releases = [
  { version: t("r1"), date: "2026-08-01", note: t("n1"), tag: t("tagFeature") },
  { version: t("r2"), date: "2026-07-29", note: t("n2"), tag: t("tagFix") },
  { version: t("r3"), date: "2026-07-25", note: t("n3"), tag: t("tagComponent") },
  { version: t("r4"), date: "2026-07-20", note: t("n4"), tag: t("tagPerf") },
  { version: t("r5"), date: "2026-07-12", note: t("n5"), tag: t("tagA11y") },
  { version: t("r6"), date: "2026-07-05", note: t("n6"), tag: t("tagTools") },
];

const visible = useRef(false);
const clickCount = useRef(0);
const host = useHost();

const getBasicScrollTarget = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement & ScrollbarExpose>("#backtop-basic-scroll")?.wrapRef ??
  null;

const onVisible = (event: CustomEvent): void => visible.set(Boolean(event.detail));
const onClick = (event: CustomEvent): void => {
  if (event.detail instanceof MouseEvent) clickCount.set(clickCount.value + 1);
};

const code = `<elf-back-top
  :target.prop="getBasicScrollTarget"
  :visibility-height="120"
  bottom="24px"
  right="24px"
  style="position:absolute"
  @visible-change="onVisible"
  @click="onClick"
/>`;
const script = `const host = useHost();
const visible = useRef(false);
const getBasicScrollTarget = () =>
  host.shadowRoot?.querySelector("#backtop-basic-scroll")?.wrapRef ?? null;
const onVisible = (event) => visible.set(Boolean(event.detail));
const onClick = (event) => console.log(event.detail);`;

const PageBacktopEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("visible")}: ${visible.value ? t("shown") : t("hidden")} · ${t("clicks")}: ${clickCount.value}</span>
    <div class="backtop-demo">
      <elf-scrollbar id="backtop-basic-scroll" class="backtop-scroll" height="300px" always>
        <div class="backtop-app">
          <div class="backtop-app__head">${t("appTitle")}</div>
          <ul class="backtop-list">
            <li v-for="item in releases" :key="item.version" class="backtop-item">
              <span class="backtop-item__meta">
                <strong>{{ item.version }}</strong>
                <time>{{ item.date }}</time>
              </span>
              <p>{{ item.note }}</p>
              <span class="backtop-item__tag">{{ item.tag }}</span>
            </li>
          </ul>
        </div>
      </elf-scrollbar>
      <elf-back-top
        :target.prop=${getBasicScrollTarget}
        :visibility-height=${120}
        bottom="24px"
        right="24px"
        style="position:absolute"
        @visible-change=${onVisible}
        @click=${onClick}
      ></elf-back-top>
    </div>
  </elf-playground>
`);

export { PageBacktopEx1 };
