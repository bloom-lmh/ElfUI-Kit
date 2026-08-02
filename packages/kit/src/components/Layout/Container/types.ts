// elf-container 类型定义

/** Container 最大宽度档位 */
export type ContainerMaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | "full";

/** Container 内边距档位 */
export type ContainerPadding = "0" | "sm" | "md" | "lg";

export interface ContainerProps {
  maxWidth: ContainerMaxWidth;
  padding: ContainerPadding;
  fluid: boolean;
}

export interface ContainerSlots {
  default?: unknown;
}
