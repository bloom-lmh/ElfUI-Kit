export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps {
  modelValue: string | number | boolean;
  value: string | number | boolean;
  label: string;
  disabled: boolean;
  size: RadioSize;
  border: boolean;
  id: string;
  name: string;
  ariaLabel: string;
  tabindex: number;
  validateEvent: boolean;
}
