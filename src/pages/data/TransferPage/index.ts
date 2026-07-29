import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageTransferEx1 } from "./ex1";
import { PageTransferEx2 } from "./ex2";
import { PageTransferEx3 } from "./ex3";
import { PageTransferEx4 } from "./ex4";
import { PageTransferEx5 } from "./ex5";
import { PageTransferEx6 } from "./ex6";
import { PageTransferProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "穿梭框", en: "Transfer" },
  description: {
    zh: "双栏穿梭选择框，支持搜索过滤、全选、自定义字段名与虚拟化。",
    en: "A dual-panel selector with filtering, select all, custom field mappings, and virtualization."
  }
});

useComponents({
  "page-transfer-ex1": PageTransferEx1,
  "page-transfer-ex2": PageTransferEx2,
  "page-transfer-ex3": PageTransferEx3,
  "page-transfer-ex4": PageTransferEx4,
  "page-transfer-ex5": PageTransferEx5,
  "page-transfer-ex6": PageTransferEx6,
  "page-transfer-props": PageTransferProps
});

const PageTransfer = defineHtml(`
  <elf-container
    ><h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-transfer-ex1 /><page-transfer-ex2 /><page-transfer-ex3 /><page-transfer-ex4 /><page-transfer-ex5 /><page-transfer-ex6 /><page-transfer-props
  /></elf-container>
`);

export { PageTransfer };
