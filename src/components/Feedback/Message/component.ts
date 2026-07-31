import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  useHostAttr,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import type { MessageEmits, MessageExpose, MessageProps, MessageSlots } from "./types";

const ICONS: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  danger: "×",
  error: "×",
};

const props = defineProps<MessageProps>({
  message: { type: String, default: "" },
  type: { type: String, default: "info" },
  position: { type: String, default: "top" },
  closable: { type: Boolean, default: false },
  action: { type: String, default: "" },
});

const emit = defineEmits<MessageEmits>(["close", "action"]);
const locale = useLocaleProvider();
const visible = useRef(true);
let closeEmitted = false;

useHostAttr("position", () => (props.position === "bottom" ? "bottom" : "top"));

/** Starts the framework-owned leave transaction exactly once. */
const close = (): void => {
  if (!visible.peek()) return;
  visible.set(false);
};

/** Notifies the service only after the structural leave has finished. */
const onAfterLeave = (): void => {
  if (closeEmitted) return;
  closeEmitted = true;
  emit("close");
};

onBeforeUnmount(onAfterLeave);

const triggerAction = (): void => {
  emit("action");
};
const icon = (): string => ICONS[String(props.type)] ?? "i";

defineExpose<MessageExpose>({ close });
defineStyle(styles);

const Message = defineHtml<MessageProps, MessageEmits, MessageSlots>(`
  <Transition name="elf-message" appear @after-leave=${onAfterLeave}>
    <div
      v-if=${visible}
      class="message"
      part="message"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
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
  </Transition>
`);

export { Message };
