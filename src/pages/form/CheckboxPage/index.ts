import { defineHtml, useComponents } from "@elfui/core";
import { PageCheckboxEx1 } from "./ex1";
import { PageCheckboxEx2 } from "./ex2";
import { PageCheckboxEx3 } from "./ex3";
import { PageCheckboxEx4 } from "./ex4";
import { PageCheckboxProps } from "./props";

useComponents({
  "page-checkbox-ex1": PageCheckboxEx1,
  "page-checkbox-ex2": PageCheckboxEx2,
  "page-checkbox-ex3": PageCheckboxEx3,
  "page-checkbox-ex4": PageCheckboxEx4,
  "page-checkbox-props": PageCheckboxProps
});

const PageCheckbox = defineHtml(`
  <elf-container>
    <h1>Checkbox 复选框</h1>
    <page-checkbox-ex1 />
    <page-checkbox-ex2 />
    <page-checkbox-ex3 />
    <page-checkbox-ex4 />
    <page-checkbox-props />
  </elf-container>
`);

export { PageCheckbox };
