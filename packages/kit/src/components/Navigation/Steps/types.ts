// elf-steps 类型定义

export type StepStatus = "wait" | "process" | "finish" | "error";
export type StepsDirection = "horizontal" | "vertical";
export type StepsSize = "sm" | "md" | "lg";

export interface StepItem {
  title: string;
  description?: string;
  content?: string;
  icon?: string;
  status?: StepStatus;
  disabled?: boolean;
  value?: string | number;
}

export interface StepProps {
  title?: string;
  description?: string;
  icon?: string;
  status?: StepStatus | "";
  disabled?: boolean;
  value?: string | number;
}

export interface StepSlots {
  icon?: unknown;
  title?: unknown;
  description?: unknown;
}

export interface StepsProps {
  active: number;
  direction: StepsDirection;
  items: StepItem[];
  space?: string | number;
  processStatus: StepStatus;
  finishStatus: StepStatus;
  alignCenter: boolean;
  simple: boolean;
  size: StepsSize;
  clickable: boolean;
  alternativeLabel: boolean;
  altLabels: boolean;
  editable: boolean;
  linear: boolean;
  showPanels: boolean;
  hideActions: boolean;
  previousText: string;
  nextText: string;
}

export interface StepsChangeDetail {
  active: number;
  item: StepItem;
}

export interface StepsSlots {
  default?: unknown;
  panel?: unknown;
}

export interface StepsExpose {
  readonly activeIndex: number;
  next: () => void;
  prev: () => void;
  setActive: (index: number) => void;
}
