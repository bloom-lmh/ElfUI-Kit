import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PageDefaultsProviderEx1 } from "./ex1";
import { PageDefaultsProviderEx2 } from "./ex2";
import { PageDefaultsProviderEx3 } from "./ex3";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "DefaultsProvider 默认值提供器", en: "DefaultsProvider" },
  description: {
    zh: "为一段组件树批量设置默认属性，适合统一按钮、标签和表单控件的默认尺寸与风格。",
    en: "Applies shared default props to a component subtree, keeping buttons, tags, and form controls consistent.",
  },
});

const propsRows = [
  {
    name: "defaults",
    type: "Record<string, object>",
    default: "{}",
    desc: pick("按组件名匹配默认属性", "Default props keyed by component name."),
  },
  {
    name: "strategy",
    type: "missing | overwrite",
    default: "missing",
    desc: pick("默认值写入策略", "Default-value application strategy."),
  },
  {
    name: "deep",
    type: "boolean",
    default: "true",
    desc: pick("是否递归作用于所有后代", "Apply recursively to descendants."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用默认值下发", "Disable default propagation."),
  },
  {
    name: "reset",
    type: "boolean",
    default: "false",
    desc: pick("停止继承外层 DefaultsProvider", "Stop inheriting the outer DefaultsProvider."),
  },
];

useComponents({
  "page-defaults-provider-ex1": PageDefaultsProviderEx1,
  "page-defaults-provider-ex2": PageDefaultsProviderEx2,
  "page-defaults-provider-ex3": PageDefaultsProviderEx3,
});

const PageDefaultsProvider = defineHtml(`
  <elf-container>
    <elf-docs-hero category="providers" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <page-defaults-provider-ex1 />

    <page-defaults-provider-ex2 />

    <page-defaults-provider-ex3 />

    <elf-api-builder component="elf-defaults-provider" title="API">
    <elf-props-table role="props" title="DefaultsProvider Props" :rows="propsRows"></elf-props-table>
  </elf-api-builder>
  </elf-container>
`);

export { PageDefaultsProvider };
