import type { FieldVariant } from "../../../types/field";

export type InputTagSize = "sm" | "md" | "lg" | "";

export interface InputTagProps {
  modelValue: string[];
  placeholder: string;
  disabled: boolean;
  required: boolean;
  readonly: boolean;
  clearable: boolean;
  max?: number;
  /** Collapses overflowing tags into a compact counter. */
  collapseTags: boolean;
  /** Number of tags kept visible while `collapseTags` is enabled. */
  maxCollapseTags: number;
  size: InputTagSize;
  variant: FieldVariant;
  label: string;
  backgroundColor: string;
  trigger: "enter" | "blur";
  tagType: string;
  tagEffect: string;
  draggable: boolean;
  validateEvent: boolean;
  name: string;
  form: string;
}
