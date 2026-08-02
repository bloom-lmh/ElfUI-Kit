export const FIELD_VARIANTS = [
  "default",
  "filled",
  "outlined",
  "underlined",
  "solo",
  "solo-filled",
  "solo-inverted",
] as const;

export type FieldVariant = (typeof FIELD_VARIANTS)[number];

export const normalizeFieldVariant = (value: unknown): FieldVariant => {
  const candidate = String(value || "filled") as FieldVariant;
  return FIELD_VARIANTS.includes(candidate) ? candidate : "filled";
};
