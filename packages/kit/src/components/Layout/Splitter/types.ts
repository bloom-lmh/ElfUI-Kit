export interface SplitterProps {
  modelValue: number;
  min: number;
  max: number;
  vertical: boolean;
  disabled: boolean;
  collapsible: boolean;
  resizable: boolean;
  storageKey: string;
}

export interface SplitterSlots {
  first?: () => unknown;
  second?: () => unknown;
}

export interface SplitterEmits {
  "update:modelValue": [value: number];
  change: [value: number];
  "resize-start": [value: number];
  "resize-end": [value: number];
  collapse: [collapsed: boolean];
}

export interface SplitterPanelProps {
  size: number;
  min: number;
  max: number;
  collapsible: boolean;
  resizable: boolean;
  lazy: boolean;
  collapsed: boolean;
}

export interface SplitterPanelSlots {
  default?: () => unknown;
}
