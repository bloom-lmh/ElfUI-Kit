import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import pageStyles from "./style.scss?inline";

const t = createDocsTranslator({
  title: { zh: "焦点与弱化动效", en: "Focus and reduced motion" },
  skip: { zh: "跳到主要内容", en: "Skip to main content" },
  action: { zh: "键盘可聚焦操作", en: "Keyboard-focusable action" },
  live: { zh: "操作结果会在这里播报", en: "Action results are announced here" },
  region: { zh: "键盘访问区域", en: "Keyboard access area" },
  hint: {
    zh: "按 Tab 检查焦点顺序与可见焦点环。",
    en: "Press Tab to check focus order and the visible focus ring."
  },
  scriptComment: {
    zh: "reduced 会统一收敛组件动效。页面仍需维护正确的标题层级、焦点顺序、可读标签和错误关联。",
    en: "reduced consistently limits component motion. The page still owns heading hierarchy, focus order, readable labels, and error associations."
  }
});

defineStyle(pageStyles);

const templateCode = `<elf-config-provider motion="reduced">
  <a class="skip-link" href="#main-content">${t("skip")}</a>
  <main id="main-content" tabindex="-1">
    <button type="button">${t("action")}</button>
    <p aria-live="polite">${t("live")}</p>
  </main>
</elf-config-provider>`;

const scriptCode = `// ${t("scriptComment")}
const motion = "reduced";`;

const PageAccessibilityEx1 = defineHtml(`
  <h2>${t("title")}</h2>
  <elf-playground
    :title=${t("title")}
    :code=${templateCode}
    :script=${scriptCode}
  >
    <elf-config-provider motion="reduced">
      <section class="a11y-focus-demo" aria-labelledby="a11y-focus-title">
        <a class="skip-link-demo" href="#a11y-demo-main">${t("skip")}</a>
        <div id="a11y-demo-main" class="focus-surface" tabindex="-1">
          <strong id="a11y-focus-title">${t("region")}</strong>
          <span>${t("hint")}</span>
          <button class="focus-demo" type="button">${t("action")}</button>
        </div>
      </section>
    </elf-config-provider>
  </elf-playground>
`);

export { PageAccessibilityEx1 };
