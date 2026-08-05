import { defineHtml, defineStyle } from "@elfui/core";
import { useConfigProvider } from "@elfui/kit-src/components/Providers/config";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./preview.scss?inline";

defineStyle(styles);

const config = useConfigProvider();
const t = createDocsTranslator({
  navTitle: { zh: "导航", en: "Navigation" },
  inbox: { zh: "收件箱", en: "Inbox" },
  projects: { zh: "项目", en: "Projects" },
  reports: { zh: "报表", en: "Reports" },
  contentTitle: { zh: "内容区域", en: "Content area" },
  contentDesc: {
    zh: "调整移动端阈值后，此区域会在双栏与单栏之间切换。",
    en: "Change the mobile threshold and this area switches between two columns and a stacked layout.",
  },
  breakpoint: { zh: "断点", en: "Breakpoint" },
  mobile: { zh: "移动端", en: "Mobile" },
  threshold: { zh: "阈值", en: "Threshold" },
  viewport: { zh: "视口", en: "Viewport" },
});

const mobileClass = (): string => (config.display.mobile ? "is-mobile" : "");
const thresholdValue = (): string => {
  const options = config.config.display ?? {};
  return String(options.mobileBreakpoint ?? "lg");
};

const PageConfigProviderPreview = defineHtml(`
  <div class="display-preview" :class=${mobileClass()}>
    <aside class="display-preview-nav">
      <strong>${t("navTitle")}</strong>
      <span>${t("inbox")}</span>
      <span>${t("projects")}</span>
      <span>${t("reports")}</span>
    </aside>
    <section class="display-preview-content">
      <strong>${t("contentTitle")}</strong>
      <p>${t("contentDesc")}</p>
    </section>
  </div>
  <div class="display-preview-status">
    <span>${t("breakpoint")}: <b>{{ config.display.name }}</b></span>
    <span>${t("mobile")}: <b>{{ config.display.mobile ? 'true' : 'false' }}</b></span>
    <span>${t("threshold")}: <b>${thresholdValue()}</b></span>
    <span>${t("viewport")}: {{ config.display.width }} × {{ config.display.height }}</span>
  </div>
`);

export { PageConfigProviderPreview };
