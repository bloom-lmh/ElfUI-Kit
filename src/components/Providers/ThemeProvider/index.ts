// elf-theme-provider — 通过 CSS variables 为子树提供可嵌套主题。

import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  provide,
  useEffect,
  useHost,
  useRef,
} from "@elfui/core";

import {
  THEME_PROVIDER_KEY,
  THEME_TOKEN_VARS,
  applyThemeTokens,
  type ThemeProviderContext,
  type ThemeTokens,
  useThemeProvider,
} from "../context";
import styles from "./style.scss?inline";
import type {
  ThemeDefinition,
  ThemeProviderProps,
  ThemeProviderTheme,
} from "./types";

export type {
  ThemeDefinition,
  ThemeProviderProps,
  ThemeProviderTheme,
  ThemeTokens,
} from "./types";

export const LIGHT_THEME_TOKENS: ThemeTokens = {
  primary: "#1976d2",
  primaryHover: "#1565c0",
  primaryActive: "#0d47a1",
  secondary: "#d81b60",
  success: "#2e7d32",
  warning: "#ed6c02",
  danger: "#d32f2f",
  info: "#0288d1",
  textPrimary: "rgba(0, 0, 0, 0.87)",
  textSecondary: "rgba(0, 0, 0, 0.6)",
  textDisabled: "rgba(0, 0, 0, 0.38)",
  textOnPrimary: "#ffffff",
  bgDefault: "#ffffff",
  bgPaper: "#ffffff",
  bgOverlay: "rgba(0, 0, 0, 0.04)",
  fieldBg: "#eeeeee",
  fieldHoverBg: "#e7e7e7",
  border: "rgba(0, 0, 0, 0.12)",
  borderStrong: "rgba(0, 0, 0, 0.23)",
  divider: "rgba(0, 0, 0, 0.08)",
  overlayBackdrop: "rgba(0, 0, 0, 0.48)",
};

export const DARK_THEME_TOKENS: ThemeTokens = {
  primary: "#90caf9",
  primaryHover: "#64b5f6",
  primaryActive: "#42a5f5",
  secondary: "#f48fb1",
  success: "#66bb6a",
  warning: "#ffa726",
  danger: "#ef5350",
  info: "#4fc3f7",
  textPrimary: "rgba(255, 255, 255, 0.87)",
  textSecondary: "rgba(255, 255, 255, 0.6)",
  textDisabled: "rgba(255, 255, 255, 0.38)",
  textOnPrimary: "rgba(0, 0, 0, 0.87)",
  bgDefault: "#121212",
  bgPaper: "#1e1e1e",
  bgOverlay: "rgba(255, 255, 255, 0.08)",
  fieldBg: "rgba(255, 255, 255, 0.1)",
  fieldHoverBg: "rgba(255, 255, 255, 0.14)",
  border: "rgba(255, 255, 255, 0.12)",
  borderStrong: "rgba(255, 255, 255, 0.23)",
  divider: "rgba(255, 255, 255, 0.08)",
  overlayBackdrop: "rgba(0, 0, 0, 0.64)",
};

const props = defineProps<ThemeProviderProps>({
  theme: { type: String, default: "light" },
  themes: { type: Object, default: () => ({}) },
  primary: { type: String, default: "" },
  secondary: { type: String, default: "" },
  success: { type: String, default: "" },
  warning: { type: String, default: "" },
  danger: { type: String, default: "" },
  info: { type: String, default: "" },
  background: { type: String, default: "" },
  surface: { type: String, default: "" },
  textColor: { type: String, default: "" },
  tokens: { type: Object, default: () => ({}) },
  inherit: { type: Boolean, default: true },
});

const host = useHost();
const parentTheme = useThemeProvider();
const systemDark = useRef(false);

const configuredTheme = (): string =>
  String(props.theme || "light").toLowerCase();

const resolvedTheme = (): string => {
  const configured = configuredTheme();
  return configured === "system" ? (systemDark.value ? "dark" : "light") : configured;
};

const themeDefinition = (): ThemeDefinition | undefined =>
  (props.themes || {})[resolvedTheme()];

const isDark = (): boolean => {
  const name = resolvedTheme();
  const definition = themeDefinition();
  if (typeof definition?.dark === "boolean") return definition.dark;
  if (name === "dark") return true;
  if (name === "light") return false;
  return Boolean(props.inherit && parentTheme?.isDark);
};

const shorthandTokens = (): ThemeTokens => ({
  ...(props.primary ? { primary: String(props.primary) } : {}),
  ...(props.secondary ? { secondary: String(props.secondary) } : {}),
  ...(props.success ? { success: String(props.success) } : {}),
  ...(props.warning ? { warning: String(props.warning) } : {}),
  ...(props.danger ? { danger: String(props.danger) } : {}),
  ...(props.info ? { info: String(props.info) } : {}),
  ...(props.background ? { bgDefault: String(props.background) } : {}),
  ...(props.surface ? { bgPaper: String(props.surface) } : {}),
  ...(props.textColor ? { textPrimary: String(props.textColor) } : {}),
});

const baseTokens = (): ThemeTokens => {
  const name = resolvedTheme();
  if (name === "light") return LIGHT_THEME_TOKENS;
  if (name === "dark") return DARK_THEME_TOKENS;
  if (themeDefinition()) return isDark() ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;
  return props.inherit && parentTheme ? parentTheme.tokens : {};
};

const readTokens = (): ThemeTokens => ({
  ...baseTokens(),
  ...(themeDefinition()?.tokens ?? {}),
  ...((props.tokens || {}) as ThemeTokens),
  ...shorthandTokens(),
});

const clearThemeTokens = (target: HTMLElement): void => {
  for (const variable of Object.values(THEME_TOKEN_VARS)) {
    target.style.removeProperty(variable);
  }
};

const applyTheme = (target: HTMLElement): void => {
  clearThemeTokens(target);
  applyThemeTokens(target, readTokens());
  target.setAttribute("data-theme", resolvedTheme());
  target.setAttribute("data-theme-source", configuredTheme());
};

const context: ThemeProviderContext = {
  get theme() {
    return resolvedTheme();
  },
  get isDark() {
    return isDark();
  },
  get tokens() {
    return readTokens();
  },
  applyTo: applyTheme,
};

provide(THEME_PROVIDER_KEY, context);

onMounted(() => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const syncSystemTheme = (): void => systemDark.set(media.matches);
  syncSystemTheme();
  media.addEventListener?.("change", syncSystemTheme);

  return () => media.removeEventListener?.("change", syncSystemTheme);
});

useEffect(() => {
  applyTheme(host);
});

defineStyle(styles);

const ThemeProvider = defineHtml<ThemeProviderProps>(`<slot></slot>`);

export { ThemeProvider };
