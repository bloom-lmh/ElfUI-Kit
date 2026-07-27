# DefaultsProvider Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Providers/DefaultsProvider`
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

- `deep`
- `defaults`
- `disabled`
- `strategy`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P2 核心属性复核：ElfUI 采用职责分离 Provider；locale 归 LocaleProvider、视觉 token 归 ThemeProvider，组件默认值由 `defaults/deep/strategy/disabled` 统一承载，不复制 Element Plus 单体 ConfigProvider 的组件专有字段。
- [x] P2 事件复核：纯上下文 Provider 不产生值变化事件，动态 defaults 通过响应式属性更新后代。
- [x] P1 插槽/暴露方法复核：Provider 只承载默认插槽，不建立额外焦点或命令式实例 API；`applyDefaults()` 通过注入上下文提供给需要的后代。
- [x] P1 行为复核：覆盖嵌套合并、`reset`、`disabled`、动态子树、卸载恢复和显式 props 优先级；Provider 本身不参与键盘或表单值交互。
- [x] P2 更新页面示例：覆盖嵌套合并、组件覆盖、reset、disabled 与动态子树。
- [x] P2 补齐组件单测、页面冒烟、公开类型和真实浏览器视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、Providers 分类测试与宏类型检查通过。

## 2026-07-22 P0 组合能力验收

- [x] 支持父子 Provider 默认值合并、组件级覆盖与 `reset` 局部恢复。
- [x] Provider 禁用、配置变化和卸载时恢复其写入的属性，不残留旧默认值。
- [x] 通过 MutationObserver 覆盖动态插入子树，并隔离嵌套 Provider 的作用域。
- [x] 组件 5 项及 Provider 页面回归通过，真实浏览器截图为 `defaults-provider-nested-reset.png`。
