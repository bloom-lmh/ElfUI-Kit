import { defineHtml } from "@elfui/core";

import {
  useLoading,
  useMessage,
  useMessageBox,
  useNotification,
} from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  message: { zh: "轻提示", en: "Message" },
  messageText: { zh: "草稿已保存", en: "Draft saved" },
  notification: { zh: "通知", en: "Notification" },
  notificationTitle: { zh: "构建完成", en: "Build complete" },
  notificationText: { zh: "产物已经可以预览。", en: "Artifacts are ready to preview." },
  loading: { zh: "加载服务", en: "Loading service" },
  loadingText: { zh: "正在同步…", en: "Syncing…" },
  messageBox: { zh: "消息框", en: "Message box" },
  messageBoxTitle: { zh: "离开页面", en: "Leave page" },
  messageBoxText: {
    zh: "当前更改尚未保存，仍然离开吗？",
    en: "Your changes are not saved. Leave anyway?",
  },
});

const message = useMessage();
const notification = useNotification();
const loading = useLoading();
const messageBox = useMessageBox();

const showMessage = (): void => {
  message.success(t("messageText"));
};

const showNotification = (): void => {
  notification.success({
    title: t("notificationTitle"),
    message: t("notificationText"),
  });
};

const showLoading = (): void => {
  const instance = loading({ text: t("loadingText") });
  window.setTimeout(instance.close, 900);
};

const showMessageBox = (): void => {
  void messageBox
    .confirm(t("messageBoxText"), t("messageBoxTitle"))
    .catch(() => undefined);
};

const PageConfigProviderServiceDefaultsPreview = defineHtml(`
  <elf-space wrap>
    <elf-button @click=${showMessage}>${t("message")}</elf-button>
    <elf-button @click=${showNotification}>${t("notification")}</elf-button>
    <elf-button @click=${showLoading}>${t("loading")}</elf-button>
    <elf-button @click=${showMessageBox}>${t("messageBox")}</elf-button>
  </elf-space>
`);

export { PageConfigProviderServiceDefaultsPreview };
