import {
  defineEmits,
  defineExpose,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
  useRef,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";

const ICONS: Record<string, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "×",
};

const props = defineProps({
  titleText: { type: String, default: "" },
  message: { type: String, default: "" },
  type: { type: String, default: "" },
  icon: { type: String, default: "" },
  position: { type: String, default: "top-right" },
  closable: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  closeIcon: { type: String, default: "×" },
});

const emit = defineEmits(["close"]);
const locale = useLocaleProvider();
const closing = useRef(false);
useHostFlag("data-closing", () => closing.value);
useHostAttr("position", () => props.position as string);

const close = (): void => {
  if (closing.peek()) return;
  closing.set(true);
  emit("close");
};

const icon = (): string => props.icon || ICONS[String(props.type)] || "";
const hasIcon = (): boolean => Boolean(icon());
const canClose = (): boolean => props.closable && props.showClose;
const hasCloseLabel = (): boolean => String(props.closeIcon).length > 1;

defineExpose({ close, closing });
defineStyle(styles);

const Notification = defineHtml(`
  <div class="notification" part="notification" role="status" aria-live="polite">
    <div v-if=${hasIcon()} :class=${["icon-box", props.type]}>
      <span class="icon">${icon()}</span>
    </div>
    <div class="content-wrapper">
      <h2 v-if=${props.titleText} class="title">${props.titleText}</h2>
      <div class="message"><slot>${props.message}</slot></div>
    </div>
    <button
      v-if=${canClose()}
      :class=${["close", { "is-label": hasCloseLabel() }]}
      type="button"
      @click.stop=${close}
      :aria-label=${hasCloseLabel() ? props.closeIcon : locale.t("a11y.closeNotification")}
    >
      ${props.closeIcon}
    </button>
  </div>
`);

export { Notification };
