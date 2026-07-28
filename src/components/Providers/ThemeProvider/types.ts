import type { ThemeTokens } from "../context";

export type ThemeProviderTheme = "light" | "dark" | "system" | "custom" | string;

export interface ThemeDefinition {
  dark?: boolean;
  tokens?: ThemeTokens;
}

export interface ThemeProviderProps {
  theme: ThemeProviderTheme;
  themes: Record<string, ThemeDefinition>;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  background: string;
  surface: string;
  textColor: string;
  tokens: ThemeTokens;
  inherit: boolean;
}

export type { ThemeTokens };
