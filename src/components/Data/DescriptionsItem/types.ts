export type DescriptionsItemAlign = "left" | "center" | "right" | "";

export interface DescriptionsItemProps {
  label: string;
  span: number;
  rowspan: number;
  align: DescriptionsItemAlign;
  labelAlign: DescriptionsItemAlign;
  labelWidth: string | number;
  className: string;
  labelClassName: string;
  emptyText: string;
}

export interface DescriptionsItemSlots {
  default?: unknown;
  label?: unknown;
}
