// elf-button 类型定义

export type ButtonVariant = "contained" | "outlined" | "text";

export type ButtonColor = "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export type ButtonSize = "sm" | "md" | "lg" | "small" | "default" | "large";

export type ButtonType = "button" | "submit" | "reset";

export type ButtonShape = "default" | "round" | "circle" | "square";

export interface ButtonProps {
  type: ButtonColor | ButtonType | "";
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  shape: ButtonShape;
  disabled: boolean;
  loading: boolean;
  block: boolean;
  text: boolean;
  bg: boolean;
  link: boolean;
  round: boolean;
  circle: boolean;
  plain: boolean;
  dashed: boolean;
  autofocus: boolean;
  ariaLabel: string;
  form: string;
  nativeType: ButtonType;
  icon: string;
  loadingIcon: string;
  /** Reserved for source compatibility; ElfUI does not alter author-provided label spacing. */
  autoInsertSpace: boolean;
  dark: boolean;
  noHover: boolean;
  /** Reserved for source compatibility; use Link for navigation semantics. */
  tag: string;
  direction: "horizontal" | "vertical";
}

export type ButtonEmits = {
  click: [event: MouseEvent];
};

export interface ButtonSlots {
  default?: () => unknown;
  icon?: () => unknown;
  "suffix-icon"?: () => unknown;
  loading?: () => unknown;
}
