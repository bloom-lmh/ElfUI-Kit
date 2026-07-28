import { defineHtml } from "@elfui/core";
import { createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  target: { zh: "滚动目标", en: "Scroll target" },
  threshold: { zh: "显示按钮的滚动阈值", en: "Visibility threshold" },
  right: { zh: "距视口右侧的偏移", en: "Right offset" },
  bottom: { zh: "距视口底部的偏移", en: "Bottom offset" },
  zIndex: { zh: "浮层层级", en: "Floating z-index" },
  smooth: { zh: "启用平滑滚动", en: "Enable smooth scrolling" },
  duration: { zh: "滚动时长；默认继承 ConfigProvider", en: "Duration inherited from ConfigProvider by default" },
  easing: { zh: "滚动缓动策略；默认继承 ConfigProvider", en: "Easing inherited from ConfigProvider by default" },
  shape: { zh: "按钮形状", en: "Button shape" },
  size: { zh: "按钮尺寸", en: "Button size" },
  icon: { zh: "后备图标文本", en: "Fallback icon text" },
  disabled: { zh: "禁用并隐藏按钮", en: "Disable and hide the button" },
  click: { zh: "按钮被点击", en: "Button clicked" },
  visible: { zh: "可见状态变化", en: "Visibility changed" },
  method: { zh: "将目标滚动到顶部", en: "Scroll the target to the top" },
  slot: { zh: "自定义按钮内容", en: "Custom button content" }
});

const propsRows = [
  { name: "target", type: "string | HTMLElement | Window", default: "window", desc: t("target") },
  { name: "visibility-height", type: "number", default: "200", desc: t("threshold") },
  { name: "right", type: "string | number", default: "40", desc: t("right") },
  { name: "bottom", type: "string | number", default: "40", desc: t("bottom") },
  { name: "z-index", type: "string | number", default: "10", desc: t("zIndex") },
  { name: "smooth", type: "boolean", default: "true", desc: t("smooth") },
  { name: "duration", type: "number", default: "goTo / 300", desc: t("duration") },
  { name: "easing", type: "GoToEasing", default: "goTo / easeInOutCubic", desc: t("easing") },
  { name: "shape", type: "circle | square", default: "circle", desc: t("shape") },
  { name: "size", type: "string | number", default: "40", desc: t("size") },
  { name: "icon", type: "string", default: "''", desc: t("icon") },
  { name: "disabled", type: "boolean", default: "false", desc: t("disabled") }
];
const eventsRows = [
  { name: "click", type: "(event: MouseEvent) => void", desc: t("click") },
  { name: "visible-change", type: "(visible: boolean) => void", desc: t("visible") }
];
const methodsRows = [{ name: "scrollToTop", type: "() => void", desc: t("method") }];
const slotsRows = [{ name: "default", desc: t("slot") }];

const PageBacktopProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows=${eventsRows}></elf-props-table>
  <elf-props-table title="Methods" :rows=${methodsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows=${slotsRows}></elf-props-table>
`);

export { PageBacktopProps };
