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

## 2026-07-31 主题调色板首版

- [x] 将五套预设收敛到单一 TypeScript 注册中心，保留旧皮肤 ID；当前内置方案统一为 Material Blue、Indigo、Teal、Deep Purple、Deep Orange。
- [x] 默认 Light/Dark ThemeProvider Token、应用皮肤和调色板预览消费同一预设事实源；全局 SCSS 首帧变量同步更新。
- [x] 新增独立主题工作台，覆盖基础/高级 Token 编辑、实时真实组件预览、WCAG 对比度、草稿、JSON 导入以及 TypeScript/JSON/CSS 导出。
- [x] 桌面与移动端均采用充实可用内容区的响应式布局，移动端通过 Editor/Preview Tabs 切换。

## 2026-07-31 Material 色板库扩展

- [x] 参考 Vuetify 官方 Material color palette，引入 19 个颜色家族和 lighten/base/darken/accent 稳定色阶；公共数据位于 `material-colors.ts`，不在页面内复制色值。
- [x] 保留五套完整主题方案，将 Material 色板定位为 Token 取色库；支持搜索颜色家族，并把任意色阶应用到 Primary、Secondary、Success、Warning、Danger 或 Info。
- [x] Primary 继续复用派生模型同步 hover、active 与 soft surface；其他语义色只覆盖目标 Token，不机械重算中性色与表面色。
- [x] 聚焦回归 5 个文件、14 项通过；应用构建通过 1106 个模块。桌面/移动端无页面横向溢出，Chrome 真实完成 Deep orange 700 写入 Danger，控制台 0 warning / 0 error。

## 2026-07-31 Material 内置预设收敛

- [x] 五套预设直接消费 `material-colors.ts`，分别采用 Blue 700、Indigo 300、Teal 700、Deep Purple 500、Deep Orange 700；hover/active 与语义色继续取 Material 家族色阶，不复制色值。
- [x] 保留 `material`、`midnight`、`forest`、`violet`、`sunset` ID，避免已持久化的站点偏好失效；显示名统一标记为 Material 系列。
- [x] 默认 Light/Dark Provider token 与 `_tokens.scss` 首屏变量同步，并新增回归锁定预设来源、旧 ID 与首屏变量一致性。
- [x] 聚焦回归 5 个文件、18 项通过；目标 Prettier、ESLint、CSpell、能力所有权测试和本地化审计 `540/540` 通过，应用构建通过 1107 个模块。
- [x] Chromium 覆盖 `/theme-studio` 的 1440x1000 与 390x844 中文：5 套预设和 19 个色系完整呈现，页面/工作台横向溢出均为 0，控制台 0 warning / 0 error。
