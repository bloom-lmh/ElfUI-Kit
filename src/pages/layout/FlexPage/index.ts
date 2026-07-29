import { defineHtml, useComponents } from "@elfui/core";

import { createDocsTranslator } from "../../docsLocale";
import { PageFlexEx1 } from "./ex1";
import { PageFlexEx2 } from "./ex2";
import { PageFlexEx3 } from "./ex3";
import { PageFlexEx4 } from "./ex4";
import { PageFlexProps } from "./props";

const t = createDocsTranslator({
  title: { zh: "弹性布局", en: "Flex layout" },
  description: {
    zh: "一个页面覆盖弹性容器、剩余空间项与间距兼容输入，以统一编号结构图展示方向、对齐、换行和空间分配。",
    en: "One page covers Flex, Spacer, and Space-compatible inputs with consistent numbered diagrams for direction, alignment, wrapping, and space distribution."
  }
});

useComponents({
  "page-flex-ex1": PageFlexEx1,
  "page-flex-ex2": PageFlexEx2,
  "page-flex-ex3": PageFlexEx3,
  "page-flex-ex4": PageFlexEx4,
  "page-flex-props": PageFlexProps
});

const PageFlex = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>
    <page-flex-ex1 />
    <page-flex-ex2 />
    <page-flex-ex3 />
    <page-flex-ex4 />
    <page-flex-props />
  </elf-container>
`);

export { PageFlex };
