import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageSegmentedProps } from "./props";
import { PageSegmentedEx1 } from "./ex1";
import { PageSegmentedEx2 } from "./ex2";

const t = createDocsTranslator({
  title: { zh: "分段控制器", en: "Segmented" },
  description: {
    zh: "在少量互斥选项中切换状态，支持受控值、禁用项、尺寸、块级布局及键盘导航。",
    en: "Switch among a small set of mutually exclusive options with controlled values, disabled items, sizes, block layout, and keyboard navigation.",
  },
  keyboard: {
    zh: "聚焦任一选项后，使用方向键、Home 和 End 在可用项之间切换。",
    en: "After focusing an option, use Arrow keys, Home, and End to move among enabled items.",
  },
});

useComponents({
  "page-segmented-ex1": PageSegmentedEx1,
  "page-segmented-ex2": PageSegmentedEx2,
  "page-segmented-props": PageSegmentedProps
});

const PageSegmented = defineHtml(`
    <elf-container>
        <h1>${t("title")}</h1>
        <p>${t("description")}</p>
        <page-segmented-ex1 />
        <page-segmented-ex2 />
        <p>${t("keyboard")}</p>
        <page-segmented-props></page-segmented-props>
    </elf-container>
`);

export { PageSegmented };
