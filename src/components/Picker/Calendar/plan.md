# Calendar Element Plus API 对齐计划

## 2026-07-29 Date Adapter 与双语文档收口

- [x] 日期解析、格式化、字段读取、不可变日期运算、星期与 ISO 周序号统一通过 `DateAdapter`。
- [x] `firstDayOfWeek` 未显式传入时读取 ConfigProvider，全局配置与局部覆盖保持明确优先级。
- [x] 页面入口、5 个案例、Template / Script、运行状态和 Props / Events / Slots API 完整支持中英文。
- [x] Provider 周起始、键盘、范围、自定义日期内容均有聚焦测试。

## 2026-07-21 本地提交范围

- [x] 使用本地已提交范围渲染端点与区间，等待父级受控值回写时不再回闪旧日期。
- [x] 新范围选择维护独立起点草稿，第二次点击后立即按日期顺序提交完整范围。

## 2026-07-19 active and keyboard states

- [x] Preserve the primary selected-day surface during hover and focus, with an explicit accessible focus ring.
- [x] Add roving day focus with arrow, Home/End, and PageUp/PageDown navigation across month boundaries.
- [x] Expose committed range endpoints through `aria-selected` and cover range and keyboard regressions.

## 2026-07-19 范围选择回归
- [x] 修正数组 Ref 案例绑定并验证重新选择起止日期

## 2026-07-16 range polish

- [x] Keep selected days circular and clear the committed range preview as soon as a new first day is chosen.

更新时间：2026-07-13

- [x] 单日期 `model-value`、`first-day-of-week`、`update:modelValue`、`change` 和 header slot。
- [x] 月份导航：默认 header 提供上/下月按钮。
- [x] `disabled-date`、`locale` 和 `aria-label`，日期网格有 button/grid 语义。
- [x] 文档展示受控日期、本地化、禁用日期与翻月。
- [x] 单测覆盖月份网格、事件、本地化、禁用与翻月。

## 后续项

- [x] P0 范围选择：首击记录半选状态，第二击提交排序后的 `[start, end]`，并渲染起点、终点与区间。
- [x] P1 `render-date-cell(cell, date)` 类型化渲染器：保留日期按钮、键盘与 ARIA 语义，同时可靠支持逐日内容。
- [ ] P2 scoped `date-cell` slot 等待宏编译器支持跨 Custom Element 的稳定局部变量；当前不公开不可用契约。

## 2026-07-27 日期内容定制

- [x] 日期内容定制、周序号、单元格状态类和导航图标插槽完成组件测试、页面案例与真实浏览器验收。

## 2026-07-22 P0 关键边界

- [x] Enter / Space 选择当前日期；方向键与跨月键盘移动跳过 `disabledDate`。
- [x] 新增 360px 键盘月历案例，明确方向键、Home/End 与选择键路径。
- [x] 文档补齐 Props / Events API 表，组件 8 项 + 页面 1 项测试与 Vite 792 模块构建通过。

## 验收记录

- [x] `pnpm test src/components/Picker/Calendar/Calendar.test.ts` 通过。
- [x] `pnpm build` 通过。
- [x] 2026-07-14 移除原生年份下拉，改为日期 / 月份 / 年份三级选择；完成暗色主题和真实浏览器验收。
