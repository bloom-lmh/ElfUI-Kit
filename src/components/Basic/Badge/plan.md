# Badge Element Plus API 对标计划

## 本轮记录
- [x] 第二阶段：补 `offset`、`badge-style`、`badge-class`、`content` 与 `content` slot 基础能力和页面示例。
- [x] 2026-07-15：完成 API、类型、案例与可访问性收口；修复原生 `hidden` 属性误隐藏宿主内容的问题，17 项组件测试、生产构建与浏览器冒烟均通过。
- [x] 2026-07-26 P1 文档审计：逻辑方向定位与入场动画支持 RTL；长文本视觉省略但保留完整状态名称，并补动态值、零值和双语场景案例。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Badge`
- Element Plus 文档：`badge.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### badge.md

#### API

- `value`
- `max`
- `is-dot`
- `hidden`
- `type`
- `show-zero ^`
- `color ^`
- `offset ^`
- `badge-style ^`
- `badge-class ^`
- `default`
- `content ^`

#### Attributes

- `value`
- `max`
- `is-dot`
- `hidden`
- `type`
- `show-zero ^`
- `color ^`
- `offset ^`
- `badge-style ^`
- `badge-class ^`

#### Slots

- `default`
- `content ^`

## 当前 ElfUI API 快照

### Props

- `color`
- `hidden`
- `isDot`
- `max`
- `offset`
- `badgeStyle`
- `badgeClass`
- `content`
- `showZero`
- `type`
- `value`

### Events

- 无。Badge 是被动展示组件，不额外派发交互事件。

### Slots

- `default`
- `content`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`offset ^`、`badge-style ^`、`badge-class ^`
- [x] P1 复核事件差距：Badge 为被动展示组件，与 Element Plus 一致，无自定义事件契约。
- [x] P1 补齐插槽/暴露方法：`content ^`
- [x] P1 对齐边界状态与无障碍属性：覆盖最大值、零值、圆点、隐藏、动态属性同步和 `role=status`；键盘、禁用、表单联动不适用于被动展示组件。
- [x] P2 更新页面示例：Template / Script 双视图、动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [x] P2 补齐组件单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；`pnpm test src/components/Basic/Badge/Badge.test.ts` 17/17 通过。
