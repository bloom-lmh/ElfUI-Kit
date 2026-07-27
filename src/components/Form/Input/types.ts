// elf-input 类型

import type { FieldVariant } from "../../../types/field";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "number"
  | "date"
  | "datetime-local"
  | "month"
  | "time"
  | "week";

export type InputSize = "sm" | "md" | "lg" | "small" | "default" | "large";

export type InputDensity = "default" | "comfortable" | "compact";

export type InputWordLimitPosition = "inside" | "outside";

export type InputVariant = FieldVariant;

export type InputNativeValue = string | number;

export interface InputModelModifiers {
  trim?: boolean;
  number?: boolean;
  lazy?: boolean;
}

export type InputFormatter = (value: string) => string;

export type InputParser = (value: string) => string;

export type InputGraphemeCounter = (value: string) => number;

export interface InputProps {
  modelValue: InputNativeValue;
  modelModifiers: InputModelModifiers;
  type: InputType;
  size: InputSize;
  /** Material field density. Non-default density overrides the legacy size height. */
  density: InputDensity;
  variant: InputVariant;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  clearable: boolean;
  maxlength: number | undefined;
  minlength: number | undefined;
  showWordLimit: boolean;
  wordLimitPosition: InputWordLimitPosition;
  clearIcon: string;
  formatter?: InputFormatter;
  parser?: InputParser;
  showPassword: boolean;
  prefixIcon: string;
  suffixIcon: string;
  prependIcon: string;
  appendIcon: string;
  autocomplete: string;
  max: string | number | undefined;
  min: string | number | undefined;
  step: string | number | undefined;
  autofocus: boolean;
  form: string;
  ariaLabel: string;
  tabindex: string | number | undefined;
  validateEvent: boolean;
  inputStyle: string | Record<string, string | number>;
  /** Overrides the field surface while preserving theme-aware text and focus styles. */
  backgroundColor: string;
  label: string;
  inputmode: string;
  countGraphemes?: InputGraphemeCounter;
  id: string;
  name: string;
}
