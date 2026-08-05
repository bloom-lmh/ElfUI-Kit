import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

import { PageConfigProviderGoToPreview } from "./goToPreview";

const t = createDocsTranslator({
  title: { zh: "共享滚动策略", en: "Shared scroll strategy" },
});

useComponents({
  "page-config-provider-goto-preview": PageConfigProviderGoToPreview,
});

const config = {
  goTo: {
    duration: 520,
    easing: "easeInOutCubic",
    offset: 12,
  },
};

const code = `<elf-config-provider :config.prop="config">
  <page-config-provider-goto-preview />
</elf-config-provider>`;

const script = `const config = {
  goTo: {
    duration: 520,
    easing: "easeInOutCubic",
    offset: 12
  }
};

// Inside page-config-provider-goto-preview:
const host = useHost();
const goTo = useGoTo();
const scrollToReview = () => goTo(
  host.shadowRoot.querySelector("#review"),
  {
    container: getScrollContainer(),
    root: host.shadowRoot
  }
).finished;`;

const PageConfigProviderEx4 = defineHtml(`
  <elf-playground
    :title=${t("title")}
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :config.prop=${config}>
      <page-config-provider-goto-preview />
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx4 };
