import { defineHtml, defineStyle } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import styles from "./demo.scss?inline";

const t = createDocsTranslator({
  title: { zh: "外链安全与禁用键盘", en: "External-link security and disabled keyboard" },
  status: {
    zh: "_blank 自动补安全 rel · disabled 退出 Tab 顺序",
    en: "_blank adds a safe rel · disabled leaves the Tab order",
  },
  externalTitle: { zh: "安全外链", en: "Safe external link" },
  externalDescription: {
    zh: "新窗口链接自动合并 noopener noreferrer，同时保留显式 rel token。",
    en: "New-window links merge noopener noreferrer while preserving explicit rel tokens.",
  },
  openSite: { zh: "打开 ElfUI 项目站点", en: "Open the ElfUI project site" },
  disabledTitle: { zh: "不可操作状态", en: "Unavailable state" },
  disabledDescription: {
    zh: "禁用后移除 href/target、设置 aria-disabled，并拦截 Enter 与 Space。",
    en: "Disabled links remove href/target, set aria-disabled, and block Enter and Space.",
  },
  noPermission: { zh: "无权限查看发布日志", en: "No permission to view release notes" },
  keyboardHint: {
    zh: "按 Tab 时焦点会跳过禁用链接",
    en: "Tab navigation skips the disabled link",
  },
});

const safetyCode = `<elf-link
  href="https://example.com"
  target="_blank"
  rel="external"
  icon="↗"
>
  Open project site
</elf-link>

<elf-link disabled href="/releases" target="_blank">
  No permission to view release notes
</elf-link>`;

const safetyScript = `// target="_blank" 时组件自动合并：rel="noopener noreferrer"。
// 用户传入的 external、nofollow 等 token 不会被覆盖。
// disabled 会移除 href、target、rel，设置 tabindex="-1" 与 aria-disabled="true"，
// 并阻止 click、Enter 和 Space 继续冒泡。`;

defineStyle(styles);

const PageLinkEx3 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${safetyCode} :script=${safetyScript}>
    <span slot="status" class="link-demo-status">${t("status")}</span>
    <div class="link-safety-grid">
      <article class="link-safety-card">
        <span class="link-safety-icon" aria-hidden="true">↗</span>
        <div>
          <strong>${t("externalTitle")}</strong>
          <p>${t("externalDescription")}</p>
          <elf-link
            type="primary"
            href="https://example.com"
            target="_blank"
            rel="external"
            icon="↗"
          >
            ${t("openSite")}
          </elf-link>
        </div>
      </article>
      <article class="link-safety-card">
        <span class="link-safety-icon is-muted" aria-hidden="true">⊘</span>
        <div>
          <strong>${t("disabledTitle")}</strong>
          <p>${t("disabledDescription")}</p>
          <elf-link disabled href="/releases" target="_blank">${t("noPermission")}</elf-link>
          <small>${t("keyboardHint")}</small>
        </div>
      </article>
    </div>
  </elf-playground>
`);

export { PageLinkEx3 };
