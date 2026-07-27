import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "尺寸、颜色与自定义 SVG", en: "Size, color, and custom SVG" },
  status: {
    zh: "容器负责尺寸与颜色，图形可来自 name 或默认插槽",
    en: "The container controls size and color; artwork comes from name or the default slot"
  },
  symbols: { zh: "文本符号", en: "Text symbols" },
  scale: { zh: "尺寸层级", en: "Size scale" },
  custom: { zh: "按需 SVG", en: "On-demand SVG" },
  search: { zh: "搜索", en: "Search" }
});

const appearanceCode = `<elf-icon name="✓" size="18" color="var(--elf-success)"></elf-icon>
<elf-icon name="!" size="24" color="var(--elf-warning)"></elf-icon>
<elf-icon name="×" size="32" color="var(--elf-danger)"></elf-icon>

<elf-icon size="28" color="var(--elf-primary)" aria-label="Search">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
</elf-icon>`;

const appearanceScript = `// 未提供 aria-label 的图标默认为装饰性 aria-hidden="true"。
// 只有图标自身承载语义时才添加 aria-label；按钮内图标应由按钮提供名称。`;

defineStyle(styles);

const PageIconEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="icon-demo-status">${t("status")}</span>
    <div class="icon-appearance-grid">
      <article class="icon-demo-card">
        <strong>${t("symbols")}</strong>
        <div class="icon-demo-row">
          <span class="icon-demo-token"><elf-icon name="✓" size="18" color="var(--elf-success)"></elf-icon><small>18</small></span>
          <span class="icon-demo-token"><elf-icon name="!" size="24" color="var(--elf-warning)"></elf-icon><small>24</small></span>
          <span class="icon-demo-token"><elf-icon name="×" size="32" color="var(--elf-danger)"></elf-icon><small>32</small></span>
        </div>
      </article>

      <article class="icon-demo-card">
        <strong>${t("scale")}</strong>
        <div class="icon-demo-row">
          <elf-icon name="A" size="16"></elf-icon>
          <elf-icon name="A" size="24"></elf-icon>
          <elf-icon name="A" size="32"></elf-icon>
          <elf-icon name="A" size="2.5em"></elf-icon>
        </div>
      </article>

      <article class="icon-demo-card icon-demo-card-wide">
        <strong>${t("custom")}</strong>
        <div class="icon-custom-preview">
          <elf-icon size="32" color="var(--elf-primary)" :aria-label=${t("search")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </elf-icon>
          <span>${t("search")}</span>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageIconEx1 };
