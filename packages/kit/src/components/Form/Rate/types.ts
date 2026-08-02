export type RateSize = "sm" | "md" | "lg";

export interface RateProps {
  modelValue: number;
  max: number;
  allowHalf: boolean;
  /** Whether pointer movement previews a score before it is selected. */
  previewOnHover: boolean;
  clearable: boolean;
  disabled: boolean;
  readonly: boolean;
  size: RateSize;
  color: string;
  voidColor: string;
  disabledColor: string;
  character: string;
  voidCharacter: string;
  showText: boolean;
  showScore: boolean;
  scoreTemplate: string;
  texts: string[];
  lowThreshold: number;
  highThreshold: number;
  colors: string[];
  disabledVoidColor: string;
  icons: string[];
  voidIcon: string;
  disabledVoidIcon: string;
  textColor: string;
  id: string;
  ariaLabel: string;
  label: string;
  validateEvent: boolean;
}
