# Textarea Element Plus API 对标计划

## 2026-07-19 装饰区回归
- [x] 清空按钮使用 SVG 并为 suffix 预留空间，避免与 Markdown 文案重叠
- [x] 避免 defineExpose 覆盖宿主原生 focus/blur 警告

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Textarea`
- Element Plus 文档：`input.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### input.md

#### API

- `type`
- `model-value / v-model`
- `model-modifiers ^`
- `maxlength`
- `minlength`
- `show-word-limit`
- `word-limit-position ^`
- `placeholder`
- `clearable`
- `clear-icon ^`
- `formatter`
- `parser`
- `show-password`
- `disabled`
- `size`
- `prefix-icon`
- `suffix-icon`
- `rows`
- `autosize`
- `autocomplete`
- `readonly`
- `max`
- `min`
- `step`
- `resize`
- `autofocus`
- `form`
- `aria-label ^ ^`
- `tabindex`
- `validate-event`
- `input-style`
- `label ^ ^`
- `inputmode ^`
- `count-graphemes ^`
- ...另有 23 项，详见来源文档

#### Attributes

- `type`
- `model-value / v-model`
- `model-modifiers ^`
- `maxlength`
- `minlength`
- `show-word-limit`
- `word-limit-position ^`
- `placeholder`
- `clearable`
- `clear-icon ^`
- `formatter`
- `parser`
- `show-password`
- `disabled`
- `size`
- `prefix-icon`
- `suffix-icon`
- `rows`
- `autosize`
- `autocomplete`
- `readonly`
- `max`
- `min`
- `step`
- `resize`
- `autofocus`
- `form`
- `aria-label ^ ^`
- `tabindex`
- `validate-event`
- `input-style`
- `label ^ ^`
- `inputmode ^`
- `count-graphemes ^`

#### Events

- `blur`
- `focus`
- `change`
- `input`
- `clear`
- `keydown`
- `mouseleave`
- `mouseenter`
- `compositionstart`
- `compositionupdate`
- `compositionend`

#### Slots

- `prefix`
- `suffix`
- `prepend`
- `append`
- `password-icon ^`

#### Exposes

- `blur`
- `clear`
- `focus`
- `input`
- `ref`
- `resizeTextarea`
- `select`
- `textarea`
- `textareaStyle`
- `isComposing ^`
- `passwordVisible ^`

## 当前 ElfUI API 快照

### Props

- `autosize`
- `disabled`
- `maxlength`
- `modelValue`
- `placeholder`
- `readonly`
- `resize`
- `rows`
- `showCount`
- `size`

### Events

- `blur`
- `change`
- `focus`
- `input`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 补齐多行输入适用的属性：修饰符、长度、字数、清空、格式化、图标、原生属性和可访问名称；`type/show-password/max/min/step` 保持由单行 Input 承担。
- [x] P0 补齐 `clear`、键盘、鼠标和完整 IME composition 事件。
- [x] P1 补齐组合插槽以及 `focus/blur/clear/select/textarea/resizeTextarea` 等命令式能力；密码专属能力不进入 Textarea 公共契约。
- [x] P1 对齐禁用、只读、清空、受控、lazy、IME、表单校验和无障碍路径。
- [x] P2 页面案例已覆盖 Template / Script、autosize、resize、受控格式化、清空、插槽和外置字数。
- [x] P2 单测覆盖模型、autosize、格式化、清空、命令式方法、原生属性和 IME 时序。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖（15 tests）。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；Textarea 定向测试 15/15 通过。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Textarea 多行输入框组件开发与重构计划

## 1. 目标定位

对标 Element Plus Input type="textarea"，提供多行文本输入组件 `<elf-textarea>`。支持根据内容自适应高度（autosize）、显示字数统计、限制最大长度、支持拖拽调整大小方向（resize）以及完备的表单禁用与校验状态反射。

## 2. 计划与重构任务

- [x] **2.1 状态关联与基础继承**:
  - [x] 引入 `useFormControl` 进行 v-model 双向绑定及与 FormItem 校验管道连结。
  - [x] 引入 `useFormItem` 获取表单校验状态及尺寸大小。
- [x] **2.2 自适应高度 (autosize) 处理**:
  - [x] 在 input 事件触发时，在微任务队列 `queueMicrotask` 中调用 `adjustHeight`，动态依据当前行高 `lineHeight` 调整高度。
  - [x] 支持传入 `boolean` 或 `{ minRows, maxRows }` 选项指定高度阈值。
- [x] **2.3 字数统计 (showCount)**:
  - [x] 支持在文本框右下角浮动展示当前字数统计，如果配置了 `maxlength` 则以 `当前字数/最大字数` 形式展示。
- [x] **2.4 主流浏览器兼容**:
  - [x] 支持通过 `resize` 属性（如 `none`, `both`, `horizontal`, `vertical`）传入 host data-attribute，在 CSS 中控制多行文本框的拖拽缩放行为。

## 2026-07-16 Field Surface

- [x] 接入共享 `filled / outlined`、浮动标签、底部激活线及错误/禁用/暗色状态契约；补齐 API、案例和定向测试。

## 2026-07-22 共享字段主题

- [x] 扩展为六种 Input 同源表面，并使用真实描边缺口及统一背景变量。
- [x] 保持 autosize、字数统计、清空和前后插槽布局。
