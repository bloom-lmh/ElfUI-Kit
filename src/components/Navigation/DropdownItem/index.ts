import { defineHtml, defineProps, defineStyle, useHost, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import type { DropdownCommand, DropdownItem, DropdownItemProps, DropdownItemSlots } from "../Dropdown/types";

export type { DropdownItemProps, DropdownItemSlots } from "../Dropdown/types";

const props = defineProps<DropdownItemProps>({
  command: { type: null, default: "" },
  disabled: { type: Boolean, default: false },
  divided: { type: Boolean, default: false },
  icon: { type: String, default: "" },
  selected: { type: Boolean, default: false },
});

const host = useHost();

const label = (): string => {
  const content = Array.from(host.childNodes)
    .filter((node) => !(node instanceof HTMLElement && node.getAttribute("slot") === "icon"))
    .map((node) => node.textContent || "")
    .join("")
    .trim();
  return content || String(props.command ?? "");
};

const onClick = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
  if (props.disabled) return;
  const item: DropdownItem = {
    label: label(),
    command: props.command as DropdownCommand,
    disabled: false,
    divided: Boolean(props.divided),
    icon: String(props.icon || ""),
  };
  host.dispatchEvent(
    new CustomEvent("elf-dropdown-item-command", {
      bubbles: true,
      composed: true,
      detail: { command: props.command, label: item.label, item },
    }),
  );
};

useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-divided", () => Boolean(props.divided));
useHostFlag("data-selected", () => Boolean(props.selected));

defineStyle(styles);

const DropdownItem = defineHtml<DropdownItemProps, Record<string, never>, DropdownItemSlots>(`
  <button
    class="dropdown-item"
    part="item"
    type="button"
    role="menuitem"
    :class="{ 'is-selected': props.selected }"
    :disabled=${props.disabled}
    :aria-label=${label()}
    :aria-current=${props.selected ? "true" : null}
    @click=${onClick}
  >
    <span class="icon" part="icon" aria-hidden="true"><slot name="icon">${props.icon}</slot></span>
    <span class="label"><slot></slot></span>
  </button>
`);

export { DropdownItem };
