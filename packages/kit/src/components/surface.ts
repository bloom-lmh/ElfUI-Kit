const SEMANTIC_COLORS: Record<string, string> = {
  primary: "var(--elf-primary)",
  secondary: "var(--elf-secondary)",
  success: "var(--elf-success)",
  warning: "var(--elf-warning)",
  danger: "var(--elf-danger)",
  info: "var(--elf-info)",
  surface: "var(--elf-bg-paper)",
  transparent: "transparent",
};

const ON_COLOR = new Set(["primary", "secondary", "success", "warning", "danger", "info"]);

export const cssSize = (value: string | number | null | undefined): string | null => {
  if (value === null || value === undefined || value === "") return null;
  return typeof value === "number" || /^\d+(?:\.\d+)?$/.test(String(value))
    ? `${value}px`
    : String(value);
};

export const surfaceColor = (value: string, fallback = "var(--elf-bg-paper)"): string =>
  SEMANTIC_COLORS[String(value || "").toLowerCase()] || String(value || fallback);

export const surfaceForeground = (value: string): string =>
  ON_COLOR.has(String(value || "").toLowerCase())
    ? "var(--elf-text-on-primary)"
    : (hexContrast(value) ?? "var(--elf-text-primary)");

const hexContrast = (value: string): string | null => {
  const match = String(value || "")
    .trim()
    .match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) return null;
  const raw =
    match[1]!.length === 3 ? [...match[1]!].map((part) => `${part}${part}`).join("") : match[1]!;
  const red = Number.parseInt(raw.slice(0, 2), 16);
  const green = Number.parseInt(raw.slice(2, 4), 16);
  const blue = Number.parseInt(raw.slice(4, 6), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 >= 150 ? "rgba(0, 0, 0, 0.87)" : "#ffffff";
};

export const surfaceShadow = (value: number): string => {
  const elevation = Math.max(0, Math.min(24, Number(value) || 0));
  if (elevation === 0) return "none";
  if (elevation <= 2) return "var(--elf-shadow-1)";
  if (elevation <= 8) return "var(--elf-shadow-2)";
  return "var(--elf-shadow-4)";
};
