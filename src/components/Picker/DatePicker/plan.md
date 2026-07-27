# DatePicker Element Plus API 对标计划

## 2026-07-21 草稿同步与多选宽度

- [x] 仅当外部受控值签名变化时重建选择草稿，避免选择后旧高亮短暂回闪。
- [x] 多日期输入保持固定宽度，日期标签横向滚动且不撑开页面布局。

## 2026-07-16 interaction polish

- [x] Share the circular day selection and fresh range-draft semantics with Calendar.
- [x] Close the anchored panel on outside pointer interaction and external page motion while preserving internal scrolling.

## 2026-07-19 documentation and surface polish

- [x] Remove the redundant appearance gallery and keep the basic shared-field example.
- [x] Keep multiple selections in a fixed-width, horizontally scrollable chip strip so added dates never shift the page layout.
- [x] Flatten the embedded Calendar border/radius inside the confirmation panel and use an SVG remove icon.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Picker/DatePicker`
- Element Plus 文档：`date-picker.md`、`datetime-picker.md`、`date-picker-panel.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### date-picker.md

#### API

- `model-value / v-model`
- `readonly`
- `disabled`
- `size`
- `editable`
- `clearable`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `validate-event`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `teleported`
- `empty-values ^`
- `value-on-clear ^`
- `fallback-placements ^`
- `placement ^`
- `show-footer ^`
- `show-confirm ^`
- ...另有 17 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `readonly`
- `disabled`
- `size`
- `editable`
- `clearable`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `validate-event`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `teleported`
- `empty-values ^`
- `value-on-clear ^`
- `fallback-placements ^`
- `placement ^`
- `show-footer ^`
- `show-confirm ^`
- ...另有 2 项，详见来源文档

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`
- `calendar-change`
- `panel-change`
- `visible-change`

#### Slots

- `default`
- `range-separator`
- `prev-month ^`
- `next-month ^`
- `prev-year ^`
- `next-year ^`

#### Exposes

- `focus`
- `blur ^`
- `handleOpen ^`
- `handleClose ^`

### datetime-picker.md

#### API

- `model-value / v-model`
- `readonly`
- `disabled`
- `editable`
- `clearable`
- `size`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `arrow-control`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `date-format ^`
- `time-format ^`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `shortcuts`
- `disabled-date`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `cell-class-name`
- ...另有 20 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `readonly`
- `disabled`
- `editable`
- `clearable`
- `size`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `arrow-control`
- `type`
- `format`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `default-value`
- `default-time`
- `value-format`
- `date-format ^`
- `time-format ^`
- `id`
- `unlink-panels`
- `single-panel ^`
- `prefix-icon`
- `clear-icon`
- `shortcuts`
- `disabled-date`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `cell-class-name`
- ...另有 7 项，详见来源文档

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`
- `calendar-change`
- `panel-change`
- `visible-change`

#### Slots

- `default`
- `range-separator`
- `prev-month ^`
- `next-month ^`
- `prev-year ^`
- `next-year ^`

#### Exposes

- `focus`
- `blur ^`

### date-picker-panel.md

#### API

- `model-value / v-model`
- `border`
- `disabled`
- `clearable`
- `editable ^`
- `type`
- `default-value`
- `default-time`
- `value-format`
- `date-format`
- `time-format`
- `unlink-panels`
- `single-panel ^`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `show-footer`
- `show-confirm`
- `show-week-number`
- `calendar-change`
- `panel-change`
- `clear ^`
- `default`
- `prev-month`
- `next-month`
- `prev-year`
- `next-year`

#### Attributes

- `model-value / v-model`
- `border`
- `disabled`
- `clearable`
- `editable ^`
- `type`
- `default-value`
- `default-time`
- `value-format`
- `date-format`
- `time-format`
- `unlink-panels`
- `single-panel ^`
- `disabled-date`
- `shortcuts`
- `cell-class-name`
- `show-footer`
- `show-confirm`
- `show-week-number`

#### Events

- `calendar-change`
- `panel-change`
- `clear ^`

#### Slots

- `default`
- `prev-month`
- `next-month`
- `prev-year`
- `next-year`

## 当前 ElfUI API 快照

### Props

- `actions`
- `cancelText`
- `clearText`
- `clearable`
- `confirmText`
- `disabled`
- `endPlaceholder`
- `endValue`
- `header`
- `max`
- `min`
- `modelValue`
- `multiple`
- `placeholder`
- `range`
- `shortcuts`
- `showHeader`
- `type`

### Events

- `update:endValue`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 高级属性：完成 `popper-options`、`fallback-placements`、`default-value`、`default-time`、`unlink-panels`、`single-panel`、自定义导航图标、`cell-class-name` 与 `show-week-number`。
- [x] P0 补齐 `change`、`blur`、`focus`、`clear`、`calendar-change`、`panel-change`、`visible-change` 事件。
- [x] P1 插槽：完成 `range-separator` 与年月导航图标；`focusInput`、`blurInput`、`handleOpen`、`handleClose` 已完成。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控同步、表单联动和无障碍属性。
- [x] P2 更新页面示例：Template / Script 双视图、动态绑定使用 `${...}`，覆盖格式、禁用、键盘与自定义浮层。
- [x] P2 补齐组件单测、页面冒烟和类型导出，并完成视觉回归截图。

## 2026-07-27 Picker 契约收尾

- [x] 接入 `useFormControl`、`useDisabled`、`useSize`，统一 Form 校验、禁用与尺寸继承。
- [x] 补齐只读、可编辑、范围文案、原生表单属性、空值回退、浮层 class/style 和动作栏兼容属性。
- [x] `calendar-change` 与 `panel-change` 提供类型化事件，API 表同步 Exposes。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm typecheck`、全量测试与生产构建通过。

## 2026-07-14 交互升级

- [x] 使用 Calendar 作为单日期、范围和多日期面板，月份使用层级网格，保留快捷项与确认/取消草稿语义。
- [x] 新面板完成圆角 surface、暗色主题、受控回显和真实浏览器验收；相关测试与 `pnpm build` 通过。

## 2026-07-16 Field Surface 与关闭语义

- [x] 接入共享 `filled / outlined` 和浮动标签；点击外部或外部滚动关闭面板，面板内部交互保持打开。

## 2026-07-22 格式、键盘与 Top Layer

- [x] 补齐 `format` / `valueFormat`，区分日历内部 ISO 值、展示值和对外绑定值。
- [x] 补齐 `disabledDate`，并与 `min` / `max` 组合限制日期单元格。
- [x] 补齐触发器键盘打开/关闭、焦点事件、`visible-change` 和无冲突公开方法。
- [x] 使用原生 Popover Top Layer、视口碰撞计算和 resize 重定位解决层级遮挡。
- [x] 新增格式与边界案例，完成组件 15 项、页面 1 项测试和真实浏览器截图。
