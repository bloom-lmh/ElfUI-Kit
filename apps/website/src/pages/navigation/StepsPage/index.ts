import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageStepsEx1 } from "./ex1";
import { PageStepsEx2 } from "./ex2";
import { PageStepsEx3 } from "./ex3";
import { PageStepsEx4 } from "./ex4";
import { PageStepsProps } from "./props";

useComponents({
  "page-steps-ex1": PageStepsEx1,
  "page-steps-ex2": PageStepsEx2,
  "page-steps-ex3": PageStepsEx3,
  "page-steps-ex4": PageStepsEx4,
  "page-steps-props": PageStepsProps,
});

const t = createDocsTranslator({
  title: { zh: "Steps 步骤条", en: "Steps" },
  description: {
    zh: "引导用户沿既定流程完成任务。支持线性、可编辑、内容面板、水平与垂直布局。",
    en: "Guide users through a defined process with linear or editable navigation, integrated panels, and horizontal or vertical layouts.",
  },
});

const PageSteps = defineHtml(`
  <elf-container>
    <elf-docs-hero category="navigation" tag="Steps" :title=${t("title")} :description=${t("description")}></elf-docs-hero>
    <page-steps-ex4></page-steps-ex4>
    <page-steps-ex1></page-steps-ex1>
    <page-steps-ex2></page-steps-ex2>
    <page-steps-ex3></page-steps-ex3>
    <page-steps-props></page-steps-props>
  </elf-container>
`);

export { PageSteps };
