# Switch Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Switch`
- Element Plus 文档：`switch.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### switch.md

#### API

- `model-value / v-model`
- `disabled`
- `loading`
- `size`
- `width`
- `inline-prompt`
- `active-icon`
- `inactive-icon`
- `active-action-icon ^`
- `inactive-action-icon ^`
- `active-text`
- `inactive-text`
- `active-value`
- `inactive-value`
- `validate-event`
- `before-change`
- `id`
- `tabindex`
- `aria-label ^ ^`
- `active-color ^`
- `inactive-color ^`
- `border-color ^`
- `label ^ ^`
- `change`
- `active-action ^`
- `inactive-action ^`
- `active ^`
- `inactive ^`
- `focus`

#### Attributes

- `model-value / v-model`
- `disabled`
- `loading`
- `size`
- `width`
- `inline-prompt`
- `active-icon`
- `inactive-icon`
- `active-action-icon ^`
- `inactive-action-icon ^`
- `active-text`
- `inactive-text`
- `active-value`
- `inactive-value`
- `validate-event`
- `before-change`
- `id`
- `tabindex`
- `aria-label ^ ^`
- `active-color ^`
- `inactive-color ^`
- `border-color ^`
- `label ^ ^`

#### Events

- `change`

#### Switch Slots

- `active-action ^`
- `inactive-action ^`
- `active ^`
- `inactive ^`

#### Exposes

- `focus`

## 当前 ElfUI API 快照

### Props

- `activeColor`
- `activeText`
- `beforeChange`
- `color`
- `disabled`
- `flat`
- `inactiveColor`
- `inactiveText`
- `inset`
- `label`
- `labelPosition`
- `loading`
- `modelValue`
- `size`

### Events

- `update:modelValue`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] 2026-07-16 增加 default / inset / material / square 变体；action icon 移入 thumb 避免遮挡；补 loading/reduced-motion 与宿主 focus 代理回归。
- [x] P0 补齐宽度、内嵌提示、普通/动作图标、自定义值、校验、原生标识和颜色属性。
- [x] P0 补齐 `change` 事件并保持 payload 为切换后的真实值。
- [x] P1 补齐 active/inactive 与 action 插槽，并提供可用的 `focus()` 代理。
- [x] P1 对齐键盘、加载/禁用阻断、异步守卫、受控值、表单校验和 ARIA switch 语义。
- [x] P2 页面案例已覆盖 Template / Script、自定义值、内嵌提示、状态图标、尺寸和外观。
- [x] P2 定向单测覆盖键盘、焦点、自定义值、守卫、加载、禁用、ARIA 和图标。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖（18 tests）。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；Switch 定向测试 18/18 通过。

## 2026-07-13 delivered

- [x] Add `active-value`, `inactive-value`, `width`, `inline-prompt`, icon/action slots, `validate-event`, `id`, `tabindex`, `aria-label`, and `border-color`.
- [x] Route changes through FormItem validation, retain async `before-change`, and cover non-boolean values, ARIA, prompt, width, and keyboard focus in focused tests.
- [x] Add custom-value/inline-prompt playground and API documentation.

## Remaining

- [x] Icon component inputs and Custom Element `focus()` proxy are implemented and covered by focused tests.

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Switch 开关组件开发与重构计划

## 1. 目标定位

对标 Element Plus Switch，提供平滑美观、符合 Material Design 的状态切换开关组件 `<elf-switch>`。全面支持在加载状态和禁用状态下的阻断、自定义前/后置提示文本，支持异步切换控制守护，并支持键盘焦点的无障碍访问。

## 2. 计划与重构任务

- [x] **2.1 表单状态接入与无障碍同步**:
  - [x] 结合 `useFormControl`、`useFormItem` 与 `useDisabled` 组成级联状态判定。
  - [x] 提供无障碍角色 `role="switch"` 并同步输出最新的 `aria-checked` 等状态。
- [x] **2.2 响应式标志属性反射**:
  - [x] 绑定 `data-checked`、`data-loading` 等标记到宿主 Host 上，由 CSS 渲染平滑的 FLIP 过渡动效。
- [x] **2.3 状态切换前置守护 (beforeChange)**:
  - [x] 支持传入 `beforeChange` 属性，支持同步或异步（Promise）形式，若返回 `false` 则直接中断本次状态切换。
- [x] **2.4 键盘焦点支持**:
  - [x] 宿主轨道上支持通过 Tab 键聚焦，并监听 `Space` 与 `Enter` 按键动作，触发无障碍状态切换。
