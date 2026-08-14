import type { FormField, FormItemSize, FormRules, ValidateField } from "../../../types/form";

export type {
  FormField,
  FormRule,
  FormRules,
  RuleTrigger,
  ValidateField,
} from "../../../types/form";

export interface FormExpose {
  validate(): Promise<boolean>;
  validateField: ValidateField;
  resetFields(prop?: string | string[]): void;
  scrollToField(prop: string, options?: ScrollIntoViewOptions | boolean): void;
  clearValidate(prop?: string | string[]): void;
  getField(prop: string): FormField | undefined;
  setInitialValues(values?: Record<string, unknown>): void;
  readonly fields: readonly FormField[];
}

export interface FormEmits {
  validate: [prop: string, isValid: boolean, message: string];
  submit: [event: Event];
}

export interface FormProps {
  model: Record<string, unknown>;
  rules: FormRules;
  size: FormItemSize;
  disabled: boolean;
  labelPosition: "top" | "left" | "right";
  labelWidth: string;
  labelSuffix: string;
  inline: boolean;
  /** Hides the required-field asterisk next to labels. */
  hideRequiredAsterisk: boolean;
  requireAsteriskPosition: "left" | "right";
  showMessage: boolean;
  inlineMessage: boolean;
  statusIcon: boolean;
  /** Revalidates registered fields when the rules object changes. */
  validateOnRuleChange: boolean;
  /** Scrolls the first invalid field into view after aggregate validation. */
  scrollToError: boolean;
  scrollIntoViewOptions: ScrollIntoViewOptions | boolean;
  /** Prevents the native submit default before emitting the public event. */
  preventSubmit: boolean;
}
