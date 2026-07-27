import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
  useRef
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";

const ICONS: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "×",
  error: "×"
};

const props = defineProps({
  message: { type: String, default: "" },
  type: { type: String, default: "info" },
  position: { type: String, default: "top" },
  closable: { type: Boolean, default: false },
  action: { type: String, default: "" }
});

const emit = defineEmits(["close", "action"]);
const locale = useLocaleProvider();
const closing = useRef(false);

useHostFlag("data-closing", () => closing.value);
useHostAttr("position", () => (props.position === "bottom" ? "bottom" : "top"));

const close = (): void => {
  closing.set(true);
  emit("close");
};

const triggerAction = (): void => {
  emit("action");
};
const icon = (): string => ICONS[String(props.type)] ?? "i";

defineExpose({ close });
defineStyle(styles);

const Message = defineHtml(`
  <div class="message" part="message" role="status" aria-live="polite" aria-atomic="true">
    <span class="accent" aria-hidden="true"></span>
    <span class="icon" aria-hidden="true">${icon()}</span>
    <span class="content"><slot>${props.message}</slot></span>
    <button
      v-if=${props.action}
      class="action"
      type="button"
      @click.stop=${triggerAction}
    >
      ${props.action}
    </button>
    <button
      v-if=${props.closable}
      class="close"
      type="button"
      @click.stop=${close}
      :aria-label=${locale.t("a11y.closeMessage")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18"></path>
      </svg>
    </button>
  </div>
`);

export { Message };
