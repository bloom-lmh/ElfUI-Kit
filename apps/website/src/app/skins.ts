import type { ThemeTokens } from "@elfui/kit-src/components/Providers/context";
import { THEME_PRESETS } from "@elfui/kit-src/components/Providers/ThemeProvider/presets";

export interface AppSkin {
  id: string;
  label: string;
  providerTheme: "light" | "dark" | "custom";
  dark: boolean;
  tokens: ThemeTokens;
}

export const APP_SKINS: AppSkin[] = THEME_PRESETS.map((preset) => ({
  id: preset.id,
  label: preset.label,
  providerTheme: preset.providerTheme,
  dark: preset.dark,
  tokens: { ...preset.tokens },
}));
