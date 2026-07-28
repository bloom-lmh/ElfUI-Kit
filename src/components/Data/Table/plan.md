# Table Element Plus API 对标计划

- [x] 增加 `title` / `title-variant` 标题栏样式，API 文档表格统一复用 `elf-table` 渲染。

## 2026-07-19 表格质量回归
- [x] 修复 Dialog 操作按钮尺寸、sticky header 透底与边框表格多余横向滚动
- [x] 合并高频滚动更新，保持 10,000 行窗口化 DOM 有界

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Table`
- Element Plus 文档：`table.md`、`table-v2.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### table.md

#### Table API

- `data`
- `height`
- `max-height`
- `stripe`
- `border`
- `size`
- `fit`
- `show-header`
- `highlight-current-row`
- `current-row-key`
- `row-class-name`
- `row-style`
- `cell-class-name`
- `cell-style`
- `header-row-class-name`
- `header-row-style`
- `header-cell-class-name`
- `header-cell-style`
- `row-key`
- `empty-text`
- `default-expand-all`
- `expand-row-keys`
- `default-sort`
- `tooltip-effect`
- `tooltip-options ^`
- `append-filter-panel-to ^`
- `show-summary`
- `sum-text`
- `summary-method`
- `span-method`
- `select-on-indeterminate`
- `indent`
- `lazy`
- `load`
- ...另有 49 项，详见来源文档

#### Table Attributes

- `data`
- `height`
- `max-height`
- `stripe`
- `border`
- `size`
- `fit`
- `show-header`
- `highlight-current-row`
- `current-row-key`
- `row-class-name`
- `row-style`
- `cell-class-name`
- `cell-style`
- `header-row-class-name`
- `header-row-style`
- `header-cell-class-name`
- `header-cell-style`
- `row-key`
- `empty-text`
- `default-expand-all`
- `expand-row-keys`
- `default-sort`
- `tooltip-effect`
- `tooltip-options ^`
- `append-filter-panel-to ^`
- `show-summary`
- `sum-text`
- `summary-method`
- `span-method`
- `select-on-indeterminate`
- `indent`
- `lazy`
- `load`
- ...另有 11 项，详见来源文档

#### Table Events

- `select`
- `select-all`
- `selection-change`
- `cell-mouse-enter`
- `cell-mouse-leave`
- `cell-click`
- `cell-dblclick`
- `cell-contextmenu`
- `row-click`
- `row-contextmenu`
- `row-dblclick`
- `header-click`
- `header-contextmenu`
- `sort-change`
- `filter-change`
- `current-change`
- `header-dragend`
- `expand-change`
- `scroll ^`

#### Table Slots

- `default`
- `append`
- `empty`

#### Table Exposes

- `clearSelection`
- `getSelectionRows`
- `getHalfSelectionRows ^`
- `toggleRowSelection`
- `toggleAllSelection`
- `toggleRowExpansion`
- `setCurrentRow`
- `clearSort`
- `clearFilter`
- `doLayout`
- `sort`
- `scrollTo`
- `setScrollTop`
- `setScrollLeft`
- `columns ^`
- `updateKeyChildren ^`

#### Table-column API

- `type`
- `index`
- `label`
- `column-key`
- `width`
- `min-width`
- `fixed`
- `render-header`
- `sortable`
- `sort-method`
- `sort-by`
- `sort-orders`
- `resizable`
- `formatter`
- `show-overflow-tooltip`
- `align`
- `header-align`
- `class-name`
- `label-class-name`
- `selectable`
- `reserve-selection`
- `filters`
- `filter-placement`
- `filter-class-name ^`
- `filter-multiple`
- `filter-method`
- `filtered-value`
- `tooltip-formatter ^`
- `default`
- `header`
- `filter-icon ^`
- `expand ^`

#### Table-column Attributes

- `type`
- `index`
- `label`
- `column-key`
- `width`
- `min-width`
- `fixed`
- `render-header`
- `sortable`
- `sort-method`
- `sort-by`
- `sort-orders`
- `resizable`
- `formatter`
- `show-overflow-tooltip`
- `align`
- `header-align`
- `class-name`
- `label-class-name`
- `selectable`
- `reserve-selection`
- `filters`
- `filter-placement`
- `filter-class-name ^`
- `filter-multiple`
- `filter-method`
- `filtered-value`
- `tooltip-formatter ^`

#### Table-column Slots

- `default`
- `header`
- `filter-icon ^`
- `expand ^`

### table-v2.md

#### TableV2 API

- `cache`
- `estimated-row-height`
- `header-class`
- `header-props`
- `header-cell-props`
- `header-height`
- `footer-height`
- `row-class`
- `row-key`
- `row-props`
- `row-height`
- `row-event-handlers`
- `cell-props`
- `columns`
- `data`
- `data-getter`
- `fixed-data`
- `expand-column-key`
- `expanded-row-keys`
- `default-expanded-row-keys`
- `class`
- `fixed`
- `width ^`
- `height ^`
- `max-height`
- `indent-size`
- `h-scrollbar-size`
- `v-scrollbar-size`
- `scrollbar-always-on`
- `sort-by`
- `sort-state`
- `cell`
- `header`
- `header-cell`
- ...另有 28 项，详见来源文档

#### TableV2 Attributes

- `cache`
- `estimated-row-height`
- `header-class`
- `header-props`
- `header-cell-props`
- `header-height`
- `footer-height`
- `row-class`
- `row-key`
- `row-props`
- `row-height`
- `row-event-handlers`
- `cell-props`
- `columns`
- `data`
- `data-getter`
- `fixed-data`
- `expand-column-key`
- `expanded-row-keys`
- `default-expanded-row-keys`
- `class`
- `fixed`
- `width ^`
- `height ^`
- `max-height`
- `indent-size`
- `h-scrollbar-size`
- `v-scrollbar-size`
- `scrollbar-always-on`
- `sort-by`
- `sort-state`

#### TableV2 Slots

- `cell`
- `header`
- `header-cell`
- `row`
- `footer`
- `empty`
- `overlay`

#### TableV2 Events

- `column-sort`
- `expanded-rows-change`
- `end-reached`
- `scroll`
- `rows-rendered`
- `row-expand`

#### TableV2 Exposes

- `scrollTo`
- `scrollToLeft`
- `scrollToTop`
- `scrollToRow`

## 当前 ElfUI API 快照

### Props

- `border`
- `columns`
- `currentRowKey`
- `data`
- `defaultExpandAll`
- `defaultSort`
- `defaultExpandedRowKeys`
- `defaultSelectedKeys`
- `emptyText`
- `expandFormatter`
- `expandedRowKeys`
- `height`
- `fit`
- `headerCellClassName`
- `headerCellStyle`
- `headerRowClassName`
- `headerRowStyle`
- `highlightCurrentRow`
- `hover`
- `loading`
- `maxHeight`
- `rowClassName`
- `rowKey`
- `rowStyle`
- `cellClassName`
- `cellStyle`
- `scrollbarAlwaysOn`
- `selectOnIndeterminate`
- `selectedKeys`
- `showHeader`
- `showOverflowTooltip`
- `showSummary`
- `size`
- `sortOrder`
- `sortProp`
- `spanMethod`
- `stickyHeader`
- `stripe`
- `sumText`
- `summaryMethod`
- `tableLayout`

### Events

- `action-click`
- `cell-click`
- `cell-contextmenu`
- `cell-dblclick`
- `cell-mouse-enter`
- `cell-mouse-leave`
- `current-change`
- `expand-change`
- `header-click`
- `header-contextmenu`
- `row-click`
- `row-contextmenu`
- `row-dblclick`
- `scroll`
- `select`
- `select-all`
- `selection-change`
- `sort-change`
- `update:expandedRowKeys`
- `update:selectedKeys`

### Slots

- `append`
- `empty`

### Exposes

- `clearSelection`
- `getSelectionRows`
- `toggleRowSelection`
- `toggleAllSelection`
- `toggleRowExpansion`
- `setCurrentRow`
- `clearSort`
- `sort`
- `doLayout`
- `scrollTo`
- `setScrollTop`
- `setScrollLeft`

## 差距与任务

Table 与 TableV2 的渲染模型不同：前者使用原生表格语义，后者依赖虚拟化窗口。两者不在同一组件中混合实现；本计划先闭环经典 Table，TableV2 另立组件计划。

### 阶段 A：经典 Table 高频契约（2026-07-15 完成）

- [x] 样式与布局：`fit`、`table-layout`、`scrollbar-always-on`、行/单元格/表头 class 与 style 回调。
- [x] 初始状态：`default-sort`、`default-expand-all`、受控/非受控选择与展开同步。
- [x] 选择行为：`selectable`、`select-on-indeterminate`、`select`、`select-all` 与禁用态。
- [x] 鼠标事件：cell/row/header 的 click、dblclick、contextmenu，以及 cell mouseenter/mouseleave。
- [x] 数据展示：`show-overflow-tooltip`、列级 tooltip 覆盖、`show-summary`、`sum-text`、`summary-method`。
- [x] 插槽与方法：`empty`、`append`、`toggleAllSelection`、`doLayout`、`scrollTo`、`setScrollTop`、`setScrollLeft`。
- [x] 类型、PropsTable、独立案例、组件单测与页面冒烟同步。

### 阶段 B：经典 Table 进阶数据能力

- [x] `span-method` 合并单元格，并覆盖数组/对象结果与 0 rowspan/colspan 边界。
- [x] 树形数据：`tree-props`、`indent`、`lazy`、`load`、展开状态与键盘交互。
- [x] 列排序扩展：`sort-method`、`sort-by`、`sort-orders`、`sortable="custom"`，并修正 default/受控排序同步。
- [x] 列过滤：filters、filter-method、filtered-value、filter-change、clearFilter 与过滤面板定位。
- [x] 可调整列宽：`resizable`、header-dragend 与固定列布局重算。
- [x] 自定义列内容：header/cell/expand/filter-icon 插槽或等价渲染器契约。
- [x] tooltip-options、tooltip-formatter 与可访问的浮层提示，不只依赖原生 title。
- [x] 完成阶段 B 的组件测试、页面案例与浏览器视觉回归。

2026-07-16 阶段 B 验收：经典 Table 已覆盖合并单元格、树形数据、扩展排序、列过滤、列宽调整、自定义渲染器与可访问溢出浮层；39 项组件测试、10 项页面测试、生产构建和真实浏览器 hover / focus / Escape 回归通过，控制台无错误。

### 阶段 C：独立 TableV2

- [x] 新建虚拟化 TableV2 组件与计划，覆盖固定行高、动态行高、固定数据、横纵滚动与窗口缓存。
- [x] 以类型化 cell/header renderer 覆盖重复行渲染，并补齐 footer/empty/overlay 插槽与滚动公开方法。
- [ ] 补齐 column-sort、expanded-rows-change、end-reached、rows-rendered、row-expand 事件。
- [ ] 使用大数据案例验证渲染窗口、滚动定位、键盘访问与性能边界。

#### 2026-07-22 P0 基线

- [x] 新增独立 `elf-table-v2`，以适配层复用 Table 的固定行高窗口、固定头列、排序、横纵滚动与渲染器。
- [x] 新增 `rows-rendered` / `end-reached` / `column-sort` 等事件及 `scrollToRow` 等滚动方法。
- [x] 5,000 行 TableV2 与 10,000 行经典 Table 案例均补齐 Template / Script，并覆盖窄屏横向滚动。
- [x] TableV2 3 项 + Table 页面 13 项测试、Vite 796 模块构建与真实浏览器截图通过。

## 2026-07-27 TableV2 Stage C completion

- [x] 动态行高使用累计偏移与二分窗口定位，不以平均行高近似滚动位置。
- [x] `fixed-data` 使用独立固定表头区，并同步横向滚动；footer 高度从正文视口中扣除。
- [x] 增加 empty / overlay / footer 状态插槽和完整高级案例。
- [ ] 动态行高、固定数据区和完整 overlay/footer 插槽继续作为阶段 C 增强项，不阻塞本轮 P0 性能基线。

## 验收清单

- [x] 阶段 A 的 API props/types 与页面 PropsTable 同步。
- [x] 阶段 A 的关键交互和边界状态有单测覆盖。
- [x] 阶段 A 文档示例可在 Playground 显示 Template / Script，复制内容使用公开 API。
- [x] 阶段 A 目标测试与构建通过。
- [ ] 阶段 B、C 全部完成后再将根组件计划标记为完成。

## 2026-07-14 体验修复

- [x] 固定列与横向滚动场景采用细窄、主题化 scrollbar，并通过目标测试与构建。

## 2026-07-17 固定行高窗口化

- [x] 增加 `virtual`、`virtual-threshold`、`row-height` 与 `overscan`。
- [x] 与 VirtualList 复用 `computeVirtualWindow`，不复制窗口算法。
- [x] 保留完整数据集合用于排序、筛选、选择、汇总和公开方法，仅限制 tbody 的 DOM 行数。
- [x] 增加 10,000 行案例与滚动换窗回归测试。

## 2026-07-19 虚拟滚动热路径

- [x] 缓存虚拟窗口与渲染行切片，避免同一窗口内重复计算和数组分配。
- [x] 滚动事件同步换窗；公开 `scroll` 事件使用 microtask 合并，避免动画帧延迟与事件风暴。
- [x] 复用 VirtualList 的固定行高窗口算法，并为纯文本/index 列提供稳定 key 的 tbody 快速更新路径；复杂列自动回退到完整响应式渲染。
- [x] 去除超长滚动层的 paint containment，使用块级虚拟 tbody 高度与 padding 定位，避免浏览器为 44 万像素画布付出高额绘制成本。
- [x] 10,000 行真实浏览器连续跨区跳转 80 次仅保留 14 行 DOM，约 4ms/次，末项准确落到第 10,000 行。

## 2026-07-19 顶部越界回归

- [x] 快速虚拟路径单独记录真实渲染范围，避免与未更新的响应式 `scrollTop` 比较后错误跳过首屏重绘。
- [x] 对负向越界位置归一化为顶部窗口，并覆盖底部到顶部的回归测试。
- [x] 真实浏览器从第 9,987 行回到顶部后立即显示第 1–14 行，`scrollTop` 与顶部 padding 均为 0。

## 2026-07-19 选择与分页响应

- [x] 行、列、选择和树状态采用不可变 shallow snapshot，避免为大数据集合创建无意义的深层响应式代理。
- [x] 选择操作先同步更新可见行、复选框与 ARIA，再合并声明式提交，快速连续点击仍以最后状态为准。
- [x] 文档分页案例改为直接更新目标 Table，移除父案例受控值造成的整段重复渲染。
- [x] 组件与页面回归覆盖连续选择、连续翻页和最终状态；真实浏览器交互耗时较修复前约降低一半。

## 2026-07-22 标题栏案例

- [x] 增加带 `title` 与 `title-variant="primary"` 的双语 Table 案例并接入页面注册。
- [x] 页面测试覆盖案例导入、注册和标题样式配置。

## 2026-07-28 动态虚拟窗口收敛

- [x] 动态 `row-height` 改为复用统一的累计偏移与二分窗口模型，不再由 Table 自行维护偏移构建算法。
- [x] 保留 Table 自身的数据排序、测量策略、响应式渲染与固定行高同步快路径，公共模块只负责纯窗口计算。
- [x] 增加函数行高回归测试，覆盖总高度、滚动偏移与有界渲染范围。

## 2026-07-28 筛选浮层交互收敛

- [x] 列筛选面板接入共享 `useDismissibleOverlay`，删除 Table 自有的 document outside 监听。
- [x] 保留筛选草稿、列规则、Top Layer 和锚点定位为 Table 内聚职责。
- [x] Escape 与外部点击由最上层浮层独占，同一事件不会连续关闭下层 Table 或父级模态层。
- [x] 增加双 Table 浮层的 outside click 与 Escape 事件归属回归测试，并复用现有“列筛选”案例完成浏览器验证。

## 2026-07-28 排序筛选纯模型

- [x] 抽取 `sort-filter.ts`，集中深层字段读取、排序策略、筛选值身份、运行时选项规范化和行匹配。
- [x] 组件仅保留响应式状态、受控同步、事件发射、虚拟行刷新和筛选面板交互。
- [x] 活动筛选列在单次 rows rebuild 中只计算一次，避免对每一行重复规范化列筛选选项。
- [x] 增加纯逻辑测试，覆盖嵌套路径、多字段排序、自定义策略异常、远程排序、同列 OR / 跨列 AND 和单选去重。
