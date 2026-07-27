import { defineEmits, defineHtml, defineProps, defineStyle } from "@elfui/core";

import styles from "./style.scss?inline";
import type { PageHeaderEmits, PageHeaderProps, PageHeaderSlots } from "./types";

export type { PageHeaderEmits, PageHeaderProps, PageHeaderSlots } from "./types";

const props = defineProps<PageHeaderProps>({
  title: { type: String, default: "Back" },
  content: { type: String, default: "" },
  icon: { type: String, default: "‹" },
});

const emit = defineEmits<PageHeaderEmits>(["back"]);

const onBack = (): void => {
  emit("back");
};

defineStyle(styles);

const PageHeader = defineHtml<PageHeaderProps, PageHeaderEmits, PageHeaderSlots>(`
  <header class="page-header" part="page-header">
    <div class="breadcrumb" part="breadcrumb">
      <slot name="breadcrumb"></slot>
    </div>
    <div class="main">
      <button class="back" type="button" part="back" :aria-label=${props.title} @click=${onBack}>
        <span class="icon"><slot name="icon">${props.icon}</slot></span>
        <span><slot name="title">${props.title}</slot></span>
      </button>
      <span class="divider" aria-hidden="true"></span>
      <div class="content">
        <div class="heading"><slot name="content">${props.content}</slot></div>
      </div>
    </div>
    <div class="extra" part="extra">
      <slot name="extra"></slot>
    </div>
  </header>
`);

export { PageHeader };
