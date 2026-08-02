export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingVariant =
  | "display"
  | "hero"
  | "page"
  | "section"
  | "subsection"
  | "card"
  | "overline"
  | "eyebrow"
  | "stat"
  | "label"
  | "caption";

export type HeadingAlign = "start" | "center" | "end";

export type HeadingColor =
  "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "muted";

export type HeadingWeight = "" | "regular" | "medium" | "bold";

export interface HeadingProps {
  level: HeadingLevel;
  variant: HeadingVariant;
  align: HeadingAlign;
  color: HeadingColor;
  weight: HeadingWeight;
  truncated: boolean;
  lineClamp?: number | string;
  eyebrow?: string;
  index?: number | string;
  accent: boolean;
  chip: boolean;
}

export interface HeadingSlots {
  default?: unknown;
}

export type HeadingElement = HTMLElement & HeadingProps;
