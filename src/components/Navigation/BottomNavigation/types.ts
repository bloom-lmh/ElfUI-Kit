export type BottomNavigationValue = string | number;

export interface BottomNavigationItem {
  label: string;
  value: BottomNavigationValue;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  modelValue: BottomNavigationValue | null;
  defaultValue: BottomNavigationValue | null;
  ariaLabel: string;
  color: string;
  backgroundColor: string;
  height: string | number;
  active: boolean;
  grow: boolean;
  horizontal: boolean;
  shift: boolean;
  border: boolean;
  rounded: boolean;
  fixed: boolean;
  safeArea: boolean;
  mandatory: boolean;
  elevation: number;
}

export interface BottomNavigationEmits {
  "update:modelValue": [value: BottomNavigationValue];
  change: [value: BottomNavigationValue, item: BottomNavigationItem];
}

export interface BottomNavigationSlots {
  prepend?: unknown;
  append?: unknown;
}
