// elf-footer 类型

export interface FooterProps {
  height: string | number;
  width: string | number;
  maxWidth: string | number;
  ariaLabel: string;
  color: string;
  elevation: number;
  border: boolean;
  rounded: boolean;
  padless: boolean;
  fixed: boolean;
  absolute: boolean;
  inset: boolean;
}

export interface FooterSlots {
  default?: unknown;
  top?: unknown;
  bottom?: unknown;
}
