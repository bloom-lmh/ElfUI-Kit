export type HeadingFamily = "guide" | "editorial" | "terminal" | "brand" | "neon" | "minimal";

export type HeadingMarkdown = "" | "bullet" | "ordered";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingAlign = "start" | "center" | "end";

export type HeadingColor =
  "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "muted";

export type HeadingWeight = "" | "regular" | "medium" | "bold";

export interface HeadingProps {
  family: HeadingFamily;
  level: HeadingLevel;
  align: HeadingAlign;
  color: HeadingColor;
  weight: HeadingWeight;
  truncated: boolean;
  lineClamp?: number | string;
  eyebrow?: string;
  numbered: boolean;
  index?: number | string;
  markdown: HeadingMarkdown;
  accent?: boolean;
  chip?: boolean;
  gradient?: boolean;
  lineHeight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  fontSize?: number | string;
  letterSpacing?: number | string;
}

export interface HeadingSlots {
  default?: unknown;
}

export type HeadingElement = HTMLElement & HeadingProps;
