import type { ThemeTokens } from "../context";

export type ThemeProviderTheme = "light" | "dark" | "custom" | string;

export interface ThemeProviderProps {
  theme: ThemeProviderTheme;
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
