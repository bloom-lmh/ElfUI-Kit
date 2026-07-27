import type { FieldVariant } from "../../../types/field";

export type TextareaSize = "sm" | "md" | "lg" | "small" | "default" | "large";

export type TextareaResize = "none" | "both" | "horizontal" | "vertical";

export type TextareaWordLimitPosition = "inside" | "outside";

export type TextareaVariant = FieldVariant;

export interface TextareaAutosizeOptions {
  minRows?: number;
  maxRows?: number;
}

export interface TextareaModelModifiers {
  trim?: boolean;
  lazy?: boolean;
}

export type TextareaFormatter = (value: string) => string;

export type TextareaParser = (value: string) => string;

export type TextareaGraphemeCounter = (value: string) => number;

export interface TextareaProps {
  modelValue: string;
  modelModifiers: TextareaModelModifiers;
  size: TextareaSize;
  variant: TextareaVariant;
  backgroundColor: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  minlength: number | undefined;
  maxlength: number | undefined;
  showCount: boolean;
  showWordLimit: boolean;
  wordLimitPosition: TextareaWordLimitPosition;
  clearable: boolean;
  clearIcon: string;
  formatter?: TextareaFormatter;
  parser?: TextareaParser;
  prefixIcon: string;
  suffixIcon: string;
  rows: number;
  autosize: boolean | "" | TextareaAutosizeOptions;
  resize: TextareaResize;
  autocomplete: string;
  autofocus: boolean;
  form: string;
  ariaLabel: string;
  tabindex: string | number | undefined;
  validateEvent: boolean;
  inputStyle: string | Record<string, string | number>;
  label: string;
  inputmode: string;
  countGraphemes?: TextareaGraphemeCounter;
  id: string;
  name: string;
}
