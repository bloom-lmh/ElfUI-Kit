export type BadgeType = "primary" | "success" | "warning" | "danger" | "info";

export type BadgeOffset = [number, number] | string;

export type BadgeStyle = Record<string, string | number>;

export interface BadgeSlots {
  default?: () => unknown;
  content?: () => unknown;
}

export interface BadgeProps {
  value: string | number;
  max: number;
  isDot: boolean;
  hidden: boolean;
  type: BadgeType;
  showZero: boolean;
  color: string;
  offset: BadgeOffset;
  badgeStyle: BadgeStyle;
  badgeClass: string;
  content: string | number;
}
