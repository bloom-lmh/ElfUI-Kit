// elf-theme-provider — 通过 CSS variables 为一段子树提供局部主题

import { defineProps, defineStyle, provide, useEffect, useHost, defineHtml } from "@elfui/core";

import {
    THEME_PROVIDER_KEY,
    THEME_TOKEN_VARS,
    applyThemeTokens,
    type ThemeProviderContext,
    type ThemeTokens,
    useThemeProvider,
} from "../context";
import styles from "./style.scss?inline";
import type { ThemeProviderProps } from "./types";

export type { ThemeProviderProps, ThemeProviderTheme, ThemeTokens } from "./types";

const LIGHT_TOKENS: ThemeTokens = {
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
};

const DARK_TOKENS: ThemeTokens = {
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
};

const props = defineProps<ThemeProviderProps>({
    theme: { type: String, default: "light" },
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

const isDark = (): boolean => {
    const themeName = String(props.theme || "").toLowerCase();
    return themeName === "dark" || (themeName === "custom" && Boolean(props.inherit && parentTheme?.isDark));
};

const readTokens = (): ThemeTokens => {
    const themeName = String(props.theme || "light").toLowerCase();
    const inherited = props.inherit && parentTheme ? parentTheme.tokens : {};
    const base = themeName === "dark" ? DARK_TOKENS : themeName === "light" ? LIGHT_TOKENS : inherited;
    return {
        ...base,
        ...((props.tokens || {}) as ThemeTokens),
        ...(props.primary ? { primary: String(props.primary) } : {}),
        ...(props.secondary ? { secondary: String(props.secondary) } : {}),
        ...(props.success ? { success: String(props.success) } : {}),
        ...(props.warning ? { warning: String(props.warning) } : {}),
        ...(props.danger ? { danger: String(props.danger) } : {}),
        ...(props.info ? { info: String(props.info) } : {}),
        ...(props.background ? { bgDefault: String(props.background) } : {}),
        ...(props.surface ? { bgPaper: String(props.surface) } : {}),
        ...(props.textColor ? { textPrimary: String(props.textColor) } : {}),
    };
};

const context: ThemeProviderContext = {
    get theme() {
        return String(props.theme || "light");
    },
    get isDark() {
        return isDark();
    },
    get tokens() {
        return readTokens();
    },
    applyTo(target) {
        applyThemeTokens(target, readTokens());
        target.setAttribute("data-theme", context.theme);
    },
};

provide(THEME_PROVIDER_KEY, context);

useEffect(() => {
    const tokens = readTokens();
    for (const varName of Object.values(THEME_TOKEN_VARS)) {
        host.style.removeProperty(varName);
    }
    applyThemeTokens(host, tokens);
    host.setAttribute("data-theme", context.theme);
});

defineStyle(styles);

const ThemeProvider = defineHtml(`<slot></slot>`);

export { ThemeProvider };
