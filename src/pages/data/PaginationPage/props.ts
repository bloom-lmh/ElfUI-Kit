import { defineHtml } from "@elfui/core";
import { createDocsPicker } from "../../docsLocale";

const pick = createDocsPicker();
const propsRows = [
  { name: "total", type: "number", default: "0", desc: pick("数据总数", "Total item count") },
  { name: "current-page", type: "number", default: "undefined", desc: pick("受控当前页", "Controlled current page") },
  { name: "default-current-page", type: "number", default: "1", desc: pick("非受控初始页", "Initial uncontrolled page") },
  { name: "page-size", type: "number", default: "undefined", desc: pick("受控每页条数", "Controlled page size") },
  { name: "default-page-size", type: "number", default: "10", desc: pick("非受控初始每页条数", "Initial uncontrolled page size") },
  { name: "page-count", type: "number", default: "0", desc: pick("显式页数，优先于 total", "Explicit page count; takes precedence over total") },
  { name: "page-sizes", type: "number[]", default: "[10, 20, 30, 40, 50, 100]", desc: pick("每页条数选项", "Page size choices") },
  { name: "pager-count", type: "number", default: "7", desc: pick("可见页码数，会归一化为奇数", "Visible pager count; normalized to odd") },
  { name: "layout", type: "string", default: "total, sizes, prev, pager, next, jumper", desc: pick("逗号分隔的布局区段", "Comma-separated sections") },
  { name: "background", type: "boolean", default: "false", desc: pick("使用带背景的页码按钮", "Use background pager buttons") },
  { name: "size", type: "small | default | large", default: "''", desc: pick("组件尺寸", "Component size") },
  { name: "small", type: "boolean", default: "false", desc: pick("旧版紧凑尺寸别名", "Legacy compact-size alias") },
  { name: "prev-text / next-text", type: "string", default: "''", desc: pick("自定义导航文案", "Custom navigation labels") },
  { name: "prev-icon / next-icon", type: "string", default: "''", desc: pick("导航图标文本，命名 SVG 插槽优先", "Navigation icon text; named SVG slots take precedence") },
  { name: "teleported", type: "boolean", default: "true", desc: pick("将尺寸下拉框放入浏览器顶层", "Place the size dropdown in the browser top layer") },
  { name: "append-size-to", type: "string | HTMLElement", default: "'body'", desc: pick("浮层逻辑挂载目标元数据", "Logical overlay target metadata") },
  { name: "popper-class", type: "string", default: "''", desc: pick("尺寸下拉框类名", "Size dropdown class") },
  { name: "popper-style", type: "string | object", default: "''", desc: pick("尺寸下拉框行内样式", "Size dropdown inline style") },
  { name: "disabled", type: "boolean", default: "false", desc: pick("禁用交互", "Disable interaction") },
  { name: "hide-on-single-page", type: "boolean", default: "false", desc: pick("仅一页时隐藏", "Hide when only one page exists") },
  { name: "aria-label", type: "string", default: "'Pagination'", desc: pick("导航地标标签", "Navigation landmark label") }
];

const eventsRows = [
  { name: "update:currentPage", type: "(page: number) => void", desc: pick("当前页更新", "Current page changed") },
  { name: "update:pageSize", type: "(size: number) => void", desc: pick("每页条数更新", "Page size changed") },
  { name: "current-change", type: "(page: number) => void", desc: pick("当前页变化", "Current page changed") },
  { name: "size-change", type: "(size: number) => void", desc: pick("每页条数变化", "Page size changed") },
  { name: "change", type: "(page: number, size: number) => void", desc: pick("页码或每页条数变化完成", "A page or size change completed") },
  { name: "prev-click / next-click", type: "(targetPage: number) => void", desc: pick("导航按钮被激活", "Navigation button activated") }
];

const slotsRows = [
  { name: "default", desc: pick("在布局区段后渲染自定义内容", "Custom content rendered after the configured layout") },
  { name: "prev-icon", desc: pick("上一页 SVG 或图标内容", "Previous navigation SVG or icon content") },
  { name: "next-icon", desc: pick("下一页 SVG 或图标内容", "Next navigation SVG or icon content") }
];

const methodsRows = [
  { name: "openSizeMenu", type: "() => void", desc: pick("打开每页条数列表框", "Open the page-size listbox") },
  { name: "closeSizeMenu", type: "() => void", desc: pick("关闭每页条数列表框", "Close the page-size listbox") }
];

const partsRows = [
  { name: "size-trigger", desc: pick("每页条数触发按钮", "Page-size trigger button") },
  { name: "size-dropdown", desc: pick("每页条数列表框浮层", "Page-size listbox overlay") }
];

const PagePaginationProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows.prop=${propsRows}></elf-props-table>
  <elf-props-table title="Events" :rows.prop=${eventsRows}></elf-props-table>
  <elf-props-table title="Slots" :rows.prop=${slotsRows}></elf-props-table>
  <elf-props-table title="Expose" :rows.prop=${methodsRows}></elf-props-table>
  <elf-props-table title="Parts" :rows.prop=${partsRows}></elf-props-table>
`);

export { PagePaginationProps };
