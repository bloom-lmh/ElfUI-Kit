import { defineHtml, defineProps, defineStyle, useHostAttr } from "@elfui/core";

import styles from "./style.scss?inline";
import type { MenuItemGroupProps, MenuItemGroupSlots } from "../Menu/types";

export type { MenuItemGroupProps, MenuItemGroupSlots } from "../Menu/types";

defineProps<MenuItemGroupProps>({
  title: { type: String, default: "" },
});

useHostAttr("role", () => "none");

defineStyle(styles);

const MenuItemGroup = defineHtml<MenuItemGroupProps, Record<string, never>, MenuItemGroupSlots>(`
  <slot name="title"></slot>
  <slot></slot>
`);

export { MenuItemGroup };
