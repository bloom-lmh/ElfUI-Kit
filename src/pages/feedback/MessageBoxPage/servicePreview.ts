import { defineHtml, useRef } from "@elfui/core";

import { useMessageBox } from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  open: { zh: "使用配置默认值", en: "Use configured defaults" },
  title: { zh: "离开工作区", en: "Leave workspace" },
  message: {
    zh: "当前更改尚未保存，仍然离开吗？",
    en: "Your changes are not saved. Leave anyway?",
  },
  waiting: { zh: "等待操作", en: "Waiting for an action" },
  confirmed: { zh: "已确认离开", en: "Leaving confirmed" },
  cancelled: { zh: "已留在当前页面", en: "Stayed on the current page" },
});

const messageBox = useMessageBox();
const status = useRef("");
const statusText = (): string => status.value || t("waiting");

const openConfigured = async (): Promise<void> => {
  try {
    await messageBox.confirm(t("message"), t("title"));
    status.set(t("confirmed"));
  } catch {
    status.set(t("cancelled"));
  }
};

const PageMessageBoxServicePreview = defineHtml(`
  <elf-button @click=${openConfigured}>${t("open")}</elf-button>
  <p class="demo-status">${statusText()}</p>
`);

export { PageMessageBoxServicePreview };
