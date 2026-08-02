import { defineHtml, useRef } from "@elfui/core";

import { ElfMessageBox } from "@elfui/kit-src/components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "提醒与确认", en: "Alert and confirm" },
  alert: { zh: "发布提醒", en: "Release alert" },
  confirm: { zh: "删除确认", en: "Delete confirmation" },
  alertMessage: {
    zh: "新版本已经准备好，可以开始发布。",
    en: "The new release is ready to publish.",
  },
  alertTitle: { zh: "发布检查", en: "Release check" },
  confirmMessage: {
    zh: "删除后无法恢复，是否继续？",
    en: "This action cannot be undone. Continue?",
  },
  confirmTitle: { zh: "删除记录", en: "Delete record" },
  waiting: { zh: "等待操作", en: "Waiting for an action" },
  acknowledged: { zh: "已确认发布提醒", en: "Release alert acknowledged" },
  deleted: { zh: "已确认删除", en: "Deletion confirmed" },
  cancelled: { zh: "已取消删除", en: "Deletion cancelled" },
});

const status = useRef("");
const statusText = (): string => status.value || t("waiting");

const openAlert = async (): Promise<void> => {
  await ElfMessageBox.alert(t("alertMessage"), t("alertTitle"));
  status.set(t("acknowledged"));
};

const openConfirm = async (): Promise<void> => {
  try {
    await ElfMessageBox.confirm(t("confirmMessage"), t("confirmTitle"), {
      type: "warning",
      confirmButtonText: t("confirm"),
    });
    status.set(t("deleted"));
  } catch {
    status.set(t("cancelled"));
  }
};

const code = `<elf-button @click=\${openAlert}>${t("alert")}</elf-button>
<elf-button color="danger" @click=\${openConfirm}>${t("confirm")}</elf-button>`;
const script = `const openAlert = async () => {
  await ElfMessageBox.alert("${t("alertMessage")}", "${t("alertTitle")}");
};

const openConfirm = async () => {
  try {
    await ElfMessageBox.confirm("${t("confirmMessage")}", "${t("confirmTitle")}", {
      type: "warning"
    });
  } catch (action) {
    // cancel or close
  }
};`;

const PageMessageBoxEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-space wrap>
      <elf-button @click=${openAlert}>${t("alert")}</elf-button>
      <elf-button color="danger" @click=${openConfirm}>${t("confirm")}</elf-button>
    </elf-space>
    <span slot="status" class="demo-status">${statusText()}</span>
  </elf-playground>
`);

export { PageMessageBoxEx1 };
