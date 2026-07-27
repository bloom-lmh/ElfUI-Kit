import { defineHtml, defineProps, defineStyle, useHostAttr, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import type { MenuItemProps, MenuItemSlots } from "../Menu/types";

export type { MenuItemClickDetail, MenuItemProps, MenuItemSlots } from "../Menu/types";

const props = defineProps<MenuItemProps>({
  index: { type: String, default: "" },
  title: { type: String, default: "" },
  icon: { type: String, default: "" },
  badge: { type: [String, Number], default: "" },
  route: { type: [String, Object], default: "" },
  disabled: { type: Boolean, default: false },
});

useHostAttr("role", () => "none");
useHostFlag("data-disabled", () => Boolean(props.disabled));

defineStyle(styles);

const MenuItem = defineHtml<MenuItemProps, Record<string, never>, MenuItemSlots>(`
  <slot name="title"></slot>
  <slot></slot>
`);

export { MenuItem };
