# TimePicker Element Plus API 对标计划

## 2026-07-21 分钟激活态

- [x] 分钟点击后同步更新钟面 active 与 `aria-pressed`，声明式刷新后再次校准。

## 2026-07-19 interaction and field fixes

- [x] Keep the floating label above an empty placeholder so the clock icon, label, and placeholder never overlap.
- [x] Give hour and minute dial nodes unit-specific keys to prevent stale labels, positions, and active states after switching units.
- [x] Cover dial switching, active state, range clearing, shortcuts, and shared field surfaces with focused tests.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Picker/TimePicker`
- Element Plus 文档：`time-picker.md`、`time-select.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### time-picker.md

#### API

- `model-value / v-model`
- `readonly`
- `disabled`
- `editable`
- `clearable`
- `size`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `is-range`
- `arrow-control`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `format`
- `default-value`
- `value-format`
- `id`
- `aria-label ^ ^`
- `prefix-icon`
- `clear-icon`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `teleported`
- `tabindex`
- `empty-values ^`
- `value-on-clear ^`
- `save-on-blur ^`
- `label ^ ^`
- `change`
- ...另有 6 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `readonly`
- `disabled`
- `editable`
- `clearable`
- `size`
- `placeholder`
- `start-placeholder`
- `end-placeholder`
- `is-range`
- `arrow-control`
- `popper-class`
- `popper-style`
- `popper-options`
- `fallback-placements ^`
- `placement ^`
- `range-separator`
- `format`
- `default-value`
- `value-format`
- `id`
- `aria-label ^ ^`
- `prefix-icon`
- `clear-icon`
- `disabled-hours`
- `disabled-minutes`
- `disabled-seconds`
- `teleported`
- `tabindex`
- `empty-values ^`
- `value-on-clear ^`
- `save-on-blur ^`
- `label ^ ^`

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`
- `visible-change`

#### Exposes

- `focus`
- `blur`
- `handleOpen ^`
- `handleClose ^`

### time-select.md

#### API

- `model-value / v-model`
- `disabled`
- `editable`
- `clearable`
- `include-end-time ^`
- `size`
- `placeholder`
- `name ^`
- `effect`
- `prefix-icon`
- `clear-icon`
- `start`
- `end`
- `step`
- `min-time`
- `max-time`
- `format`
- `empty-values ^`
- `value-on-clear ^`
- `popper-class ^`
- `popper-style ^`
- `change`
- `blur`
- `focus`
- `clear ^`

#### Attributes

- `model-value / v-model`
- `disabled`
- `editable`
- `clearable`
- `include-end-time ^`
- `size`
- `placeholder`
- `name ^`
- `effect`
- `prefix-icon`
- `clear-icon`
- `start`
- `end`
- `step`
- `min-time`
- `max-time`
- `format`
- `empty-values ^`
- `value-on-clear ^`
- `popper-class ^`
- `popper-style ^`

#### Events

- `change`
- `blur`
- `focus`
- `clear ^`

#### Exposes

- `focus`
- `blur`

## 当前 ElfUI API 快照

### Props

- `clearable`
- `disabled`
- `editable`
- `endPlaceholder`
- `endValue`
- `emptyValues`
- `id`
- `isRange`
- `max`
- `min`
- `modelValue`
- `name`
- `placeholder`
- `range`
- `rangeSeparator`
- `readonly`
- `saveOnBlur`
- `size`
- `shortcuts`
- `startPlaceholder`
- `step`
- `tabindex`
- `valueOnClear`

### Events

- `blur`
- `change`
- `clear`
- `focus`
- `update:endValue`
- `update:modelValue`
- `visible-change`

### Slots

- 暂无记录

### Exposes

- `blur`
- `focus`
- `handleClose`
- `handleOpen`

## 本轮已完成（2026-07-05）

- [x] 修复原生 `type=time` 的回显绑定，`modelValue="09:30"` 直接写入 input。
- [x] 支持 Element Plus `is-range` 和数组 `modelValue`，同时保留旧 `endValue`。
- [x] 补 `readonly`、`editable`、`size`、`start-placeholder`、`range-separator`、`id/name/tabindex`、`value-on-clear` 基础逻辑。
- [x] 补 `focus`、`blur`、`visible-change` 事件和 `handleOpen`、`handleClose` 暴露方法。
- [x] shortcut 点击从旧字符串事件迁移为 `${...}` 事件代理。

## 差距与任务

- [x] P0 高级属性：完成 `popper-options`、`fallback-placements` 与 `default-value`；格式、禁用时分秒、Top Layer、位置、图标、空值、标签和无障碍属性已完成。
- [x] P0 补齐事件差距：`blur`、`focus`、`visible-change`
- [x] P1 补齐插槽/暴露方法：`focus`、`blur`、`handleOpen ^`、`handleClose ^`
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控同步、表单联动和无障碍属性。
- [x] P2 更新页面示例：Template / Script 双视图，覆盖格式、秒级步进、禁用项与浮层位置。
- [x] P2 补齐组件单测、页面冒烟和类型导出，并完成视觉回归截图。

## 2026-07-27 Picker 契约收尾

- [x] 接入 Form 禁用、尺寸和校验触发链，`save-on-blur` 控制失焦校验。
- [x] 新增 `teleported`、`placement`、`popper-class/style`、自定义前后图标与 `aria-label`。
- [x] 非 Top Layer 模式保留锚点内布局，外部滚动与点击关闭语义保持一致。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm typecheck`、全量测试与生产构建通过。

## 2026-07-14 交互升级

- [x] 用“数字表头 + 12 位钟面 + 小时/分钟分步选择 + AM/PM”替代机械原生输入，保留范围、快捷项、键盘微调和清空。
- [x] 完成深浅主题视觉验收；相关测试与 `pnpm build` 通过。

## 2026-07-16 Field Surface 与关闭语义

- [x] 接入共享 `filled / outlined` 和浮动标签；点击外部或外部滚动关闭面板，钟面内部交互不误关闭。

## 2026-07-22 P0 关键边界

- [x] 新增 `format` / `valueFormat`，以秒级规范值统一解析、展示与输出。
- [x] 新增 `disabledHours` / `disabledMinutes` / `disabledSeconds`，支持范围端点上下文。
- [x] `step` 接入键盘增减、分钟刻度和秒刻度；格式含秒或步进小于一分钟时显示秒钟面。
- [x] 补齐键盘打开/关闭、跨日范围和 `focusInput` / `blurInput` 公开方法。
- [x] 新增两个高质量 Playground、组件 20 项测试、页面冒烟与真实浏览器截图；Vite 791 模块构建通过。

## 2026-07-28 统一浮层协议

- [x] 接入进程级 Overlay Stack 与 `useDismissibleOverlay`，外部 pointerdown、Escape 和外部滚动职责清晰分层。
- [x] 触发器与钟面 Escape 都先认领事件，再关闭面板并恢复当前时间字段焦点。

## 2026-07-30 EP-11 文档页面收敛

- [x] 页面入口、6 个 Playground、Template/Script、运行时状态和 Props/Events/Methods API 表完成中英文对齐；API 表以当前 `types.ts`、默认值和 Provider 行为为准。
- [x] 所有变化状态均位于 Playground 直接子节点的 `slot="status"`，并使用 `role="status"` 与 `aria-live="polite"`；示例预览复用共享舞台水平、垂直居中。
- [x] 页面测试覆盖 6 个示例、3 张 API 表、英文源码、live region、共享居中舞台和状态响应；文档审计从 `482/527` 推进到 `495/533`，TimePicker 不再出现在缺口清单。
- [x] 真实 Chromium 覆盖 1440x1000 与 390x844、Material/Midnight、中英文；Enter/Escape 可打开/关闭钟面，移动端无横向溢出，最终控制台 0 warning / 0 error。
- [x] 聚焦诊断测试在 `--hookTimeout=30000` 下 2 个文件、25 项通过；`pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm build:lib` 通过。
- [ ] 仓库标准测试门限仍被全组件入口冷加载超过 10 秒阻断；全量结果为 224/229 个文件、1568 项通过，4 个套件 hook 超时、1 个 FormPage 测试超时。该问题不通过放宽仓库测试配置或修改断言规避。
