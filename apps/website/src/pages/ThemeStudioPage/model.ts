import { THEME_TOKEN_VARS, type ThemeTokens } from "@elfui/kit";

export interface ThemeTokenField {
  key: keyof ThemeTokens;
  label: string;
  group: "Primary" | "Semantic" | "Surface" | "Text";
  basic?: boolean;
}

export const THEME_COLOR_FIELDS: readonly ThemeTokenField[] = [
  { key: "primary", label: "Primary / 500", group: "Primary", basic: true },
  { key: "primaryHover", label: "Hover / 600", group: "Primary" },
  { key: "primaryActive", label: "Active / 700", group: "Primary" },
  { key: "secondary", label: "Secondary", group: "Primary" },
  { key: "success", label: "Success", group: "Semantic" },
  { key: "warning", label: "Warning", group: "Semantic" },
  { key: "danger", label: "Danger", group: "Semantic" },
  { key: "info", label: "Info", group: "Semantic" },
  { key: "bgDefault", label: "Page background", group: "Surface", basic: true },
  { key: "bgPaper", label: "Surface", group: "Surface", basic: true },
  { key: "bgOverlay", label: "Subtle surface", group: "Surface" },
  { key: "fieldBg", label: "Field", group: "Surface" },
  { key: "fieldHoverBg", label: "Field hover", group: "Surface" },
  { key: "border", label: "Border", group: "Surface" },
  { key: "borderStrong", label: "Strong border", group: "Surface" },
  { key: "textPrimary", label: "Text primary", group: "Text", basic: true },
  { key: "textSecondary", label: "Text secondary", group: "Text" },
  { key: "textDisabled", label: "Text disabled", group: "Text" },
  { key: "textOnPrimary", label: "Text on primary", group: "Text" },
];

const hexToRgb = (hex: string): [number, number, number] | null => {
  const value = String(hex || "")
    .trim()
    .replace(/^#/, "");
  if (!/^[\da-f]{6}$/i.test(value)) return null;
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16)) as [
    number,
    number,
    number,
  ];
};

const rgbToHex = (channels: readonly number[]): string =>
  `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

const mixHex = (hex: string, target: "#000000" | "#FFFFFF", weight: number): string => {
  const source = hexToRgb(hex);
  const destination = hexToRgb(target);
  if (!source || !destination) return hex;
  return rgbToHex(
    source.map((channel, index) => channel + (destination[index]! - channel) * weight),
  );
};

/** Derives interaction colors while keeping semantic and neutral tokens independent. */
export const derivePrimaryTokens = (primary: string, dark: boolean): ThemeTokens => ({
  primary,
  primaryHover: mixHex(primary, "#000000", dark ? 0.15 : 0.14),
  primaryActive: mixHex(primary, "#000000", dark ? 0.28 : 0.26),
  bgOverlay: mixHex(primary, dark ? "#000000" : "#FFFFFF", dark ? 0.72 : 0.92),
});

const relativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const channels = rgb.map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
};

export const contrastRatio = (foreground: string, background: string): number => {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
};

export type ThemeExportFormat = "config" | "json" | "css";

export const createThemeExport = (
  format: ThemeExportFormat,
  name: string,
  dark: boolean,
  tokens: ThemeTokens,
): string => {
  if (format === "css") {
    return (Object.entries(tokens) as Array<[keyof ThemeTokens, string | number]>)
      .filter(([key, value]) => Boolean(THEME_TOKEN_VARS[key]) && value !== "")
      .map(([key, value]) => `  ${THEME_TOKEN_VARS[key]}: ${String(value)};`)
      .reduce((output, line) => `${output}\n${line}`, `:root[data-theme="${name}"] {`)
      .concat("\n}");
  }

  const payload = {
    version: 1,
    name,
    dark,
    theme: { theme: "custom", tokens },
  };
  if (format === "json") return JSON.stringify(payload, null, 2);

  return `import { defineElfUIConfig } from "@elfui/kit";\n\nexport const themeConfig = defineElfUIConfig(${JSON.stringify(
    { theme: payload.theme },
    null,
    2,
  )});`;
};
