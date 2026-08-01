# Main Element Plus API 对标计划

生成时间：2026-07-05

## 2026-07-15 验收记录

- [x] 确认 Main 与 Element Plus 一致为无 props 的剩余空间容器；补齐 slot 类型、2 项独立测试和组合布局浏览器验收。
- [x] 2026-07-31 移除 Main 默认的主色混合背景，默认改为透明，同时保留 `--elf-layout-main-bg` 供业务布局显式覆盖。

## 对标定位

- ElfUI 组件目录：`Layout/Main`
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

- 暂无记录

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 完成核心属性归属复核：Main 无独立属性；`direction`、`height`、`width` 分属 Layout、Header/Footer、Aside。
- [x] P1 复核事件差距：Main 为纯布局组件，无自定义事件契约。
- [x] P1 默认插槽已类型化，无需 expose 方法。
- [x] P1 验证 `flex: 1`、最小尺寸和滚动布局；交互、禁用、清空、表单与 ARIA 不适用。
- [x] P2 共享 Layout Shell 的 3 个案例均提供 Template / Script。
- [x] P2 补齐独立单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API/slot 类型与页面 PropsTable 同步。
- [x] slot 投影与无意外交互表面有独立单测覆盖。
- [x] Playground Template / Script 与复制内容完整。
- [x] `pnpm build` 通过；Main 2/2 测试通过，浏览器验证 `flex-grow: 1`。
