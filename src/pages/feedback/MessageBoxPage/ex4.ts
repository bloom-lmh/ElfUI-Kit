import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageMessageBoxServicePreview } from "./servicePreview";

const t = createDocsTranslator({
  section: { zh: "ConfigProvider 服务默认值", en: "ConfigProvider service defaults" },
  confirm: { zh: "仍然离开", en: "Leave anyway" },
  cancel: { zh: "留在此页", en: "Stay here" },
});

useComponents({
  "page-message-box-service-preview": PageMessageBoxServicePreview,
});

const config = () => ({
  services: {
    messageBox: {
      type: "warning",
      center: true,
      confirmButtonText: t("confirm"),
      cancelButtonText: t("cancel"),
    },
  },
});

const code = `<elf-config-provider :config.prop="config">
  <page-message-box-service-preview />
</elf-config-provider>`;
const script = `const config = {
  services: {
    messageBox: {
      type: "warning",
      center: true,
      confirmButtonText: "${t("confirm")}",
      cancelButtonText: "${t("cancel")}"
    }
  }
};

// Inside a descendant component setup:
const messageBox = useMessageBox();
const open = () => messageBox.confirm("...", "...");`;

const PageMessageBoxEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-config-provider :config.prop=${config()}>
      <page-message-box-service-preview />
    </elf-config-provider>
  </elf-playground>
`);

export { PageMessageBoxEx4 };
