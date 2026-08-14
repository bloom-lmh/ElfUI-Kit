export interface RadioGroupOptionProps {
  label?: string;
  value?: string;
  disabled?: string;
}

export type RadioGroupOption = string | number | boolean | Record<string, unknown>;

export interface RadioGroupProps {
  modelValue: unknown;
  disabled: boolean;
  required: boolean;
  size: "sm" | "md" | "lg";
  variant: "default" | "button";
  fill: string;
  textColor: string;
  id: string;
  name: string;
  form: string;
  ariaLabel: string;
  label: string;
  validateEvent: boolean;
  options: RadioGroupOption[];
  props: RadioGroupOptionProps;
}
