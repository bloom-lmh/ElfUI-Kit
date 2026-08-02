import { defineHtml, useComponents } from "@elfui/core";

import { createDocsPicker, createDocsTranslator } from "../../docsLocale";
import { PageDropdownEx1 } from "./ex1";
import { PageDropdownEx2 } from "./ex2";
import { PageDropdownEx3 } from "./ex3";
import { PageDropdownEx4 } from "./ex4";
import { PageDropdownEx5 } from "./ex5";
import { PageDropdownEx6 } from "./ex6";

const pick = createDocsPicker();
const t = createDocsTranslator({
  title: { zh: "Dropdown 下拉菜单", en: "Dropdown" },
  description: {
    zh: "用于承载一组轻量命令，支持点击、悬停、右键、分裂按钮、禁用项、分割线和子菜单。",
    en: "Presents lightweight commands with click, hover, context-menu, split-button, disabled, divided, and nested modes.",
  },
});

const propsRows = [
  {
    name: "items",
    type: "DropdownItem[]",
    default: "[]",
    desc: pick("菜单项，支持 children 嵌套", "Menu items with nested children support."),
  },
  {
    name: "trigger",
    type: "DropdownTriggerMode | DropdownTriggerMode[]",
    default: "click",
    desc: pick("一种或多种触发方式", "One or more trigger modes."),
  },
  {
    name: "placement",
    type: "bottom | bottom-start | bottom-end | top | top-start | top-end",
    default: "bottom-start",
    desc: pick("弹层位置", "Overlay placement."),
  },
  {
    name: "splitButton",
    type: "boolean",
    default: "false",
    desc: pick("分裂按钮模式", "Enable split-button mode."),
  },
  {
    name: "hideOnClick",
    type: "boolean",
    default: "true",
    desc: pick("点击菜单后自动关闭", "Close after selecting a menu item."),
  },
  {
    name: "variant",
    type: "filled | outlined | underlined | solo | solo-filled | solo-inverted",
    default: "filled",
    desc: pick(
      "与输入类组件一致的 Material 字段表面",
      "Material field surface shared with input-like controls.",
    ),
  },
  {
    name: "backgroundColor",
    type: "string",
    default: "''",
    desc: pick("覆盖触发器表面颜色", "Override the trigger surface color."),
  },
  {
    name: "type",
    type: "default | primary | success | warning | danger | info",
    default: "default",
    desc: pick("按钮类型", "Trigger button type."),
  },
  {
    name: "showTimeout / hideTimeout",
    type: "number",
    default: "120 / 180",
    desc: pick("hover 展开和关闭延迟", "Hover open and close delays."),
  },
  {
    name: "triggerKeys",
    type: "string[]",
    default: "Enter / Space / ArrowDown / NumpadEnter",
    desc: pick("键盘触发键", "Keyboard keys that open the menu."),
  },
  {
    name: "virtualTriggering / virtualRef",
    type: "boolean / DropdownVirtualRef",
    default: "false / -",
    desc: pick(
      "使用外部元素或虚拟矩形作为触发目标",
      "Use an external element or virtual rectangle as the anchor.",
    ),
  },
  {
    name: "maxHeight",
    type: "string | number",
    default: "280px",
    desc: pick("菜单最大高度", "Maximum menu height."),
  },
  {
    name: "popperClass / popperStyle",
    type: "string / object",
    default: "-",
    desc: pick("弹层自定义样式", "Custom overlay class and styles."),
  },
  {
    name: "popperOptions",
    type: "DropdownPopperOptions",
    default: "{}",
    desc: pick(
      "strategy、placement 及 offset / flip / preventOverflow modifiers",
      "Strategy, placement, and offset / flip / preventOverflow modifiers.",
    ),
  },
  {
    name: "closeOnClickOutside",
    type: "boolean",
    default: "true",
    desc: pick("点击外部是否关闭", "Close when an outside pointer interaction occurs."),
  },
  {
    name: "teleported / appendTo",
    type: "boolean / string | HTMLElement",
    default: "true / body",
    desc: pick(
      "使用原生 top layer 脱离裁切，并声明承载目标",
      "Use the native top layer to escape clipping and declare the target container.",
    ),
  },
];

const slotsRows = [
  { name: "default", type: "unknown", desc: pick("自定义触发内容", "Custom trigger content.") },
  {
    name: "trigger / main",
    type: "unknown",
    desc: pick("ElfUI 兼容触发器与分裂主按钮", "ElfUI-compatible trigger and split main action."),
  },
  {
    name: "dropdown",
    type: "DropdownMenu",
    desc: pick("组合式菜单内容", "Compositional menu content."),
  },
];

const itemRows = [
  {
    name: "command",
    type: "string | number | object",
    default: "''",
    desc: pick("命令值", "Command value."),
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: pick("禁用菜单项", "Disable the menu item."),
  },
  {
    name: "divided",
    type: "boolean",
    default: "false",
    desc: pick("显示上分割线", "Show a divider above the item."),
  },
  {
    name: "icon / icon slot",
    type: "string / unknown",
    default: "''",
    desc: pick("图标或自定义图标", "Icon name or custom icon content."),
  },
];

itemRows.push({
  name: "selected",
  type: "boolean",
  default: "false",
  desc: pick(
    "组合式菜单项的受控选中状态，父级选择后会自动同步",
    "Controlled selected state for compositional items, synchronized by the parent dropdown.",
  ),
});

const eventsRows = [
  {
    name: "command",
    type: "({ command, item }) => void",
    desc: pick("点击可选菜单项时触发", "Emitted after selecting an enabled item."),
  },
  {
    name: "visible-change",
    type: "(visible) => void",
    desc: pick("展开状态变化时触发", "Emitted when menu visibility changes."),
  },
  {
    name: "click",
    type: "(event) => void",
    desc: pick("分裂按钮主按钮点击时触发", "Emitted when the split main action is clicked."),
  },
];

const exposeRows = [
  { name: "openMenu()", type: "() => void", desc: pick("打开下拉菜单", "Open the menu.") },
  { name: "closeMenu()", type: "() => void", desc: pick("关闭下拉菜单", "Close the menu.") },
  {
    name: "toggleMenu()",
    type: "() => void",
    desc: pick("切换展开状态", "Toggle menu visibility."),
  },
];

useComponents({
  "page-dropdown-ex1": PageDropdownEx1,
  "page-dropdown-ex2": PageDropdownEx2,
  "page-dropdown-ex3": PageDropdownEx3,
  "page-dropdown-ex4": PageDropdownEx4,
  "page-dropdown-ex5": PageDropdownEx5,
  "page-dropdown-ex6": PageDropdownEx6,
});

const PageDropdown = defineHtml(`
  <elf-container>
    <elf-docs-hero category="navigation" :title=${t("title")} :description=${t("description")}></elf-docs-hero>

    <page-dropdown-ex1 />

    <page-dropdown-ex2 />

    <page-dropdown-ex3 />

    <page-dropdown-ex4 />

    <page-dropdown-ex5 />

    <page-dropdown-ex6 />

    <h2>API</h2>
    <elf-props-table title="Dropdown Props" :rows=${propsRows}></elf-props-table>
    <elf-props-table title="Dropdown Events" :rows=${eventsRows}></elf-props-table>
    <elf-props-table title="Dropdown Expose" :rows=${exposeRows}></elf-props-table>
    <elf-props-table title="Dropdown Slots" :rows=${slotsRows}></elf-props-table>
    <elf-props-table title="DropdownItem Props / Slots" :rows=${itemRows}></elf-props-table>
  </elf-container>
`);

export { PageDropdown };
