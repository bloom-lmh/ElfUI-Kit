import { defineHtml, useComponents } from "@elfui/core";

import { PageConfigProviderGoToPreview } from "./goToPreview";

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
    title="goTo · shared scrolling strategy"
    :code=${code}
    :script=${script}
  >
    <elf-config-provider :config.prop=${config}>
      <page-config-provider-goto-preview />
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx4 };
