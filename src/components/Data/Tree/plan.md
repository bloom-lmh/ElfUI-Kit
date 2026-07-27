# Tree Element Plus API 对标计划

- [x] 2026-07-17 文档案例统一使用轻量 outlined Card 承载，保持 Playground 标题操作与树内容层级稳定。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Tree`
- Element Plus 文档：`tree.md`、`tree-v2.md`、`tree-select.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tree.md

#### Tree API

- `data`
- `empty-text`
- `node-key`
- `props`
- `render-after-expand`
- `load`
- `render-content`
- `highlight-current`
- `default-expand-all`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `auto-expand-parent`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-node-method`
- `accordion`
- `indent`
- `icon`
- `lazy`
- `draggable`
- `allow-drag`
- `allow-drop`
- `label`
- `children`
- `disabled`
- `isLeaf`
- `class`
- `filter`
- `updateKeyChildren`
- `getCheckedNodes`
- ...另有 30 项，详见来源文档

#### Attributes

- `data`
- `empty-text`
- `node-key`
- `props`
- `render-after-expand`
- `load`
- `render-content`
- `highlight-current`
- `default-expand-all`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `auto-expand-parent`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-node-method`
- `accordion`
- `indent`
- `icon`
- `lazy`
- `draggable`
- `allow-drag`
- `allow-drop`

#### props

- `label`
- `children`
- `disabled`
- `isLeaf`
- `class`

#### Exposes

- `filter`
- `updateKeyChildren`
- `getCheckedNodes`
- `setCheckedNodes`
- `getCheckedKeys`
- `setCheckedKeys`
- `setChecked`
- `getHalfCheckedNodes`
- `getHalfCheckedKeys`
- `getCurrentKey`
- `getCurrentNode`
- `setCurrentKey`
- `setCurrentNode`
- `getNode`
- `remove`
- `append`
- `insertBefore`
- `insertAfter`

#### Events

- `node-click`
- `node-contextmenu`
- `check-change`
- `check`
- `current-change`
- `node-expand`
- `node-collapse`
- `node-drag-start`
- `node-drag-enter`
- `node-drag-leave`
- `node-drag-over`
- `node-drag-end`
- `node-drop`

#### Slots

- `default`
- `empty ^`

### tree-v2.md

#### TreeV2 API

- `data`
- `empty-text`
- `props`
- `highlight-current`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-method`
- `indent`
- `icon`
- `item-size ^`
- `scrollbar-always-on ^`
- `height`
- `value`
- `label`
- `children`
- `disabled`
- `class ^`
- `filter`
- `getCheckedNodes`
- `getCheckedKeys`
- `setCheckedKeys`
- `setChecked`
- `setExpandedKeys`
- `getHalfCheckedNodes`
- `getHalfCheckedKeys`
- `getCurrentKey`
- `getCurrentNode`
- `setCurrentKey`
- ...另有 16 项，详见来源文档

#### TreeV2 Attributes

- `data`
- `empty-text`
- `props`
- `highlight-current`
- `expand-on-click-node`
- `check-on-click-node`
- `check-on-click-leaf ^`
- `default-expanded-keys`
- `show-checkbox`
- `check-strictly`
- `default-checked-keys`
- `current-node-key`
- `filter-method`
- `indent`
- `icon`
- `item-size ^`
- `scrollbar-always-on ^`
- `height`

#### props

- `value`
- `label`
- `children`
- `disabled`
- `class ^`

#### TreeV2 Exposes

- `filter`
- `getCheckedNodes`
- `getCheckedKeys`
- `setCheckedKeys`
- `setChecked`
- `setExpandedKeys`
- `getHalfCheckedNodes`
- `getHalfCheckedKeys`
- `getCurrentKey`
- `getCurrentNode`
- `setCurrentKey`
- `getNode`
- `expandNode`
- `collapseNode`
- `setData`
- `scrollTo ^`
- `scrollToNode ^`

#### TreeV2 Events

- `node-click`
- `node-drop ^`
- `node-contextmenu`
- `check-change`
- `check`
- `current-change`
- `node-expand`
- `node-collapse`

#### TreeV2 Slots

- `default`
- `empty ^`

### tree-select.md

#### API

- `Attributes`
- `tree`
- `select`
- `cache-data ^`
- `treeRef ^`
- `selectRef ^`
- `filter ^`
- `updateKeyChildren ^`
- `getCheckedNodes ^`
- `setCheckedNodes ^`
- `getCheckedKeys ^`
- `setCheckedKeys ^`
- `setChecked ^`
- `getHalfCheckedNodes ^`
- `getHalfCheckedKeys ^`
- `getCurrentKey ^`
- `getCurrentNode ^`
- `setCurrentKey ^`
- `setCurrentNode ^`
- `getNode ^`
- `remove ^`
- `append ^`
- `insertBefore ^`
- `insertAfter ^`
- `focus ^`
- `blur ^`
- `selectedLabel ^ ^`

#### Attributes

- `Attributes`
- `tree`
- `select`
- `cache-data ^`

#### Own Attributes

- `cache-data ^`

#### Exposes

- `treeRef ^`
- `selectRef ^`
- `filter ^`
- `updateKeyChildren ^`
- `getCheckedNodes ^`
- `setCheckedNodes ^`
- `getCheckedKeys ^`
- `setCheckedKeys ^`
- `setChecked ^`
- `getHalfCheckedNodes ^`
- `getHalfCheckedKeys ^`
- `getCurrentKey ^`
- `getCurrentNode ^`
- `setCurrentKey ^`
- `setCurrentNode ^`
- `getNode ^`
- `remove ^`
- `append ^`
- `insertBefore ^`
- `insertAfter ^`
- `focus ^`
- `blur ^`
- `selectedLabel ^ ^`

## 当前 ElfUI API 快照

### Props

- 数据与字段：`data`、`node-key`、`props`（含 `class` / `icon` / `isLeaf`）。
- 受控状态：`model-value`、`current-node-key`、`expanded-keys`、`checked-keys`。
- 展开与勾选：`default-expand-all`、`auto-expand-parent`、`accordion`、`check-strictly`、`check-on-click-node`、`check-on-click-leaf`。
- 数据能力：`lazy` / `load`、`filter-node-method` / `filter-method`、`render-content`。
- 大数据与拖拽：`virtual`、`height`、`item-size`、`overscan`、`draggable`、`allow-drag`、`allow-drop`。
- 外观与无障碍：`bordered`、`icon`、`scrollbar-always-on`、`aria-label`。

### Events

- 状态事件：`update:modelValue`、`update:expandedKeys`、`update:checkedKeys`、`current-change`、`check`、`check-change`。
- 节点事件：`node-click`、`node-contextmenu`、`node-expand`、`node-collapse`、`node-load`。
- 拖拽事件：`node-drag-start`、`node-drag-enter`、`node-drag-over`、`node-drag-leave`、`node-drag-end`、`node-drop`。

### Slots

- `empty`。
- 节点定制通过可类型化的 `render-content(node, context)` 完成，避免宏模板重复节点中的 scoped-slot 不确定性。

### Exposes

- 勾选、展开、当前节点、过滤、数据替换、节点增删插入和滚动方法均已公开。
- 节点维护使用 `appendNode/removeNode/insertBeforeNode/insertAfterNode`，避免覆盖 HTMLElement 的同名原生方法。

## 差距与任务

- [x] P1 补齐懒加载、过滤别名、自动展开父级、叶子点击勾选、节点类名/图标、渲染函数、虚拟窗口与常驻滚动条。
- [x] P1 补齐上下文菜单、当前节点与完整拖拽生命周期事件。
- [x] P1 补齐空状态插槽，以及勾选、展开、过滤、节点维护、数据替换和滚动公开方法。
- [x] P1 对齐键盘树导航、禁用态、空状态、受控/非受控同步、ARIA tree/treeitem 状态和 roving tabindex。
- [x] P2 将“大数据虚拟树”和“小型目录拖拽”拆成独立案例，补齐 Template / Script 和类型导出。
- [x] P2 补齐组件单测、页面冒烟与视觉验证。
- [ ] P1 拖拽目前采用稳定的 `inner` 投放；若产品需要同级排序，再扩展 `before/after` 命中区域与键盘拖拽。
- [ ] P2 `render-after-expand=false` 与 scoped default slot 依赖重复宏模板的稳定作用域插槽能力，当前以 `render-content` 覆盖主要定制场景。
- [ ] P2 TreeSelect 保持独立组合组件规划，不把 Select 的弹层、搜索和表单职责塞进 Tree。

> Web Components 约束：不暴露 `append/remove/insertBefore/scrollTo` 同名方法，因为它们会覆盖 HTMLElement 原生 API。对应能力使用带语义前缀的方法提供。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm typecheck`、目标测试、全量测试与生产构建通过。

## 2026-07-14 体验修复

- [x] 树体滚动条改为细窄主题样式；权限树操作与状态合并到案例标题行。
