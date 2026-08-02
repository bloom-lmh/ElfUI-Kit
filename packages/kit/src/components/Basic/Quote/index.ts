import {
  defineHtml,
  defineProps,
  defineStyle,
  useHost,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { QuoteProps, QuoteSlots, QuoteType, QuoteVariant } from "./types";

export type { QuoteProps, QuoteSlots, QuoteType, QuoteVariant } from "./types";

const TYPES: readonly QuoteType[] = ["default", "primary", "success", "warning", "danger", "info"];

const props = defineProps<QuoteProps>({
  type: { type: String, default: "default" },
  variant: { type: String, default: "soft" },
  title: { type: String, default: "" },
  cite: { type: String, default: "" },
  compact: { type: Boolean, default: false },
});

const host = useHost();
const slotVersion = useRef(0);

const normalizedType = (): QuoteType =>
  TYPES.includes(props.type as QuoteType) ? (props.type as QuoteType) : "default";

const normalizedVariant = (): QuoteVariant =>
  props.variant === "outlined" || props.variant === "filled" ? props.variant : "soft";

const hasNamedSlot = (name: "title" | "cite"): boolean => {
  void slotVersion.value;
  return Boolean(host.querySelector(`[slot="${name}"]`));
};

const onSlotChange = (): void => slotVersion.set(slotVersion.value + 1);

useHostAttr("type", normalizedType);
useHostAttr("variant", normalizedVariant);
useHostFlag("compact", () => Boolean(props.compact));

defineStyle(styles);

const Quote = defineHtml<QuoteProps, Record<string, never>, QuoteSlots>(`
  <blockquote
    class="quote"
    part="quote"
  >
    <span
      class="accent"
      aria-hidden="true"
    ></span>
    <span
      class="icon"
      part="icon"
    >
      <slot name="icon"></slot>
    </span>
    <div
      class="content"
      part="content"
    >
      <div
        :class=${["title", { "is-empty": !props.title && !hasNamedSlot("title") }]}
        part="title"
      >
        <slot
          name="title"
          @slotchange=${onSlotChange}
        >${props.title}</slot>
      </div>
      <div
        class="body"
        part="body"
      >
        <slot></slot>
      </div>
      <footer
        :class=${["cite", { "is-empty": !props.cite && !hasNamedSlot("cite") }]}
        part="cite"
      >
        <cite>
          <slot
            name="cite"
            @slotchange=${onSlotChange}
          >${props.cite}</slot>
        </cite>
      </footer>
    </div>
  </blockquote>
`);

export { Quote };
