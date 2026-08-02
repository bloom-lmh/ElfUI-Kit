export type SwitchSize = "sm" | "md" | "lg";
export type SwitchColor = "primary" | "success" | "warning" | "danger" | "info" | string;
export type SwitchLabelPosition = "start" | "end";
export type SwitchVariant = "default" | "inset" | "material" | "square";
export type SwitchValue = string | number | boolean;

export interface SwitchProps {
  modelValue: SwitchValue;
  disabled: boolean;
  size: SwitchSize;
  variant: SwitchVariant;
  width: string | number;
  inlinePrompt: boolean;
  activeText: string;
  inactiveText: string;
  activeIcon: string;
  inactiveIcon: string;
  activeActionIcon: string;
  inactiveActionIcon: string;
  label: string;
  labelPosition: SwitchLabelPosition;
  activeValue: SwitchValue;
  inactiveValue: SwitchValue;
  beforeChange?: (next: SwitchValue) => boolean | Promise<boolean>;
  validateEvent: boolean;
  loading: boolean;
  inset: boolean;
  flat: boolean;
  color: SwitchColor;
  activeColor: string;
  inactiveColor: string;
  borderColor: string;
  id: string;
  tabindex: number;
  ariaLabel: string;
}
