# ColorPicker Element Plus API 对标计划

## 2026-07-19 案例回归
- [x] 解除标题状态槽裁切，完整显示 rgba 右括号

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Picker/ColorPicker`
- Element Plus 文档：`color-picker.md`、`color-picker-panel.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### color-picker.md

#### API

- `model-value / v-model`
- `disabled`
- `clearable ^`
- `size`
- `show-alpha`
- `color-format`
- `popper-class`
- `popper-style ^`
- `predefine`
- `validate-event`
- `tabindex`
- `aria-label ^ ^`
- `empty-values ^`
- `value-on-clear ^`
- `id`
- `teleported ^`
- `label ^ ^`
- `persistent ^`
- `append-to ^`
- `change`
- `active-change`
- `focus ^`
- `blur ^`
- `clear ^`
- `color`
- `show ^`
- `hide ^`

#### Attributes

- `model-value / v-model`
- `disabled`
- `clearable ^`
- `size`
- `show-alpha`
- `color-format`
- `popper-class`
- `popper-style ^`
- `predefine`
- `validate-event`
- `tabindex`
- `aria-label ^ ^`
- `empty-values ^`
- `value-on-clear ^`
- `id`
- `teleported ^`
- `label ^ ^`
- `persistent ^`
- `append-to ^`

#### Events

- `change`
- `active-change`
- `focus ^`
- `blur ^`
- `clear ^`

#### Exposes

- `color`
- `show ^`
- `hide ^`
- `focus ^`
- `blur ^`

### color-picker-panel.md

#### API

- `model-value / v-model`
- `border`
- `disabled`
- `show-alpha`
- `color-format`
- `predefine`
- `validate-event ^`
- `hue-slider-class ^`
- `hue-slider-style ^`
- `footer`
- `color`
- `inputRef`
- `update ^`

#### Attributes

- `model-value / v-model`
- `border`
- `disabled`
- `show-alpha`
- `color-format`
- `predefine`
- `validate-event ^`
- `hue-slider-class ^`
- `hue-slider-style ^`

#### Slots

- `footer`

#### Exposes

- `color`
- `inputRef`
- `update ^`

## 当前 ElfUI API 快照

### Props

- `clearable`
- `disabled`
- `format`
- `modelValue`
- `presets`
- `showAlpha`

### Events

- `change`
- `clear`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P0 高级属性：`append-to` 使用独立 portal Shadow Root 保留样式和事件；`hue-slider-class/style` 定制原生色板入口。
- [x] P0 补齐 `active-change`、`focus`、`blur` 事件。
- [x] P1 补齐 `footer`、`color` 插槽与 `show`、`hide`、`focusInput`、`blurInput`、`inputRef`、`update` 暴露方法。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控同步、表单联动和无障碍属性。
- [x] P2 更新页面示例：Template / Script 双视图，覆盖格式别名、预设色、透明度、键盘和表单边界。
- [x] P2 补齐组件单测、页面冒烟和类型导出，并完成视觉回归截图。

## 2026-07-27 Picker 契约收尾

- [x] 增加 `color-format` / `predefine` 兼容别名、可持久浮层、无边框模式和浮层 class/style。
- [x] `teleported=false` 不调用原生 Popover；`persistent` 明确控制外部点击关闭策略。
- [x] 尺寸继承 Form，上层可通过 `color` 插槽替换色块，并可读取 `inputRef`。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm typecheck`、全量测试与生产构建通过。

## 2026-07-16 Field Surface 与预设色修复

- [x] 接入共享 `filled / outlined`、浮动标签及禁用/暗色状态，修复预设色 style 绑定与事件代理并补定向测试。

## 2026-07-19 RGBA 状态回归

- [x] 扩大颜色值展示宽度并使用等宽数字，确保完整 `rgba(...)` 文本不裁掉右括号。
- [x] 清空操作使用语义化 SVG 图标和可访问名称，不再使用普通字符叉号。

## 2026-07-22 案例布局回归

- [x] 基础与透明度案例在 Playground 预览区水平居中；真实浏览器测得组件、案例容器与 Playground 中心误差均为 0px。

## 2026-07-22 P0 关键边界

- [x] 将色板、透明度和预设色收敛进原生 Popover Top Layer 面板，支持碰撞定位、外部关闭和键盘恢复。
- [x] 接入表单控制、父级禁用、尺寸、表单/无障碍属性、`valueOnClear` 与校验触发开关。
- [x] 新增 `active-change`、focus/blur、visible-change 和 `show` / `hide` / `focusInput` / `blurInput` / `update`。
- [x] 补齐键盘、清空与表单案例；组件 11 项 + 页面 1 项通过，Vite 793 模块构建和真实浏览器截图通过。

## 2026-07-28 统一浮层协议

- [x] 接入进程级 Overlay Stack 与 `useDismissibleOverlay`，兼容 Top Layer、append-to portal 与 persistent 策略。
- [x] 色板内外部交互通过 composed path 判定；Escape 只关闭最上层色板并恢复输入焦点。
