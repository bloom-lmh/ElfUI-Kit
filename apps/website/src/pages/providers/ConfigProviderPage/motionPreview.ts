import { defineHtml, defineStyle, useRef } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import styles from "./motionPreview.scss?inline";

defineStyle(styles);

const t = createDocsTranslator({
  toggle: { zh: "移动圆点", en: "Move dot" },
  hint: {
    zh: "完整动效下圆点平滑滑动；减少动效下立即到位。",
    en: "The dot slides smoothly with full motion and jumps instantly with reduced motion.",
  },
});

const moved = useRef(false);

const onToggle = (): void => {
  moved.set(!moved.value);
};
const dotClass = (): string => (moved.value ? "is-moved" : "");

const PageConfigProviderMotionPreview = defineHtml(`
  <div class="motion-preview">
    <elf-button size="sm" variant="outlined" @click=${onToggle}>
      ${t("toggle")}
    </elf-button>
    <div class="motion-track">
      <span class="motion-dot" :class=${dotClass()}></span>
    </div>
    <small class="motion-hint">${t("hint")}</small>
  </div>
`);

export { PageConfigProviderMotionPreview };
