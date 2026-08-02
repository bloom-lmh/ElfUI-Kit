import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "语义外观与长文本", en: "Semantic appearance and long text" },
  status: {
    zh: "6 种语义色 · 下划线可控 · 长内容自动换行",
    en: "6 semantic colors · optional underline · long content wraps",
  },
  default: { zh: "默认链接", en: "Default link" },
  primary: { zh: "主要链接", en: "Primary link" },
  success: { zh: "成功链接", en: "Success link" },
  warning: { zh: "警告链接", en: "Warning link" },
  danger: { zh: "危险链接", en: "Danger link" },
  info: { zh: "信息链接", en: "Info link" },
  semantics: { zh: "语义类型", en: "Semantic types" },
  decoration: { zh: "装饰与图标", en: "Decoration and icon" },
  withoutUnderline: { zh: "悬停也不显示下划线", en: "No underline, including hover" },
  iconLink: { zh: "查看发布说明", en: "Read release notes" },
  wrapping: { zh: "受限容器中的长链接", en: "Long link in a constrained container" },
  longText: {
    zh: "这是一段会在窄容器中自然换行的很长链接文本，不会撑破卡片布局",
    en: "This intentionally long link wraps naturally inside a narrow container without breaking the card layout",
  },
});

const appearanceCode = `<elf-link href="#/basic/link">Default link</elf-link>
<elf-link type="primary" href="#/basic/link">Primary link</elf-link>
<elf-link type="success" href="#/basic/link">Success link</elf-link>
<elf-link type="warning" href="#/basic/link">Warning link</elf-link>
<elf-link type="danger" href="#/basic/link">Danger link</elf-link>
<elf-link type="info" href="#/basic/link">Info link</elf-link>

<elf-link type="primary" :underline.prop=\${false}>No underline</elf-link>
<elf-link type="primary" icon="↗">Read release notes</elf-link>`;

const appearanceScript = `// Link 默认继承当前字号和行高，可直接嵌入正文。
// underline=false 会同时关闭默认、hover 和 focus-visible 下划线。
// 长内容使用 overflow-wrap:anywhere，不需要业务侧补截断样式。`;

defineStyle(styles);

const PageLinkEx1 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${appearanceCode} :script=${appearanceScript}>
    <span slot="status" class="link-demo-status">${t("status")}</span>
    <div class="link-appearance-grid">
      <article class="link-demo-card link-demo-card-wide">
        <strong>${t("semantics")}</strong>
        <div class="link-demo-row">
          <elf-link href="#/basic/link">${t("default")}</elf-link>
          <elf-link type="primary" href="#/basic/link">${t("primary")}</elf-link>
          <elf-link type="success" href="#/basic/link">${t("success")}</elf-link>
          <elf-link type="warning" href="#/basic/link">${t("warning")}</elf-link>
          <elf-link type="danger" href="#/basic/link">${t("danger")}</elf-link>
          <elf-link type="info" href="#/basic/link">${t("info")}</elf-link>
        </div>
      </article>
      <article class="link-demo-card">
        <strong>${t("decoration")}</strong>
        <div class="link-demo-column">
          <elf-link type="primary" .underline=${false} href="#/basic/link">${t("withoutUnderline")}</elf-link>
          <elf-link type="primary" icon="↗" href="#/basic/link">${t("iconLink")}</elf-link>
        </div>
      </article>
      <article class="link-demo-card">
        <strong>${t("wrapping")}</strong>
        <div class="link-wrap-box">
          <elf-link type="primary" href="#/basic/link">${t("longText")}</elf-link>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageLinkEx1 };
