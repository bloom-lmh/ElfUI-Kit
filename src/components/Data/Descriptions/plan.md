# Descriptions Element Plus API 对标计划

## 2026-07-19 alignment and responsive layout

- [x] Align horizontal data items on one shared 88px label track so values start on the same baseline.
- [x] Collapse configured multi-column layouts to full-width items below 640px, including declarative items.
- [x] Keep borders, long content, header extras, and themed text tokens intact.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Descriptions`
- Element Plus 文档：`descriptions.md`

## 第一批实现

- [x] 基础 props：`title`、`extra`、`items`、`column`、`border`、`direction`、`size`、`props`。
- [x] 基础 slots：`title`、`extra`。
- [x] 注册到 Data 组件族并补单测。

## 后续差距

- [x] 拆出 DescriptionsItem 子组件，补 label/default slots、align、label-width、class-name，并保持 items 数据模式为无子项时的兼容回退。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、items 数据结构、column、border、vertical、size 和 span 示例。

## 2026-07-26 v0.0.2-beta.1 内容边界与插槽复核

- [x] 新增基于组件自身宽度的 `responsive` 列策略，在最大列数、2 列和 1 列之间稳定切换，数据项与声明式子项的 span 同步收敛。
- [x] 新增 `empty-text` 与 `empty` slot；null、undefined、空字符串使用占位文本，同时保留 `0` 与 `false`。
- [x] 修复仅提供 `title` / `extra` slot 时头部不显示的问题，默认 slot 始终监听声明式子项的动态增删。
- [x] 声明式子项补齐 `rowspan`、`label-class-name`、`empty-text`，水平标签统一进入共享宽度轨道。
- [x] DOM 语义调整为 `dl` / `dt` / `dd`，长标签、长链接和值内容统一安全换行。
- [x] 文档收敛为响应式内容边界、边框方向密度、插槽操作与空集合 3 个双语场景，补齐 Template、Script 和完整 API。
