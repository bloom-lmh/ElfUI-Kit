import { defineHtml, defineProps, defineStyle, useHostFlag } from "@elfui/core";

import type { CarouselItemProps } from "../Carousel/types";
import { useLocaleProvider } from "../../Providers/context";
import styles from "./style.scss?inline";

export type { CarouselItemProps } from "../Carousel/types";

const props = defineProps<CarouselItemProps>({
  name: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  active: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

const locale = useLocaleProvider();

// Derived state
const generatedAriaLabel = (): string => {
  if (props.ariaLabel) return props.ariaLabel;
  const index = props.index + 1;
  if (locale.name.toLowerCase().startsWith("en")) {
    return `${props.label || "Slide"} ${index} of ${props.total}`;
  }
  return props.label
    ? `${props.label}，第 ${index} 张，共 ${props.total} 张`
    : `第 ${index} 张，共 ${props.total} 张`;
};

useHostFlag("active", () => Boolean(props.active));

defineStyle(styles);

const CarouselItem = defineHtml(`
    <div
        class="carousel-item"
        role="group"
        aria-roledescription="slide"
        :aria-label=${generatedAriaLabel()}
        :aria-hidden=${props.active ? "false" : "true"}
    >
        <slot></slot>
        <span v-if=${props.label} class="carousel-item__label">${props.label}</span>
    </div>
`);

export { CarouselItem };
