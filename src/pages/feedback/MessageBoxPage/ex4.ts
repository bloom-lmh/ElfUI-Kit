import { defineHtml, useComponents, useRef } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageMessageBoxServicePreview } from "./servicePreview";

const t = createDocsTranslator({
  waiting: { zh: "等待操作", en: "Waiting for an action" },
  open: { zh: "使用配置默认值", en: "Use configured defaults" },
  title: { zh: "离开工作区", en: "Leave workspace" },
  message: {
    zh: "当前更改尚未保存，仍然离开吗？",
    en: "Your changes are not saved. Leave anyway?",
  },
  confirmed: { zh: "已确认离开", en: "Leaving confirmed" },
  cancelled: { zh: "已留在当前页面", en: "Stayed on the current page" },
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

const status = useRef("");
const statusText = (): string => status.value || t("waiting");
const onStatusChange = (event: CustomEvent<"confirmed" | "cancelled">): void =>
  status.set(t(event.detail));

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
      <page-message-box-service-preview
        :openLabel=${t("open")}
        :title=${t("title")}
        :message=${t("message")}
        @status-change=${onStatusChange}
      />
    </elf-config-provider>
    <span slot="status" class="demo-status">${statusText()}</span>
  </elf-playground>
`);

export { PageMessageBoxEx4 };
