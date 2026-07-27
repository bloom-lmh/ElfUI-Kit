import {
  PageSwitchEx1 } from "./ex1";
import { PageSwitchEx2 } from "./ex2";
import { PageSwitchEx3 } from "./ex3";
import { PageSwitchProps } from "./props";

import { defineHtml,
  useComponents
} from "@elfui/core";

useComponents({
  "page-switch-ex1": PageSwitchEx1,
  "page-switch-ex2": PageSwitchEx2,
  "page-switch-ex3": PageSwitchEx3,
  "page-switch-props": PageSwitchProps
});

const PageSwitch = defineHtml(`
  <elf-container>
    <h1>Switch 开关</h1>
    <page-switch-ex1></page-switch-ex1>
    <page-switch-ex2></page-switch-ex2>
    <page-switch-ex3></page-switch-ex3>
    <page-switch-props></page-switch-props>
  </elf-container>
`);

export { PageSwitch };
