import { defineHtml } from "@elfui/core";
import { createDocsPicker, createDocsTranslator } from "../../docsLocale";

const t = createDocsTranslator({
  api: { zh: "API", en: "API" },
  props: { zh: "表格属性", en: "Table props" },
  column: { zh: "列配置", en: "Column" },
  events: { zh: "事件", en: "Events" },
  slots: { zh: "插槽", en: "Slots" },
  methods: { zh: "方法", en: "Methods" },
});
const pick = createDocsPicker();

interface ApiRow {
  name: string;
  type: string;
  default?: string;
  desc: string;
}

const propsRowsSource: ApiRow[] = [
  {
    name: "title",
    type: "string",
    default: "''",
    desc: pick("可选表格标题栏", "Optional table title bar."),
  },
  {
    name: "title-variant",
    type: "default | primary | muted",
    default: "default",
    desc: pick("标题栏视觉样式", "Visual style of the title bar."),
  },
  { name: "data", type: "TableRow[]", default: "[]", desc: pick("表格数据", "Table data.") },
  {
    name: "columns",
    type: "TableColumn[]",
    default: "[]",
    desc: pick(
      "列配置；为空时按首行推导",
      "Column definitions; inferred from the first row when empty.",
    ),
  },
  {
    name: "row-key",
    type: "string | (row) => Key",
    default: "id",
    desc: pick(
      "行唯一标识，字符串支持点路径",
      "Unique row identifier; dot paths are supported for strings.",
    ),
  },
  {
    name: "stripe",
    type: "boolean",
    default: "false",
    desc: pick("斑马纹行", "Alternating row stripes."),
  },
  {
    name: "border",
    type: "boolean",
    default: "false",
    desc: pick("显示列边框", "Show column borders."),
  },
  {
    name: "hover",
    type: "boolean",
    default: "true",
    desc: pick("悬停高亮", "Highlight rows on hover."),
  },
  {
    name: "size",
    type: "small | default | large",
    default: "default",
    desc: pick("表格尺寸", "Table size."),
  },
  {
    name: "height",
    type: "string | number",
    default: "''",
    desc: pick("固定表格高度", "Fixed table height."),
  },
  {
    name: "max-height",
    type: "string | number",
    default: "''",
    desc: pick("最大表格高度", "Maximum table height."),
  },
  {
    name: "virtual",
    type: "boolean",
    default: "false",
    desc: pick(
      "在固定 height 内启用大数据窗口化渲染",
      "Enable windowed rendering for large datasets inside a fixed height.",
    ),
  },
  {
    name: "virtual-threshold",
    type: "number",
    default: "100",
    desc: pick("达到该行数后启用虚拟窗口", "Row count at which virtual windowing is enabled."),
  },
  {
    name: "row-height",
    type: "number | (context) => number",
    default: "48",
    desc: pick("虚拟模式的固定或动态行高", "Fixed or dynamic row height in virtual mode."),
  },
  {
    name: "overscan",
    type: "number | (context) => number",
    default: "5",
    desc: pick("视口外额外缓冲行数", "Viewport buffer rows in virtual mode."),
  },
  {
    name: "fit",
    type: "boolean",
    default: "true",
    desc: pick("列宽是否适配容器", "Whether column widths adapt to the container."),
  },
  {
    name: "table-layout",
    type: "fixed | auto",
    default: "fixed",
    desc: pick("原生 table-layout 策略", "Native table-layout strategy."),
  },
  {
    name: "scrollbar-always-on",
    type: "boolean",
    default: "false",
    desc: pick("始终显示滚动条轨道", "Always show the scrollbar track."),
  },
  {
    name: "show-header",
    type: "boolean",
    default: "true",
    desc: pick("显示表头", "Show the header row."),
  },
  {
    name: "sticky-header",
    type: "boolean",
    default: "true",
    desc: pick("纵向滚动时表头吸顶", "Stick the header while scrolling vertically."),
  },
  {
    name: "empty-text",
    type: "string",
    default: pick("暂无数据 / false", "No data / false"),
    desc: pick("空状态文案", "Empty-state text."),
  },
  {
    name: "loading",
    type: "boolean",
    default: pick("暂无数据 / false", "No data / false"),
    desc: pick("加载遮罩", "Loading overlay."),
  },
  {
    name: "highlight-current-row",
    type: "boolean",
    default: "false",
    desc: pick("高亮当前行", "Highlight the current row."),
  },
  {
    name: "current-row-key",
    type: "string | number",
    default: "''",
    desc: pick("受控当前行 key", "Controlled current-row key."),
  },
  {
    name: "row-class-name",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("整行自定义 class", "Custom class for each row."),
  },
  {
    name: "row-style",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("整行内联样式", "Inline styles for each row."),
  },
  {
    name: "cell-class-name",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("全局单元格自定义 class", "Custom class for all cells."),
  },
  {
    name: "cell-style",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("全局单元格内联样式", "Inline styles for all cells."),
  },
  {
    name: "header-row-class-name",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("表头行自定义 class", "Custom class for header rows."),
  },
  {
    name: "header-row-style",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("表头行内联样式", "Inline styles for header rows."),
  },
  {
    name: "header-cell-class-name",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("表头单元格自定义 class", "Custom class for header cells."),
  },
  {
    name: "header-cell-style",
    type: "string | (context) => value",
    default: "undefined",
    desc: pick("表头单元格内联样式", "Inline styles for header cells."),
  },
  {
    name: "selected-keys",
    type: "string[]",
    default: "undefined",
    desc: pick("受控选中行键", "Controlled selected row keys."),
  },
  {
    name: "default-selected-keys",
    type: "string[]",
    default: "[]",
    desc: pick("默认选中行键", "Uncontrolled initial selected keys."),
  },
  {
    name: "select-on-indeterminate",
    type: "boolean",
    default: "true",
    desc: pick(
      "半选时点击全选是否选中全部可选行",
      "Whether clicking select-all while indeterminate selects every selectable row.",
    ),
  },
  {
    name: "expanded-row-keys",
    type: "string[]",
    default: "undefined",
    desc: pick("受控展开行键", "Controlled expanded row keys."),
  },
  {
    name: "default-expanded-row-keys",
    type: "string[]",
    default: "[]",
    desc: pick("默认展开行键", "Uncontrolled initial expanded keys."),
  },
  {
    name: "default-expand-all",
    type: "boolean",
    default: "false",
    desc: pick("首次渲染时展开全部行", "Expand every row on first render."),
  },
  {
    name: "tree-props",
    type: "{ children, hasChildren, checkStrictly }",
    default: "children / hasChildren / false",
    desc: pick(
      "树形字段映射与选择关联策略",
      "Tree field mapping and selection-association strategy.",
    ),
  },
  {
    name: "indent",
    type: "number",
    default: "16",
    desc: pick("树节点每一级缩进像素", "Pixels indented per tree level."),
  },
  {
    name: "lazy",
    type: "boolean",
    default: "false",
    desc: pick("按需加载子节点", "Lazy-load child nodes."),
  },
  {
    name: "load",
    type: "TableLoad",
    default: "undefined",
    desc: pick("懒加载数据函数", "Lazy-load data function."),
  },
  {
    name: "expand-formatter",
    type: "(row, index) => unknown",
    default: "undefined",
    desc: pick("展开行内容格式化", "Formats expanded row content."),
  },
  {
    name: "sort-prop",
    type: "string",
    default: "''",
    desc: pick("受控排序字段", "Controlled sort property."),
  },
  {
    name: "sort-order",
    type: "TableSortOrder",
    default: "''",
    desc: pick("受控排序方向", "Controlled sort order."),
  },
  {
    name: "default-sort",
    type: "{ prop, order }",
    default: "undefined",
    desc: pick("非受控默认排序", "Uncontrolled initial sort state."),
  },
  {
    name: "show-overflow-tooltip",
    type: "boolean",
    default: "false",
    desc: pick(
      "内容截断时启用鼠标与键盘可访问的浮层提示",
      "Show a mouse- and keyboard-accessible tooltip when content is truncated.",
    ),
  },
  {
    name: "tooltip-options",
    type: "TableTooltipOptions",
    default: "top / 300ms / 320px",
    desc: pick(
      "溢出浮层的位置、偏移、显隐延迟与最大宽度",
      "Position, offset, delay, and max width of overflow tooltips.",
    ),
  },
  {
    name: "show-summary",
    type: "boolean",
    default: pick("false / 合计", "false / Total"),
    desc: pick("显示合计行", "Show the summary row."),
  },
  {
    name: "sum-text",
    type: "string",
    default: pick("false / 合计", "false / Total"),
    desc: pick("合计行首列文案", "Text in the summary row's first column."),
  },
  {
    name: "summary-method",
    type: "({ columns, data }) => unknown[]",
    default: "undefined",
    desc: pick("自定义汇总单元格", "Custom summary cells."),
  },
  {
    name: "span-method",
    type: "(cellContext) => [rowspan, colspan] | object",
    default: "undefined",
    desc: pick(
      "合并数据单元格；返回 0 隐藏当前位置",
      "Merge data cells; return 0 to hide the current position.",
    ),
  },
];

const columnRowsSource: ApiRow[] = [
  { name: "prop", type: "string", default: "''", desc: pick("数据字段名", "Data property.") },
  { name: "label", type: "string", default: "prop", desc: pick("表头文字", "Column header text.") },
  {
    name: "type",
    type: "default | selection | index | expand | actions",
    default: "default",
    desc: pick("列类型", "Column type."),
  },
  {
    name: "index",
    type: "number | (index) => value",
    default: "undefined",
    desc: pick("自定义序号起点或内容", "Custom index start value or content."),
  },
  {
    name: "width",
    type: "string | number",
    default: "''",
    desc: pick("固定列宽", "Fixed column width."),
  },
  {
    name: "minWidth",
    type: "string | number",
    default: "120",
    desc: pick("最小列宽", "Minimum column width."),
  },
  {
    name: "align",
    type: "left | center | right",
    default: "left",
    desc: pick("内容对齐方式", "Content alignment."),
  },
  {
    name: "headerAlign",
    type: "left | center | right",
    default: "align",
    desc: pick("表头对齐方式", "Header alignment."),
  },
  {
    name: "fixed",
    type: "left | right",
    default: "undefined",
    desc: pick("固定列", "Fixed column."),
  },
  {
    name: "sortable",
    type: "boolean | custom",
    default: "false",
    desc: pick(
      "本地排序；custom 仅派发事件供远程排序",
      "Local sorting; custom only emits events for remote sorting.",
    ),
  },
  {
    name: "sortMethod",
    type: "(left, right) => number",
    default: "undefined",
    desc: pick(
      "自定义本地比较函数，优先级高于 sortBy",
      "Custom local comparison function with priority over sortBy.",
    ),
  },
  {
    name: "sortBy",
    type: "string | string[] | function",
    default: "undefined",
    desc: pick(
      "排序取值路径；数组按字段依次比较",
      "Sort value path; arrays compare field by field.",
    ),
  },
  {
    name: "sortOrders",
    type: "Array<TableSortOrder | null>",
    default: "[ascending, descending, null]",
    desc: pick("点击表头时的排序状态循环", "Sort-state cycle when clicking the header."),
  },
  {
    name: "resizable",
    type: "boolean",
    default: "true",
    desc: pick(
      "border 表格中是否允许调整当前列宽",
      "Whether the current column width can be resized in a border table.",
    ),
  },
  {
    name: "columnKey",
    type: "string",
    default: "prop",
    desc: pick(
      "筛选事件与 clearFilter 使用的稳定列标识",
      "Stable column identifier used by filter events and clearFilter.",
    ),
  },
  {
    name: "filters",
    type: "TableFilterOption[]",
    default: "undefined",
    desc: pick("筛选选项与初始选中值", "Filter options and initial selected values."),
  },
  {
    name: "filteredValue",
    type: "unknown[]",
    default: "[]",
    desc: pick("筛选选项与初始选中值", "Controlled filter value."),
  },
  {
    name: "filterMethod",
    type: "(value, row, column) => boolean",
    default: "undefined",
    desc: pick(
      "自定义行匹配规则；同列多值为任一匹配",
      "Custom row-matching rule; multiple values in a column match any.",
    ),
  },
  {
    name: "filterMultiple",
    type: "boolean",
    default: "true",
    desc: pick("是否允许选择多个筛选值", "Allow selecting multiple filter values."),
  },
  {
    name: "filterPlacement",
    type: "string",
    default: "bottom-start",
    desc: pick("筛选浮层位置与自定义类名", "Filter overlay placement."),
  },
  {
    name: "filterClassName",
    type: "string",
    default: "''",
    desc: pick("筛选浮层位置与自定义类名", "Custom class for the filter overlay."),
  },
  {
    name: "formatter",
    type: "(row, column, index) => unknown",
    default: "undefined",
    desc: pick("格式化单元格内容", "Formats cell content."),
  },
  {
    name: "renderHeader",
    type: "(context) => TableRenderValue",
    default: "undefined",
    desc: pick(
      "渲染表头，可返回文本、DOM 节点或节点数组",
      "Renders the header; may return text, DOM nodes, or an array of nodes.",
    ),
  },
  {
    name: "renderCell",
    type: "(context) => TableRenderValue",
    default: "undefined",
    desc: pick(
      "渲染单元格，可返回文本、DOM 节点或节点数组",
      "Renders a cell; may return text, DOM nodes, or an array of nodes.",
    ),
  },
  {
    name: "renderExpand",
    type: "(rowContext) => TableRenderValue",
    default: "undefined",
    desc: pick("渲染 expand 列对应的展开区域", "Renders the expansion area for the expand column."),
  },
  {
    name: "renderFilterIcon",
    type: "({ column, filtered }) => TableRenderValue",
    default: "undefined",
    desc: pick(
      "按过滤状态渲染列筛选图标",
      "Renders the column filter icon based on the filtered state.",
    ),
  },
  {
    name: "className",
    type: "string",
    default: "''",
    desc: pick("列单元格自定义 class", "Custom class for column cells."),
  },
  {
    name: "headerClassName",
    type: "string",
    default: "''",
    desc: pick("表头自定义 class", "Custom class for the column header."),
  },
  {
    name: "cellClassName",
    type: "string | function",
    default: "undefined",
    desc: pick("当前列单元格自定义 class", "Custom class for the current column's cells."),
  },
  {
    name: "cellStyle",
    type: "object | function",
    default: "undefined",
    desc: pick("当前列单元格内联样式", "Inline styles for the current column's cells."),
  },
  {
    name: "selectable",
    type: "(row, index) => boolean",
    default: "undefined",
    desc: pick("selection 列的可选条件", "Selection condition for the selection column."),
  },
  {
    name: "showOverflowTooltip",
    type: "boolean",
    default: "undefined",
    desc: pick("覆盖全局溢出提示配置", "Overrides the global overflow-tooltip configuration."),
  },
  {
    name: "tooltipFormatter",
    type: "(row, column, index) => unknown",
    default: "undefined",
    desc: pick("自定义可访问溢出浮层的文本内容", "Custom text for accessible overflow tooltips."),
  },
  {
    name: "actions",
    type: "TableAction[]",
    default: "[]",
    desc: pick("操作列按钮配置", "Action-button configuration for the actions column."),
  },
];

const eventsRowsSource: ApiRow[] = [
  {
    name: "select",
    type: "(rows, row?) => void",
    desc: pick("切换单行选择时触发", "Emitted when a single row is toggled."),
  },
  {
    name: "select-all",
    type: "(rows, row?) => void",
    desc: pick("切换全选时触发", "Emitted when all rows are toggled."),
  },
  {
    name: "update:selectedKeys",
    type: "(keys | rows) => void",
    desc: pick("选中行键变化", "Emitted when the selected keys change."),
  },
  {
    name: "selection-change",
    type: "(keys | rows) => void",
    desc: pick("携带完整选区的变化事件", "Emitted with the full selection after a change."),
  },
  {
    name: "cell-mouse-enter",
    type: "(row, column, cell, event) => void",
    desc: pick("鼠标进入单元格", "Emitted when the pointer enters a cell."),
  },
  {
    name: "cell-mouse-leave",
    type: "(row, column, cell, event) => void",
    desc: pick("鼠标离开单元格", "Emitted when the pointer leaves a cell."),
  },
  {
    name: "cell-click",
    type: "(row, column, cell, event) => void",
    desc: pick("点击单元格", "Emitted when a cell is clicked."),
  },
  {
    name: "cell-dblclick",
    type: "(row, column, cell, event) => void",
    desc: pick("双击单元格", "Emitted when a cell is double-clicked."),
  },
  {
    name: "cell-contextmenu",
    type: "(row, column, cell, event) => void",
    desc: pick("右键单元格", "Emitted on right-click of a cell."),
  },
  {
    name: "row-click",
    type: "(row, column, event) => void",
    desc: pick("点击行", "Emitted when a row is clicked."),
  },
  {
    name: "row-dblclick",
    type: "(row, column, event) => void",
    desc: pick("双击行", "Emitted when a row is double-clicked."),
  },
  {
    name: "row-contextmenu",
    type: "(row, column, event) => void",
    desc: pick("右键行", "Emitted on right-click of a row."),
  },
  {
    name: "header-click",
    type: "(column, event) => void",
    desc: pick("点击表头", "Emitted when a header cell is clicked."),
  },
  {
    name: "header-contextmenu",
    type: "(column, event) => void",
    desc: pick("右键表头", "Emitted on right-click of a header cell."),
  },
  {
    name: "current-change",
    type: "(row, oldRow) => void",
    desc: pick("当前行变化", "Emitted when the current row changes."),
  },
  {
    name: "update:expandedRowKeys",
    type: "(keys | row, keys | expanded) => void",
    desc: pick("展开行变化", "Emitted when expanded rows change."),
  },
  {
    name: "expand-change",
    type: "(keys | row, keys | expanded) => void",
    desc: pick("携带展开详情的变更事件", "Emitted with the expanded detail or tree rows."),
  },
  {
    name: "action-click",
    type: "(action, row, index) => void",
    desc: pick("点击操作列按钮", "Emitted when an action button is clicked."),
  },
  {
    name: "sort-change",
    type: "({ prop, order }) => void",
    desc: pick("排序变化", "Emitted when the sort state changes."),
  },
  {
    name: "filter-change",
    type: "Record<columnKey, unknown[]>",
    desc: pick("应用或清除列筛选时触发", "Emitted when a column filter is applied or cleared."),
  },
  {
    name: "header-dragend",
    type: "(newWidth, oldWidth, column, event) => void",
    desc: pick(
      "拖动或键盘调整列宽结束时触发",
      "Emitted when column width resizing ends by drag or keyboard.",
    ),
  },
  {
    name: "scroll",
    type: "({ scrollLeft, scrollTop }) => void",
    desc: pick("表格容器滚动", "Emitted when the table container scrolls."),
  },
];

const slotsRowsSource: ApiRow[] = [
  { name: "empty", type: "—", desc: pick("自定义空状态", "Custom empty-state content.") },
  {
    name: "append",
    type: "—",
    desc: pick("表格末尾追加内容", "Content appended after the table."),
  },
];

const methodsRowsSource: ApiRow[] = [
  {
    name: "clearSelection()",
    type: "() => void",
    desc: pick("清空当前选择", "Clears the current selection."),
  },
  {
    name: "getSelectionRows()",
    type: "Row[]",
    desc: pick("读取选中行", "Returns the selected rows."),
  },
  {
    name: "toggleRowSelection(rowOrKey, selected?)",
    type: "(Row | Key, boolean?) => void",
    desc: pick("切换单行选择", "Toggles a single row's selection."),
  },
  {
    name: "toggleAllSelection()",
    type: "() => void",
    desc: pick("切换全部可选行", "Toggles every selectable row."),
  },
  {
    name: "toggleRowExpansion(rowOrKey, expanded?)",
    type: "(Row | Key, boolean?) => void",
    desc: pick("切换行展开", "Toggles a row's expansion."),
  },
  {
    name: "updateKeyChildren(key, children)",
    type: "(Key, Row[]) => void",
    desc: pick("替换懒加载树节点的子数据", "Replaces child data of a lazy tree node."),
  },
  {
    name: "setCurrentRow(rowOrKey)",
    type: "(Row | Key) => void",
    desc: pick("设置当前行", "Sets the current row."),
  },
  { name: "sort(prop, order)", type: "function", desc: pick("设置排序", "Sets the sort state.") },
  { name: "clearSort()", type: "function", desc: pick("清除排序", "Clears the sort state.") },
  {
    name: "clearFilter(columnKeys?)",
    type: "(string | string[]) => void",
    desc: pick("清除指定列或全部列筛选", "Clears filters for the given columns or all columns."),
  },
  {
    name: "scrollTableTo(x, y)",
    type: "function",
    desc: pick("滚动到目标坐标", "Scrolls the table to target coordinates."),
  },
  {
    name: "scrollTableTo(options)",
    type: "function",
    desc: pick("按配置滚动", "Scrolls the table to the given options."),
  },
  {
    name: "setScrollTop(value)",
    type: "(number) => void",
    desc: pick("设置垂直滚动位置", "Sets the vertical scroll position."),
  },
  {
    name: "setScrollLeft(value)",
    type: "(number) => void",
    desc: pick("设置水平滚动位置", "Sets the horizontal scroll position."),
  },
  {
    name: "doLayout()",
    type: "() => void",
    desc: pick("容器尺寸变化后同步布局", "Recomputes layout after container size changes."),
  },
];

const propsDescriptions: Record<string, string> = {
  title: "Optional table title surface.",
  "title-variant": "Visual treatment for the title surface.",
  data: "Rows displayed by the table.",
  columns: "Column definitions; empty input infers columns from the first row.",
  "row-key": "Unique row key; string values support nested paths.",
  "stripe / border / hover": "Enable striped rows, borders, and hover feedback.",
  size: "Table density.",
  "height / max-height": "Fixed or maximum height; numbers are interpreted as pixels.",
  virtual: "Enable windowed rendering inside a fixed height.",
  "virtual-threshold": "Minimum row count before windowing activates.",
  "row-height / overscan": "Fixed or computed row height and viewport buffer for virtual mode.",
  fit: "Whether columns should fill the available container width.",
  "table-layout": "Native table-layout strategy.",
  "scrollbar-always-on": "Keep scrollbar tracks visible.",
  "show-header / sticky-header": "Show the header and keep it pinned during vertical scrolling.",
  "empty-text / loading": "Empty-state copy and loading overlay state.",
  "highlight-current-row": "Highlight the current row.",
  "current-row-key": "Controlled key for the current row.",
  "row-class-name / row-style": "Class and inline style for each row.",
  "cell-class-name / cell-style": "Global class and inline style for data cells.",
  "header-row-class-name / header-row-style": "Class and inline style for the header row.",
  "header-cell-class-name / header-cell-style": "Class and inline style for header cells.",
  "selected-keys / default-selected-keys": "Controlled selection and uncontrolled initial keys.",
  "select-on-indeterminate":
    "Whether toggling a partially selected header selects all eligible rows.",
  "expanded-row-keys / default-expanded-row-keys":
    "Controlled expansion and uncontrolled initial keys.",
  "default-expand-all": "Expand all eligible rows on the first render.",
  "tree-props": "Tree field mapping and selection cascade policy.",
  indent: "Indent in pixels for each tree depth.",
  "lazy / load": "Enable lazy children and provide the loading function.",
  "expand-formatter": "Format expanded-row content.",
  "sort-prop / sort-order": "Controlled sort field and direction.",
  "default-sort": "Uncontrolled initial sort state.",
  "show-overflow-tooltip": "Provide mouse and keyboard accessible tooltips for truncated content.",
  "tooltip-options": "Placement, offset, delays, and maximum width for overflow tooltips.",
  "show-summary / sum-text": "Show a summary row and configure its first-column label.",
  "summary-method": "Return custom summary cells for the current columns and rows.",
  "span-method": "Merge data cells; return zero spans to hide the current position.",
};

const columnDescriptions: Record<string, string> = {
  "prop / label": "Field path and header label.",
  type: "Column role.",
  index: "Custom index start or formatter.",
  "width / minWidth": "Fixed and minimum column widths.",
  "align / headerAlign": "Data and header alignment.",
  fixed: "Pin the column to the left or right edge.",
  sortable: "Use local sorting; custom emits state for remote sorting only.",
  sortMethod: "Local comparator with priority over sortBy.",
  sortBy: "Value path or ordered paths used for sorting.",
  sortOrders: "Sort-state cycle used by header interactions.",
  resizable: "Allow resizing this column in bordered tables.",
  columnKey: "Stable key used by filter events and clearFilter.",
  "filters / filteredValue": "Filter options and initial selected values.",
  filterMethod: "Custom row matcher; multiple values in one column use OR semantics.",
  filterMultiple: "Allow more than one selected filter value.",
  "filterPlacement / filterClassName": "Filter overlay placement and custom class.",
  formatter: "Format data-cell content.",
  "renderHeader / renderCell": "Render a header or cell as text, DOM nodes, or node arrays.",
  renderExpand: "Render expanded content for an expand column.",
  renderFilterIcon: "Render the filter icon from the current filter state.",
  "className / headerClassName": "Classes for data and header cells in this column.",
  "cellClassName / cellStyle": "Class and style for data cells in this column.",
  selectable: "Determine whether a row can be selected.",
  showOverflowTooltip: "Override the table-level overflow tooltip setting.",
  tooltipFormatter: "Customize accessible overflow tooltip text.",
  actions: "Action-button definitions for an actions column.",
};

const eventDescriptions: Record<string, string> = {
  "select / select-all": "Emitted when the user toggles one row or all eligible rows.",
  "update:selectedKeys / selection-change": "Selection keys or selected rows changed.",
  "cell-mouse-enter / cell-mouse-leave": "Pointer entered or left a data cell.",
  "cell-click / cell-dblclick / cell-contextmenu": "Data-cell pointer events.",
  "row-click / row-dblclick / row-contextmenu": "Row pointer events.",
  "header-click / header-contextmenu": "Header-cell pointer events.",
  "current-change": "Current row changed.",
  "update:expandedRowKeys / expand-change": "Detail-row or tree expansion changed.",
  "action-click": "An actions-column command was invoked.",
  "sort-change": "Sort state changed.",
  "filter-change": "Column filters were applied or cleared.",
  "header-dragend": "Pointer or keyboard column resizing completed.",
  scroll: "The table scroll container moved.",
};

const slotDescriptions: Record<string, string> = {
  empty: "Customize the empty state.",
  append: "Append content after the table body.",
};

const methodDescriptions: Record<string, string> = {
  "clearSelection() / getSelectionRows()": "Clear or read the current selection.",
  "toggleRowSelection(rowOrKey, selected?)": "Toggle selection for one row.",
  "toggleAllSelection()": "Toggle all eligible rows.",
  "toggleRowExpansion(rowOrKey, expanded?)": "Toggle detail or tree expansion for one row.",
  "updateKeyChildren(key, children)": "Replace the loaded children for a tree row.",
  "setCurrentRow(rowOrKey)": "Set the current row.",
  "sort(prop, order) / clearSort()": "Apply or clear sorting.",
  "clearFilter(columnKeys?)": "Clear selected columns or every filter.",
  "scrollTableTo(x, y) / scrollTableTo(options)": "Scroll the table content to a target position.",
  "setScrollTop(value) / setScrollLeft(value)": "Set one scroll axis.",
  "doLayout()": "Synchronize native layout after the container size changes.",
};

const localizeRows = (rows: ApiRow[], descriptions: Record<string, string>): ApiRow[] =>
  rows.map((row) => ({ ...row, desc: pick(row.desc, descriptions[row.name] || row.desc) }));

const propsRows = (): ApiRow[] => localizeRows(propsRowsSource, propsDescriptions);
const columnRows = (): ApiRow[] => localizeRows(columnRowsSource, columnDescriptions);
const eventsRows = (): ApiRow[] => localizeRows(eventsRowsSource, eventDescriptions);
const slotsRows = (): ApiRow[] => localizeRows(slotsRowsSource, slotDescriptions);
const methodsRows = (): ApiRow[] => localizeRows(methodsRowsSource, methodDescriptions);

const PageTableProps = defineHtml(`
  <elf-api-builder component="elf-table" title="API">
  <elf-props-table role="props" :title=${t("props")} :rows=${propsRows()}></elf-props-table>
  <elf-props-table :title=${t("column")} :rows=${columnRows()}></elf-props-table>
  <elf-props-table role="events" :title=${t("events")} :rows=${eventsRows()}></elf-props-table>
  <elf-props-table role="slots" :title=${t("slots")} :rows=${slotsRows()}></elf-props-table>
  <elf-props-table role="methods" :title=${t("methods")} :rows=${methodsRows()}></elf-props-table>
  </elf-api-builder>
`);

export { PageTableProps };
