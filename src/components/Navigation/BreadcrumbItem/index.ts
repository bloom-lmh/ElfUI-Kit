import { defineHtml, defineProps, defineStyle, useHost, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import { normalizeBreadcrumbSeparatorIcon } from "../Breadcrumb/separator";
import type { BreadcrumbItemProps, BreadcrumbItemSlots, BreadcrumbRouteLocation } from "../Breadcrumb/types";

export type { BreadcrumbItemProps, BreadcrumbItemSlots } from "../Breadcrumb/types";

const props = defineProps<BreadcrumbItemProps>({
  to: { type: [String, Object], default: "" },
  replace: { type: Boolean, default: false },
  current: { type: Boolean, default: false },
  last: { type: Boolean, default: false },
  separator: { type: String, default: "/" },
  separatorIcon: { type: String, default: "" },
});

const host = useHost();

const hasTarget = (): boolean => {
  if (typeof props.to === "string") return Boolean(props.to);
  const route = props.to as BreadcrumbRouteLocation;
  return Boolean(route?.path || route?.hash || route?.name);
};

const onClick = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
  if (props.current || !hasTarget()) return;
  host.dispatchEvent(
    new CustomEvent("elf-breadcrumb-item-click", {
      bubbles: true,
      composed: true,
      detail: { to: props.to, replace: Boolean(props.replace) },
    }),
  );
};

useHostFlag("data-current", () => props.current);
useHostFlag("data-last", () => props.last);

defineStyle(styles);

const BreadcrumbItem = defineHtml<BreadcrumbItemProps, Record<string, never>, BreadcrumbItemSlots>(`
  <span class="breadcrumb-item" part="item" role="listitem">
    <button v-if=${!props.current && hasTarget()} class="breadcrumb-link" type="button" @click=${onClick}>
      <slot></slot>
    </button>
    <span v-else class="breadcrumb-text" :aria-current=${props.current ? "page" : null}><slot></slot></span>
    <span v-if=${!props.last} class="breadcrumb-separator" part="separator" aria-hidden="true">
      <elf-icon
        v-if=${props.separatorIcon}
        class="breadcrumb-separator-icon"
        :name=${normalizeBreadcrumbSeparatorIcon(props.separatorIcon)}
      ></elf-icon>
      <span v-else>${props.separator || "/"}</span>
    </span>
  </span>
`);

export { BreadcrumbItem };
