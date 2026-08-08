import { defineHtml, defineProps, defineStyle, useComponents } from "@elfui/core";

import { Link } from "@elfui/kit-src/components/Basic/Link";
import styles from "./style.scss?inline";
import type { OverviewCardProps, OverviewCardSlots } from "./types";

export type { OverviewCardProps, OverviewCardSlots } from "./types";

const props = defineProps<OverviewCardProps>({
  title: { type: String, default: "" },
  href: { type: String, default: "" },
  badge: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
});

useComponents({ "elf-link": Link });
defineStyle(styles);

const OverviewCard = defineHtml<OverviewCardProps, Record<string, never>, OverviewCardSlots>(`
  <elf-link
    class="card"
    part="root"
    :to=${props.href || "/"}
    .underline=${false}
  >
    <span class="sr-only">${props.ariaLabel || props.title}</span>
    <span class="surface" aria-hidden="true">
      <span class="header" part="header">
        <span class="title">${props.title}</span>
        <span v-if=${props.badge} class="badge">${props.badge}</span>
      </span>
      <span class="preview" part="preview">
        <slot></slot>
      </span>
    </span>
  </elf-link>
`);

export { OverviewCard };
