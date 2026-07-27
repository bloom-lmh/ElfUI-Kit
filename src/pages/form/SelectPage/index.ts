import { defineHtml, useComponents } from "@elfui/core";
import { PageSelectEx1 } from "./ex1";
import { PageSelectEx2 } from "./ex2";
import { PageSelectEx3 } from "./ex3";
import { PageSelectEx4 } from "./ex4";
import { PageSelectEx5 } from "./ex5";
import { PageSelectProps } from "./props";

useComponents({
  "page-select-ex1": PageSelectEx1,
  "page-select-ex2": PageSelectEx2,
  "page-select-ex3": PageSelectEx3,
  "page-select-ex4": PageSelectEx4,
  "page-select-ex5": PageSelectEx5,
  "page-select-props": PageSelectProps
});

const PageSelect = defineHtml(`
  <elf-container>
    <h1>Select 选择器</h1>
    <page-select-ex1 />
    <page-select-ex2 />
    <page-select-ex3 />
    <page-select-ex4 />
    <page-select-ex5 />
    <page-select-props />
  </elf-container>
`);

export { PageSelect };
