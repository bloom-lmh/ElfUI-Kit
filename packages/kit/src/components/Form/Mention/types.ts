import type { FieldVariant } from "../../../types/field";

export interface MentionOption {
  value?: string;
  label?: string;
  disabled?: boolean;
}

export type MentionPrefix = string | string[];
export type MentionPlacement = "top" | "bottom";
export type MentionFilterOption = (pattern: string, option: MentionOption) => boolean;
export type MentionCheckIsWhole = (pattern: string, prefix: string) => boolean;

export interface MentionProps {
  modelValue: string;
  options: MentionOption[];
  prefix: MentionPrefix;
  /** Web Component-safe alternative for multiple prefixes; `prefix` collides with Node.prefix. */
  prefixes: string[];
  placeholder: string;
  label: string;
  variant: FieldVariant;
  backgroundColor: string;
  disabled: boolean;
  required: boolean;
  rows: number;
  split: string;
  filterOption?: MentionFilterOption;
  whole: boolean;
  checkIsWhole?: MentionCheckIsWhole;
  loading: boolean;
  loadingText: string;
  placement: MentionPlacement;
  id: string;
  name: string;
  form: string;
  ariaLabel: string;
  validateEvent: boolean;
}
