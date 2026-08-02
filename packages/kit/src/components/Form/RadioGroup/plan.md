# RadioGroup Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/RadioGroup`
- Element Plus 文档：`radio.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### radio.md

#### Radio API

- `model-value / v-model`
- `value ^`
- `label`
- `disabled`
- `border`
- `size`
- `change`
- `default`

#### Radio Attributes

- `model-value / v-model`
- `value ^`
- `label`
- `disabled`
- `border`
- `size`

#### Radio Events

- `change`

#### Radio Slots

- `default`

#### RadioGroup API

- `model-value / v-model`
- `size`
- `disabled`
- `validate-event`
- `text-color`
- `fill`
- `aria-label ^ ^`
- `id`
- `label ^ ^`
- `options ^`
- `props ^`
- `type ^`
- `change`
- `default`

#### RadioGroup Attributes

- `model-value / v-model`
- `size`
- `disabled`
- `validate-event`
- `text-color`
- `fill`
- `aria-label ^ ^`
- `id`
- `label ^ ^`
- `options ^`
- `props ^`
- `type ^`

#### RadioGroup Events

- `change`

#### RadioGroup Slots

- `default`

#### RadioButton API

- `value ^`
- `label`
- `disabled`
- `default`

#### RadioButton Attributes

- `value ^`
- `label`
- `disabled`

#### RadioButton Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `disabled`
- `fill`
- `modelValue`
- `size`
- `textColor`
- `variant`

### Events

- `change`
- `update:modelValue`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 补齐 label、校验、ARIA、按钮变体、颜色、声明式 `options` 和字段 `props` 映射。
- [x] P0 复核 update/change payload，并保留 string/number/boolean/object 值类型。
- [x] P1 默认插槽与声明式选项可并存，组契约不暴露内部状态。
- [x] P1 对齐箭头键循环、禁用项跳过、受控同步、表单校验和 radiogroup 语义。
- [x] P2 页面案例覆盖 Template / Script、按钮组和自定义字段 options。
- [x] P2 定向测试验证嵌套 Custom Element 注入、字段映射、禁用和键盘路径。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 与 Radio / RadioGroup 定向测试通过。

## 2026-07-13 delivered

- [x] Add `id`, `name`, `aria-label`, `label`, and `validate-event` for the slot-based group API.
- [x] Add FormItem change validation, inherited disabled state, fill/text-color tokens, group semantics, and Arrow-key selection.
- [x] Add API documentation and focused tests for ARIA/name/keyboard behavior.

## Remaining

- [x] Declarative `options` / `props` and the RadioButton appearance are implemented as a stable Group variant.

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# RadioGroup 单选框组组件开发与重构计划

## 1. 目标定位

提供支持管理多个 `Radio` 子组件的单选组合包装容器。支持统一管理子组件的选中状态（互斥性）、大小、禁用状态，以及统一的风格填充，并支持无缝集成到 `Form` 与 `FormItem` 表单校验中。

## 2. 计划与重构任务

- [x] **2.1 上下文共享与跨打包实例互通**: 使用全局共享 `Symbol.for("elfui.provides.radio-group")` 作为注入键值，保证在 monorepo 局部多实例打包中子单选组件能 100% 正确连通并触发 `RadioGroup` 的状态转换。
- [x] **2.2 组级别禁用和尺寸联动**: 自动继承外层 `Form` 或自身的禁用和尺寸设置，通过 `provide` 向下透传给 `Radio` 子组件。
- [x] **2.3 单选互斥选中控制**: 自动实现子组件之间的值对比与互斥选中切换，当用户点击任一子单选组件时，通过 `changeEvent` 统一修改。
- [x] **2.4 校验事件触发**: 选中值变更时，同步触发 `update:modelValue` 与 `change` 事件，供 `FormItem` 收集校验触发。
