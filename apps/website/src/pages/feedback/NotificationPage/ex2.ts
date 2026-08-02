import { defineHtml } from "@elfui/core";
import { ElfNotification } from "@elfui/kit-src/components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "不同弹出位置", en: "Screen positions" },
  systemTitle: { zh: "系统通知", en: "System notification" },
  systemMessage: {
    zh: "这是一条常规系统消息，自动在右上角堆叠显示。",
    en: "This standard system message stacks automatically in the top-right corner.",
  },
  topLeftTitle: { zh: "左上角通知", en: "Top-left notification" },
  topLeftMessage: {
    zh: "这是一条在左上角弹出的消息通知。",
    en: "This notification opens in the top-left corner.",
  },
  bottomRightTitle: { zh: "右下角通知", en: "Bottom-right notification" },
  bottomRightMessage: {
    zh: "这是一条在右下角弹出的消息通知。",
    en: "This notification opens in the bottom-right corner.",
  },
  bottomLeftTitle: { zh: "左下角通知", en: "Bottom-left notification" },
  bottomLeftMessage: {
    zh: "这是一条在左下角弹出的消息通知。",
    en: "This notification opens in the bottom-left corner.",
  },
  closeLabel: { zh: "关闭", en: "Close" },
  topRightButton: { zh: "右上角（大关闭标签）", en: "Top right (wide close label)" },
  topLeftButton: { zh: "左上角", en: "Top left" },
  bottomRightButton: { zh: "右下角", en: "Bottom right" },
  bottomLeftButton: { zh: "左下角", en: "Bottom left" },
  closeAll: { zh: "关闭全部", en: "Close all" },
});

const showNormal = () => {
  ElfNotification({
    title: t("systemTitle"),
    message: t("systemMessage"),
    duration: 0,
    closeIcon: t("closeLabel"),
  });
};

const showTopLeft = () => {
  ElfNotification({
    title: t("topLeftTitle"),
    message: t("topLeftMessage"),
    position: "top-left",
    duration: 0,
  });
};

const showBottomRight = () => {
  ElfNotification({
    title: t("bottomRightTitle"),
    message: t("bottomRightMessage"),
    position: "bottom-right",
    duration: 0,
  });
};

const showBottomLeft = () => {
  ElfNotification({
    title: t("bottomLeftTitle"),
    message: t("bottomLeftMessage"),
    position: "bottom-left",
    duration: 0,
  });
};

const closeAll = (): void => ElfNotification.closeAll();

const code = `<elf-button @click=\${showNormal}>${t("topRightButton")}</elf-button>
<elf-button @click=\${showTopLeft}>${t("topLeftButton")}</elf-button>
<elf-button @click=\${showBottomRight}>${t("bottomRightButton")}</elf-button>
<elf-button @click=\${showBottomLeft}>${t("bottomLeftButton")}</elf-button>
<elf-button color="danger" @click=\${closeAll}>${t("closeAll")}</elf-button>`;

const script = `const showTopLeft = () => {
  ElfNotification({
    title: "${t("topLeftTitle")}",
    message: "${t("topLeftMessage")}",
    position: "top-left",
    duration: 0
  });
};

const closeAll = () => ElfNotification.closeAll();`;

const PageNotificationEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground
    :title=${t("section")}
    :code=${code}
    :script=${script}
  >
    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
      <elf-button @click=${showNormal}>${t("topRightButton")}</elf-button>
      <elf-button @click=${showTopLeft}>${t("topLeftButton")}</elf-button>
      <elf-button @click=${showBottomRight}>${t("bottomRightButton")}</elf-button>
      <elf-button @click=${showBottomLeft}>${t("bottomLeftButton")}</elf-button>
      <elf-button color="danger" @click=${closeAll}>${t("closeAll")}</elf-button>
    </div>
  </elf-playground>
`);

export { PageNotificationEx2 };
