import { defineHtml, useComponents } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";
import { PageAutocompleteProps } from "./props";
import { PageAutocompleteEx1 } from "./ex1";
import { PageAutocompleteEx2 } from "./ex2";
import { PageAutocompleteEx3 } from "./ex3";
import { PageAutocompleteEx4 } from "./ex4";
import { PageAutocompleteEx5 } from "./ex5";
import { PageAutocompleteEx6 } from "./ex6";

const t = createDocsTranslator({
  title: { zh: "自动补全", en: "Autocomplete" },
  description: {
    zh: "基于输入内容展示建议项，支持本地选项、异步建议、创建项、虚拟滚动和完整远程状态。",
    en: "Show suggestions from input with local options, async fetching, creatable entries, virtualization, and complete remote states."
  }
});

useComponents({
  "page-autocomplete-ex1": PageAutocompleteEx1,
  "page-autocomplete-ex2": PageAutocompleteEx2,
  "page-autocomplete-ex3": PageAutocompleteEx3,
  "page-autocomplete-ex4": PageAutocompleteEx4,
  "page-autocomplete-ex5": PageAutocompleteEx5,
  "page-autocomplete-ex6": PageAutocompleteEx6,
  "page-autocomplete-props": PageAutocompleteProps
});

const PageAutocomplete = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-autocomplete-ex1 />

    <page-autocomplete-ex2 />
    <page-autocomplete-ex3 />
    <page-autocomplete-ex4 />
    <page-autocomplete-ex5 />
    <page-autocomplete-ex6 />
    <page-autocomplete-props></page-autocomplete-props>
  </elf-container>
`);

export { PageAutocomplete };
