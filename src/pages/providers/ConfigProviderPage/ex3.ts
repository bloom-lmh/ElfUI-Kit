import { defineHtml, useComponents } from "@elfui/core";

import { PageConfigProviderPreview } from "./preview";

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
    title="Display and motion preferences"
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :config.prop=${config}>
      <page-config-provider-preview />
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx3 };
