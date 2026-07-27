/// <!--@elf component-->

// elf-alert — 警告 / 提示
//
//   <elf-alert type="success" title="操作成功" closable />
//   <elf-alert type="danger" title="错误" description="详情..." />

import { defineEmits, defineHtml, defineProps, defineStyle, useHostAttr, useHostFlag, useRef } from "@elfui/core";

import styles from "./style.scss?inline";
import type { AlertEmits, AlertProps, AlertSlots } from "./types";
import { useLocaleProvider } from "../../Providers/context";

export type { AlertDensity, AlertEmits, AlertProps, AlertSlots, AlertType, AlertVariant } from "./types";

const props = defineProps({
  type: { type: String, default: "info" },
  variant: { type: String, default: "tonal" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  closable: { type: Boolean, default: false },
  closeText: { type: String, default: "" },
  showIcon: { type: Boolean, default: true },
  center: { type: Boolean, default: false },
  density: { type: String, default: "default" },
  prominent: { type: Boolean, default: false },
}) as unknown as Readonly<AlertProps>;

const locale = useLocaleProvider();

const emit = defineEmits<AlertEmits>(["close"]);

const closed = useRef(false);
const closing = useRef(false);

useHostFlag("data-closing", () => closing.value);
useHostFlag("data-closed", () => closed.value);
useHostAttr("type", () => props.type);
useHostAttr("variant", () => props.variant);
useHostAttr("density", () => props.density);
useHostFlag("center", () => props.center);
useHostFlag("prominent", () => props.prominent);

const onClose = (): void => {
  if (closing.value || closed.value) return;
  closing.set(true);
  emit("close");
  setTimeout(() => {
    closed.set(true);
    closing.set(false);
  }, 200);
};

defineStyle(styles);

const Alert = defineHtml(`
  <div v-if=${!closed} class="alert" part="alert" role="alert">
    <span v-if=${props.showIcon} class="icon" aria-hidden="true">
      <slot name="icon">
        <svg
          v-if=${props.type === "info"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <svg
          v-else-if=${props.type === "success"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
        <svg
          v-else-if=${props.type === "warning"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </slot>
    </span>
    <div class="body">
      <div class="title">
        <slot name="title">${props.title}</slot>
      </div>
      <div class="description">
        <slot>${props.description}</slot>
      </div>
    </div>
    <button
      v-if=${props.closable}
      class="close"
      type="button"
      :aria-label=${props.closeText || locale.t("common.close")}
      :disabled=${closing}
      @click=${onClose}
    >
      <span v-if=${props.closeText}>${props.closeText}</span>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
`);

export { Alert };
