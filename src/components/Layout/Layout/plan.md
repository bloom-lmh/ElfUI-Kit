# Layout Element Plus API 对标计划

## 2026-07-22 浅色区域层级

- [x] 为 Header、Aside、Main、Footer 提供默认分区背景和分隔线，避免浅色主题下所有区域融为同一白色平面。
- [x] 通过 `--elf-layout-*-bg` 与 `--elf-layout-divider` 保留业务侧自定义和无分隔设计能力。
- [x] Main 默认层级改用 5% 主题色底，避免与 Playground 中性灰代码区混淆。

生成时间：2026-07-05

## 2026-07-15 架构与验收记录

- [x] `elf-layout` 对应 Element Plus Container：支持显式 `direction`，未显式设置时根据直接子级 `elf-aside` 自动推断方向，并在 slot 动态变化后重新计算。
- [x] Element Plus Row/Col API 由 ElfUI `elf-grid` / `elf-grid-item` 与 `elf-flex` 承担，不在应用骨架 Layout 中重复实现。
- [x] 9 项测试、生产构建及浏览器自动方向冒烟通过。

## 对标定位

- ElfUI 组件目录：`Layout/Layout`
- Element Plus 文档：`layout.md`、`container.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### layout.md

#### Row API

- `gutter`
- `justify`
- `align`
- `tag`
- `default`

#### Row Attributes

- `gutter`
- `justify`
- `align`
- `tag`

#### Row Slots

- `default`

#### Col API

- `span`
- `offset`
- `push`
- `pull`
- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `tag`
- `default`

#### Col Attributes

- `span`
- `offset`
- `push`
- `pull`
- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `tag`

#### Col Slots

- `default`

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

- `direction`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 完成 API 归属复核：Row/Col 的栅格属性由 Grid/GridItem/Flex 提供，`height`、`width` 分属 Header/Footer 与 Aside；Layout 自身完整实现 `direction`。
- [x] P1 复核事件差距：Layout 为纯布局组件，无自定义事件契约。
- [x] P1 默认插槽已类型化，无需 expose 方法。
- [x] P1 对齐显式/自动方向同步及动态 slot 更新；交互、禁用、清空、表单和 ARIA 不适用于无交互语义的布局容器。
- [x] P2 Layout Shell 的 3 个案例均提供 Template / Script，并新增 Aside 自动横向案例。
- [x] P2 补齐组件单测、页面冒烟、类型导出和视觉验证。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步，默认方向标记为 `auto`。
- [x] 默认、显式覆盖、Aside 自动推断及动态增删有单测覆盖。
- [x] Playground Template / Script 与复制内容完整。
- [x] `pnpm build` 通过；Layout 9/9 测试通过，浏览器验证 `vertical/column → horizontal/row`。

## 2026-07-19 组合案例扩充

- [x] 新增主导航、二级导航、内容区和状态栏组成的多级应用工作区案例。
- [x] 新增 Header、Main 与右侧详情栏组合案例，并补齐 Template / Script。
- [x] 浏览器验证两组画布与 Main 均无意外内部滚动。

## 2026-07-19 产品布局图库

- [x] 全部示意统一为低圆角虚线结构，不混用实线卡片、渐变或阴影。
- [x] 增加 Baseline、Extended Toolbar、System Bar、Inbox、Constrained、Side Navigation、Three Columns、Community Workspace 与 Store Layout 九种产品布局。
- [x] 1200px 与 360px 真实浏览器验证通过，图库响应为三列/两列/单列且页面无横向溢出。

## 2026-07-22 案例结构去重

- [x] 生命周期迁移为 `onMounted`。
- [x] 将相同应用骨架合并，保留八种不重复结构能力。
- [x] 目录改为八个 Playground 一级条目，不再使用产品类型分组。
- [x] 全部预览采用统一语义区域色、实线边框、8px 圆角和结构占位块。
- [x] 页面聚焦测试、应用构建和 1280px / 390px 真实浏览器视觉验收通过。
