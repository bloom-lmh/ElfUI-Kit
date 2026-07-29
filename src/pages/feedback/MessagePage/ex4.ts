import { defineHtml, useRef } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "操作与位置", en: "Actions and placement" },
  waiting: { zh: "等待交互", en: "Waiting for interaction" },
  saved: { zh: "草稿已保存，可立即查看详情", en: "The draft was saved. You can view its details now." },
  view: { zh: "查看", en: "View" },
  actionClicked: { zh: "点击了操作按钮", en: "The action button was clicked" },
  closed: { zh: "提示已关闭", en: "The message was closed" },
  syncing: { zh: "同步任务正在后台运行", en: "The sync task is running in the background." },
  undo: { zh: "撤销", en: "Undo" },
  undone: { zh: "已撤销同步任务", en: "The sync task was undone" },
  top: { zh: "顶部操作提示", en: "Top action message" },
  bottom: { zh: "底部操作提示", en: "Bottom action message" },
});

const lastEvent = useRef(t("waiting"));

const showAction = (): void => {
  ElfMessage.success(t("saved"), {
    action: t("view"),
    closable: true,
    duration: 0,
    onAction: () => lastEvent.set(t("actionClicked")),
    onClose: () => lastEvent.set(t("closed"))
  });
};

const showBottom = (): void => {
  ElfMessage.info(t("syncing"), {
    position: "bottom",
    offset: 32,
    action: t("undo"),
    closable: true,
    duration: 0,
    onAction: () => lastEvent.set(t("undone"))
  });
};

const code = `<elf-button color="success" @click=\${showAction}>${t("top")}</elf-button>
<elf-button @click=\${showBottom}>${t("bottom")}</elf-button>`;

const script = `const showAction = () => {
  ElfMessage.success("${t("saved")}", {
    action: "${t("view")}", closable: true, duration: 0,
    onAction: () => {}, onClose: () => {}
  });
};

const showBottom = () => {
  ElfMessage.info("${t("syncing")}", {
    position: "bottom", offset: 32, action: "${t("undo")}", closable: true, duration: 0
  });
};`;

const PageMessageEx4 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button color="success" @click=${showAction}>${t("top")}</elf-button>
    <elf-button @click=${showBottom}>${t("bottom")}</elf-button>
    <span slot="status" class="demo-state">${lastEvent}</span>
  </elf-playground>
`);

export { PageMessageEx4 };
