import { defineHtml, defineProps, defineStyle } from "@elfui/core";

import styles from "./style.scss?inline";
import type { DropdownMenuProps, DropdownMenuSlots } from "../Dropdown/types";

export type { DropdownMenuProps, DropdownMenuSlots } from "../Dropdown/types";

const props = defineProps<DropdownMenuProps>({
  role: { type: String, default: "menu" }
});

defineStyle(styles);

const DropdownMenu = defineHtml<DropdownMenuProps, Record<string, never>, DropdownMenuSlots>(`
  <div class="dropdown-menu" part="menu" :role=${props.role || "menu"}><slot></slot></div>
`);

export { DropdownMenu };
