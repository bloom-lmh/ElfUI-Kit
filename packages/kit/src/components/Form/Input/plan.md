# Input Element Plus API 对标计划

- [x] 对齐 Material outlined / filled / underlined / solo / solo-filled / solo-inverted 表面与浮动标签。
- [x] 补齐 prefix/suffix 与 prepend/append 内外图标 props/slots，默认清空按钮改为线性 SVG。

## 2026-07-19 输入框改进

- [x] 稳定 outlined 盒模型与浮动标签位置
- [x] 新增 background-color 自定义字段背景
- [x] 将外观切换收敛到首个可操作 Playground，并完成明暗主题与 360px 窄屏验收

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Input`
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

- `clearable`
- `disabled`
- `maxlength`
- `modelValue`
- `placeholder`
- `prefixIcon`
- `readonly`
- `size`
- `suffixIcon`
- `type`

### Events

- `blur`
- `change`
- `clear`
- `focus`
- `input`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] 2026-07-16 增加 Vuetify 信息层级的 `filled` / `outlined` 外观、浮动标签、底部激活线和主题化 field tokens；修复文档命令式焦点调用宿主原生方法冲突。
- [x] 2026-07-06 第一批深度对齐：补 `model-modifiers`、`formatter/parser`、`show-word-limit/word-limit-position/count-graphemes`、`clear-icon`、原生输入属性透传、hover/keydown/composition 事件、`prefix/suffix/prepend/append/password-icon` slots、`focus/blur/select/clear/input/ref/isComposing/passwordVisible` 暴露，并迁移组件模板为 `${...}`。
- [x] P0 补齐单行输入属性；`rows`、`autosize`、`resize` 明确由独立 `elf-textarea` 承担，避免在两个组件中维护同一套多行输入状态。
- [x] P0 补齐事件：`keydown`、`mouseleave`、`mouseenter`、`compositionstart`、`compositionupdate`、`compositionend`。
- [x] P1 补齐插槽和暴露方法，包括真实可用的 `focus` / `blur` 宿主代理。
- [x] P1 对齐键盘、禁用、只读、清空、受控、IME、表单校验和无障碍路径。
- [x] P2 页面案例已覆盖 Template / Script、格式化、插槽、原生属性和命令式焦点控制。
- [x] P2 定向单测覆盖模型、格式化、IME、焦点、禁用、清空、插槽和原生属性。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖（17 tests）。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；Input 定向测试 17/17 通过。

## 后续待细化

- [x] 2026-07-22 按 Vuetify `VField` 状态模型重写 Input：六种 variant、真实 outlined notch、0.75 浮动标签、150ms Material 缓动、内图标斜向轨迹、三档 density、暗色主题与浏览器截图全部验收；全量 1008 项测试通过。

- [x] 2026-07-22 outlined 浮动标签下移至描边开口的垂直中心，并完成聚焦截图回归。

- [x] 2026-07-21 beta6 视觉回归：去重相同 `label/placeholder`，内前置图标避让静止标签，outlined 聚焦使用 `fieldset/legend` 真实开口；明暗主题截图与 43 项相关测试通过。

- `rows`、`autosize`、`resize`、`textarea/textareaStyle/resizeTextarea` 与现有独立 `Textarea` 组件存在职责重叠，后续需要决定是让 `elf-input type="textarea"` 代理到 Textarea，还是在文档中明确拆分边界。
- `validate-event` 当前按 setup 初始值接入表单触发开关，后续若需要运行时动态切换需升级 `useFormControl` 触发器读取方式。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Input 单行输入框组件开发与重构计划

## 1. 目标定位

对标 Element Plus Input，提供通用单行文本/密码输入框 `<elf-input>`。高度适配全局/表单项的禁用与尺寸传递，原生表单事件的高效劫持与转发，内置密码可见性切换、一键清除、格式化等丰富的高阶能力。

## 2. 计划与重构任务

- [x] **2.1 表单联动组合器继承**:
  - [x] `useFormControl`: 组合双向数据绑定与 FormItem 触发校验逻辑。
  - [x] `useFormItem`: 连接并从 Form/FormItem 读取大小与校验状态。
  - [x] `useDisabled`: 支持级联式禁用判定。
- [x] **2.2 视觉与状态同步**:
  - [x] 使用 `useHostAttr` 反射 `data-state` 校验状态，以便根据外层 FormItem 的成功/失败/验证中状态自适应变换边框或高亮底色。
  - [x] 使用 `useTemplateRef` 建立对 `<input>` DOM 的引用。
- [x] **2.3 辅助器功能集成**:
  - [x] `showClear`: 一键清除功能，当非禁用且存在字符时显示 `×` 清空键，并触发 `@clear` 事件。
  - [x] `showPassword`: 支持密码模式，通过内置 `pwdVisible` 逻辑实现密文 `👁` 和明文 `🙈` 转换。
- [x] **2.4 自定义 Part CSS Scoping**: 采用 shadow root `part="wrapper"` 等定义，允许用户在全局或组件外部进行微调样式。

## 2026-07-22 动态插槽回归

- [x] 监听宿主 slot 子节点变化，确保条件渲染的内部前置图标即时显示。
- [x] 将原生插入光标与内部前置图标的间距增加到 16px，并通过浏览器截图复核。
- [x] 增加前置图标与输入光标间距，并补充动态插槽单测和真实浏览器截图。
- [x] 带浮动标签时将内部图标与编辑行统一到同一视觉中心；真实浏览器测得中心误差为 0px，输入文字使用 16px/24px 可读行高。

## 2026-07-28 描边字段垂直节奏

- [x] 修正带浮动标签的 outlined 输入文字基线，使文字与其它字段变体保持一致。
- [x] 保留 filled/underlined 的共享字段契约，避免通过案例级偏移掩盖组件布局。
