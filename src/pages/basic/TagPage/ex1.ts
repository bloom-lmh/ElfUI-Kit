import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "外观矩阵", en: "Appearance matrix" },
  status: {
    zh: "颜色、层级、尺寸与形状集中对比",
    en: "Colors, emphasis, sizes, and shapes in one comparison"
  },
  semantics: { zh: "语义颜色", en: "Semantic colors" },
  primary: { zh: "主要", en: "Primary" },
  secondary: { zh: "次要", en: "Secondary" },
  success: { zh: "成功", en: "Success" },
  warning: { zh: "警告", en: "Warning" },
  danger: { zh: "危险", en: "Danger" },
  info: { zh: "信息", en: "Info" },
  variants: { zh: "强调层级", en: "Emphasis variants" },
  filled: { zh: "填充", en: "Filled" },
  light: { zh: "淡色", en: "Light" },
  outlined: { zh: "描边", en: "Outlined" },
  sizes: { zh: "尺寸与形状", en: "Sizes and shapes" },
  small: { zh: "小", en: "Small" },
  medium: { zh: "中", en: "Medium" },
  large: { zh: "大", en: "Large" },
  rounded: { zh: "圆角", en: "Rounded" },
  custom: { zh: "自定义颜色与兼容别名", en: "Custom colors and compatibility aliases" },
  brand: { zh: "品牌紫", en: "Brand purple" },
  darkEffect: { zh: "dark → filled", en: "dark → filled" },
  plainEffect: { zh: "plain → outlined", en: "plain → outlined" }
});

const appearanceCode = `<elf-tag type="primary">Primary</elf-tag>
<elf-tag type="success">Success</elf-tag>
<elf-tag type="warning">Warning</elf-tag>
<elf-tag type="danger">Danger</elf-tag>

<elf-tag variant="filled">Filled</elf-tag>
<elf-tag variant="light">Light</elf-tag>
<elf-tag variant="outlined">Outlined</elf-tag>

<elf-tag size="sm">Small</elf-tag>
<elf-tag size="lg" round>Large rounded</elf-tag>
<elf-tag color="#7c3aed">Brand purple</elf-tag>`;

const appearanceScript = `// type 是 Element Plus 兼容语义色；color 也接受任意 CSS 颜色。
// effect="dark | light | plain" 分别映射到 filled | light | outlined。
// size、round、disabled 等状态通过宿主属性反射，便于主题覆盖。`;

defineStyle(styles);

const PageTagEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="tag-demo-status">${t("status")}</span>
    <div class="tag-appearance-grid">
      <article class="tag-demo-card tag-demo-card-wide">
        <strong>${t("semantics")}</strong>
        <div class="tag-demo-row">
          <elf-tag type="primary">${t("primary")}</elf-tag>
          <elf-tag type="secondary">${t("secondary")}</elf-tag>
          <elf-tag type="success">${t("success")}</elf-tag>
          <elf-tag type="warning">${t("warning")}</elf-tag>
          <elf-tag type="danger">${t("danger")}</elf-tag>
          <elf-tag type="info">${t("info")}</elf-tag>
        </div>
      </article>
      <article class="tag-demo-card">
        <strong>${t("variants")}</strong>
        <div class="tag-demo-row">
          <elf-tag variant="filled">${t("filled")}</elf-tag>
          <elf-tag variant="light">${t("light")}</elf-tag>
          <elf-tag variant="outlined">${t("outlined")}</elf-tag>
        </div>
      </article>
      <article class="tag-demo-card">
        <strong>${t("sizes")}</strong>
        <div class="tag-demo-row tag-demo-row-baseline">
          <elf-tag size="sm">${t("small")}</elf-tag>
          <elf-tag size="md">${t("medium")}</elf-tag>
          <elf-tag size="lg">${t("large")}</elf-tag>
          <elf-tag round>${t("rounded")}</elf-tag>
        </div>
      </article>
      <article class="tag-demo-card tag-demo-card-wide">
        <strong>${t("custom")}</strong>
        <div class="tag-demo-row">
          <elf-tag color="#7c3aed">${t("brand")}</elf-tag>
          <elf-tag type="success" effect="dark">${t("darkEffect")}</elf-tag>
          <elf-tag type="warning" effect="plain">${t("plainEffect")}</elf-tag>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageTagEx1 };
