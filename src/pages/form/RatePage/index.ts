import { defineHtml, useComponents } from "@elfui/core";

import { PageRateEx1 } from "./ex1";
import { PageRateEx2 } from "./ex2";
import { PageRateEx3 } from "./ex3";
import { PageRateEx4 } from "./ex4";

const propsRows = [
  { name: "modelValue", type: "number", default: "0", desc: "当前评分" },
  { name: "max", type: "number", default: "5", desc: "最大评分" },
  { name: "allowHalf", type: "boolean", default: "false", desc: "是否允许半星" },
  { name: "clearable", type: "boolean", default: "true", desc: "再次点击当前分可清空" },
  { name: "showText / showScore", type: "boolean", default: "false", desc: "展示描述或分数" },
  { name: "character", type: "string", default: "★", desc: "自定义评分符号" },
  { name: "low-threshold / high-threshold", type: "number", default: "2 / 4" },
  { name: "colors / icons", type: "string[]", default: "[]" },
  { name: "void-icon / disabled-void-icon", type: "string", default: "''" },
  { name: "text-color / id / aria-label / label", type: "string", default: "''" },
  { name: "validate-event", type: "boolean", default: "true" }
];

useComponents({
  "page-rate-ex1": PageRateEx1,
  "page-rate-ex2": PageRateEx2,
  "page-rate-ex3": PageRateEx3,
  "page-rate-ex4": PageRateEx4
});

const PageRate = defineHtml(`
  <elf-container>
    <h1>Rate 评分</h1>
    <p>用于主观评分与满意度输入，支持半星、清空、只读、文本、分数、自定义符号和键盘调整。</p>

    <page-rate-ex1 />

    <page-rate-ex2 />

    <page-rate-ex3 />

    <page-rate-ex4 />

    <h2>API</h2>
    <elf-props-table title="评分属性" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="事件" :rows=${[
      { name: "update:modelValue / change", type: "(value: number) => void" },
      { name: "hover-change", type: "(value: number) => void" },
      { name: "clear", type: "() => void" }
    ]}></elf-props-table>
    <elf-props-table title="暴露方法" :rows=${[
      { name: "setCurrentValue", type: "(value: number) => void" },
      { name: "resetCurrentValue", type: "() => void" }
    ]}></elf-props-table>
  </elf-container>
`);

export { PageRate };
