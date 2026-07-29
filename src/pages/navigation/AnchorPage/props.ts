import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();

const propsRows = [
  { name: "items", type: "AnchorItem[]", default: "[]", desc: pick("锚点项树", "Anchor item tree.") },
  { name: "model-value", type: "string", default: "''", desc: pick("受控激活链接", "Controlled active href.") },
  { name: "default-active", type: "string", default: "''", desc: pick("初始激活链接", "Initial active href.") },
  {
    name: "container",
    type: "string | HTMLElement | Window",
    default: "window",
    desc: pick("滚动容器", "Scroll container.")
  },
  { name: "offset", type: "number", default: "0", desc: pick("激活前的顶部偏移", "Top offset before activation.") },
  { name: "bound", type: "number", default: "15", desc: pick("激活阈值", "Activation threshold.") },
  { name: "bounds", type: "number", default: "15", desc: pick("旧版激活阈值别名", "Legacy activation-threshold alias.") },
  { name: "duration", type: "number", default: "goTo / 300", desc: pick("平滑滚动时长", "Smooth-scroll duration.") },
  { name: "easing", type: "GoToEasing", default: "goTo / easeInOutCubic", desc: pick("平滑滚动缓动策略", "Smooth-scroll easing strategy.") },
  { name: "marker", type: "boolean", default: "true", desc: pick("显示激活标记", "Show the active marker.") },
  { name: "type", type: "default | underline", default: "default", desc: pick("锚点样式类型", "Anchor style type.") },
  { name: "direction", type: "vertical | horizontal", default: "vertical", desc: pick("锚点方向", "Anchor direction.") },
  { name: "selectScrollTop", type: "boolean", default: "false", desc: pick("Element Plus 兼容标记", "Element Plus compatibility flag.") },
  { name: "smooth", type: "boolean", default: "true", desc: pick("点击时平滑滚动", "Smooth-scroll on click.") },
  { name: "props", type: "AnchorFieldNames", default: "built-in", desc: pick("字段别名", "Field aliases.") }
];

const eventsRows = [
  { name: "update:modelValue", type: "(href: string) => void", desc: pick("激活链接变化", "Active href changed.") },
  {
    name: "change",
    type: "(detail: AnchorChangeDetail) => void",
    desc: pick("滚动或点击导致激活项变化", "Active item changed after scrolling or clicking.")
  },
  { name: "click", type: "(detail: AnchorClickDetail) => void", desc: pick("点击锚点项", "Anchor item clicked.") }
];

const methodsRows = [
  { name: "scrollToAnchor", type: "(href: string) => void", desc: pick("滚动到目标；避免覆盖 HTMLElement.scrollTo", "Scroll to the target without overriding HTMLElement.scrollTo.") }
];

const slotsRows = [
  { name: "default", type: "AnchorLink[]", desc: pick("组合式锚点链接", "Compositional anchor links.") }
];

const linkPropsRows = [
  { name: "title", type: "string", default: "''", desc: pick("链接标签", "Link label.") },
  { name: "href", type: "string", default: "''", desc: pick("目标选择器", "Target selector.") }
];

const linkSlotsRows = [
  { name: "default", type: "unknown", desc: pick("自定义链接内容", "Custom link content.") },
  { name: "sub-link", type: "AnchorLink[]", desc: pick("嵌套锚点链接", "Nested anchor links.") }
];

const PageAnchorProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Expose" :rows=${methodsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
  <elf-props-table title="AnchorLink Props" :rows=${linkPropsRows}></elf-props-table>
  <elf-props-table title="AnchorLink Slots" :rows=${linkSlotsRows}></elf-props-table>
`);

export { PageAnchorProps };
