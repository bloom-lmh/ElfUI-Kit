import type {
  FormItemSize,
  FormItemValidateState,
  FormRule,
  RuleTrigger,
} from "../../../types/form";

export type { FormItemSize, FormItemValidateState } from "../../../types/form";

export interface FormItemProps {
  prop: string;
  label: string;
  labelPosition: "top" | "left" | "right" | "";
  labelWidth: string;
  rules: FormRule[];
  required: boolean;
  size: FormItemSize | "";
  /** Overrides the current validation result with an external error message. */
  error: string;
  for: string;
  validateStatus: FormItemValidateState;
  trigger: RuleTrigger | "";
  /** Places feedback beside the control instead of below it. */
  inlineMessage?: boolean;
  /** Controls whether validation feedback is rendered. */
  showMessage?: boolean;
}

export interface ValidateError {
  prop: string;
  trigger?: RuleTrigger;
  message: string;
}

export interface FormItemExpose {
  readonly validateMessage: string;
  readonly validateState: FormItemValidateState;
  validate(trigger?: RuleTrigger): Promise<boolean>;
  resetField(): void;
  clearValidate(): void;
  setInitialValue(value?: unknown): void;
}

export interface FormItemEmits {
  validate: [prop: string, isValid: boolean, message: string];
}
