import { defineHtml, defineProps, defineStyle, useHostAttr, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import type { SubMenuProps, SubMenuSlots } from "../Menu/types";

export type { SubMenuProps, SubMenuSlots } from "../Menu/types";

const props = defineProps<SubMenuProps>({
  index: { type: String, default: "" },
  title: { type: String, default: "" },
  icon: { type: String, default: "" },
  badge: { type: [String, Number], default: "" },
  disabled: { type: Boolean, default: false },
  popperClass: { type: String, default: "" },
  popperStyle: { type: [String, Object], default: () => ({}) },
  showTimeout: { type: Number, default: undefined },
  hideTimeout: { type: Number, default: undefined },
  teleported: { type: Boolean, default: undefined },
  popperOffset: { type: Number, default: undefined },
  expandCloseIcon: { type: String, default: "" },
  expandOpenIcon: { type: String, default: "" },
  collapseCloseIcon: { type: String, default: "" },
  collapseOpenIcon: { type: String, default: "" },
});

useHostAttr("role", () => "none");
useHostFlag("data-disabled", () => Boolean(props.disabled));

defineStyle(styles);

const SubMenu = defineHtml<SubMenuProps, Record<string, never>, SubMenuSlots>(`
  <slot name="title"></slot>
  <slot></slot>
`);

export { SubMenu };
