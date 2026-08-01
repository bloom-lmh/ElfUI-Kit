import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "目标容器与内容投放", en: "Target container and teleported content" },
  playgroundTitle: {
    zh: "目标边界、内容投放与滚动状态",
    en: "Target boundary, teleport, and scroll state",
  },
  row: { zh: "目标容器内容", en: "Target container row" },
  scope: { zh: "容器边界内", en: "Inside target boundary" },
  tracking: { zh: "正在跟踪", en: "Tracking" },
  instruction: { zh: "向下滚动以触发吸附", en: "Scroll down to activate sticky behavior" },
  toolbar: { zh: "目标容器工具栏", en: "Target container toolbar" },
  scrollTop: { zh: "滚动位置", en: "Scroll position" },
  fixed: { zh: "吸附状态", en: "Fixed state" },
  yes: { zh: "是", en: "Yes" },
  no: { zh: "否", en: "No" },
  comment: {
    zh: "实例同时暴露 update() 和 updateRoot()。",
    en: "The instance exposes both update() and updateRoot().",
  },
});

const scrollState = useRef(`${t("scrollTop")}: 0 / ${t("fixed")}: ${t("no")}`);
const rows = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  title: `${t("row")} ${index + 1}`,
  meta: t("scope"),
  state: t("tracking"),
  tone: index % 3 === 0 ? "success" : "primary",
}));

defineStyle(styles);

const onScroll = (event: CustomEvent<{ scrollTop: number; fixed: boolean }>): void => {
  const { scrollTop, fixed } = event.detail;
  scrollState.set(
    `${t("scrollTop")}: ${Math.round(scrollTop)} / ${t("fixed")}: ${fixed ? t("yes") : t("no")}`,
  );
};

const code = `<section class="affix-target">
  <elf-sticky
    target=".affix-target"
    offset="12"
    teleported
    append-to=".sticky-portal-target"
    @scroll=\${onScroll}
  >
    <div class="toolbar">${t("toolbar")}</div>
  </elf-sticky>
</section>`;

const script = `const onScroll = (event) => {
  const { scrollTop, fixed } = event.detail;
  console.log(scrollTop, fixed);
};

// ${t("comment")}`;

const PageStickyEx4 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <div class="sticky-target-wrap">
      <div class="sticky-portal-target"></div>
      <section class="affix-target sticky-demo-surface sticky-demo-surface--target">
        <div class="sticky-target-intro">
          ${t("instruction")}
        </div>
        <elf-sticky
          target=".affix-target"
          offset="12"
          teleported
          append-to=".sticky-portal-target"
          @scroll=${onScroll}
          style="--sticky-shadow:0 12px 30px -18px rgba(0,0,0,.45)"
        >
          <div class="sticky-target-toolbar">
            <strong>${t("toolbar")}</strong>
            <span>{{ scrollState }}</span>
          </div>
        </elf-sticky>
        <div class="sticky-record-list sticky-record-list--target">
          <div class="sticky-record-row" v-for="row in rows" :key="row.id">
            <span class="sticky-record-index">{{ String(row.id).padStart(2, '0') }}</span>
            <span class="sticky-record-copy">
              <strong>{{ row.title }}</strong>
              <small>{{ row.meta }}</small>
            </span>
            <span class="sticky-record-state" :data-tone="row.tone">{{ row.state }}</span>
          </div>
        </div>
      </section>
    </div>
  </elf-playground>
`);

export { PageStickyEx4 };
