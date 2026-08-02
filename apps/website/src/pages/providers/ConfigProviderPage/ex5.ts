import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageConfigProviderServiceDefaultsPreview } from "./serviceDefaultsPreview";

const t = createDocsTranslator({
  title: { zh: "服务行为默认值", en: "Service behavior defaults" },
  confirm: { zh: "仍然离开", en: "Leave anyway" },
  cancel: { zh: "留在此页", en: "Stay here" },
});

useComponents({
  "page-config-provider-service-defaults-preview": PageConfigProviderServiceDefaultsPreview,
});

const config = () => ({
  services: {
    message: { duration: 2400, position: "bottom" as const },
    notification: { duration: 3600, position: "bottom-right" as const },
    loading: { variant: "bars" as const, lock: true },
    messageBox: {
      type: "warning" as const,
      confirmButtonText: t("confirm"),
      cancelButtonText: t("cancel"),
    },
  },
});

const code = `<elf-config-provider :config.prop="config">
  <service-actions />
</elf-config-provider>`;
const script = `const config = {
  services: {
    message: { duration: 2400, position: "bottom" },
    notification: { duration: 3600, position: "bottom-right" },
    loading: { variant: "bars", lock: true },
    messageBox: {
      type: "warning",
      confirmButtonText: "${t("confirm")}",
      cancelButtonText: "${t("cancel")}"
    }
  }
};

// Inside a descendant component setup:
const message = useMessage();
const notification = useNotification();
const loading = useLoading();
const messageBox = useMessageBox();

// Call options override provider defaults for one invocation.
message.success("Saved", { duration: 1200 });`;

const PageConfigProviderEx5 = defineHtml(`
  <elf-playground :title=${t("title")} :code=${code} :script=${script}>
    <elf-config-provider :config.prop=${config()}>
      <page-config-provider-service-defaults-preview />
    </elf-config-provider>
  </elf-playground>
`);

export { PageConfigProviderEx5 };
