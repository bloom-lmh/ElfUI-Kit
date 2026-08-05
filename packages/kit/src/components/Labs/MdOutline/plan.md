# MdOutline 配套大纲组件

生成时间：2026-08-04

## 定位

- 与 `elf-md-page` 配对使用，渲染可点击的标题大纲并高亮滚动中的当前章节。
- 通过 `target` 关联同 Shadow Root 或 document 中的 `elf-md-page`，监听 `toc-change` / `active-change`。

## 公共契约

- Props：`target`、`toc`（直接数据）、`max-depth`、`label`。
- Events：`select`。
- Expose：`scrollTo(id)`、`active()`。

## 验收清单

- [x] 数据来自 `toc` prop 或目标组件 `outline()`。
- [x] 监听目标 `toc-change` / `active-change` 并高亮当前项。
- [x] 点击条目平滑滚动到对应标题。
- [x] 缩进随标题深度变化。
