// elf-checkbox-group 类型

export interface CheckboxGroupOptionProps {
  label?: string;
  value?: string;
  disabled?: string;
}

export type CheckboxGroupOption = string | number | boolean | Record<string, unknown>;

export interface CheckboxGroupProps {
  modelValue: unknown[];
  disabled: boolean;
  size: "sm" | "md" | "lg";
  min: number;
  max: number;
  ariaLabel: string;
  variant: "default" | "button";
  fill: string;
  textColor: string;
  options: CheckboxGroupOption[];
  props: CheckboxGroupOptionProps;
}
