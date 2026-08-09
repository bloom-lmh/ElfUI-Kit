import { defineHtml, defineStyle, useHost, useRef } from "@elfui/core";
import type { ScrollbarExpose } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  section: { zh: "自定义外观", en: "Custom appearance" },
  title: {
    zh: "自定义内容",
    en: "Custom content",
  },
  clicks: { zh: "点击次数", en: "Clicks" },
  appTitle: { zh: "本周任务", en: "This week's tasks" },
  t1: { zh: "设计 token 基线", en: "Design token baseline" },
  t2: { zh: "Provider 配置合并", en: "Provider config merge" },
  t3: { zh: "共享滚动策略", en: "Shared scroll strategy" },
  t4: { zh: "双语文档同步", en: "Bilingual docs sync" },
  t5: { zh: "键盘导航覆盖", en: "Keyboard navigation coverage" },
  t6: { zh: "虚拟列表滚动优化", en: "Virtual list scroll polish" },
  t7: { zh: "主题预设整理", en: "Theme preset cleanup" },
  t8: { zh: "发布流程自动化", en: "Release automation" },
  done: { zh: "已完成", en: "Done" },
  active: { zh: "进行中", en: "In progress" },
  todo: { zh: "待开始", en: "Pending" },
});

const tasks = [
  { title: t("t1"), owner: "设计组", status: t("done"), state: "done" },
  { title: t("t2"), owner: "核心组", status: t("done"), state: "done" },
  { title: t("t3"), owner: "组件组", status: t("active"), state: "active" },
  { title: t("t4"), owner: "文档组", status: t("active"), state: "active" },
  { title: t("t5"), owner: "组件组", status: t("todo"), state: "todo" },
  { title: t("t6"), owner: "数据组", status: t("todo"), state: "todo" },
  { title: t("t7"), owner: "设计组", status: t("todo"), state: "todo" },
  { title: t("t8"), owner: "基建组", status: t("todo"), state: "todo" },
];

const times = useRef(0);
const host = useHost();
const getCustomScrollTarget = (): HTMLElement | null =>
  host.shadowRoot?.querySelector<HTMLElement & ScrollbarExpose>("#backtop-custom-scroll")
    ?.wrapRef ?? null;
const onClick = (): void => times.set(times.value + 1);
const code = `<elf-back-top
  :target.prop="getCustomScrollTarget"
  shape="square"
  size="48px"
  bottom="24px"
  right="24px"
  style="position:absolute"
>Top</elf-back-top>`;
const script = `const host = useHost();
const times = useRef(0);
const getCustomScrollTarget = () =>
  host.shadowRoot?.querySelector("#backtop-custom-scroll")?.wrapRef ?? null;
const onClick = () => times.set(times.value + 1);`;

const PageBacktopEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">${t("clicks")}: ${times.value}</span>
    <div class="backtop-demo">
      <elf-scrollbar id="backtop-custom-scroll" class="backtop-scroll" height="280px" always>
        <div class="backtop-app">
          <div class="backtop-app__head">${t("appTitle")}</div>
          <ul class="backtop-list">
            <li v-for="item in tasks" :key="item.title" class="backtop-task" :class="'is-' + item.state">
              <span class="backtop-task__mark"></span>
              <span class="backtop-task__body">
                <strong>{{ item.title }}</strong>
                <small>{{ item.owner }}</small>
              </span>
              <span class="backtop-task__status">{{ item.status }}</span>
            </li>
          </ul>
        </div>
      </elf-scrollbar>
      <elf-back-top
        :target.prop=${getCustomScrollTarget}
        shape="square"
        size="48px"
        bottom="24px"
        right="24px"
        style="position:absolute"
        @click=${onClick}
      >Top</elf-back-top>
    </div>
  </elf-playground>
`);

export { PageBacktopEx2 };
