import { defineHtml, useRef } from "@elfui/core";

import { ElfMessageBox } from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "异步关闭与关闭原因", en: "Async close and close reasons" },
  open: { zh: "提交审批", en: "Submit approval" },
  title: { zh: "提交确认", en: "Submission confirmation" },
  message: {
    zh: "确认时模拟异步权限检查；取消按钮和关闭按钮返回不同原因。",
    en: "Confirmation waits for an async permission check. Cancel and close return distinct reasons.",
  },
  confirm: { zh: "提交", en: "Submit" },
  waiting: { zh: "等待操作", en: "Waiting for an action" },
  submitted: { zh: "审批已提交", en: "Approval submitted" },
  cancelled: { zh: "用户取消了提交", en: "Submission cancelled" },
  closed: { zh: "用户关闭了消息框", en: "Message box closed" },
});

const status = useRef("");
const statusText = (): string => status.value || t("waiting");
const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const openGuarded = async (): Promise<void> => {
  try {
    await ElfMessageBox.confirm(t("message"), t("title"), {
      distinguishCancelAndClose: true,
      confirmButtonText: t("confirm"),
      beforeClose: async (action) => {
        if (action === "confirm") await wait(700);
        return true;
      },
    });
    status.set(t("submitted"));
  } catch (action) {
    status.set(action === "close" ? t("closed") : t("cancelled"));
  }
};

const code = `<elf-button @click=\${openGuarded}>${t("open")}</elf-button>`;
const script = `const openGuarded = async () => {
  try {
    await ElfMessageBox.confirm("${t("message")}", "${t("title")}", {
      distinguishCancelAndClose: true,
      beforeClose: async (action) => {
        if (action === "confirm") await savePermission();
        return true;
      }
    });
  } catch (action) {
    // action is "cancel" or "close"
  }
};`;

const PageMessageBoxEx3 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${openGuarded}>${t("open")}</elf-button>
    <span slot="status" class="demo-status">${statusText()}</span>
  </elf-playground>
`);

export { PageMessageBoxEx3 };
