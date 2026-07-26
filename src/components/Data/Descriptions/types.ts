export type DescriptionsDirection = "horizontal" | "vertical";
export type DescriptionsSize = "sm" | "md" | "lg" | "";
export type DescriptionValue = string | number | boolean | null | undefined;

export interface DescriptionItem {
  key?: string | number;
  label?: string;
  value?: DescriptionValue;
  span?: number;
}

export type DescriptionSourceItem = DescriptionItem | Record<string, unknown>;

export interface DescriptionsFieldNames {
  key?: string;
  label?: string;
  value?: string;
  span?: string;
}

export interface DescriptionsProps {
  title: string;
  extra: string;
  items: DescriptionSourceItem[];
  column: number;
  responsive: boolean;
  border: boolean;
  direction: DescriptionsDirection;
  size: DescriptionsSize;
  emptyText: string;
  props: DescriptionsFieldNames;
}

export interface DescriptionsSlots {
  default?: unknown;
  title?: unknown;
  extra?: unknown;
  empty?: unknown;
}
