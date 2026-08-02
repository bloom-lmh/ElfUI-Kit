// elf-checkbox 类型

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps {
  modelValue: boolean | string[] | number[];
  /** 选中时使用的值（在 group 模式有意义） */
  value: string | number | boolean;
  trueValue: unknown;
  falseValue: unknown;
  label: string;
  disabled: boolean;
  size: CheckboxSize;
  /** 半选状态（仅 boolean 模式） */
  indeterminate: boolean;
  border: boolean;
  checked?: boolean;
  id: string;
  tabindex: number;
  ariaLabel: string;
  ariaControls: string;
  trueLabel: string;
  falseLabel: string;
}
