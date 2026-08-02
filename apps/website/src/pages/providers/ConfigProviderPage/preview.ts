import { defineHtml } from "@elfui/core";

import { useConfigProvider } from "@elfui/kit-src/components/Providers/config";
import { createDocsTranslator } from "../../docsLocale";

const config = useConfigProvider();
const t = createDocsTranslator({
  breakpoint: { zh: "断点", en: "Breakpoint" },
  mobile: { zh: "移动端", en: "Mobile" },
  reducedMotion: { zh: "减少动效", en: "Reduced motion" },
});

const PageConfigProviderPreview = defineHtml(`
  <div class="config-preview">
    <div class="preview-stat">
      <span class="preview-label">${t("breakpoint")}</span>
      <strong>{{ config.display.name }}</strong>
      <small>{{ config.display.width }} × {{ config.display.height }}</small>
    </div>
    <div class="preview-stat">
      <span class="preview-label">${t("mobile")}</span>
      <strong>{{ config.display.mobile ? 'true' : 'false' }}</strong>
      <small>${t("reducedMotion")}: {{ config.reducedMotion ? 'true' : 'false' }}</small>
    </div>
  </div>
`);

export { PageConfigProviderPreview };
