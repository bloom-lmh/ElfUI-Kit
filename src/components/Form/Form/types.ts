// elf-form 类型

import type { FormItemSize } from "../FormItem/types";

/** 校验触发时机 */
export type RuleTrigger = "blur" | "change" | "input";

/** 单条规则 */
export interface FormRule {
  /** 必填 */
  required?: boolean;
  /** 最小值（数字 / 字符串长度 / 数组长度） */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 字符串长度精确等于 */
  length?: number;
  /** 正则匹配 */
  pattern?: RegExp;
  /** 类型断言 */
  type?: "string" | "number" | "integer" | "float" | "boolean" | "array" | "date" | "email" | "url";
  /** 值必须在列表中 */
  enum?: unknown[];
  /** 跨字段联动（如 "password2" 与 "password" 比较） */
  fields?: string;
  /** 错误信息（覆盖默认） */
  message?: string;
  /** 触发时机；默认 change + blur */
  trigger?: RuleTrigger | RuleTrigger[];
  /**
   * 自定义校验函数
   * - 返回 true / undefined → 通过
   * - 返回 string → 错误信息
   * - 返回 Promise → 异步校验
   */
  validator?: (
    value: unknown,
    model: Record<string, unknown>
  ) => string | true | undefined | Promise<string | true | undefined>;
}

/** 整张表的规则表 */
export type FormRules = Record<string, FormRule[]>;

/** 校验单字段 API */
export type ValidateField = (prop: string | string[], trigger?: RuleTrigger) => Promise<boolean>;

export interface FormField {
  readonly prop: string;
  readonly initialValue: unknown;
  readonly state: "" | "validating" | "success" | "error";
  readonly message: string;
  validate(trigger?: RuleTrigger): Promise<boolean>;
  clearValidate(): void;
  resetField(): void;
  setInitialValue(value?: unknown): void;
}

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

/** elf-form props */
export interface FormProps {
  model: Record<string, unknown>;
  rules: FormRules;
  size: FormItemSize;
  disabled: boolean;
  labelPosition: "top" | "left" | "right";
  labelWidth: string;
  labelSuffix: string;
  inline: boolean;
  /** 隐藏 label 必填星号 */
  hideRequiredAsterisk: boolean;
  requireAsteriskPosition: "left" | "right";
  showMessage: boolean;
  inlineMessage: boolean;
  statusIcon: boolean;
  /** rules 变化时是否重新校验 */
  validateOnRuleChange: boolean;
  /** 校验失败时滚动到第一个错误 */
  scrollToError: boolean;
  scrollIntoViewOptions: ScrollIntoViewOptions | boolean;
  /** 提交时是否阻止原生 submit */
  preventSubmit: boolean;
}
