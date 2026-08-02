# FormItem Element Plus API 对标计划

## 本轮记录

- [x] 2026-07-16 为输入型表单控件建立统一的满宽布局契约，保证 Card、双列与动态字段场景对齐。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/FormItem`
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

- `error`
- `inlineMessage`
- `label`
- `prop`
- `required`
- `rules`
- `showMessage`
- `size`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 补齐 Item 自有属性：`label-position`、`label-width`、`for`、`validate-status`、`trigger`；模型、布局、全局禁用与滚动属性继续由 Form 上下文统一管理。
- [x] P0 补齐逐字段 `validate` 事件，并同步通知所属 Form。
- [x] P1 补齐 `label` / `error` 插槽及 `validateMessage`、`validateState`、`validate`、`resetField`、`clearValidate`、`setInitialValue` 暴露方法；`size` 保持 Custom Element 原生 prop，避免 expose 覆盖警告。
- [x] P1 对齐异步竞态、触发时机、尺寸/禁用继承、左右星号、状态图标与错误 `aria-live`。
- [x] P2 页面命令案例和 API 表覆盖字段级状态、滚动及重置基线。
- [x] P2 补齐集成测试、页面冒烟与类型导出，并完成真实浏览器验证。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm typecheck`、目标测试、全量测试与生产构建通过。

## 2026-07-27 字段契约收尾

- [x] 初始值按值快照保存，允许将 `undefined` 作为合法重置目标。
- [x] 新校验会使旧异步结果失效，避免错误消息回写覆盖新状态。
- [x] 标签位置、标签宽度、星号位置和 inline 状态随父级运行时配置同步。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# FormItem 表单项组件开发与重构计划

## 1. 目标定位

对标 Element Plus，提供表单项目包装容器 `<elf-form-item>`。负责提供标签 Label、必填星号展示、包裹底层具体控件、收集并应用字段级校验规则、并在校验失败或成功时展示校验状态与提示信息。

## 2. 计划与重构任务

- [x] **2.1 状态注入与收集**:
  - [x] 向上通过 `inject(FORM_KEY)` 连接 `<elf-form>` 容器，并在挂载时执行 `form.registerItem` 登记自身实例。
  - [x] 向下通过 `provide(FORM_ITEM_KEY)` 向内部的具体输入型控件（如 `Input`, `Select`, `Checkbox` 等）提供字段上下文，用于触发联动校验。
- [x] **2.2 嵌套字段支持**: 支持使用路径字符串（如 `prop="user.name"`）访问和操作 `form.model` 中深层嵌套的数据结构。
- [x] **2.3 多触发时机校验 (Trigger)**: 支持配置 `blur`, `change`, `input` 等触发类型，根据用户交互动态调度异步校验器。
- [x] **2.4 自定义重置 (Reset) 机制**: 在 `onMounted` 时期缓存字段的初始值 `initialValue`，当触发 `resetField` 时精确还原数据并清理校验状态。
