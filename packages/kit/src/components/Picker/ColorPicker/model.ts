import type { ColorFormat, ColorPreset } from "./types";

export interface FormatColorOptions {
  color: unknown;
  format: ColorFormat;
  alpha: number;
  showAlpha: boolean;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const resolveColorFormat = (colorFormat: unknown, fallbackFormat: unknown): ColorFormat =>
  String(colorFormat || fallbackFormat || "hex").toLowerCase() === "rgb" ? "rgb" : "hex";

export const normalizeColorHex = (value: unknown): string | null => {
  const raw = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const [, red, green, blue] = raw;
    return `#${red}${red}${green}${green}${blue}${blue}`.toLowerCase();
  }

  const rgb =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i.exec(
      raw,
    );
  if (!rgb) return null;

  const channels = rgb.slice(1, 4).map((channel) => clamp(Number(channel), 0, 255));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
};

export const parseColorAlpha = (value: unknown): number | null => {
  const match = /^rgba\([^,]+,[^,]+,[^,]+,\s*(0|1|0?\.\d+)\s*\)$/i.exec(String(value || "").trim());
  return match ? Math.round(clamp(Number(match[1]), 0, 1) * 100) : null;
};

export const colorHexToRgb = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

export const formatColorValue = ({
  color,
  format,
  alpha,
  showAlpha,
}: FormatColorOptions): string => {
  const hex = normalizeColorHex(color);
  if (!hex) return "";

  if (format !== "rgb" && (!showAlpha || alpha >= 100)) return hex;

  const [red, green, blue] = colorHexToRgb(hex);
  if (!showAlpha) return `rgb(${red}, ${green}, ${blue})`;

  return `rgba(${red}, ${green}, ${blue}, ${clamp(alpha, 0, 100) / 100})`;
};

export const normalizeColorPresets = (predefine: unknown, presets: unknown): ColorPreset[] => {
  const source =
    Array.isArray(predefine) && predefine.length > 0
      ? predefine
      : Array.isArray(presets)
        ? presets
        : [];

  return source.flatMap((item): ColorPreset[] => {
    if (typeof item === "string") return [{ value: item, label: item }];
    if (!item || typeof item !== "object") return [];

    const record = item as Partial<ColorPreset>;
    const value = String(record.value || "");
    return [{ value, label: String(record.label || value) }];
  });
};
