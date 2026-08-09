import { defineHtml } from "@elfui/core";
import { ElfMessage } from "@elfui/kit";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "基础类型", en: "Basic types" },
  infoMessage: { zh: "这是一条普通提示", en: "This is an informational message." },
  successMessage: { zh: "操作已成功完成", en: "The operation completed successfully." },
  warningMessage: { zh: "请检查当前配置", en: "Please review the current configuration." },
  dangerMessage: {
    zh: "操作失败，请稍后重试",
    en: "The operation failed. Please try again later.",
  },
});

const showInfo = (): void => {
  ElfMessage.info(t("infoMessage"));
};
const showSuccess = (): void => {
  ElfMessage.success(t("successMessage"));
};
const showWarning = (): void => {
  ElfMessage.warning(t("warningMessage"));
};
const showDanger = (): void => {
  ElfMessage.danger(t("dangerMessage"));
};

const code = `<elf-button @click=\${showInfo}>info</elf-button>
<elf-button color="success" @click=\${showSuccess}>success</elf-button>
<elf-button color="warning" @click=\${showWarning}>warning</elf-button>
<elf-button color="danger" @click=\${showDanger}>danger</elf-button>`;

const script = `const showInfo = () => ElfMessage.info("${t("infoMessage")}");
const showSuccess = () => ElfMessage.success("${t("successMessage")}");
const showWarning = () => ElfMessage.warning("${t("warningMessage")}");
const showDanger = () => ElfMessage.danger("${t("dangerMessage")}");`;

const PageMessageEx1 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${showInfo}>info</elf-button>
    <elf-button color="success" @click=${showSuccess}>success</elf-button>
    <elf-button color="warning" @click=${showWarning}>warning</elf-button>
    <elf-button color="danger" @click=${showDanger}>danger</elf-button>
  </elf-playground>
`);

export { PageMessageEx1 };
