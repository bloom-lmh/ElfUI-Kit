import type { FieldVariant } from "../../../types/field";

export type InputNumberSize = "sm" | "md" | "lg" | "";
export type InputNumberDensity = "default" | "comfortable" | "compact";
export type InputNumberControlsPosition = "" | "right";
export type InputNumberControlVariant = "default" | "stacked" | "split" | "hidden";

export interface InputNumberProps {
  modelValue?: number | null;
  min?: number;
  max?: number;
  step: number;
  stepStrictly: boolean;
  precision?: number;
  disabled: boolean;
  required: boolean;
  readonly: boolean;
  controls: boolean;
  controlsPosition: InputNumberControlsPosition;
  controlVariant: InputNumberControlVariant;
  reverse: boolean;
  inset: boolean;
  hideInput: boolean;
  size: InputNumberSize;
  density: InputNumberDensity;
  variant: FieldVariant;
  label: string;
  backgroundColor: string;
  placeholder: string;
  name: string;
  form: string;
  valueOnClear?: number | null;
  validateEvent: boolean;
}
