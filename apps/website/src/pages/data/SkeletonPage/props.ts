import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  {
    name: "variant",
    type: "text | circle | rect",
    default: "text",
    desc: pick("形状变体", "Shape variant"),
  },
  {
    name: "width",
    type: "string",
    default: "''",
    desc: pick("宽度，不设则用默认值", "Width; uses the default when omitted"),
  },
  {
    name: "height",
    type: "string",
    default: "''",
    desc: pick("高度，不设则用默认值", "Height; uses the default when omitted"),
  },
  {
    name: "animated",
    type: "boolean",
    default: "false",
    desc: pick("显示轻量脉冲动画", "Show the subtle pulse animation"),
  },
  {
    name: "count",
    type: "number",
    default: "1",
    desc: pick("重复生成的骨架组数", "Number of repeated skeleton groups"),
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: pick("显示骨架或默认插槽", "Show the skeleton or default slot"),
  },
  {
    name: "rows",
    type: "number",
    default: "3",
    desc: pick("每个文本骨架组的行数", "Rows in each text skeleton group"),
  },
  {
    name: "throttle",
    type: "number | { leading, trailing }",
    default: "0",
    desc: pick("显示和隐藏延迟，避免加载闪烁", "Show and hide delays that prevent loading flicker"),
  },
  {
    name: "gap",
    type: "string",
    default: "'12px'",
    desc: pick("多组骨架的行间距", "Gap between repeated groups"),
  },
];

const slotsRows = [
  { name: "default", desc: pick("加载完成后显示的实际内容", "Content shown after loading") },
  {
    name: "template",
    desc: pick("加载中显示的自定义骨架模板", "Custom skeleton template shown while loading"),
  },
];

const PageSkeletonProps = defineHtml(`
  <elf-api-builder component="elf-skeleton" title="API">
  <elf-props-table role="props" title="Props" :rows="propsRows" />
  <elf-props-table role="slots" title="Slots" :rows="slotsRows" />
  </elf-api-builder>
`);

export { PageSkeletonProps };
