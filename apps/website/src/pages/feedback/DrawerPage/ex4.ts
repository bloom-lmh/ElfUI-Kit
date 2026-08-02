import { defineHtml, defineStyle, globalStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import drawerDemoStyles from "./demo.scss?inline";

const t = createDocsTranslator({
  section: { zh: "可调整尺寸", en: "Resizable drawer" },
  initial: { zh: "初始宽度", en: "Initial width" },
  current: { zh: "当前宽度", en: "Current width" },
  saved: { zh: "已保存宽度", en: "Saved width" },
  adaptive: { zh: "自适应工作区", en: "Adaptive workspace" },
  summary: {
    zh: "拖动抽屉内侧边缘，或聚焦手柄后使用方向键。",
    en: "Drag the inner edge, or focus the handle and use the arrow keys.",
  },
  open: { zh: "打开可调整抽屉", en: "Open resizable drawer" },
  title: { zh: "工作区详情", en: "Workspace details" },
  currentPanel: { zh: "当前面板", en: "Current panel" },
  bounds: {
    zh: "尺寸限制为 300–640px；方向键每次调整 10px，Home / End 可直达边界。",
    en: "The size is limited to 300–640px. Arrow keys adjust by 10px; Home and End jump to the limits.",
  },
  pending: { zh: "待处理", en: "Pending" },
  releases: { zh: "本周发布", en: "Releases this week" },
  sourceComment: { zh: "详情内容", en: "Detail content" },
});

const open = useRef(false);
const size = useRef(420);
const status = useRef(`${t("initial")} 420px`);

const showDrawer = (): void => open.set(true);
const onResize = (event: CustomEvent<{ size: number }>): void => {
  size.set(event.detail.size);
  status.set(`${t("current")} ${event.detail.size}px`);
};
const onResizeEnd = (event: CustomEvent<{ size: number }>): void => {
  status.set(`${t("saved")} ${event.detail.size}px`);
};

const code = `<elf-button @click=\${showDrawer}>${t("open")}</elf-button>
<elf-drawer
  v-model:open="open"
  title="${t("title")}"
  size="420px"
  resizable
  :min-size="300"
  :max-size="640"
  @resize="onResize"
  @resize-end="onResizeEnd"
>
  <!-- ${t("sourceComment")} -->
</elf-drawer>`;

const script = `const open = useRef(false);
const size = useRef(420);
const status = useRef("${t("initial")} 420px");

const showDrawer = () => open.set(true);
const onResize = (event) => {
  size.set(event.detail.size);
  status.set("${t("current")} " + event.detail.size + "px");
};
const onResizeEnd = (event) => {
  status.set("${t("saved")} " + event.detail.size + "px");
};`;

defineStyle(drawerDemoStyles);
globalStyle(drawerDemoStyles);

const PageDrawerEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <span slot="status">${status}</span>
    <div class="drawer-resize-trigger">
      <div>
        <strong>${t("adaptive")}</strong>
        <span>${t("summary")}</span>
      </div>
      <elf-button type="primary" @click=${showDrawer}>${t("open")}</elf-button>
    </div>

    <elf-drawer
      v-model:open="open"
      :title=${t("title")}
      size="420px"
      resizable
      :min-size=${300}
      :max-size=${640}
      @resize=${onResize}
      @resize-end=${onResizeEnd}
    >
      <section class="drawer-resize-content">
        <div class="drawer-resize-hero">
          <span>${t("currentPanel")}</span>
          <strong>${size}px</strong>
          <p>${t("bounds")}</p>
        </div>
        <div class="drawer-resize-metrics">
          <article><span>${t("pending")}</span><strong>18</strong></article>
          <article><span>${t("releases")}</span><strong>6</strong></article>
        </div>
      </section>
    </elf-drawer>
  </elf-playground>
`);

export { PageDrawerEx4 };
