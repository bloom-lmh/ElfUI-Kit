/** Shared Form protocols owned below component implementations. */

/** Validation phase used by fields and rules. */
export type RuleTrigger = "blur" | "change" | "input";

/** One declarative or custom field-validation rule. */
export interface FormRule {
  /** Requires a non-empty value. */
  required?: boolean;
  /** Minimum numeric value or string/array length. */
  min?: number;
  /** Maximum numeric value or string/array length. */
  max?: number;
  /** Exact string length. */
  length?: number;
  pattern?: RegExp;
  type?: "string" | "number" | "integer" | "float" | "boolean" | "array" | "date" | "email" | "url";
  enum?: unknown[];
  fields?: string;
  message?: string;
  trigger?: RuleTrigger | RuleTrigger[];
  /** Returns an error message, or true/undefined when validation succeeds. */
  validator?: (
    value: unknown,
    model: Record<string, unknown>,
  ) => string | true | undefined | Promise<string | true | undefined>;
}

/** Field path to validation-rule mapping for one Form. */
export type FormRules = Record<string, FormRule[]>;
/** Validates one or more registered field paths. */
export type ValidateField = (prop: string | string[], trigger?: RuleTrigger) => Promise<boolean>;
export type FormItemValidateState = "" | "validating" | "success" | "error";
export type FormItemSize = "sm" | "md" | "lg";

/** Public attributes shared by form-associated Kit fields. */
export interface NativeFormAssociatedProps {
  name: string;
  form: string;
  required: boolean;
  disabled: boolean;
}

/** Native-like validity commands exposed by every form-associated Kit field. */
export interface NativeFormControlMethods {
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

/** Stable field commands exposed by Form and implemented by FormItem. */
export interface FormField {
  readonly prop: string;
  readonly initialValue: unknown;
  readonly state: FormItemValidateState;
  readonly message: string;
  validate(trigger?: RuleTrigger): Promise<boolean>;
  clearValidate(): void;
  resetField(): void;
  setInitialValue(value?: unknown): void;
}

export interface FormContext {
  model: Record<string, unknown>;
  rules: FormRules;
  size: FormItemSize;
  disabled: boolean;
  labelPosition: "top" | "left" | "right";
  labelWidth: string;
  labelSuffix: string;
  hideRequiredAsterisk: boolean;
  requireAsteriskPosition: "left" | "right";
  showMessage: boolean;
  inlineMessage: boolean;
  statusIcon: boolean;
  inline: boolean;
  scrollIntoViewOptions: ScrollIntoViewOptions | boolean;
  registerItem(item: FormItemContext): () => void;
  unregisterItem(item: FormItemContext): void;
  validateField: ValidateField;
  validate(): Promise<boolean>;
  resetFields(props?: string | string[]): void;
  clearValidate(props?: string | string[]): void;
  notifyValidate(prop: string, isValid: boolean, message: string): void;
}

export interface FormItemContext extends FormField {
  rules: FormRule[];
  size: FormItemSize;
  validateTrigger(trigger: RuleTrigger): void;
}

export interface CheckboxGroupContext {
  modelValue: unknown[];
  disabled: boolean;
  size: FormItemSize;
  min: number;
  max: number;
  variant: "default" | "button";
  resolveValue(value: unknown): unknown;
  changeEvent(value: unknown[]): void;
}

export interface RadioGroupContext {
  modelValue: unknown;
  disabled: boolean;
  size: FormItemSize;
  name?: string;
  variant: "default" | "button";
  resolveValue(value: unknown): unknown;
  changeEvent(value: unknown): void;
}
