export type CollapseModelValue = string | string[];

export interface CollapseItem {
  name?: string;
  title?: string;
  content?: string;
  disabled?: boolean;
}

export interface CollapseFieldNames {
  name?: string;
  title?: string;
  content?: string;
  disabled?: string;
}

export interface CollapseProps {
  modelValue?: CollapseModelValue;
  accordion: boolean;
  items: CollapseItem[];
  props: CollapseFieldNames;
}

export interface CollapseEmits {
  "update:modelValue": [value: CollapseModelValue];
  change: [value: CollapseModelValue];
}

export interface CollapseItemProps {
  name: string | number;
  title: string;
  disabled: boolean;
  /** @internal Controlled by elf-collapse when used as a child component. */
  active: boolean;
}

export interface CollapseItemSlots {
  default?: unknown;
  title?: unknown;
  icon?: unknown;
}

export interface CollapseItemExposes {
  toggle: () => void;
  focusHeader: () => void;
}
