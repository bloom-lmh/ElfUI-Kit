import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";
import { PageCheckboxEx1 } from "./ex1";
import { PageCheckboxEx2 } from "./ex2";
import { PageCheckboxEx3 } from "./ex3";
import { PageCheckboxEx4 } from "./ex4";
import { PageCheckboxProps } from "./props";

const p = createDocsPicker();

useComponents({
  "page-checkbox-ex1": PageCheckboxEx1,
  "page-checkbox-ex2": PageCheckboxEx2,
  "page-checkbox-ex3": PageCheckboxEx3,
  "page-checkbox-ex4": PageCheckboxEx4,
  "page-checkbox-props": PageCheckboxProps
});

const PageCheckbox = defineHtml(`
  <elf-container>
    <h1>${p("复选框", "Checkbox")}</h1>
    <p>${p("用于单项开关和多项选择，支持选项组、数量限制、按钮外观与非布尔值映射。", "Use checkboxes for standalone toggles and multiple selection with groups, selection limits, button styling, and non-boolean value mapping.")}</p>
    <page-checkbox-ex1 />
    <page-checkbox-ex2 />
    <page-checkbox-ex3 />
    <page-checkbox-ex4 />
    <page-checkbox-props />
  </elf-container>
`);

export { PageCheckbox };
