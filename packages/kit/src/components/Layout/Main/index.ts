// elf-main — 主内容容器（占据剩余空间）

import { defineHtml, defineStyle } from "@elfui/core";

import styles from "./style.scss?inline";
import type { MainProps, MainSlots } from "./types";

export type { MainProps, MainSlots } from "./types";

defineStyle(styles);

const Main = defineHtml<MainProps, Record<string, never>, MainSlots>(`<slot></slot>`);

export { Main };
