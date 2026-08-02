export type SegmentedValue = string | number | boolean;
export type SegmentedSize = "sm" | "md" | "lg" | "";

export interface SegmentedOptionObject {
  label?: string;
  value?: SegmentedValue;
  disabled?: boolean;
}

export type SegmentedOption = SegmentedValue | SegmentedOptionObject;

export interface SegmentedFieldNames {
  label?: string;
  value?: string;
  disabled?: string;
}

export interface SegmentedProps {
  modelValue?: SegmentedValue;
  options: SegmentedOption[];
  size: SegmentedSize;
  disabled: boolean;
  block: boolean;
  props: SegmentedFieldNames;
  name: string;
  id: string;
  ariaLabel: string;
  label: string;
  validateEvent: boolean;
}
