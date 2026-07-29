import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import { PageConfigProviderPreview } from "./preview";

const t = createDocsTranslator({
  title: { zh: "显示与动效偏好", en: "Display and motion preferences" },
});

useComponents({
  "page-config-provider-preview": PageConfigProviderPreview,
});

const config = {
  display: {
    mobileBreakpoint: "md",
    thresholds: { sm: 520, md: 860 },
  },
  motion: "reduced",
};

const code = `<elf-config-provider :config.prop="config">
  <page-config-provider-preview />
</elf-config-provider>`;

const script = `const config = {
  display: {
    mobileBreakpoint: "md",
    thresholds: { sm: 520, md: 860 }
  },
  motion: "reduced"
};`;

const PageConfigProviderEx3 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :config.prop=${config}>
      <page-config-provider-preview />
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx3 };
