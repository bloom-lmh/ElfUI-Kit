# Rate Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Rate`
- Element Plus 文档：`rate.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### rate.md

#### API

- `model-value / v-model`
- `max`
- `size`
- `disabled`
- `allow-half`
- `low-threshold`
- `high-threshold`
- `colors`
- `void-color`
- `disabled-void-color`
- `icons`
- `void-icon`
- `disabled-void-icon`
- `show-text`
- `show-score`
- `text-color`
- `texts`
- `score-template`
- `clearable ^`
- `id`
- `aria-label ^ ^`
- `label ^ ^`
- `change`
- `setCurrentValue`
- `resetCurrentValue`

#### Attributes

- `model-value / v-model`
- `max`
- `size`
- `disabled`
- `allow-half`
- `low-threshold`
- `high-threshold`
- `colors`
- `void-color`
- `disabled-void-color`
- `icons`
- `void-icon`
- `disabled-void-icon`
- `show-text`
- `show-score`
- `text-color`
- `texts`
- `score-template`
- `clearable ^`
- `id`
- `aria-label ^ ^`
- `label ^ ^`

#### Events

- `change`

#### Exposes

- `setCurrentValue`
- `resetCurrentValue`

## 2026-07-13 delivered

- [x] Add thresholds, color/icon arrays, void/disabled icons, `id`, `aria-label`, `label`, and `validate-event`.
- [x] Route score changes through FormItem validation; expose `setCurrentValue` and `resetCurrentValue`.
- [x] Add threshold-color/icon rendering tests and a playground example.

## 当前 ElfUI API 快照

### Props

- `allowHalf`
- `character`
- `clearable`
- `color`
- `disabled`
- `disabledColor`
- `max`
- `modelValue`
- `readonly`
- `scoreTemplate`
- `showScore`
- `showText`
- `size`
- `texts`
- `voidCharacter`
- `voidColor`

### Events

- `change`
- `clear`
- `hover-change`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 补齐阈值、颜色、图标、禁用空态、文本颜色和无障碍标识属性。
- [x] P0 复核 update/change/hover-change/clear payload 与清空时机。
- [x] P1 补齐有边界约束的 `setCurrentValue` 与可恢复的 `resetCurrentValue`。
- [x] P1 对齐箭头/Home/End 键、禁用/只读、清空、受控值、表单校验和 slider ARIA。
- [x] P2 页面案例覆盖 Template / Script、半星、分段颜色图标、只读和受控状态。
- [x] P2 定向单测覆盖阈值、hover、键盘、禁用、清空和命令式方法。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖（8 tests）。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 与 Rate 定向测试通过。
