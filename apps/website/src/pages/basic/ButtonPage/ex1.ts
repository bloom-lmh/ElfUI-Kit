import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "语义色与外观矩阵", en: "Semantic color and appearance matrix" },
  status: {
    zh: "同一操作在三种层级中的视觉对比",
    en: "Compare the same action across three visual levels",
  },
  contained: { zh: "强调操作", en: "Emphasized actions" },
  outlined: { zh: "次要操作", en: "Secondary actions" },
  text: { zh: "轻量操作", en: "Low-emphasis actions" },
  primary: { zh: "主要", en: "Primary" },
  success: { zh: "成功", en: "Success" },
  warning: { zh: "警告", en: "Warning" },
  danger: { zh: "危险", en: "Danger" },
  plain: { zh: "淡色", en: "Plain" },
  dashed: { zh: "虚线", en: "Dashed" },
});

const appearanceCode = `<elf-button color="primary">Primary</elf-button>
<elf-button color="success">Success</elf-button>
<elf-button color="warning">Warning</elf-button>
<elf-button color="danger">Danger</elf-button>

<elf-button variant="outlined">Primary</elf-button>
<elf-button variant="outlined" color="success">Success</elf-button>
<elf-button variant="outlined" dashed color="danger">Dashed</elf-button>

<elf-button variant="text">Text</elf-button>
<elf-button text bg color="info">Text with background</elf-button>
<elf-button plain color="success">Plain</elf-button>`;

const appearanceScript = `// color 表达操作语义，variant 表达视觉强调层级。
// 同一组操作优先保持 variant 一致，仅用 color 区分状态。`;

defineStyle(styles);

const PageButtonEx1 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${appearanceCode}
    :script=${appearanceScript}
  >
    <span slot="status" class="button-demo-status">${t("status")}</span>
    <div class="button-appearance-grid">
      <article class="button-demo-card">
        <strong>${t("contained")}</strong>
        <div class="button-demo-row">
          <elf-button>${t("primary")}</elf-button>
          <elf-button color="success">${t("success")}</elf-button>
          <elf-button color="warning">${t("warning")}</elf-button>
          <elf-button color="danger">${t("danger")}</elf-button>
        </div>
      </article>

      <article class="button-demo-card">
        <strong>${t("outlined")}</strong>
        <div class="button-demo-row">
          <elf-button variant="outlined">${t("primary")}</elf-button>
          <elf-button variant="outlined" color="success">${t("success")}</elf-button>
          <elf-button variant="outlined" color="warning">${t("warning")}</elf-button>
          <elf-button variant="outlined" dashed color="danger">${t("dashed")}</elf-button>
        </div>
      </article>

      <article class="button-demo-card button-demo-card-wide">
        <strong>${t("text")}</strong>
        <div class="button-demo-row">
          <elf-button variant="text">${t("primary")}</elf-button>
          <elf-button text bg color="info">${t("text")}</elf-button>
          <elf-button plain color="success">${t("plain")}</elf-button>
          <elf-button link color="danger">${t("danger")}</elf-button>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageButtonEx1 };
