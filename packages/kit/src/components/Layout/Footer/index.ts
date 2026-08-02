// elf-footer - 底栏容器
//
//   <elf-footer height="40px">© 2026 ElfUI</elf-footer>

import { defineHtml, defineProps, defineStyle, useHostCssVar, useHostFlag } from "@elfui/core";

import { cssSize, surfaceColor, surfaceForeground, surfaceShadow } from "../../surface";
import styles from "./style.scss?inline";
import type { FooterProps, FooterSlots } from "./types";

export type { FooterProps, FooterSlots } from "./types";

const props = defineProps<FooterProps>({
  height: { type: [String, Number], default: "60px" },
  width: { type: [String, Number], default: "100%" },
  maxWidth: { type: [String, Number], default: "" },
  ariaLabel: { type: String, default: "" },
  color: { type: String, default: "surface" },
  elevation: { type: Number, default: 0 },
  border: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  padless: { type: Boolean, default: false },
  fixed: { type: Boolean, default: false },
  absolute: { type: Boolean, default: false },
  inset: { type: Boolean, default: false },
});

useHostCssVar("--_height", () => cssSize(props.height));
useHostCssVar("--_width", () => cssSize(props.width));
useHostCssVar("--_max-width", () => cssSize(props.maxWidth));
useHostCssVar("--_footer-bg", () => surfaceColor(props.color));
useHostCssVar("--_footer-color", () => surfaceForeground(props.color));
useHostCssVar("--_footer-shadow", () => surfaceShadow(props.elevation));
useHostFlag("border", () => props.border);
useHostFlag("rounded", () => props.rounded);
useHostFlag("padless", () => props.padless);
useHostFlag("fixed", () => props.fixed);
useHostFlag("absolute", () => props.absolute);
useHostFlag("inset", () => props.inset);

defineStyle(styles);

const Footer = defineHtml<FooterProps, Record<string, never>, FooterSlots>(`
  <footer class="footer" part="footer" :aria-label=${props.ariaLabel || null}>
    <slot name="top"></slot>
    <slot></slot>
    <slot name="bottom"></slot>
  </footer>
`);

export { Footer };
