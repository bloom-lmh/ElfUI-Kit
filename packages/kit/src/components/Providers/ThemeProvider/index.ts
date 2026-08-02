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
import { DARK_THEME_TOKENS, LIGHT_THEME_TOKENS } from "./presets";
import type { ThemeDefinition, ThemeProviderProps } from "./types";

export type { ThemeDefinition, ThemeProviderProps, ThemeProviderTheme, ThemeTokens } from "./types";

export { DARK_THEME_TOKENS, LIGHT_THEME_TOKENS } from "./presets";
export { THEME_PRESETS, getThemePreset } from "./presets";
export type { ThemePreset, ThemePresetId } from "./presets";
export {
  MATERIAL_COLOR_PALETTES,
  MATERIAL_COLOR_TONES,
  getMaterialColorPalette,
} from "./material-colors";
export type { MaterialColorFamily, MaterialColorTone } from "./material-colors";

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

const configuredTheme = (): string => String(props.theme || "light").toLowerCase();

const resolvedTheme = (): string => {
  const configured = configuredTheme();
  return configured === "system" ? (systemDark.value ? "dark" : "light") : configured;
};

const themeDefinition = (): ThemeDefinition | undefined => (props.themes || {})[resolvedTheme()];

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
