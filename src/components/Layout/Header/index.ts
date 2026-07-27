// elf-header — 顶栏容器
//
//   <elf-header height="56px">brand + nav</elf-header>

import { defineHtml, defineProps, defineStyle, useHostCssVar } from "@elfui/core";

import styles from "./style.scss?inline";
import type { HeaderProps, HeaderSlots } from "./types";

export type { HeaderProps, HeaderSlots } from "./types";

const props = defineProps<HeaderProps>({
  height: { type: String, default: "60px" }
});

useHostCssVar("--_height", () => props.height);

defineStyle(styles);

const Header = defineHtml<HeaderProps, Record<string, never>, HeaderSlots>(`<slot></slot>`);

export { Header };
