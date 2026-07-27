import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  useHost,
  useHostAttr,
  useHostCssVar,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { AnchorLinkProps, AnchorLinkSlots } from "../Anchor/types";

export type { AnchorLinkProps, AnchorLinkSlots } from "../Anchor/types";

const props = defineProps<AnchorLinkProps>({
  title: { type: String, default: "" },
  href: { type: String, default: "" },
  active: { type: Boolean, default: false },
  level: { type: Number, default: 0 },
  direction: { type: String, default: "vertical" },
});

const host = useHost();
const hasDefaultContent = useRef(false);

const syncDefaultContent = (): void => {
  hasDefaultContent.set(
    Array.from(host.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
      if (!(node instanceof HTMLElement)) return false;
      return node.getAttribute("slot") !== "sub-link";
    }),
  );
};

const onClick = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
  if (!props.href) return;
  host.dispatchEvent(
    new CustomEvent("elf-anchor-link-click", {
      bubbles: true,
      composed: true,
      detail: { href: props.href, event },
    }),
  );
};

useHostFlag("data-active", () => props.active);
useHostFlag("data-has-default-content", () => hasDefaultContent.value);
useHostAttr("data-direction", () => (props.direction === "horizontal" ? "horizontal" : "vertical"));
useHostAttr("data-level", () => Math.max(0, Math.trunc(Number(props.level) || 0)));
useHostCssVar("--_level", () => String(Math.max(0, Math.trunc(Number(props.level) || 0))));

onMounted(syncDefaultContent);

defineStyle(styles);

const AnchorLink = defineHtml<AnchorLinkProps, Record<string, never>, AnchorLinkSlots>(`
  <li class="item" part="item">
    <a class="link" :href=${props.href || "#"} :aria-current=${props.active ? "true" : null} @click=${onClick}>
      <span class="title">${props.title}</span>
      <slot @slotchange=${syncDefaultContent}></slot>
    </a>
    <div class="sub-links" part="sub-links"><slot name="sub-link"></slot></div>
  </li>
`);

export { AnchorLink };
