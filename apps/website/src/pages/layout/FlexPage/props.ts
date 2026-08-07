import { defineHtml } from "@elfui/core";

import { createDocsTranslator, createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const t = createDocsTranslator({
  alignment: {
    zh: "Space 兼容别名，优先于 align",
    en: "Space-compatible alias with priority over align",
  },
  size: { zh: "Space 兼容别名，优先于 gap", en: "Space-compatible alias with priority over gap" },
  alignContent: {
    zh: "多行项目在交叉轴上的分布方式",
    en: "Distribution of wrapped lines on the cross axis",
  },
  wrap: {
    zh: "换行策略；boolean 保持原有兼容行为",
    en: "Wrapping strategy; boolean preserves the legacy behavior",
  },
  inline: { zh: "使用 inline-flex", en: "Render with inline-flex" },
  fill: { zh: "填满父容器可用尺寸", en: "Fill the available size of the parent container" },
  fillRatio: {
    zh: "fill 子项占比，限制在 0~100",
    en: "Share assigned to a fill item, clamped from 0 to 100",
  },
  defaultSlot: { zh: "Flex 子项", en: "Flex items" },
});

const propsRows = () => [
  {
    name: "direction",
    type: "row|row-reverse|column|column-reverse",
    default: "row",
    desc: pick("布局方向", "Layout direction."),
  },
  {
    name: "justify",
    type: "flex-start|flex-end|center|space-between|space-around|space-evenly",
    default: "flex-start",
    desc: pick("主轴对齐方式", "Main-axis alignment."),
  },
  {
    name: "align",
    type: "stretch|flex-start|flex-end|center|baseline",
    default: "stretch",
    desc: pick("对齐方式", "Alignment."),
  },
  {
    name: "align-content",
    type: "stretch|flex-start|flex-end|center|space-between|space-around|space-evenly",
    default: "stretch",
    desc: t("alignContent"),
  },
  { name: "alignment", type: "FlexAlign", default: "''", desc: t("alignment") },
  {
    name: "gap",
    type: "preset|string|number|[number, number]",
    default: "0",
    desc: pick("间距", "Gap size."),
  },
  { name: "size", type: "preset|string|number|[number, number]", default: "''", desc: t("size") },
  { name: "wrap", type: "boolean|nowrap|wrap|wrap-reverse", default: "false", desc: t("wrap") },
  { name: "inline", type: "boolean", default: "false", desc: t("inline") },
  { name: "fill", type: "boolean", default: "false", desc: t("fill") },
  { name: "fill-ratio", type: "number", default: "100", desc: t("fillRatio") },
];

const slotsRows = () => [{ name: "default", type: "-", default: "-", desc: t("defaultSlot") }];
const spacerRows = () => [
  { name: "props", type: "—", default: "—", desc: "flex-grow: 1" },
  { name: "events", type: "—", default: "—", desc: "flex-grow: 1" },
  { name: "slots", type: "—", default: "—", desc: "flex-grow: 1" },
];

const PageFlexProps = defineHtml(`
  <elf-api-builder component="elf-flex" title="API">
  <elf-props-table role="props" title="Props" :rows=${propsRows()} />
  <elf-props-table role="slots" title="Slots" :rows=${slotsRows()} />
  <elf-props-table role="props" component="elf-spacer" title="elf-spacer" :rows=${spacerRows()} />
  </elf-api-builder>
`);

export { PageFlexProps };
