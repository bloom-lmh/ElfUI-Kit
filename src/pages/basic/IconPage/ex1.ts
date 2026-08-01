import { defineHtml, defineStyle } from "@elfui/core";
import { mdiAlertOutline, mdiCheckCircleOutline, mdiCloseCircleOutline, mdiMagnify } from "@mdi/js";

import { createSvgIconSet } from "../../../components/Basic/Icon";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "尺寸、颜色与第三方 SVG 图标", en: "Size, color, and third-party SVG icons" },
  status: {
    zh: "容器负责尺寸与颜色，图形可来自 name 或默认插槽",
    en: "The container controls size and color; artwork comes from name or the default slot",
  },
  symbols: { zh: "状态图标", en: "Status icons" },
  scale: { zh: "尺寸层级", en: "Size scale" },
  custom: { zh: "第三方 SVG 图标", en: "Third-party SVG icon" },
  search: { zh: "搜索", en: "Search" },
});

const iconOptions = {
  defaultSet: "mdi",
  sets: {
    mdi: createSvgIconSet({
      success: mdiCheckCircleOutline,
      warning: mdiAlertOutline,
      danger: mdiCloseCircleOutline,
      search: mdiMagnify,
    }),
  },
};

const appearanceCode = `<elf-icon-provider :options.prop="iconOptions">
  <elf-icon name="success" size="18" color="var(--elf-success)" />
  <elf-icon name="warning" size="24" color="var(--elf-warning)" />
  <elf-icon name="danger" size="32" color="var(--elf-danger)" />
  <elf-icon name="search" size="28" aria-label="Search" />
</elf-icon-provider>`;

const appearanceScript = `// 未提供 aria-label 的图标默认为装饰性 aria-hidden="true"。
// 只有图标自身承载语义时才添加 aria-label；按钮内图标应由按钮提供名称。`;

defineStyle(styles);

const PageIconEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="icon-demo-status">${t("status")}</span>
    <elf-icon-provider :options.prop=${iconOptions}><div class="icon-appearance-grid">
      <article class="icon-demo-card">
        <strong>${t("symbols")}</strong>
        <div class="icon-demo-row">
          <span class="icon-demo-token"><elf-icon name="success" size="18" color="var(--elf-success)"></elf-icon><small>18</small></span>
          <span class="icon-demo-token"><elf-icon name="warning" size="24" color="var(--elf-warning)"></elf-icon><small>24</small></span>
          <span class="icon-demo-token"><elf-icon name="danger" size="32" color="var(--elf-danger)"></elf-icon><small>32</small></span>
        </div>
      </article>

      <article class="icon-demo-card">
        <strong>${t("scale")}</strong>
        <div class="icon-demo-row">
          <elf-icon name="search" size="16"></elf-icon>
          <elf-icon name="search" size="24"></elf-icon>
          <elf-icon name="search" size="32"></elf-icon>
          <elf-icon name="search" size="2.5em"></elf-icon>
        </div>
      </article>

      <article class="icon-demo-card icon-demo-card-wide">
        <strong>${t("custom")}</strong>
        <div class="icon-custom-preview">
          <elf-icon name="search" size="32" color="var(--elf-primary)" :aria-label=${t("search")}></elf-icon>
          <span>${t("search")}</span>
        </div>
      </article>
    </div></elf-icon-provider>
  </elf-playground>
`);

export { PageIconEx1 };
