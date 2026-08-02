import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  api: { zh: "API", en: "API" },
  props: { zh: "属性", en: "Props" },
  slots: { zh: "插槽", en: "Slots" },
});
const pick = createDocsPicker();

const propsRows = [
  {
    name: "value",
    type: "string | number",
    default: "''",
    desc: pick("徽标显示值", "Badge display value."),
  },
  {
    name: "max",
    type: "number",
    default: "99",
    desc: pick(
      "数值超过上限时显示最大值加号",
      "Shows the maximum followed by a plus sign when the numeric value exceeds it.",
    ),
  },
  {
    name: "is-dot",
    type: "boolean",
    default: "false",
    desc: pick("显示为圆点状态徽标", "Displays the badge as a status dot."),
  },
  {
    name: "hidden",
    type: "boolean",
    default: "false",
    desc: pick("隐藏徽标内容", "Hides the badge content."),
  },
  {
    name: "type",
    type: "primary|success|warning|danger|info",
    default: "danger",
    desc: pick("语义颜色类型", "Semantic color type."),
  },
  {
    name: "show-zero",
    type: "boolean",
    default: "true",
    desc: pick(
      "值为零时是否仍显示徽标",
      "Whether to keep the badge visible when its value is zero.",
    ),
  },
  {
    name: "color",
    type: "string",
    default: "''",
    desc: pick("自定义徽标颜色", "Custom badge color."),
  },
  {
    name: "offset",
    type: "[number, number] | string",
    default: "''",
    desc: pick("徽标在水平和垂直方向的偏移", "Horizontal and vertical badge offset."),
  },
  {
    name: "badge-style",
    type: "Record<string, string | number>",
    default: "{}",
    desc: pick("附加到徽标节点的内联样式", "Inline styles applied to the badge node."),
  },
  {
    name: "badge-class",
    type: "string",
    default: "''",
    desc: pick("附加到徽标节点的类名", "Class name applied to the badge node."),
  },
  {
    name: "content",
    type: "string | number",
    default: "''",
    desc: pick("value 的兼容别名", "Compatibility alias for value."),
  },
];

const slotsRows = [
  {
    name: "default",
    desc: pick("徽标关联的主体内容", "Reference content associated with the badge."),
  },
  { name: "content", desc: pick("自定义徽标内容", "Custom badge content.") },
];

const PageBadgeProps = defineHtml(`
  <h2>${t("api")}</h2>
  <elf-props-table :title=${t("props")} :rows=${propsRows} />
  <elf-props-table :title=${t("slots")} :rows=${slotsRows} />
`);

export { PageBadgeProps };
