import { defineHtml } from "@elfui/core";

const propsRows = [
  { name: "title", type: "string", default: "''", desc: "可选表格标题栏" },
  { name: "title-variant", type: "default | primary | muted", default: "default", desc: "标题栏视觉样式" },
  { name: "data", type: "TableRow[]", default: "[]", desc: "表格数据" },
  { name: "columns", type: "TableColumn[]", default: "[]", desc: "列配置；为空时按首行推导" },
  { name: "row-key", type: "string | (row) => Key", default: "id", desc: "行唯一标识，字符串支持点路径" },
  { name: "stripe / border / hover", type: "boolean", default: "false / false / true", desc: "斑马纹、边框与悬停反馈" },
  { name: "size", type: "small | default | large", default: "default", desc: "表格尺寸" },
  { name: "height / max-height", type: "string | number", default: "''", desc: "固定或最大高度，数字按 px 处理" },
  { name: "virtual", type: "boolean", default: "false", desc: "在固定 height 内启用大数据窗口化渲染" },
  { name: "virtual-threshold", type: "number", default: "100", desc: "达到该行数后启用虚拟窗口" },
  { name: "row-height / overscan", type: "number | (context) => number", default: "48 / 5", desc: "虚拟模式的固定或动态行高与视口缓冲行数" },
  { name: "fit", type: "boolean", default: "true", desc: "列宽是否适配容器" },
  { name: "table-layout", type: "fixed | auto", default: "fixed", desc: "原生 table-layout 策略" },
  { name: "scrollbar-always-on", type: "boolean", default: "false", desc: "始终显示滚动条轨道" },
  { name: "show-header / sticky-header", type: "boolean", default: "true", desc: "显示表头并在纵向滚动时吸附" },
  { name: "empty-text / loading", type: "string / boolean", default: "暂无数据 / false", desc: "空状态文案与加载遮罩" },
  { name: "highlight-current-row", type: "boolean", default: "false", desc: "高亮当前行" },
  { name: "current-row-key", type: "string | number", default: "''", desc: "受控当前行 key" },
  { name: "row-class-name / row-style", type: "string | (context) => value", default: "undefined", desc: "整行 class 与内联样式" },
  { name: "cell-class-name / cell-style", type: "string | (context) => value", default: "undefined", desc: "全局单元格 class 与内联样式" },
  { name: "header-row-class-name / header-row-style", type: "string | (context) => value", default: "undefined", desc: "表头行 class 与内联样式" },
  { name: "header-cell-class-name / header-cell-style", type: "string | (context) => value", default: "undefined", desc: "表头单元格 class 与内联样式" },
  { name: "selected-keys / default-selected-keys", type: "string[]", default: "undefined / []", desc: "受控选择与非受控初值" },
  { name: "select-on-indeterminate", type: "boolean", default: "true", desc: "半选时点击全选是否选中全部可选行" },
  { name: "expanded-row-keys / default-expanded-row-keys", type: "string[]", default: "undefined / []", desc: "受控展开与非受控初值" },
  { name: "default-expand-all", type: "boolean", default: "false", desc: "首次渲染时展开全部行" },
  { name: "tree-props", type: "{ children, hasChildren, checkStrictly }", default: "children / hasChildren / false", desc: "树形字段映射与选择关联策略" },
  { name: "indent", type: "number", default: "16", desc: "树节点每一级缩进像素" },
  { name: "lazy / load", type: "boolean / TableLoad", default: "false / undefined", desc: "按需加载子节点及其加载函数" },
  { name: "expand-formatter", type: "(row, index) => unknown", default: "undefined", desc: "展开行内容格式化" },
  { name: "sort-prop / sort-order", type: "string / TableSortOrder", default: "''", desc: "受控排序字段与方向" },
  { name: "default-sort", type: "{ prop, order }", default: "undefined", desc: "非受控默认排序" },
  { name: "show-overflow-tooltip", type: "boolean", default: "false", desc: "内容截断时启用鼠标与键盘可访问的浮层提示" },
  { name: "tooltip-options", type: "TableTooltipOptions", default: "top / 300ms / 320px", desc: "溢出浮层的位置、偏移、显隐延迟与最大宽度" },
  { name: "show-summary / sum-text", type: "boolean / string", default: "false / 合计", desc: "显示汇总行及首列文案" },
  { name: "summary-method", type: "({ columns, data }) => unknown[]", default: "undefined", desc: "自定义汇总单元格" },
  { name: "span-method", type: "(cellContext) => [rowspan, colspan] | object", default: "undefined", desc: "合并数据单元格；返回 0 隐藏当前位置" }
];

const columnRows = [
  { name: "prop / label", type: "string", default: "'' / prop", desc: "字段名与表头文字" },
  { name: "type", type: "default | selection | index | expand | actions", default: "default", desc: "列类型" },
  { name: "index", type: "number | (index) => value", default: "undefined", desc: "自定义序号起点或内容" },
  { name: "width / minWidth", type: "string | number", default: "'' / 120", desc: "固定列宽与最小列宽" },
  { name: "align / headerAlign", type: "left | center | right", default: "left / align", desc: "内容与表头对齐方式" },
  { name: "fixed", type: "left | right", default: "undefined", desc: "固定列" },
  { name: "sortable", type: "boolean | custom", default: "false", desc: "本地排序；custom 仅派发事件供远程排序" },
  { name: "sortMethod", type: "(left, right) => number", default: "undefined", desc: "自定义本地比较函数，优先级高于 sortBy" },
  { name: "sortBy", type: "string | string[] | function", default: "undefined", desc: "排序取值路径；数组按字段依次比较" },
  { name: "sortOrders", type: "Array<TableSortOrder | null>", default: "[ascending, descending, null]", desc: "点击表头时的排序状态循环" },
  { name: "resizable", type: "boolean", default: "true", desc: "border 表格中是否允许调整当前列宽" },
  { name: "columnKey", type: "string", default: "prop", desc: "筛选事件与 clearFilter 使用的稳定列标识" },
  { name: "filters / filteredValue", type: "TableFilterOption[] / unknown[]", default: "undefined / []", desc: "筛选选项与初始选中值" },
  { name: "filterMethod", type: "(value, row, column) => boolean", default: "undefined", desc: "自定义行匹配规则；同列多值为任一匹配" },
  { name: "filterMultiple", type: "boolean", default: "true", desc: "是否允许选择多个筛选值" },
  { name: "filterPlacement / filterClassName", type: "string", default: "bottom-start / ''", desc: "筛选浮层位置与自定义类名" },
  { name: "formatter", type: "(row, column, index) => unknown", default: "undefined", desc: "格式化单元格内容" },
  { name: "renderHeader / renderCell", type: "(context) => TableRenderValue", default: "undefined", desc: "渲染表头或单元格，可返回文本、DOM 节点或节点数组" },
  { name: "renderExpand", type: "(rowContext) => TableRenderValue", default: "undefined", desc: "渲染 expand 列对应的展开区域" },
  { name: "renderFilterIcon", type: "({ column, filtered }) => TableRenderValue", default: "undefined", desc: "按过滤状态渲染列筛选图标" },
  { name: "className / headerClassName", type: "string", default: "''", desc: "列单元格与表头 class" },
  { name: "cellClassName / cellStyle", type: "string | function / object | function", default: "undefined", desc: "当前列单元格样式" },
  { name: "selectable", type: "(row, index) => boolean", default: "undefined", desc: "selection 列的可选条件" },
  { name: "showOverflowTooltip", type: "boolean", default: "undefined", desc: "覆盖全局溢出提示配置" },
  { name: "tooltipFormatter", type: "(row, column, index) => unknown", default: "undefined", desc: "自定义可访问溢出浮层的文本内容" },
  { name: "actions", type: "TableAction[]", default: "[]", desc: "操作列按钮配置" }
];

const eventsRows = [
  { name: "select / select-all", type: "(rows, row?) => void", desc: "用户切换单行或全选时触发" },
  { name: "update:selectedKeys / selection-change", type: "(keys | rows) => void", desc: "选择状态变化" },
  { name: "cell-mouse-enter / cell-mouse-leave", type: "(row, column, cell, event) => void", desc: "鼠标进入或离开单元格" },
  { name: "cell-click / cell-dblclick / cell-contextmenu", type: "(row, column, cell, event) => void", desc: "单元格鼠标事件" },
  { name: "row-click / row-dblclick / row-contextmenu", type: "(row, column, event) => void", desc: "行鼠标事件" },
  { name: "header-click / header-contextmenu", type: "(column, event) => void", desc: "表头鼠标事件" },
  { name: "current-change", type: "(row, oldRow) => void", desc: "当前行变化" },
  { name: "update:expandedRowKeys / expand-change", type: "(keys | row, keys | expanded) => void", desc: "详情行或树节点展开状态变化" },
  { name: "action-click", type: "(action, row, index) => void", desc: "点击操作列按钮" },
  { name: "sort-change", type: "({ prop, order }) => void", desc: "排序变化" },
  { name: "filter-change", type: "Record<columnKey, unknown[]>", desc: "应用或清除列筛选时触发" },
  { name: "header-dragend", type: "(newWidth, oldWidth, column, event) => void", desc: "拖动或键盘调整列宽结束时触发" },
  { name: "scroll", type: "({ scrollLeft, scrollTop }) => void", desc: "表格容器滚动" }
];

const slotsRows = [
  { name: "empty", type: "—", desc: "自定义空状态" },
  { name: "append", type: "—", desc: "表格末尾追加内容" }
];

const methodsRows = [
  { name: "clearSelection() / getSelectionRows()", type: "() => void / Row[]", desc: "清空或读取选择" },
  { name: "toggleRowSelection(rowOrKey, selected?)", type: "(Row | Key, boolean?) => void", desc: "切换单行选择" },
  { name: "toggleAllSelection()", type: "() => void", desc: "切换全部可选行" },
  { name: "toggleRowExpansion(rowOrKey, expanded?)", type: "(Row | Key, boolean?) => void", desc: "切换行展开" },
  { name: "updateKeyChildren(key, children)", type: "(Key, Row[]) => void", desc: "替换懒加载树节点的子数据" },
  { name: "setCurrentRow(rowOrKey)", type: "(Row | Key) => void", desc: "设置当前行" },
  { name: "sort(prop, order) / clearSort()", type: "function", desc: "设置或清除排序" },
  { name: "clearFilter(columnKeys?)", type: "(string | string[]) => void", desc: "清除指定列或全部列筛选" },
  { name: "scrollTableTo(x, y) / scrollTableTo(options)", type: "function", desc: "滚动表格内容到目标坐标" },
  { name: "setScrollTop(value) / setScrollLeft(value)", type: "(number) => void", desc: "设置单轴滚动位置" },
  { name: "doLayout()", type: "() => void", desc: "容器尺寸变化后同步布局" }
];

const PageTableProps = defineHtml(`
  <h2>API</h2>
  <elf-props-table title="Props" :rows="propsRows"></elf-props-table>
  <elf-props-table title="Column" :rows="columnRows"></elf-props-table>
  <elf-props-table title="Events" :rows="eventsRows"></elf-props-table>
  <elf-props-table title="Slots" :rows="slotsRows"></elf-props-table>
  <elf-props-table title="Methods" :rows="methodsRows"></elf-props-table>
`);

export { PageTableProps };
