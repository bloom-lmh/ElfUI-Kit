// elf-footer — 底栏容器
//
//   <elf-footer height="40px">© 2026 ElfUI</elf-footer>

import { defineHtml, defineProps, defineStyle, useHostCssVar } from "@elfui/core";

import styles from "./style.scss?inline";
import type { FooterProps, FooterSlots } from "./types";

export type { FooterProps, FooterSlots } from "./types";

const props = defineProps<FooterProps>({
  height: { type: String, default: "60px" }
});

useHostCssVar("--_height", () => props.height);

defineStyle(styles);

const Footer = defineHtml<FooterProps, Record<string, never>, FooterSlots>(`<slot></slot>`);

export { Footer };
