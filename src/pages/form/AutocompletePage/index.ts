import { defineHtml, useComponents } from "@elfui/core";
import { PageAutocompleteProps } from "./props";
import { PageAutocompleteEx1 } from "./ex1";
import { PageAutocompleteEx2 } from "./ex2";
import { PageAutocompleteEx3 } from "./ex3";
import { PageAutocompleteEx4 } from "./ex4";
import { PageAutocompleteEx5 } from "./ex5";
import { PageAutocompleteEx6 } from "./ex6";

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
    <h1>Autocomplete 自动补全</h1>
    <p>基于输入内容展示建议项，支持本地 options、异步 fetchSuggestions、清空和选中事件。</p>

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
