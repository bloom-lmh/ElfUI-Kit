export type ProgressVariant = "line" | "circle";
export type ProgressType = ProgressVariant | "dashboard";

export type ProgressStatus = "" | "primary" | "success" | "warning" | "danger" | "exception" | "info";
export type ProgressLabelPosition = "top" | "bottom" | "start" | "end";
export type ProgressValueFormatter = string | ((percent: number, value: number, max: number) => string);

export interface ProgressProps {
  percentage?: number;
  type?: ProgressType;
  value: number;
  max: number;
  variant: ProgressVariant;
  status: ProgressStatus;
  color: string;
  trackColor: string;
  height: string;
  /** Value-change transition duration in seconds. */
  transitionDuration: number;
  /** Indeterminate and striped animation duration in seconds. */
  duration: number;
  width: number;
  size: number;
  strokeWidth: number;
  strokeLinecap: "butt" | "round" | "square";
  label: string;
  labelPosition: ProgressLabelPosition;
  showText: boolean;
  hideValue: boolean;
  textInside: boolean;
  reverse: boolean;
  striped: boolean;
  stripedFlow: boolean;
  indeterminate: boolean;
  format?: (percent: number, value: number) => string;
  valueFormat?: ProgressValueFormatter;
}

export interface ProgressSlots {
  default?: unknown;
  label?: unknown;
  value?: unknown;
}
