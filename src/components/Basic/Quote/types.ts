export type QuoteType = "default" | "primary" | "success" | "warning" | "danger" | "info";

export type QuoteVariant = "soft" | "outlined" | "filled";

export interface QuoteProps {
  type: QuoteType;
  variant: QuoteVariant;
  title: string;
  cite: string;
  compact: boolean;
}

export interface QuoteSlots {
  default?: unknown;
  title?: unknown;
  cite?: unknown;
  icon?: unknown;
}
