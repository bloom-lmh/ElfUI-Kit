# Header Element Plus API 对标计划

生成时间：2026-07-05

## 2026-07-15 验收记录

- [x] `height` 默认值、attribute/property 动态更新、默认插槽与类型导出已收口；3 项独立测试、生产构建和组合布局浏览器验收通过。

## 对标定位

- ElfUI 组件目录：`Layout/Header`
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

- `height`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 完成核心属性归属复核：Header 的 Element Plus 契约只有 `height`；`direction` 属于 Layout，`width` 属于 Aside。
- [x] P1 复核事件差距：Header 为纯布局组件，无自定义事件契约。
- [x] P1 默认插槽已类型化，无需 expose 方法。
- [x] P1 对齐 height attribute/property 同步；交互、禁用、清空、表单与 ARIA 不适用于无交互语义的布局容器。
- [x] P2 共享 Layout Shell 的 3 个案例均提供 Template / Script。
- [x] P2 补齐独立单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 默认值、attribute/property 更新和 slot 有单测覆盖。
- [x] Playground Template / Script 与复制内容完整。
- [x] `pnpm build` 通过；Header 3/3 测试通过，浏览器验证默认 `60px` 与动态 `48px`。
