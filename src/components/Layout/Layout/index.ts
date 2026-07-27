// elf-layout — 容器组件，按方向（vertical/horizontal）排列子区
//
// 与 elf-header / elf-aside / elf-main / elf-footer 配合：
//   <elf-layout>
//     <elf-header>顶部</elf-header>
//     <elf-layout direction="horizontal">
//       <elf-aside>侧边</elf-aside>
//       <elf-main>主内容</elf-main>
//     </elf-layout>
//     <elf-footer>底部</elf-footer>
//   </elf-layout>
//
// 未显式设置方向时，直接包含 elf-aside 会自动切换为 horizontal。

import { defineHtml, defineProps, defineStyle, onMounted, useHost, useHostAttr, useRef } from "@elfui/core";

import styles from "./style.scss?inline";
import type { LayoutDirection, LayoutProps, LayoutSlots } from "./types";

export type { LayoutDirection, LayoutProps, LayoutSlots } from "./types";

const props = defineProps<LayoutProps>({
  direction: { type: String, default: "" }
});

// Reactive state
const hasAside = useRef(false);
const host = useHost();

const syncChildren = (): void => {
  hasAside.set(Array.from(host.children).some((child) => child.tagName.toLowerCase() === "elf-aside"));
};

const resolvedDirection = (): Exclude<LayoutDirection, ""> => {
  if (props.direction === "horizontal" || props.direction === "vertical") return props.direction;
  return hasAside.value ? "horizontal" : "vertical";
};

const onSlotChange = (): void => syncChildren();

onMounted(syncChildren);
useHostAttr("data-direction", resolvedDirection);

defineStyle(styles);

const Layout = defineHtml<LayoutProps, Record<string, never>, LayoutSlots>(`<slot @slotchange=${onSlotChange}></slot>`);

export { Layout };
