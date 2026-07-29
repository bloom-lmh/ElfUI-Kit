import { defineHtml } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback/Message";
import { useThemeProvider } from "../../../components/Providers/context";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  message: { zh: "浮层继承了局部暗色主题", en: "The overlay inherited the local dark theme" },
  action: { zh: "打开主题浮层", en: "Open themed overlay" },
});
const theme = useThemeProvider();
const showThemedMessage = (): void => {
  ElfMessage.success(t("message"), {
    closable: true,
    duration: 3600,
    themeTokens: theme?.tokens
  });
};

const PageThemeServiceTrigger = defineHtml(`
  <elf-button size="small" @click=${showThemedMessage}>${t("action")}</elf-button>
`);

export { PageThemeServiceTrigger };
