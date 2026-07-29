import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageVirtualTableEx1 } from "./ex1";
import { PageVirtualTableEx2 } from "./ex2";
import { PageVirtualTableEx3 } from "./ex3";
import { PageVirtualTableProps } from "./props";

useComponents({
  "page-virtual-table-ex1": PageVirtualTableEx1,
  "page-virtual-table-ex2": PageVirtualTableEx2,
  "page-virtual-table-ex3": PageVirtualTableEx3,
  "page-virtual-table-props": PageVirtualTableProps,
});

const t = createDocsTranslator({
  title: { zh: "虚拟表格", en: "VirtualTable" },
  description: {
    zh: "面向大数据表格的窗口化渲染，支持固定表头、固定数据、动态行高、固定列与层级展开。",
    en: "Windowed rendering for large tables with pinned headers, pinned data, dynamic row heights, fixed columns, and hierarchy expansion.",
  },
});

const PageVirtualTable = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-virtual-table-ex1></page-virtual-table-ex1>
    <page-virtual-table-ex2></page-virtual-table-ex2>
    <page-virtual-table-ex3></page-virtual-table-ex3>
    <page-virtual-table-props></page-virtual-table-props>
  </elf-container>
`);

export { PageVirtualTable };
