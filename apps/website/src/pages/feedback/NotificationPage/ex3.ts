import { defineHtml } from "@elfui/core";
import { ElfNotification } from "@elfui/kit-src/components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "时长与服务选项", en: "Duration and service options" },
  longTitle: { zh: "长时通知", en: "Long-lived" },
  longMessage: {
    zh: "这条通知将持续显示十秒。",
    en: "This notification stays visible for ten seconds.",
  },
  persistentTitle: { zh: "常驻通知", en: "Persistent" },
  persistentMessage: {
    zh: "这条通知只会通过服务句柄或 closeAll 关闭。",
    en: "This notification only closes through its handle or closeAll.",
  },
  customTitle: { zh: "自定义服务选项", en: "Custom service options" },
  customMessage: {
    zh: "同时应用自定义类名、层级、偏移、关闭文字和回调。",
    en: "Custom class, z-index, offset, close label, and callback are applied together.",
  },
  closeLabel: { zh: "关闭", en: "Close" },
  closedLog: { zh: "通知已关闭", en: "Notification closed" },
  showLong: { zh: "显示 10 秒", en: "Show for 10 seconds" },
  keepOpen: { zh: "保持显示", en: "Keep open" },
  customOptions: { zh: "自定义选项", en: "Custom options" },
  closeAll: { zh: "关闭全部", en: "Close all" },
});

const showLong = (): void => {
  ElfNotification({ title: t("longTitle"), message: t("longMessage"), duration: 10000 });
};

const showPersistent = (): void => {
  ElfNotification({ title: t("persistentTitle"), message: t("persistentMessage"), duration: 0 });
};

const showCustomized = (): void => {
  ElfNotification({
    title: t("customTitle"),
    message: t("customMessage"),
    type: "success",
    duration: 0,
    offset: 48,
    zIndex: 3100,
    customClass: "notification-demo-custom",
    closeIcon: t("closeLabel"),
    onClose: () => console.info(t("closedLog")),
  });
};

const handleCloseAll = (): void => ElfNotification.closeAll();

const code = `<elf-button @click=\${showLong}>${t("showLong")}</elf-button>
<elf-button @click=\${showPersistent}>${t("keepOpen")}</elf-button>
<elf-button @click=\${showCustomized}>${t("customOptions")}</elf-button>
<elf-button color="danger" @click=\${handleCloseAll}>${t("closeAll")}</elf-button>`;

const script = `const showLong = () => ElfNotification({ title: "${t("longTitle")}", message: "${t("longMessage")}", duration: 10000 });
const showPersistent = () => ElfNotification({ title: "${t("persistentTitle")}", message: "${t("persistentMessage")}", duration: 0 });
const showCustomized = () => ElfNotification({
  title: "${t("customTitle")}",
  message: "${t("customMessage")}",
  customClass: "notification-demo-custom",
  zIndex: 3100,
  offset: 48,
  closeIcon: "${t("closeLabel")}",
  onClose: () => console.info("${t("closedLog")}")
});
const handleCloseAll = () => ElfNotification.closeAll();`;

const PageNotificationEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click=${showLong}>${t("showLong")}</elf-button>
      <elf-button @click=${showPersistent}>${t("keepOpen")}</elf-button>
      <elf-button @click=${showCustomized}>${t("customOptions")}</elf-button>
      <elf-button color="danger" @click=${handleCloseAll}>${t("closeAll")}</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx3 };
