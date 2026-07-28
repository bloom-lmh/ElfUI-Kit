import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTreeEx1 } from "./ex1";
import { PageTreeEx2 } from "./ex2";
import { PageTreeEx3 } from "./ex3";
import { PageTreeEx4 } from "./ex4";
import { PageTreeEx5 } from "./ex5";
import { PageTreeEx6 } from "./ex6";
import { PageTreeEx7 } from "./ex7";
import { PageTreeProps } from "./props";

useComponents({
  "page-tree-ex1": PageTreeEx1,
  "page-tree-ex2": PageTreeEx2,
  "page-tree-ex3": PageTreeEx3,
  "page-tree-ex4": PageTreeEx4,
  "page-tree-ex5": PageTreeEx5,
  "page-tree-ex6": PageTreeEx6,
  "page-tree-ex7": PageTreeEx7,
  "page-tree-props": PageTreeProps
});

const t = createDocsTranslator({
  title: { zh: "Tree 树", en: "Tree" },
  description: {
    zh: "展示和操作层级数据，覆盖选择、级联勾选、过滤、懒加载、虚拟化与无障碍拖拽。",
    en: "Present and manage hierarchical data with selection, cascading checks, filtering, lazy loading, virtualization, and accessible drag and drop."
  }
});

const PageTree = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-tree-ex1 />
    <page-tree-ex2 />
    <page-tree-ex3 />
    <page-tree-ex4 />
    <page-tree-ex5 />
    <page-tree-ex6 />
    <page-tree-ex7 />
    <page-tree-props />
  </elf-container>
`);

export { PageTree };
