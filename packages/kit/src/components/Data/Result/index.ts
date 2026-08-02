import { defineHtml, defineProps, defineStyle, useHostAttr } from "@elfui/core";

import styles from "./style.scss?inline";
import type { ResultIcon, ResultProps, ResultSlots } from "./types";

export type { ResultIcon, ResultProps, ResultSlots } from "./types";

const props = defineProps<ResultProps>({
  icon: { type: String, default: "info" },
  title: { type: String, default: "" },
  subTitle: { type: String, default: "" },
});

const normalizedIcon = (): ResultIcon => {
  const value = String(props.icon || "info") as ResultIcon;
  return ["success", "warning", "error"].includes(value) ? value : "info";
};

useHostAttr("icon", normalizedIcon);

defineStyle(styles);

const Result = defineHtml<ResultProps, Record<string, never>, ResultSlots>(`
  <div class="result" part="result" role="status" aria-live="polite">
    <div class="icon" part="icon">
      <slot name="icon">
        <svg
          v-if=${normalizedIcon() === "success"}
          class="icon-svg"
          data-icon="success"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path d="m13 24 7 7 15-16" />
        </svg>
        <svg
          v-else-if=${normalizedIcon() === "warning"}
          class="icon-svg"
          data-icon="warning"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path d="M24 10 40 38H8L24 10Z" />
          <path d="M24 19v9" />
          <path d="M24 33h.01" />
        </svg>
        <svg
          v-else-if=${normalizedIcon() === "error"}
          class="icon-svg"
          data-icon="error"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="15" />
          <path d="m19 19 10 10m0-10L19 29" />
        </svg>
        <svg
          v-else
          class="icon-svg"
          data-icon="info"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="15" />
          <path d="M24 22v10" />
          <path d="M24 16h.01" />
        </svg>
      </slot>
    </div>
    <div class="title" part="title">
      <slot name="title">${props.title}</slot>
    </div>
    <div class="subtitle" part="sub-title">
      <slot name="sub-title">${props.subTitle}</slot>
    </div>
    <div class="extra" part="extra">
      <slot name="extra"></slot>
    </div>
  </div>
`);

export { Result };
