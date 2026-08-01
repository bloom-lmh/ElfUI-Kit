import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageDrawerEx1 } from "./ex1";
import { PageDrawerEx2 } from "./ex2";
import { PageDrawerEx3 } from "./ex3";
import { PageDrawerEx4 } from "./ex4";
import { PageDrawerProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "Drawer 抽屉", en: "Drawer" },
  description: {
    zh: "从屏幕边缘滑出的任务面板，支持四个方向、非模态模式和可调整尺寸。",
    en: "A task panel that slides from any screen edge with non-modal and resizable modes.",
  },
});

useComponents({
  "page-drawer-ex1": PageDrawerEx1,
  "page-drawer-ex2": PageDrawerEx2,
  "page-drawer-ex3": PageDrawerEx3,
  "page-drawer-ex4": PageDrawerEx4,
  "page-drawer-props": PageDrawerProps,
});

const PageDrawer = defineHtml(`
  <elf-container>
    <elf-docs-hero category="feedback" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-drawer-ex1></page-drawer-ex1>
    <page-drawer-ex2></page-drawer-ex2>
    <page-drawer-ex3></page-drawer-ex3>
    <page-drawer-ex4></page-drawer-ex4>
    <page-drawer-props></page-drawer-props>
  </elf-container>
`);

export { PageDrawer };
