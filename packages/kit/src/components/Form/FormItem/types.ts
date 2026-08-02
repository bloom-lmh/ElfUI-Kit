// elf-form-item 类型

import type { FormRule, RuleTrigger } from "../Form/types";

export type FormItemValidateState = "" | "validating" | "success" | "error";
export type FormItemSize = "sm" | "md" | "lg";

export interface FormItemProps {
  prop: string;
  label: string;
  labelPosition: "top" | "left" | "right" | "";
  labelWidth: string;
  rules: FormRule[];
  required: boolean;
  size: FormItemSize | "";
  /** 手动设置错误信息（覆盖校验结果） */
  error: string;
  for: string;
  validateStatus: FormItemValidateState;
  trigger: RuleTrigger | "";
  /** 错误信息显示模式：底部（默认）或行内 */
  inlineMessage?: boolean;
  /** 是否显示错误信息 */
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
