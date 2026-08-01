import type { ThemeTokens } from "../context";
import {
  getMaterialColorPalette,
  type MaterialColorFamily,
  type MaterialColorTone,
} from "./material-colors";

/** Legacy-stable identifiers used by persisted application theme preferences. */
export type ThemePresetId = "material" | "midnight" | "forest" | "violet" | "sunset";

/** One complete built-in theme assembled from the shared Material palette registry. */
export interface ThemePreset {
  id: ThemePresetId;
  label: string;
  labelZh: string;
  dark: boolean;
  providerTheme: "light" | "dark" | "custom";
  tokens: ThemeTokens;
}

const materialColor = (family: MaterialColorFamily, tone: MaterialColorTone): string => {
  const color = family.colors[tone];
  if (!color) throw new Error(`Material color ${family.id}.${tone} is unavailable`);
  return color;
};

const BLUE = getMaterialColorPalette("blue");
const INDIGO = getMaterialColorPalette("indigo");
const TEAL = getMaterialColorPalette("teal");
const DEEP_PURPLE = getMaterialColorPalette("deep-purple");
const DEEP_ORANGE = getMaterialColorPalette("deep-orange");
const GREEN = getMaterialColorPalette("green");
const ORANGE = getMaterialColorPalette("orange");
const RED = getMaterialColorPalette("red");
const PINK = getMaterialColorPalette("pink");
const LIGHT_BLUE = getMaterialColorPalette("light-blue");
const GREY = getMaterialColorPalette("grey");

const LIGHT_FOUNDATION: ThemeTokens = {
  secondary: materialColor(PINK, "darken1"),
  success: materialColor(GREEN, "darken3"),
  warning: materialColor(ORANGE, "darken3"),
  danger: materialColor(RED, "darken2"),
  info: materialColor(LIGHT_BLUE, "darken2"),
  textPrimary: "rgba(0, 0, 0, 0.87)",
  textSecondary: "rgba(0, 0, 0, 0.6)",
  textDisabled: "rgba(0, 0, 0, 0.38)",
  textOnPrimary: "#FFFFFF",
  bgDefault: "#FFFFFF",
  bgPaper: "#FFFFFF",
  bgOverlay: "rgba(0, 0, 0, 0.04)",
  fieldBg: materialColor(GREY, "lighten3"),
  fieldHoverBg: materialColor(GREY, "lighten2"),
  border: "rgba(0, 0, 0, 0.12)",
  borderStrong: "rgba(0, 0, 0, 0.23)",
  divider: "rgba(0, 0, 0, 0.08)",
  overlayBackdrop: "rgba(0, 0, 0, 0.48)",
};

/** Default light theme tokens backed by the Material Blue color family. */
export const LIGHT_THEME_TOKENS: ThemeTokens = {
  ...LIGHT_FOUNDATION,
  primary: materialColor(BLUE, "darken2"),
  primaryHover: materialColor(BLUE, "darken3"),
  primaryActive: materialColor(BLUE, "darken4"),
};

/** Default dark theme tokens backed by the Material Indigo color family. */
export const DARK_THEME_TOKENS: ThemeTokens = {
  primary: materialColor(INDIGO, "lighten2"),
  primaryHover: materialColor(INDIGO, "lighten1"),
  primaryActive: materialColor(INDIGO, "base"),
  secondary: materialColor(PINK, "lighten3"),
  success: materialColor(GREEN, "lighten1"),
  warning: materialColor(ORANGE, "lighten1"),
  danger: materialColor(RED, "lighten1"),
  info: materialColor(LIGHT_BLUE, "lighten2"),
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

/** Built-in Material theme presets in their public display order. */
export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: "material",
    label: "Material blue",
    labelZh: "Material 蓝",
    dark: false,
    providerTheme: "light",
    tokens: LIGHT_THEME_TOKENS,
  },
  {
    id: "midnight",
    label: "Material indigo",
    labelZh: "Material 靛蓝",
    dark: true,
    providerTheme: "dark",
    tokens: DARK_THEME_TOKENS,
  },
  {
    id: "forest",
    label: "Material teal",
    labelZh: "Material 青绿",
    dark: false,
    providerTheme: "custom",
    tokens: {
      ...LIGHT_FOUNDATION,
      primary: materialColor(TEAL, "darken2"),
      primaryHover: materialColor(TEAL, "darken3"),
      primaryActive: materialColor(TEAL, "darken4"),
      bgOverlay: materialColor(TEAL, "lighten5"),
      fieldHoverBg: materialColor(TEAL, "lighten5"),
    },
  },
  {
    id: "violet",
    label: "Material deep purple",
    labelZh: "Material 深紫",
    dark: false,
    providerTheme: "custom",
    tokens: {
      ...LIGHT_FOUNDATION,
      primary: materialColor(DEEP_PURPLE, "base"),
      primaryHover: materialColor(DEEP_PURPLE, "darken1"),
      primaryActive: materialColor(DEEP_PURPLE, "darken2"),
      bgOverlay: materialColor(DEEP_PURPLE, "lighten5"),
      fieldHoverBg: materialColor(DEEP_PURPLE, "lighten5"),
    },
  },
  {
    id: "sunset",
    label: "Material deep orange",
    labelZh: "Material 深橙",
    dark: false,
    providerTheme: "custom",
    tokens: {
      ...LIGHT_FOUNDATION,
      primary: materialColor(DEEP_ORANGE, "darken2"),
      primaryHover: materialColor(DEEP_ORANGE, "darken3"),
      primaryActive: materialColor(DEEP_ORANGE, "darken4"),
      bgOverlay: materialColor(DEEP_ORANGE, "lighten5"),
      fieldHoverBg: materialColor(DEEP_ORANGE, "lighten5"),
    },
  },
];

/** Resolves a built-in preset while keeping Material Blue as the stable fallback. */
export const getThemePreset = (id: string): ThemePreset =>
  THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0]!;
