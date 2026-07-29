import { defineHtml, useComponents } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

import { PageRateEx1 } from "./ex1";
import { PageRateEx2 } from "./ex2";
import { PageRateEx3 } from "./ex3";
import { PageRateEx4 } from "./ex4";

const t = createDocsTranslator({
  title: { zh: "评分", en: "Rate" },
  description: {
    zh: "用于主观评分与满意度输入，支持半星、清空、只读、文本、分数、自定义符号和键盘调整。",
    en: "Collect ratings and satisfaction scores with half values, clearing, read-only display, text, scores, custom symbols, and keyboard controls.",
  },
});
const pick = createDocsPicker();

const propsRows = [
  { name: "modelValue", type: "number", default: "0", desc: pick("当前评分", "Current rating.") },
  { name: "max", type: "number", default: "5", desc: pick("最大评分", "Maximum rating.") },
  { name: "allowHalf", type: "boolean", default: "false", desc: pick("允许半星", "Allow half values.") },
  { name: "clearable", type: "boolean", default: "true", desc: pick("再次点击当前分可清空", "Clear by clicking the current value again.") },
  { name: "showText / showScore", type: "boolean", default: "false", desc: pick("展示描述或分数", "Show descriptive text or a score.") },
  { name: "character", type: "string", default: "★", desc: pick("自定义评分符号", "Custom rating character.") },
  { name: "low-threshold / high-threshold", type: "number", default: "2 / 4", desc: pick("分段阈值", "Segment thresholds.") },
  { name: "colors / icons", type: "string[]", default: "[]", desc: pick("分段颜色与图标", "Segment colors and icons.") },
  { name: "void-icon / disabled-void-icon", type: "string", default: "''", desc: pick("空值与禁用空值图标", "Empty and disabled-empty icons.") },
  { name: "text-color / id / aria-label / label", type: "string", default: "''", desc: pick("文本颜色与标识属性", "Text color and identifier attributes.") },
  { name: "validate-event", type: "boolean", default: "true", desc: pick("值变化时触发表单校验", "Trigger form validation after changes.") }
];

useComponents({
  "page-rate-ex1": PageRateEx1,
  "page-rate-ex2": PageRateEx2,
  "page-rate-ex3": PageRateEx3,
  "page-rate-ex4": PageRateEx4
});

const PageRate = defineHtml(`
  <elf-container>
    <h1>${t("title")}</h1>
    <p>${t("description")}</p>

    <page-rate-ex1 />

    <page-rate-ex2 />

    <page-rate-ex3 />

    <page-rate-ex4 />

    <h2>API</h2>
    <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Events" :rows=${[
      { name: "update:modelValue / change", type: "(value: number) => void", desc: pick("评分变化时触发", "Emitted when the rating changes.") },
      { name: "hover-change", type: "(value: number) => void", desc: pick("悬浮评分变化时触发", "Emitted when the hovered rating changes.") },
      { name: "clear", type: "() => void", desc: pick("清空评分时触发", "Emitted after clearing the rating.") }
    ]}></elf-props-table>
    <elf-props-table title="Expose" :rows=${[
      { name: "setCurrentValue", type: "(value: number) => void", desc: pick("设置当前评分", "Set the current rating.") },
      { name: "resetCurrentValue", type: "() => void", desc: pick("重置当前评分", "Reset the current rating.") }
    ]}></elf-props-table>
  </elf-container>
`);

export { PageRate };
