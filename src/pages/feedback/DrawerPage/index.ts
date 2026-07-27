import { defineHtml, useComponents } from "@elfui/core";
import { PageDrawerEx1 } from "./ex1";
import { PageDrawerEx2 } from "./ex2";
import { PageDrawerEx3 } from "./ex3";
import { PageDrawerEx4 } from "./ex4";
import { PageDrawerProps } from "./props";

useComponents({
  "page-drawer-ex1": PageDrawerEx1,
  "page-drawer-ex2": PageDrawerEx2,
  "page-drawer-ex3": PageDrawerEx3,
  "page-drawer-ex4": PageDrawerEx4,
  "page-drawer-props": PageDrawerProps
});

const PageDrawer = defineHtml(`
  <elf-container
    ><h1>Drawer 抽屉</h1>
    <p>从屏幕边缘滑出的面板。</p>
    <page-drawer-ex1 /><page-drawer-ex2 /><page-drawer-ex3 /><page-drawer-ex4 /><page-drawer-props
  /></elf-container>
`);

export { PageDrawer };
