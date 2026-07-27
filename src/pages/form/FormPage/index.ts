import { defineHtml, useComponents } from "@elfui/core";
import { PageFormEx1 } from "./ex1";
import { PageFormEx2 } from "./ex2";
import { PageFormEx3 } from "./ex3";
import { PageFormEx4 } from "./ex4";
import { PageFormEx5 } from "./ex5";
import { PageFormEx6 } from "./ex6";
import { PageFormProps } from "./props";

useComponents({
  "page-form-ex1": PageFormEx1,
  "page-form-ex2": PageFormEx2,
  "page-form-ex3": PageFormEx3,
  "page-form-ex4": PageFormEx4,
  "page-form-ex5": PageFormEx5,
  "page-form-ex6": PageFormEx6,
  "page-form-props": PageFormProps
});

const PageForm = defineHtml(`
  <elf-container>
    <h1>Form 表单</h1>
    <p>对标 Element Plus，model + rules 校验联动。使用 :modelValue.prop + 函数 handler。</p>
    <page-form-ex1 />
    <page-form-ex2 />
    <page-form-ex3 />
    <page-form-ex4 />
    <page-form-ex5 />
    <page-form-ex6 />
    <page-form-props />
  </elf-container>
`);

export { PageForm };
