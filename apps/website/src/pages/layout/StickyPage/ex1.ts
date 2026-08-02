import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "顶部吸附", en: "Top sticky" },
  playgroundTitle: { zh: "顶部吸附与状态变化", en: "Top sticky with state changes" },
  idle: { zh: "未吸附", en: "Not fixed" },
  fixed: { zh: "已吸附", en: "Fixed" },
  row: { zh: "内容行", en: "Content row" },
  instruction: {
    zh: "向下滚动；工具栏抵达容器顶部后会吸附并显示阴影",
    en: "Scroll down; the toolbar becomes fixed and gains a shadow when it reaches the container top",
  },
  toolbar: { zh: "筛选工具栏", en: "Filter toolbar" },
});

const stuck = useRef(t("idle"));

const onChange = (event: CustomEvent): void => {
  stuck.set(event.detail ? t("fixed") : t("idle"));
};

const rows = Array.from({ length: 12 }, (_, index) => `${t("row")} ${index + 1}`);

defineStyle(`
  .sticky-demo {
    width: 100%;
    max-width: 720px;
    height: 300px;
    overflow: auto;
    border: 1px solid var(--elf-divider);
    border-radius: var(--elf-radius-sm);
    background: var(--elf-bg-paper);
  }
  .sticky-intro {
    display: grid;
    min-height: 112px;
    place-items: center;
    padding: 20px;
    background: color-mix(in srgb, var(--elf-primary) 6%, var(--elf-bg-paper));
    color: var(--elf-text-secondary);
    font-size: var(--elf-font-size-sm);
    line-height: 1.65;
    text-align: center;
  }
  .sticky-toolbar {
    display: flex;
    align-items: center;
    min-height: 52px;
    padding: 0 20px;
    border-bottom: 1px solid var(--elf-divider);
    background: var(--elf-bg-paper);
  }
  .sticky-list { display: grid; gap: 0; padding: 8px 20px 20px; }
  .sticky-row {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) auto;
    align-items: center;
    min-height: 58px;
    border-bottom: 1px solid var(--elf-divider);
    color: var(--elf-text-primary);
  }
  .sticky-index {
    color: var(--elf-primary);
    font-size: var(--elf-font-size-xs);
    font-weight: 700;
  }
  .sticky-meta { color: var(--elf-text-secondary); font-size: var(--elf-font-size-xs); }
`);

const code = `<elf-sticky top="0" @change="onChange">
  <div class="toolbar">${t("toolbar")}</div>
</elf-sticky>`;

const script = `const stuck = useRef("${t("idle")}");
const onChange = (event) => stuck.set(event.detail ? "${t("fixed")}" : "${t("idle")}");`;

const PageStickyEx1 = defineHtml(`
  <h2>${t("playgroundTitle")}</h2>
  <elf-playground :title=${t("playgroundTitle")} :code=${code} :script=${script}>
    <span slot="status" class="demo-state">{{ stuck }}</span>
    <div class="sticky-demo">
      <div class="sticky-intro">
        ${t("instruction")}
      </div>
      <elf-sticky
        top="0"
        @change=${onChange}
        style="--sticky-shadow:0 10px 24px -16px rgba(0,0,0,.42)"
      >
        <div class="sticky-toolbar">
          <strong>${t("toolbar")}</strong>
        </div>
      </elf-sticky>
      <div class="sticky-list">
        <div class="sticky-row" v-for="(row, index) in rows"
          :key="row"
        >
          <span class="sticky-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <strong>{{ row }}</strong>
          <span class="sticky-meta">{{ index % 2 === 0 ? 'Ready' : 'Queued' }}</span>
        </div>
      </div>
    </div>
  </elf-playground>
`);

export { PageStickyEx1 };
