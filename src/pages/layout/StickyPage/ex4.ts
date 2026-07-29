import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "目标容器与内容投放", en: "Target container and teleported content" },
  playgroundTitle: { zh: "目标边界、内容投放与滚动状态", en: "Target boundary, teleport, and scroll state" },
  row: { zh: "目标容器内容", en: "Target container row" },
  instruction: { zh: "向下滚动以触发吸附", en: "Scroll down to activate sticky behavior" },
  toolbar: { zh: "目标容器工具栏", en: "Target container toolbar" },
  scrollTop: { zh: "滚动位置", en: "Scroll position" },
  fixed: { zh: "吸附状态", en: "Fixed state" },
  yes: { zh: "是", en: "Yes" },
  no: { zh: "否", en: "No" },
  comment: { zh: "实例同时暴露 update() 和 updateRoot()。", en: "The instance exposes both update() and updateRoot()." }
});

const scrollState = useRef(`${t("scrollTop")}: 0 / ${t("fixed")}: ${t("no")}`);
const rows = Array.from({ length: 14 }, (_, index) => `${t("row")} ${index + 1}`);

const onScroll = (event: CustomEvent<{ scrollTop: number; fixed: boolean }>): void => {
  const { scrollTop, fixed } = event.detail;
  scrollState.set(`${t("scrollTop")}: ${Math.round(scrollTop)} / ${t("fixed")}: ${fixed ? t("yes") : t("no")}`);
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
    <div style="position:relative;width:100%;max-width:720px">
      <div class="sticky-portal-target"></div>
      <section
        class="affix-target"
        style="height:280px;overflow:auto;border:1px solid var(--elf-border);border-radius:12px;background:var(--elf-bg-paper)"
      >
        <div style="height:84px;display:grid;place-items:center;color:var(--elf-text-secondary)">
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
          <div style="display:flex;align-items:center;justify-content:space-between;height:48px;padding:0 16px;border:1px solid var(--elf-border);border-radius:10px;background:var(--elf-bg-paper);box-sizing:border-box">
            <strong>${t("toolbar")}</strong>
            <span style="font-size:12px;color:var(--elf-primary)">{{ scrollState }}</span>
          </div>
        </elf-sticky>
        <div style="display:grid;gap:8px;padding:16px">
          <div
            v-for="row in rows"
            :key="row"
            style="height:36px;display:flex;align-items:center;padding:0 12px;border-radius:8px;background:var(--elf-bg-overlay)"
          >
            {{ row }}
          </div>
        </div>
      </section>
    </div>
  </elf-playground>
`);

export { PageStickyEx4 };
