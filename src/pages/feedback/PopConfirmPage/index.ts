import { defineHtml, useComponents } from "@elfui/core";
import { PagePopConfirmEx1 } from "./ex1";
import { PagePopConfirmEx2 } from "./ex2";
import { PagePopConfirmEx3 } from "./ex3";
import { PagePopConfirmProps } from "./props";

useComponents({
  "page-pop-confirm-ex1": PagePopConfirmEx1,
  "page-pop-confirm-ex2": PagePopConfirmEx2,
  "page-pop-confirm-ex3": PagePopConfirmEx3,
  "page-pop-confirm-props": PagePopConfirmProps
});

const PagePopConfirm = defineHtml(`
  <elf-container>
    <h1>PopConfirm 气泡确认</h1>
    <p>点击或悬浮触发元素时弹出的确认气泡，用于不需要二次确认的轻量操作。</p>
    <page-pop-confirm-ex1 />
    <page-pop-confirm-ex2 />
    <page-pop-confirm-ex3 />
    <page-pop-confirm-props />
  </elf-container>
`);

export { PagePopConfirm };
