# LocaleProvider Element Plus API 对标计划

## 2026-07-29 外部 i18n Adapter

- [x] 建立与框架无关的 `LocaleAdapter`，覆盖翻译、数字格式化与日期格式化。
- [x] LocaleProvider 与 ConfigProvider 复用唯一 Locale Context 工厂，不复制 Provider 行为。
- [x] 嵌套 ConfigProvider 将 adapter 作为原子策略替换，缺失翻译继续使用内置英文或中文文案。
- [x] 新增 ConfigProvider 法语目录案例、公开类型、Custom Element 类型与 Provider 回归测试。

## 2026-07-19 文档精简

- [x] 曾移除重复的组件级英文案例；2026-07-22 已按完整覆盖矩阵重新设计并恢复

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Providers/LocaleProvider`
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

- `dir`
- `messages`
- `name`
- `rtl`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P2 核心属性复核：LocaleProvider 聚焦 locale/messages/number/date/timeZone/rtl；size 与组件默认值归 DefaultsProvider，视觉和层级 token 归 ThemeProvider，避免单体 ConfigProvider 职责膨胀。
- [x] P2 事件复核：纯上下文 Provider 不产生交互事件，运行时 locale/messages 变化直接响应式更新后代。
- [x] P1 插槽/暴露方法复核：Provider 只承载默认插槽；翻译、数字和日期格式化统一通过注入上下文提供，不重复暴露 DOM 方法。
- [x] P1 行为复核：覆盖嵌套 locale、运行时切换、RTL、消息深合并、时区以及 `lang` / `dir` 语义；Provider 本身不建立焦点或表单值状态。
- [x] P2 更新页面示例：覆盖组件英文矩阵、嵌套语言、RTL、数字/日期格式化和运行时切换。
- [x] P2 补齐组件单测、页面冒烟、公开类型和真实浏览器视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、Providers 分类测试与宏类型检查通过。

## 2026-07-17 国际化增强

- [x] 内置 `zh-CN` 与 `en-US` 基础文案，并允许 messages 深度覆盖。
- [x] 文档应用 Header 使用 LocaleProvider 切换中英文与菜单文案。
- [x] 保留 RTL 方向能力与独立案例。

## 2026-07-22 P0 组合能力验收

- [x] 恢复并扩展组件级英文覆盖案例，验证表单、选择器、反馈和分页文案。
- [x] 支持局部嵌套 locale 与运行时切换，子 Provider 不污染父级上下文。
- [x] 上下文提供 `formatNumber` / `formatDate`，并支持 `timeZone`。
- [x] 组件 6 项及 Provider 页面回归通过，真实浏览器截图为 `locale-provider-nested-format.png`。
