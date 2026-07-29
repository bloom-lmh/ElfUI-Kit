import { defineHtml, useRef } from "@elfui/core";

import { ElfMessageBox } from "../../../components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "输入与校验", en: "Prompt and validation" },
  open: { zh: "邀请成员", en: "Invite member" },
  title: { zh: "添加协作者", en: "Add collaborator" },
  message: {
    zh: "输入工作邮箱，确认前会进行格式校验。",
    en: "Enter a work email. Its format is validated before confirmation.",
  },
  placeholder: { zh: "name@example.com", en: "name@example.com" },
  invalid: { zh: "请输入有效的邮箱地址", en: "Enter a valid email address" },
  waiting: { zh: "尚未邀请", en: "No invitation sent" },
  invited: { zh: "已邀请：{value}", en: "Invited: {value}" },
  cancelled: { zh: "已取消邀请", en: "Invitation cancelled" },
});

const status = useRef("");
const statusText = (): string => status.value || t("waiting");

const openPrompt = async (): Promise<void> => {
  try {
    const result = await ElfMessageBox.prompt(t("message"), t("title"), {
      inputPlaceholder: t("placeholder"),
      inputPattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      inputErrorMessage: t("invalid"),
    });
    status.set(t("invited").replace("{value}", result.value));
  } catch {
    status.set(t("cancelled"));
  }
};

const code = `<elf-button @click=\${openPrompt}>${t("open")}</elf-button>`;
const script = `const openPrompt = async () => {
  try {
    const { value } = await ElfMessageBox.prompt(
      "${t("message")}",
      "${t("title")}",
      {
        inputPlaceholder: "name@example.com",
        inputPattern: /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/,
        inputErrorMessage: "${t("invalid")}"
      }
    );
  } catch (action) {
    // cancel or close
  }
};`;

const PageMessageBoxEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${openPrompt}>${t("open")}</elf-button>
    <span slot="status" class="demo-status">${statusText()}</span>
  </elf-playground>
`);

export { PageMessageBoxEx2 };
