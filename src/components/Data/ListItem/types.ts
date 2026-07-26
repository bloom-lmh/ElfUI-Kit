export interface ListItemProps {
  title: string;
  subtitle: string;
  value: string | number;
  active: boolean;
  disabled: boolean;
  clickable: boolean;
  lines: "one" | "two" | "three";
}

export interface ListItemEmits {
  click: [MouseEvent];
  select: [string | number];
}

export interface ListItemSlots {
  default?: unknown;
  leading?: unknown;
  trailing?: unknown;
}

export interface ListItemExposes {
  /** Focus the item's interactive surface when it is clickable and enabled. */
  focusItem(): void;
}
