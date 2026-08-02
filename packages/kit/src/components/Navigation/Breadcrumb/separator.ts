const SEPARATOR_GLYPHS: Record<string, string> = {
  "chevron-right": "›",
  chevron_right: "›",
  keyboard_arrow_right: "›",
  "arrow-right": "→",
  arrow_right: "→",
};

export const normalizeBreadcrumbSeparatorIcon = (value: unknown): string => {
  const name = String(value || "").trim();
  return SEPARATOR_GLYPHS[name] || name;
};
