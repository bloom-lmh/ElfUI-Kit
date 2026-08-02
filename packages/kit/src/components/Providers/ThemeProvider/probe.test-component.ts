import { defineExpose, defineHtml } from "@elfui/core";
import { useThemeProvider } from "../context";

const theme = useThemeProvider();
const applyTo = (target: HTMLElement): void => theme?.applyTo(target);

defineExpose({ applyTo });

const ThemeProviderProbe = defineHtml(`
  <span>${theme?.theme}|${theme?.isDark}|${theme?.tokens.primary}|${theme?.tokens.bgPaper}</span>
`);

export { ThemeProviderProbe };
