import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageTreeSelectEx1 } from "./ex1";
import { PageTreeSelectEx2 } from "./ex2";
import { PageTreeSelectEx3 } from "./ex3";
import { PageTreeSelectEx4 } from "./ex4";
import { PageTreeSelectEx5 } from "./ex5";
import { PageTreeSelectProps } from "./props";

useComponents({
  "page-tree-select-ex1": PageTreeSelectEx1,
  "page-tree-select-ex2": PageTreeSelectEx2,
  "page-tree-select-ex3": PageTreeSelectEx3,
  "page-tree-select-ex4": PageTreeSelectEx4,
  "page-tree-select-ex5": PageTreeSelectEx5,
  "page-tree-select-props": PageTreeSelectProps,
});

const t = createDocsTranslator({
  title: { zh: "TreeSelect 树选择器", en: "TreeSelect" },
  description: {
    zh: "在紧凑字段中组合 Tree 的层级交互与表单选择协议，支持联动勾选、搜索、懒加载和大数据虚拟化。",
    en: "Combine Tree hierarchy with a compact form field, including cascaded checks, search, lazy loading, and large-data virtualization.",
  },
});

const PageTreeSelect = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-tree-select-ex1 />
    <page-tree-select-ex2 />
    <page-tree-select-ex3 />
    <page-tree-select-ex4 />
    <page-tree-select-ex5 />
    <page-tree-select-props />
  </elf-container>
`);

export { PageTreeSelect };
