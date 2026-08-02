import { defineHtml } from "@elfui/core";
import { ElfMessage } from "@elfui/kit-src/components/Feedback";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  section: { zh: "可关闭", en: "Closable" },
  message: {
    zh: "这条提示会保持显示，可手动关闭",
    en: "This message stays visible until it is closed manually.",
  },
  show: { zh: "显示常驻提示", en: "Show persistent message" },
});

const showClosable = (): void => {
  ElfMessage({ message: t("message"), closable: true, duration: 0 });
};

const code = `<elf-button @click=\${showClosable}>${t("show")}</elf-button>`;
const script = `const showClosable = () => {
  ElfMessage({ message: "${t("message")}", closable: true, duration: 0 });
};`;

const PageMessageEx2 = defineHtml(`
  <h2>${t("section")}</h2>
  <elf-playground :title=${t("section")} :code=${code} :script=${script}>
    <elf-button @click=${showClosable}>${t("show")}</elf-button>
  </elf-playground>
`);

export { PageMessageEx2 };
