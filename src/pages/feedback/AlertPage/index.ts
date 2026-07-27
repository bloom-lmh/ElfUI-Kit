import { defineHtml, useComponents } from "@elfui/core";
import { PageAlertEx1 } from "./ex1";
import { PageAlertEx2 } from "./ex2";
import { PageAlertEx3 } from "./ex3";
import { PageAlertProps } from "./props";

useComponents({
  "page-alert-ex1": PageAlertEx1,
  "page-alert-ex2": PageAlertEx2,
  "page-alert-ex3": PageAlertEx3,
  "page-alert-props": PageAlertProps
});

const PageAlert = defineHtml(`
  <elf-container
    ><h1>Alert 警告提示</h1>
    <page-alert-ex1 /><page-alert-ex2 /><page-alert-ex3 /><page-alert-props
  /></elf-container>
`);

export { PageAlert };
