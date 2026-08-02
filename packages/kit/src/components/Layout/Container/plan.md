# Container Element Plus API 对标计划

生成时间：2026-07-05

## 2026-07-15 架构复核

- `elf-container` 是 ElfUI 额外提供的页面限宽/留白容器，不直接对应 Element Plus 的布局 Container。
- Element Plus `direction` 对应 `elf-layout`；`height` 对应 `elf-header` / `elf-footer`；`width` 对应 `elf-aside`。保持分工可以避免内容容器与应用骨架职责耦合。
- 本轮补齐 `maxWidth`、`padding`、`fluid` 的 property → host attribute 响应链、默认值/动态状态测试、插槽类型、完整案例与浏览器验收。

## 对标定位

- ElfUI 组件目录：`Layout/Container`
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

- `maxWidth`
- `padding`
- `fluid`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 完成核心属性归属复核：`direction`、`height`、`width` 分别由 `elf-layout`、`elf-header/footer`、`elf-aside` 提供，不重复塞入页面限宽容器。
- [x] P1 复核事件差距：Container 为纯布局组件，无自定义事件契约。
- [x] P1 复核插槽/暴露方法：默认插槽已类型化，无需 expose 方法。
- [x] P1 对齐动态 property/attribute 同步；键盘、禁用、清空、表单与 ARIA 不适用于无交互语义的布局容器。
- [x] P2 更新页面示例：3 个案例均提供 Template / Script，覆盖所有宽度、padding、fluid 与嵌套限宽场景。
- [x] P2 补齐组件单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 默认值、slot、全部宽度档位和 fluid 动态同步有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；`pnpm test src/components/Layout/Container/Container.test.ts` 5/5 通过，浏览器验证 `xl=1536px`、`fluid=max-width:none`。
