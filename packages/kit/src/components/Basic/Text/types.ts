export type TextType = "primary" | "success" | "warning" | "danger" | "info" | "";
export type TextSize = "small" | "default" | "large" | "sm" | "md" | "lg" | "";
export type TextTag =
  | "span"
  | "p"
  | "div"
  | "b"
  | "strong"
  | "i"
  | "em"
  | "sub"
  | "sup"
  | "mark"
  | "del"
  | "ins"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export interface TextProps {
  type: TextType;
  size: TextSize;
  truncated: boolean;
  lineClamp?: number | string;
  tag: TextTag | string;
  mark: boolean;
  deleted: boolean;
  inserted: boolean;
  strong: boolean;
  italic: boolean;
}

export interface TextSlots {
  default?: unknown;
}
