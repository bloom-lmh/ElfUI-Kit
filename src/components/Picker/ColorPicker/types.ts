import type { FieldVariant } from "../../../types/field";

export type ColorFormat = "hex" | "rgb";
export type ColorPickerVariant = FieldVariant;

export interface ColorPreset {
  label?: string;
  value: string;
}

export interface ColorPickerProps {
  modelValue: string;
  format: ColorFormat;
  colorFormat: ColorFormat | "";
  variant: ColorPickerVariant;
  label: string;
  presets: Array<string | ColorPreset>;
  predefine: Array<string | ColorPreset>;
  showAlpha: boolean;
  disabled: boolean;
  clearable: boolean;
  size: "small" | "default" | "large" | "sm" | "md" | "lg" | "";
  tabindex: string | number;
  id: string;
  name: string;
  ariaLabel: string;
  valueOnClear: string | (() => string) | undefined;
  emptyValues: unknown[];
  validateEvent: boolean;
  teleported: boolean;
  persistent: boolean;
  popperClass: string;
  popperStyle: Record<string, string>;
  border: boolean;
}

export interface ColorPickerExpose {
  show: () => void;
  hide: () => void;
  focusInput: () => void;
  blurInput: () => void;
  update: (value: string) => void;
  readonly inputRef: HTMLInputElement | null;
}

export type ColorPickerElement = HTMLElement & ColorPickerExpose;
