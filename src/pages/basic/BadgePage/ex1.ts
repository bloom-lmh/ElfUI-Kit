import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "状态与外观矩阵", en: "Status and appearance matrix" },
  status: { zh: "数字 · 截断 · 文本 · 圆点 · 语义色", en: "Number · max · text · dot · semantic color" },
  inbox: { zh: "收件箱", en: "Inbox" },
  review: { zh: "待审核", en: "Review" },
  release: { zh: "发布", en: "Release" },
  online: { zh: "在线", en: "Online" },
  warning: { zh: "警告", en: "Warning" },
  basic: { zh: "计数与上限", en: "Count and maximum" },
  semantic: { zh: "文本与语义状态", en: "Text and semantic status" }
});

const matrixCode = `<elf-badge value="12"><elf-button>Inbox</elf-button></elf-badge>
<elf-badge value="200" max="99"><elf-button>Review</elf-button></elf-badge>
<elf-badge value="NEW" type="primary"><elf-button>Release</elf-button></elf-badge>
<elf-badge is-dot type="success"><span>Online</span></elf-badge>`;

const matrixScript = `// Badge 是被动状态组件；更新 value、type 或 isDot 即可驱动视图。`;

defineStyle(styles);

const PageBadgeEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${matrixCode} :script=${matrixScript}>
    <span slot="status" class="badge-demo-status">${t("status")}</span>
    <div class="badge-matrix">
      <article class="badge-card">
        <strong>${t("basic")}</strong>
        <div class="badge-row">
          <elf-badge value="12"><elf-button>${t("inbox")}</elf-button></elf-badge>
          <elf-badge value="200" max="99"><elf-button>${t("review")}</elf-button></elf-badge>
          <elf-badge value="0"><elf-button>Zero</elf-button></elf-badge>
        </div>
      </article>
      <article class="badge-card">
        <strong>${t("semantic")}</strong>
        <div class="badge-row">
          <elf-badge value="NEW" type="primary"><elf-button>${t("release")}</elf-button></elf-badge>
          <elf-badge is-dot type="success"><span>${t("online")}</span></elf-badge>
          <elf-badge value="!" type="warning"><span>${t("warning")}</span></elf-badge>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageBadgeEx1 };
