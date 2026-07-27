// elf-aside — 侧边栏容器
//
//   <elf-aside width="220px">导航</elf-aside>

import { defineHtml, defineProps, defineStyle, useHostCssVar } from "@elfui/core";

import styles from "./style.scss?inline";
import type { AsideProps, AsideSlots } from "./types";

export type { AsideProps, AsideSlots } from "./types";

const props = defineProps<AsideProps>({
  width: { type: String, default: "300px" },
});

useHostCssVar("--_width", () => props.width);

defineStyle(styles);

const Aside = defineHtml<AsideProps, Record<string, never>, AsideSlots>(`<slot></slot>`);

export { Aside };
