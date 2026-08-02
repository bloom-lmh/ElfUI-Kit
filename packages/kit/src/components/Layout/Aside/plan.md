# Aside Element Plus API 对标计划

生成时间：2026-07-05

## 2026-07-15 验收记录

- [x] `width` 默认值对齐为 `300px`，并通过宿主 CSS 变量支持 attribute/property 动态更新。
- [x] 补齐 `AsideSlots`、4 项独立单测和 Layout Shell 的 Template / Script 双视图；生产构建及浏览器验收通过。

## 对标定位

- ElfUI 组件目录：`Layout/Aside`
- Element Plus 文档：`container.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### container.md

#### Container API

- `direction`
- `default`

#### Container Attributes

- `direction`

#### Container Slots

- `default`

#### Header API

- `height`
- `default`

#### Header Attributes

- `height`

#### Header Slots

- `default`

#### Aside API

- `width`
- `default`

#### Aside Attributes

- `width`

#### Aside Slots

- `default`

#### Main API

- `default`

#### Main Slots

- `default`

#### Footer API

- `height`
- `default`

#### Footer Attributes

- `height`

#### Footer Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `width`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 完成核心属性归属复核：Aside 的 Element Plus 契约只有 `width`；`direction` 属于 Layout，`height` 属于 Header/Footer。
- [x] P1 复核事件差距：Aside 为纯布局组件，无自定义事件契约。
- [x] P1 复核插槽/暴露方法：默认插槽已类型化，无需 expose 方法。
- [x] P1 对齐 attribute/property 动态同步；键盘、禁用、清空、表单和 ARIA 不适用于无交互语义的侧栏容器。
- [x] P2 更新共享 Layout Shell 页面：所有案例提供 Template / Script，覆盖 Aside + Main 与完整应用骨架。
- [x] P2 补齐独立组件单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步，默认宽度为 `300px`。
- [x] 默认值、attribute、property 动态更新和 slot 有独立单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；`pnpm test src/components/Layout/Aside/Aside.test.ts` 4/4 通过，浏览器验证显式宽度 `160px`、动态 CSS 变量更新为 `180px`。
