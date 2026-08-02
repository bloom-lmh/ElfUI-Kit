import { defineEmits, defineHtml, defineProps, defineStyle, useHostAttr } from "@elfui/core";

import styles from "./style.scss?inline";
import type {
  PageHeaderAlign,
  PageHeaderEmits,
  PageHeaderMode,
  PageHeaderProps,
  PageHeaderSlots,
  PageHeaderTone,
  PageHeaderVariant,
} from "./types";

export type {
  PageHeaderAlign,
  PageHeaderEmits,
  PageHeaderMode,
  PageHeaderProps,
  PageHeaderSlots,
  PageHeaderTone,
  PageHeaderVariant,
} from "./types";

const props = defineProps<PageHeaderProps>({
  title: { type: String, default: "Back" },
  content: { type: String, default: "" },
  icon: { type: String, default: "‹" },
  titleIcon: { type: String, default: "" },
  titleIconColor: { type: String, default: "" },
  mode: { type: String, default: "standard" },
  variant: { type: String, default: "plain" },
  align: { type: String, default: "start" },
  tone: { type: String, default: "default" },
  eyebrow: { type: String, default: "" },
  tag: { type: String, default: "" },
  description: { type: String, default: "" },
  version: { type: String, default: "" },
  image: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
});

const emit = defineEmits<PageHeaderEmits>(["back"]);

const normalize = <T extends string>(value: string, values: readonly T[], fallback: T): T =>
  values.includes(value as T) ? (value as T) : fallback;
const mode = (): PageHeaderMode => normalize(props.mode, ["standard", "hero"], "standard");
const variant = (): PageHeaderVariant =>
  normalize(props.variant, ["plain", "card", "banner"], "plain");
const align = (): PageHeaderAlign => normalize(props.align, ["start", "center"], "start");
const tone = (): PageHeaderTone => normalize(props.tone, ["default", "primary", "dark"], "default");
const titleIconStyle = (): string => (props.titleIconColor ? `color:${props.titleIconColor}` : "");
const rootClass = (): unknown[] => [
  "page-header",
  `is-${mode()}`,
  `is-${variant()}`,
  `is-${align()}`,
  `is-${tone()}`,
];

useHostAttr("mode", mode);
useHostAttr("variant", variant);
useHostAttr("align", align);
useHostAttr("tone", tone);

const onBack = (): void => {
  emit("back");
};

defineStyle(styles);

const PageHeader = defineHtml<PageHeaderProps, PageHeaderEmits, PageHeaderSlots>(`
  <header :class=${rootClass()} part="page-header">
    <template v-if=${mode() === "standard"}>
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
    </template>

    <template v-else>
      <div class="hero-visual" part="visual">
        <img v-if=${props.image} :src=${props.image} :alt=${props.imageAlt} />
        <slot name="visual"></slot>
      </div>
      <div class="hero-layout">
        <div v-if=${variant() === "card"} class="hero-icon" part="icon">
          <slot name="icon">${props.icon}</slot>
        </div>
        <div class="hero-content">
          <div class="hero-eyebrow" part="breadcrumb"><slot name="eyebrow">${props.eyebrow}</slot></div>
          <div class="hero-title-row">
            <span v-if=${props.titleIcon} class="hero-title-icon" part="title-icon" :style=${titleIconStyle()} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path :d=${props.titleIcon}></path></svg>
            </span>
            <h1 class="hero-title" part="title"><slot name="title">${props.title}</slot></h1>
            <span class="hero-tag" part="tag"><slot name="tag">${props.tag}</slot></span>
          </div>
          <p class="hero-description" part="description"><slot name="description">${props.description}</slot></p>
          <div class="hero-meta" part="meta"><slot name="meta">${props.version}</slot></div>
        </div>
        <div class="hero-extra" part="extra"><slot name="extra"></slot></div>
      </div>
    </template>
  </header>
`);

export { PageHeader };
