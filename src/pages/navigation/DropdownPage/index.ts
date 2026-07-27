import { defineHtml, useComponents } from "@elfui/core";

import { PageDropdownEx1 } from "./ex1";
import { PageDropdownEx2 } from "./ex2";
import { PageDropdownEx3 } from "./ex3";
import { PageDropdownEx4 } from "./ex4";
import { PageDropdownEx5 } from "./ex5";
import { PageDropdownEx6 } from "./ex6";

const propsRows = [
  { name: "items", type: "DropdownItem[]", default: "[]", desc: "菜单项，支持 children 嵌套" },
  { name: "trigger", type: "DropdownTriggerMode | DropdownTriggerMode[]", default: "click", desc: "一种或多种触发方式" },
  {
    name: "placement",
    type: "bottom | bottom-start | bottom-end | top | top-start | top-end",
    default: "bottom-start",
    desc: "弹层位置"
  },
  { name: "splitButton", type: "boolean", default: "false", desc: "分裂按钮模式" },
  { name: "hideOnClick", type: "boolean", default: "true", desc: "点击菜单后自动关闭" },
  { name: "type", type: "default | primary | success | warning | danger | info", default: "default", desc: "按钮类型" },
  { name: "showTimeout / hideTimeout", type: "number", default: "120 / 180", desc: "hover 展开和关闭延迟" },
  { name: "triggerKeys", type: "string[]", default: "Enter / Space / ArrowDown / NumpadEnter", desc: "键盘触发键" },
  { name: "virtualTriggering / virtualRef", type: "boolean / DropdownVirtualRef", default: "false / -", desc: "使用外部元素或虚拟矩形作为触发目标" },
  { name: "maxHeight", type: "string | number", default: "280px", desc: "菜单最大高度" },
  { name: "popperClass / popperStyle", type: "string / object", default: "-", desc: "弹层自定义样式" },
  { name: "popperOptions", type: "DropdownPopperOptions", default: "{}", desc: "strategy、placement 及 offset / flip / preventOverflow modifiers" },
  { name: "closeOnClickOutside", type: "boolean", default: "true", desc: "点击外部是否关闭" },
  { name: "teleported / appendTo", type: "boolean / string | HTMLElement", default: "true / body", desc: "使用原生 top layer 脱离裁切，并声明承载目标" }
];

const slotsRows = [
  { name: "default", type: "unknown", desc: "自定义触发内容" },
  { name: "trigger / main", type: "unknown", desc: "ElfUI 兼容触发器与分裂主按钮" },
  { name: "dropdown", type: "DropdownMenu", desc: "组合式菜单内容" }
];

const itemRows = [
  { name: "command", type: "string | number | object", default: "''", desc: "命令值" },
  { name: "disabled", type: "boolean", default: "false", desc: "禁用菜单项" },
  { name: "divided", type: "boolean", default: "false", desc: "显示上分割线" },
  { name: "icon / icon slot", type: "string / unknown", default: "''", desc: "图标或自定义图标" }
];

itemRows.push({
  name: "selected",
  type: "boolean",
  default: "false",
  desc: "组合式菜单项的受控选中状态，父级选择后会自动同步"
});

const eventsRows = [
  { name: "command", type: "({ command, item }) => void", desc: "点击可选菜单项时触发" },
  { name: "visible-change", type: "(visible) => void", desc: "展开状态变化时触发" },
  { name: "click", type: "(event) => void", desc: "分裂按钮主按钮点击时触发" }
];

const exposeRows = [
  { name: "openMenu()", type: "() => void", desc: "打开下拉菜单" },
  { name: "closeMenu()", type: "() => void", desc: "关闭下拉菜单" },
  { name: "toggleMenu()", type: "() => void", desc: "切换展开状态" }
];

useComponents({
  "page-dropdown-ex1": PageDropdownEx1,
  "page-dropdown-ex2": PageDropdownEx2,
  "page-dropdown-ex3": PageDropdownEx3,
  "page-dropdown-ex4": PageDropdownEx4,
  "page-dropdown-ex5": PageDropdownEx5,
  "page-dropdown-ex6": PageDropdownEx6
});

const PageDropdown = defineHtml(`
  <elf-container>
    <h1>Dropdown 下拉菜单</h1>
    <p>用于承载一组轻量命令，支持点击、悬停、右键、分裂按钮、禁用项、分割线和子菜单。</p>

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
