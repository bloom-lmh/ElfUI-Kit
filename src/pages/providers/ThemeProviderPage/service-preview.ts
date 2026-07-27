import { defineHtml } from "@elfui/core";
import { ElfMessage } from "../../../components/Feedback/Message";
import { useThemeProvider } from "../../../components/Providers/context";

const theme = useThemeProvider();
const showThemedMessage = (): void => {
  ElfMessage.success("浮层继承了局部暗色主题", {
    closable: true,
    duration: 3600,
    themeTokens: theme?.tokens
  });
};

const PageThemeServiceTrigger = defineHtml(`
  <elf-button size="small" @click=${showThemedMessage}>打开主题浮层</elf-button>
`);

export { PageThemeServiceTrigger };
