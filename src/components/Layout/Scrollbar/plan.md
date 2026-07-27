# Scrollbar Element Plus API 对标计划

## 2026-07-19 案例布局
- [x] 命令控制按钮迁移到 Playground 标题操作区
- [x] 消息列表示例约束滚动宿主宽度，内容与垂直轨道仅保留 8px 稳定 gutter，不再出现大块空白。
- [x] 1200px、360px 与暗色主题真实浏览器验证无页面溢出；命令控制到顶/到底精确命中 0 与最大滚动值。

生成时间：2026-07-05 · 更新：2026-07-13

## 第一批实现

- [x] 基础 props：`height`、`max-height`、`always`、`native`。
- [x] 基础 event：`scroll`。
- [x] 接入 Layout 注册和单测。

## 后续差距

- [x] 自定义滚动条 thumb（hover / active 状态 + color-mix 主题适配）。
- [x] `noresize` prop（纯 CSS 实现天然无 resize 监听，保留 prop 对齐 API）。
- [x] `wrap-class` / `view-class`（透传到 `.wrap` / `.view`）。
- [x] `setScrollTop` / `setScrollLeft` / `update` expose（`defineExpose` + `useTemplateRef`，带 `useHost` 回退）。
- [x] `wrapRef` expose（getter 动态返回 `.wrap` 元素）。
- [x] `native` prop 切换美化（`native=true` 默认美化，`native=false` 保留纯原生）。

## 本轮案例页

- [x] 独立展示页面，覆盖 height、max-height、always、scroll 事件。
- [x] 横向滚动案例（展示 thumb 横向样式）。
- [x] 命令式 API（setScrollTop）演示。
- [x] 修复 Playground slot 边界下模板 ref 未解析导致“回到顶部 / 滚到底部”无效，并增加页面级回归测试。

## 实现要点

- 高度直接内联到 `.wrap`（`:style`），不再绕 host→wrap 的 `height:100%` 传递，
  避免 host 在 flex 容器里或 CSS 变量时序未跟上时塌缩成内容高度导致无滚动条。
- `useHostFlag("native")` / `useHostFlag("always")` 反射到 host attribute，
  由 `:host([native])` / `:host([always])` 控制样式分支。

## 2026-07-22 纵向案例约束

- [x] 消息列表案例显式隐藏横向溢出，视图宽度跟随滚动容器，确保只出现纵向滚动条。
