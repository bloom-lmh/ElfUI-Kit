# ThemeProvider Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Providers/ThemeProvider`
- Element Plus 文档：`config-provider.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### config-provider.md

#### API

- `locale`
- `size`
- `zIndex`
- `namespace`
- `button`
- `link`
- `dialog ^`
- `message`
- `experimental-features`
- `empty-values ^`
- `value-on-clear ^`
- `table ^`
- `type ^`
- `autoInsertSpace`
- `plain ^`
- `text ^`
- `round ^`
- `dashed ^`
- `underline ^`
- `shadow ^`
- `align-center ^`
- `draggable ^`
- `overflow ^`
- `transition ^`
- `max`
- `grouping ^`
- `duration ^`
- `showClose ^`
- `offset ^`
- `placement ^`
- `show-overflow-tooltip`
- `tooltip-effect`
- `tooltip-options`
- `tooltip-formatter`
- ...另有 1 项，详见来源文档

#### Config Provider Attributes

- `locale`
- `size`
- `zIndex`
- `namespace`
- `button`
- `link`
- `dialog ^`
- `message`
- `experimental-features`
- `empty-values ^`
- `value-on-clear ^`
- `table ^`

#### Config Provider Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `background`
- `danger`
- `info`
- `primary`
- `secondary`
- `success`
- `surface`
- `textColor`
- `theme`
- `tokens`
- `warning`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P2 核心属性复核：ThemeProvider 聚焦 theme/dark/inherit/tokens 与语义色；语言归 LocaleProvider，组件缺省值归 DefaultsProvider，服务层通过 `applyTo()` 继承主题而非复制组件专有配置。
- [x] P2 事件复核：纯上下文 Provider 不产生交互事件，主题和 token 更新直接响应式传播。
- [x] P1 插槽/暴露方法复核：Provider 只承载默认插槽；`theme`、`tokens`、`isDark` 与 `applyTo()` 由注入上下文提供给组件及服务浮层。
- [x] P1 行为复核：覆盖嵌套继承、`inherit=false` 隔离、动态 token、暗色语义和文档层服务浮层；Provider 本身不建立焦点或表单值状态。
- [x] P2 更新页面示例：覆盖皮肤切换、局部暗色、嵌套继承/隔离、自定义 token 与服务浮层。
- [x] P2 补齐组件单测、页面冒烟、公开类型和真实浏览器视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、Providers 分类测试与宏类型检查通过。

## 2026-07-17 Provider 皮肤增强

- [x] 补齐输入表面 `fieldBg`、`fieldHoverBg` 语义 token。
- [x] 提供 Material、Midnight、Forest、Sunset 四套皮肤案例。
- [x] 文档应用 Header 使用 ThemeProvider 动态切换皮肤。

## 2026-07-22 P0 组合能力验收

- [x] 支持嵌套主题继承与局部 token 覆盖，`inherit=false` 可隔离父级 token。
- [x] 上下文提供 `applyTo(target)`，供 Message 等挂载到文档层的服务浮层继承主题。
- [x] 补齐嵌套暗色、服务浮层与自定义 token 案例，并完成组件、Message 和页面回归。
- [x] 真实浏览器截图为 `theme-provider-nested-overlay.png`；主题持久化明确由应用层负责。

## 2026-07-28 全局配置收尾

- [x] 支持命名主题、`system` 主题和 `ThemeDefinition.dark` 语义。
- [x] 扩展颜色之外的字体、圆角、间距、阴影、动效和浮层层级 token。
- [x] `applyTo()` 在转发前清理旧 token，避免服务浮层遗留旧主题变量。
- [x] 主题切换通过 `matchMedia` 监听系统深色偏好，并在卸载时清理监听器。
