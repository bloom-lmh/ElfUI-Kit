# Radio Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Radio`
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

- `border`
- `disabled`
- `label`
- `modelValue`
- `size`
- `value`

### Events

- `change`
- `update:modelValue`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 补齐 Radio 本体的值、校验、标识和无障碍属性；`fill/text-color/options/props/type` 由 RadioGroup 统一管理。
- [x] P0 复核 `update:modelValue` / `change` payload 与重复选中触发时机。
- [x] P1 默认插槽与组上下文契约已同步，无多余命令式暴露。
- [x] P1 对齐箭头键导航、禁用、受控值、表单校验和 radio ARIA 语义。
- [x] P2 页面案例使用 Template / Script 与 `${...}`，覆盖基础、按钮、禁用和声明式选项。
- [x] P2 Radio / RadioGroup 定向测试覆盖事件、禁用、键盘、ARIA 和对象映射。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 与 Radio / RadioGroup 定向测试通过。

## 2026-07-13 delivered

- [x] Add `id`, `name`, `aria-label`, and roving `tabindex` to the existing slot-based Radio API.
- [x] Add Arrow-key navigation events for RadioGroup and focused component tests.
- [x] Update API reference and keyboard guidance.

## Remaining

- [x] Declarative `options` / `props` and button-style radios are provided by RadioGroup with typed value preservation.

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Radio 单选组件开发与重构计划

## 1. 目标定位

提供高内聚、易伸缩的单选框组件。支持单个使用、RadioGroup 组配合使用、禁用态、带边框样式等多种灵活表单场景。

## 2. 计划与重构任务

- [x] **2.1 底座依赖注入打通**: 升级底层 `Symbol.for` 框架机制，使 `Radio` 与 `RadioGroup` 在复杂 monorepo 和多模块加载中能够 100% 互联，解决案例点击全部失效的宿疾。
- [x] **2.2 表单集成与禁用控制**: 统一支持 `useDisabled` 高级 Composable 状态控制。
- [x] **2.3 双保险事件绝对封锁**:
  - [x] 在 `select(e)` 事件处理器最前端进行 `e.stopPropagation()` 与 `e.preventDefault()` 截断。
  - [x] 逻辑层通过 `useEventListener(useHost(), 'click')` 对宿主级点击做安全保护。
  - [x] 模板内对子元素 `.dot` 和 `.label` 明确赋予 `@click.stop.prevent="select"` 绑定，杜绝冒泡到 SPA 路由系统。
- [x] **2.4 自定义展示页与测试**: 确保 `page-radio` 的案例展现流畅、高质。
