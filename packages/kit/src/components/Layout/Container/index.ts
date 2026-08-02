// elf-container — 居中限宽容器（Material 风格）
//
// 用法：
//   <elf-container max-width="md">...</elf-container>

import { defineHtml, defineProps, defineStyle, useHostAttr, useHostFlag } from "@elfui/core";

import styles from "./style.scss?inline";
import type { ContainerProps, ContainerSlots } from "./types";

export type { ContainerMaxWidth, ContainerPadding, ContainerProps, ContainerSlots } from "./types";

const props = defineProps<ContainerProps>({
  maxWidth: { type: String, default: "lg" },
  padding: { type: String, default: "md" },
  fluid: { type: Boolean, default: false },
});

useHostAttr("max-width", () => props.maxWidth);
useHostAttr("padding", () => props.padding);
useHostFlag("fluid", () => props.fluid);

defineStyle(styles);

const Container = defineHtml<ContainerProps, Record<string, never>, ContainerSlots>(
  `<slot></slot>`,
);

export { Container };
