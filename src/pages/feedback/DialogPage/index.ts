import { defineHtml, useComponents } from "@elfui/core";
import { PageDialogEx1 } from "./ex1";
import { PageDialogEx2 } from "./ex2";
import { PageDialogEx3 } from "./ex3";
import { PageDialogEx4 } from "./ex4";
import { PageDialogProps } from "./props";

useComponents({
  "page-dialog-ex1": PageDialogEx1,
  "page-dialog-ex2": PageDialogEx2,
  "page-dialog-ex3": PageDialogEx3,
  "page-dialog-ex4": PageDialogEx4,
  "page-dialog-props": PageDialogProps
});

const PageDialog = defineHtml(`
  <elf-container
    ><h1>Dialog 对话框</h1>
    <p>在保留当前页面状态的情况下，告知用户并承载操作。</p>
    <page-dialog-ex1 /><page-dialog-ex2 /><page-dialog-ex3 /><page-dialog-ex4 /><page-dialog-props
  /></elf-container>
`);

export { PageDialog };
