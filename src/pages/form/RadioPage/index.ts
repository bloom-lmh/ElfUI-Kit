import { defineHtml, useComponents } from "@elfui/core";
import { PageRadioEx1 } from "./ex1";
import { PageRadioEx2 } from "./ex2";
import { PageRadioEx3 } from "./ex3";
import { PageRadioEx4 } from "./ex4";
import { PageRadioProps } from "./props";

useComponents({
  "page-radio-ex1": PageRadioEx1,
  "page-radio-ex2": PageRadioEx2,
  "page-radio-ex3": PageRadioEx3,
  "page-radio-ex4": PageRadioEx4,
  "page-radio-props": PageRadioProps
});

const PageRadio = defineHtml(`
  <elf-container>
    <h1>Radio 单选</h1>
    <page-radio-ex1 />
    <page-radio-ex2 />
    <page-radio-ex3 />
    <page-radio-ex4 />
    <page-radio-props />
  </elf-container>
`);

export { PageRadio };
