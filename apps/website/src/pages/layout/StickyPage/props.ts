import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  offset: { zh: "吸附偏移距离", en: "Offset from the sticky edge." },
  position: { zh: "吸附位置", en: "Sticky edge." },
  target: { zh: "限制吸附范围的 CSS 选择器", en: "CSS selector that limits the sticky boundary." },
  teleported: {
    zh: "将吸附内容投放到 append-to 指定的目标",
    en: "Teleport sticky content to the append-to target.",
  },
  appendTo: { zh: "内容投放目标", en: "Teleport destination." },
  top: { zh: "顶部吸附偏移", en: "Legacy top offset." },
  bottom: {
    zh: "底部吸附偏移；设置后启用底部模式",
    en: "Legacy bottom offset; enables bottom mode when set.",
  },
  zIndex: { zh: "吸附层级", en: "Stacking level of sticky content." },
  disabled: { zh: "禁用吸附", en: "Disable sticky behavior." },
  change: { zh: "吸附状态变化时触发", en: "Emitted when the fixed state changes." },
  scroll: { zh: "滚动更新时触发", en: "Emitted on scroll updates." },
  update: { zh: "立即更新吸附状态", en: "Refresh the sticky state immediately." },
  updateRoot: { zh: "重新解析目标容器", en: "Resolve the target container again." },
  defaultSlot: { zh: "需要吸附的内容", en: "Content that becomes sticky." },
});

const propsRows = () => [
  { name: "offset", type: "string | number", default: "0", desc: t("offset") },
  { name: "position", type: "top | bottom", default: "top", desc: t("position") },
  { name: "target", type: "string", default: "''", desc: t("target") },
  { name: "teleported", type: "boolean", default: "false", desc: t("teleported") },
  { name: "append-to", type: "string | HTMLElement", default: "body", desc: t("appendTo") },
  { name: "top", type: "string | number", default: "0", desc: t("top") },
  {
    name: "bottom",
    type: "string | number",
    default: "''",
    desc: t("bottom"),
  },
  { name: "zIndex", type: "string | number", default: "100", desc: t("zIndex") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") },
];

const eventsRows = () => [
  { name: "change", type: "(fixed: boolean) => void", desc: t("change") },
  { name: "scroll", type: "({ scrollTop, fixed }) => void", desc: t("scroll") },
];

const exposesRows = () => [
  { name: "update", type: "() => void", desc: t("update") },
  { name: "updateRoot", type: "() => void", desc: t("updateRoot") },
];

const slotsRows = () => [{ name: "default", type: "—", default: "—", desc: t("defaultSlot") }];

const PageStickyProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows()}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows()}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows()}></elf-props-table>
  <elf-props-table title="Expose" :rows=${exposesRows()}></elf-props-table>
`);

export { PageStickyProps };
