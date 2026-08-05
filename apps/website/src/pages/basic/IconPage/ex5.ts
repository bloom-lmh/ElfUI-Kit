import { defineHtml, defineStyle } from "@elfui/core";
import { mdiGithub } from "@mdi/js";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "第三方 SVG", en: "Third-party SVG" },
  rawSvg: { zh: "原始 SVG 插槽", en: "Raw SVG slot" },
  body: {
    zh: "品牌或私有图标可以直接放进默认插槽，尺寸与颜色仍由 elf-icon 统一控制。",
    en: "Brand or private icons go straight into the default slot; size and color stay controlled by elf-icon.",
  },
  github: { zh: "GitHub", en: "GitHub" },
  sizeColor: { zh: "尺寸与语义色", en: "Size and semantic colors" },
});

const rawSvgSizes = (): Array<{ id: string; size: number; label: string }> => [
  { id: "s16", size: 16, label: "16px" },
  { id: "s24", size: 24, label: "24px" },
  { id: "s32", size: 32, label: "32px" },
  { id: "s40", size: 40, label: "40px" },
];

const rawSvgColors = (): Array<{ id: string; size: number; color: string }> => [
  { id: "primary", size: 28, color: "var(--elf-primary)" },
  { id: "success", size: 28, color: "var(--elf-success)" },
  { id: "warning", size: 28, color: "var(--elf-warning)" },
  { id: "danger", size: 28, color: "var(--elf-danger)" },
];

const code = `<elf-icon size="40" color="var(--elf-primary)">
  <svg viewBox="0 0 24 24"><path :d="githubPath"></path></svg>
</elf-icon>

<elf-icon size="24" color="var(--elf-success)">
  <svg viewBox="0 0 24 24"><path :d="githubPath"></path></svg>
</elf-icon>`;

const script = `// Raw SVG in the default slot keeps the Icon container's size and color contract.
// 默认插槽中的原始 SVG 仍由 elf-icon 控制尺寸与颜色。`;

defineStyle(styles);

const PageIconEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <span slot="status" class="icon-demo-status">${t("sizeColor")}</span>

    <div class="icon-gallery-panel">
      <article class="icon-gallery-card icon-gallery-card-wide">
        <strong>${t("rawSvg")}</strong>
        <p>${t("body")}</p>
        <div class="icon-raw-svg-preview">
          <elf-icon size="48" color="var(--elf-primary)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path :d=${mdiGithub}></path></svg>
          </elf-icon>
          <span>${t("github")}</span>
        </div>
      </article>

      <article class="icon-gallery-card icon-gallery-card-wide">
        <strong>${t("sizeColor")}</strong>
        <div class="icon-size-ladder">
          <span v-for="item in rawSvgSizes()" :key="item.id" class="icon-raw-svg-token">
            <elf-icon :size="item.size" color="var(--elf-primary)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d=${mdiGithub}></path></svg>
            </elf-icon>
            <small>{{ item.label }}</small>
          </span>
        </div>
        <div class="icon-color-row">
          <span v-for="item in rawSvgColors()" :key="item.id" class="icon-raw-svg-token">
            <elf-icon :size="item.size" :color="item.color">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path :d=${mdiGithub}></path></svg>
            </elf-icon>
          </span>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageIconEx5 };
