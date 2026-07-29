import { defineHtml, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "顶部吸附", en: "Top sticky" },
  playgroundTitle: { zh: "顶部吸附与状态变化", en: "Top sticky with state changes" },
  idle: { zh: "未吸附", en: "Not fixed" },
  fixed: { zh: "已吸附", en: "Fixed" },
  row: { zh: "内容行", en: "Content row" },
  instruction: { zh: "向下滚动；工具栏抵达容器顶部后会吸附并显示阴影", en: "Scroll down; the toolbar becomes fixed and gains a shadow when it reaches the container top" },
  toolbar: { zh: "筛选工具栏", en: "Filter toolbar" }
});

const stuck = useRef(t("idle"));

const onChange = (event: CustomEvent): void => {
  stuck.set(event.detail ? t("fixed") : t("idle"));
};

const rows = Array.from({ length: 12 }, (_, index) => `${t("row")} ${index + 1}`);

const code = `<elf-sticky top="0" @change="onChange">
  <div class="toolbar">${t("toolbar")}</div>
</elf-sticky>`;

const script = `const stuck = useRef("${t("idle")}");
const onChange = (event) => stuck.set(event.detail ? "${t("fixed")}" : "${t("idle")}");`;

const PageStickyEx1 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <div
      style="width:100%;max-width:720px;height:260px;overflow:auto;border:1px solid var(--elf-border);border-radius:8px;background:var(--elf-bg-paper)"
    >
      <div style="height:112px;display:grid;place-items:center;padding:0 16px;background:linear-gradient(135deg,color-mix(in srgb,var(--elf-primary) 10%,var(--elf-bg-paper)),var(--elf-bg-paper));color:var(--elf-text-secondary);font-size:13px">
        ${t("instruction")}
      </div>
      <elf-sticky
        top="0"
        @change=${onChange}
        style="--sticky-shadow:0 10px 24px -16px rgba(0,0,0,.42)"
      >
        <div
          style="display:flex;align-items:center;gap:12px;height:48px;padding:0 16px;background:var(--elf-bg-paper);border-bottom:1px solid var(--elf-divider)"
        >
          <strong>${t("toolbar")}</strong>
          <span style="color:var(--elf-primary);font-size:13px;font-weight:600">{{ stuck }}</span>
        </div>
      </elf-sticky>
      <div style="display:grid;gap:8px;padding:16px">
        <div
          v-for="row in rows"
          :key="row"
          style="height:36px;padding:0 12px;display:flex;align-items:center;border-radius:6px;background:var(--elf-bg-overlay)"
        >
          {{ row }}
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageStickyEx1 };
