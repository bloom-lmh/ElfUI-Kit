import { PageSwitchEx1 } from "./ex1";
import { PageSwitchEx2 } from "./ex2";
import { PageSwitchEx3 } from "./ex3";
import { PageSwitchProps } from "./props";

import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  title: { zh: "开关", en: "Switch" },
  description: {
    zh: "切换相互对立的即时状态，支持文字、尺寸、加载、外观、动作图标和自定义值。",
    en: "Toggle an immediate binary state with text, sizes, loading, variants, action icons, and custom values.",
  },
});

useComponents({
  "page-switch-ex1": PageSwitchEx1,
  "page-switch-ex2": PageSwitchEx2,
  "page-switch-ex3": PageSwitchEx3,
  "page-switch-props": PageSwitchProps,
});

const PageSwitch = defineHtml(`
  <elf-container>
    <elf-docs-hero category="form" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-switch-ex1></page-switch-ex1>
    <page-switch-ex2></page-switch-ex2>
    <page-switch-ex3></page-switch-ex3>
    <page-switch-props></page-switch-props>
  </elf-container>
`);

export { PageSwitch };
