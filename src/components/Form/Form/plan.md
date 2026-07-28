# Form Element Plus API 对标计划

## 本轮记录

- [x] 2026-07-16 修复 inline 布局落在错误节点、输入控件宽度不一致和 preventSubmit 类型/运行时不一致；重构居中响应式 Card 案例，并补登录、动态字段、提交校验等独立场景。
- [x] 2026-07-19 修复投影到 Card 内的示例 ref 丢失，重置/清除校验改为稳定宿主查询；行内筛选 Card 允许选择浮层越界显示，并反射 FormItem 校验状态。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Form`
- Element Plus 文档：`form.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### form.md

#### Form API

- `model`
- `rules`
- `inline`
- `label-position`
- `label-width`
- `label-suffix`
- `hide-required-asterisk`
- `require-asterisk-position`
- `show-message`
- `inline-message`
- `status-icon`
- `validate-on-rule-change`
- `size`
- `disabled`
- `scroll-to-error`
- `scroll-into-view-options ^`
- `validate`
- `default`
- `validateField`
- `resetFields`
- `scrollToField`
- `clearValidate`
- `fields ^`
- `getField ^`
- `setInitialValues ^`

#### Form Attributes

- `model`
- `rules`
- `inline`
- `label-position`
- `label-width`
- `label-suffix`
- `hide-required-asterisk`
- `require-asterisk-position`
- `show-message`
- `inline-message`
- `status-icon`
- `validate-on-rule-change`
- `size`
- `disabled`
- `scroll-to-error`
- `scroll-into-view-options ^`

#### Form Events

- `validate`

#### Form Slots

- `default`

#### Form Exposes

- `validate`
- `validateField`
- `resetFields`
- `scrollToField`
- `clearValidate`
- `fields ^`
- `getField ^`
- `setInitialValues ^`

#### FormItem API

- `label`
- `label-position ^`
- `label-width`
- `required`
- `rules`
- `error`
- `show-message`
- `inline-message`
- `size`
- `for`
- `validate-status`
- `trigger`
- `default`
- `validateMessage`
- `validateState`
- `validate`
- `resetField`
- `clearValidate`
- `setInitialValue ^`

#### FormItem Attributes

- `label`
- `label-position ^`
- `label-width`
- `required`
- `rules`
- `error`
- `show-message`
- `inline-message`
- `size`
- `for`
- `validate-status`
- `trigger`

#### FormItem Slots

- `default`
- `label`
- `error`

#### FormItem Exposes

- `size`
- `validateMessage`
- `validateState`
- `validate`
- `resetField`
- `clearValidate`
- `setInitialValue ^`

## 当前 ElfUI API 快照

### Props

- `disabled`
- `hideRequiredAsterisk`
- `inline`
- `labelPosition`
- `labelWidth`
- `model`
- `preventSubmit`
- `rules`
- `scrollToError`
- `size`
- `validateOnRuleChange`

### Events

- `submit`
- `validate`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 补齐核心属性差距：Form 容器属性全部落地；`label`、`required`、`error`、`for`、`validate-status`、`trigger` 明确归属 FormItem。
- [x] P0 对齐 `validate` 为逐字段事件，detail 为 `[prop, isValid, message]`；原生 `submit` 保留事件对象。
- [x] P1 补齐 `validate`、`validateField`、`resetFields`、`scrollToField`、`clearValidate`、`fields`、`getField`、`setInitialValues`，字段级命令由 FormItem 暴露。
- [x] P1 对齐动态注册、规则变化、异步校验、首错滚动、字段级重置、禁用/尺寸继承和错误 ARIA。
- [x] P2 页面命令案例提供完整 Template / Script，并展示滚动定位与重置基线。
- [x] P2 补齐组件集成测试、页面冒烟与公开类型导出，并完成真实浏览器验证。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm typecheck`、目标测试、全量测试与生产构建通过。

## 2026-07-27 命令式契约收尾

- [x] `fields` 返回注册字段快照，`getField` 不泄露内部数组。
- [x] `setInitialValues` 只更新重置基线，不擅自覆盖当前模型。
- [x] `scrollToField` 和 `scroll-to-error` 共用同一定位逻辑与滚动参数。
- [x] 逐字段校验事件覆盖手动、异步和控件触发路径。

## 2026-07-22 校验命令与滚动首错回归

- [x] 案例覆盖同步/异步规则、`validate`、`validateField`、`resetFields` 与 `clearValidate`。
- [x] `scroll-to-error` 严格定位首个失败字段，并由单元测试验证滚动目标。
- [x] Playground Script 提供可复制的规则、表单引用与命令调用，不再只展示静态片段。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Form 表单容器组件开发与重构计划

## 1. 目标定位

对标 Element Plus，提供表单数据包络容器 `<elf-form>`。集成整表数据源 (`model`) 与统一校验规则配置 (`rules`)，建立父子节点连通管理，提供表单校验、重置、清除校验及滚动到错误项等高阶能力。

## 2. 计划与重构任务

- [x] **2.1 表单数据与规则响应式监听**: 将 `model` 和 `rules` 作为表单的全局核心配置，通过上下文 (`FormContext`) 注入到所有子 FormItem 组件中。
- [x] **2.2 动态子表项注册管理**: 动态收集和管理内部挂载的 `<elf-form-item>` 组件，支持动态增删时自动刷新注册表。
- [x] **2.3 统一校验与定位流程**:
  - [x] `validate`: 并行触发所有已注册子表项的 `validate()` 方法，收集所有异步校验结果，向外 emit `validate` 事件。
  - [x] `scrollToError`: 校验失败时，支持自动平滑滚动到第一个出错的 FormItem 位置。
- [x] **2.4 自定义公共接口暴露**: 使用 `defineExpose` 暴露 `validate`、`validateField`、`resetFields` 和 `clearValidate`，供外部宿主直接调用。
## 2026-07-28 布局与禁用态案例回归

- [x] 迁移布局与禁用态案例到 beta15 静态表达式和属性绑定语法。
- [x] 使用显式事件处理器维护表单模型，确保禁用开关可往返恢复并覆盖页面测试。
