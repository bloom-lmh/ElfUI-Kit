# Select Element Plus API 对标计划

## 2026-07-28 统一浮层交互

- [x] 接入共享 overlay interaction stack，Escape 与外部点击只关闭最上层浮层。
- [x] 关闭前恢复浮层内部焦点，并为持久化隐藏面板同步 `aria-hidden` 与 `inert`。
- [x] 增加 Select → Cascader 混合浮层的 Escape / outside click 回归测试。

## 2026-07-28 虚拟化与双语文档收敛

- [x] `virtual`、`virtualThreshold`、`itemHeight`、`overscan` 接入共享虚拟窗口算法。
- [x] 选项 DOM 数量保持有界，滚动、Home/End、方向键与 `aria-activedescendant` 保持同步。
- [x] 暴露 `scrollToOption(index)`，避免覆盖原生 `HTMLElement.scrollTo()` 并支持命令式定位大数据选项。
- [x] 6 个案例、运行时数据、状态、占位符和 API 表完整支持中英文。
- [x] 目录只保留简洁 Playground 标题与 API。

## 2026-07-19 弹层衔接
- [x] 下拉面板与输入表面无缝贴合并统一底部圆角

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Select`
- Element Plus 文档：`select.md`、`select-v2.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### select.md

#### Select API

- `model-value / v-model`
- `multiple`
- `options ^`
- `props ^`
- `disabled`
- `value-key`
- `size`
- `clearable`
- `collapse-tags`
- `collapse-tags-tooltip ^`
- `tag-tooltip ^`
- `multiple-limit`
- `id`
- `effect`
- `autocomplete`
- `placeholder`
- `filterable`
- `allow-create`
- `filter-method`
- `remote`
- `debounce ^`
- `remote-method`
- `remote-show-suffix`
- `loading`
- `loading-text`
- `no-match-text`
- `no-data-text`
- `popper-class`
- `popper-style ^`
- `reserve-keyword`
- `default-first-option`
- `teleported`
- `append-to ^`
- `persistent`
- ...另有 46 项，详见来源文档

#### Select Attributes

- `model-value / v-model`
- `multiple`
- `options ^`
- `props ^`
- `disabled`
- `value-key`
- `size`
- `clearable`
- `collapse-tags`
- `collapse-tags-tooltip ^`
- `tag-tooltip ^`
- `multiple-limit`
- `id`
- `effect`
- `autocomplete`
- `placeholder`
- `filterable`
- `allow-create`
- `filter-method`
- `remote`
- `debounce ^`
- `remote-method`
- `remote-show-suffix`
- `loading`
- `loading-text`
- `no-match-text`
- `no-data-text`
- `popper-class`
- `popper-style ^`
- `reserve-keyword`
- `default-first-option`
- `teleported`
- `append-to ^`
- `persistent`
- ...另有 18 项，详见来源文档

#### props

- `value`
- `label`
- `options ^`
- `disabled`

#### Select Events

- `change`
- `visible-change`
- `remove-tag`
- `clear`
- `blur`
- `focus`
- `popup-scroll ^`
- `end-reached ^`

#### Select Slots

- `default`
- `header ^`
- `footer ^`
- `prefix`
- `empty`
- `tag ^`
- `loading ^`
- `label ^`

#### Select Exposes

- `focus`
- `blur`
- `selectedLabel ^`

#### Option Group API

- `label`
- `disabled`
- `default`

#### Option Group Attributes

- `label`
- `disabled`

#### Option Group Slots

- `default`

#### Option API

- `value`
- `label`
- `disabled`
- `default`

#### Option Attributes

- `value`
- `label`
- `disabled`

#### Option Slots

- `default`

### select-v2.md

#### API

- `model-value / v-model`
- `options`
- `props ^`
- `multiple`
- `disabled`
- `value-key`
- `size`
- `clearable`
- `clear-icon`
- `collapse-tags`
- `multiple-limit`
- `id`
- `effect`
- `autocomplete`
- `placeholder`
- `filterable`
- `allow-create`
- `filter-method`
- `loading`
- `loading-text`
- `reserve-keyword`
- `default-first-option`
- `no-match-text`
- `no-data-text`
- `popper-class`
- `popper-style ^`
- `teleported`
- `append-to ^`
- `persistent`
- `popper-options`
- `automatic-dropdown`
- `fit-input-width ^`
- `suffix-icon ^`
- `height`
- ...另有 48 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `options`
- `props ^`
- `multiple`
- `disabled`
- `value-key`
- `size`
- `clearable`
- `clear-icon`
- `collapse-tags`
- `multiple-limit`
- `id`
- `effect`
- `autocomplete`
- `placeholder`
- `filterable`
- `allow-create`
- `filter-method`
- `loading`
- `loading-text`
- `reserve-keyword`
- `default-first-option`
- `no-match-text`
- `no-data-text`
- `popper-class`
- `popper-style ^`
- `teleported`
- `append-to ^`
- `persistent`
- `popper-options`
- `automatic-dropdown`
- `fit-input-width ^`
- `suffix-icon ^`
- `height`
- ...另有 22 项，详见来源文档

#### props

- `value`
- `label`
- `options`
- `disabled`

#### Events

- `change`
- `visible-change`
- `remove-tag`
- `clear`
- `blur`
- `focus`
- `end-reached ^`

#### Slots

- `default`
- `header ^`
- `footer ^`
- `empty`
- `prefix`
- `tag ^`
- `loading ^`
- `label ^`

#### Exposes

- `focus`
- `blur`
- `selectedLabel ^`

## 当前 ElfUI API 快照

### Props

- `allowCreate`
- `automaticDropdown`
- `clearable`
- `collapseTags`
- `collapseTagsTooltip`
- `debounce`
- `defaultFirstOption`
- `disabled`
- `emptyValues`
- `filterMethod`
- `filterable`
- `fitInputWidth`
- `height`
- `id`
- `loading`
- `loadingText`
- `maxCollapseTags`
- `modelValue`
- `multiple`
- `multipleLimit`
- `name`
- `noDataText`
- `noMatchText`
- `options`
- `placeholder`
- `props`
- `remote`
- `remoteMethod`
- `reserveKeyword`
- `size`
- `tabindex`
- `valueKey`
- `valueOnClear`

### Events

- `blur`
- `change`
- `clear`
- `focus`
- `end-reached`
- `popup-scroll`
- `remove-tag`
- `search`
- `update:modelValue`
- `visible-change`

### Slots

- 暂无记录

### Exposes

- `close`
- `open`
- `selectedLabel`
- `toggle`

## 本轮已完成（2026-07-05）

- [x] 支持 Element Plus `options/props` 字段映射，补 `value-key` 对象值识别。
- [x] 补 `multiple-limit`、`max-collapse-tags`、`allow-create`、`default-first-option`、`remote-method/debounce`、`value-on-clear`、`height`、`tabindex/id/name` 的基础逻辑。
- [x] 补 `remove-tag`、`popup-scroll`、`end-reached` 事件和 `selectedLabel` 暴露方法。
- [x] 核心模板事件/动态属性从旧字符串写法迁移到 `${...}`。
- [x] 补充字段映射、多选上限、创建项、远程搜索单测。

## 差距与任务

- [x] P0 核心属性收口：补齐标签提示与视觉语义、面板 effect/class/style/persistent/offset、autocomplete、远程后缀、图标、精确宽度、自动展开和表单校验。`teleported / append-to` 不伪造兼容属性，继续由 Shadow DOM 内锚定面板保证样式与焦点隔离，待统一 Overlay 平台提供跨根挂载。
- [x] P0 补齐事件差距：`remove-tag`、`popup-scroll ^`、`end-reached ^`
- [x] P1 插槽/暴露方法：补齐 header、footer、prefix、empty、tag、loading、label、clear-icon、suffix-icon；tag / label 提供 scoped 数据，并暴露 open/close/toggle/focus/blur/selectedLabel。
- [x] P1 行为：完成方向键、Home/End、Enter、Escape、Tab、禁用项跳过、ARIA combobox/listbox、父 Form 禁用与校验联动、受控值同步和外部滚动关闭。
- [x] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，覆盖基础、多选、创建、远程状态、字段映射与面板插槽。
- [x] P2 补齐组件单测、页面冒烟和类型导出，并完成真实浏览器视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、Form/Providers 分类测试与宏类型检查通过。

## 2026-07-22 远程状态与面板插槽

- [x] 补齐 `header` 面板插槽，并统一 `header` / `footer` 的边界和暗色主题样式。
- [x] 远程案例覆盖加载、空结果、请求失败和过期响应忽略，Script 展示完整状态组织。
- [x] 增加 header/footer/loading/empty 投影单测和真实页面远程错误回归测试。
- [x] 表单校验与完整键盘路径已于 2026-07-27 收口。
- [x] 大数据选项虚拟化已复用共享窗口算法；统一 Overlay 平台仍作为独立架构路线推进。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Select 下拉选择组件开发与重构计划

## 1. 目标定位

提供高品质、符合 Material Design 风格的下拉选择组件，支持单选、多选、可搜索、可清空等高级表单关联功能，在多实例/单页路由场景中具备完美的事件隔离和状态稳定性。

## 2. 计划与重构任务

- [x] **2.1 状态同步与防 Mutate**: 引入 `innerValue` 响应式副本，由 `useEffect` 单向同步 `props.modelValue`，防止直接修改 prop 带来的副作用。
- [x] **2.2 退场动画优雅控制**: 结合 `rendered` 和 `closing` 状态及 200ms 的 `setTimeout` 延迟控制下拉框的淡出物理生命周期，保证动画完整展示。
- [x] **2.3 阻止事件冒泡与默认行为**:
  - [x] 将 Option 选项点击修改为 `@click.stop.prevent` 阻止捕获冒泡，避免触发 Vite 开发服务器全局 hash 监听器导致路由重置。
  - [x] 将 Trigger 元素点击修改为 `@click.stop`，避免向外部逃逸引发不期望的重置事件。
  - [x] 在 `selectOption(opt, e)` 处理器中显式执行 `e?.stopPropagation()` 与 `e?.preventDefault()` 双重防逃逸机制。
- [x] **2.4 自定义展示页与测试**: 确保 `page-select` 的 5 个展示 Demo 功能齐全且状态独立。

## 2026-07-16 Field Surface 与浮层滚动

- [x] 接入共享 `filled / outlined` 和浮动标签；外部滚动关闭下拉，面板内部滚动继续触发 `popup-scroll / end-reached`。

## 2026-07-19 行内筛选回归

- [x] 为关键字、状态和开关建立明确的弹性宽度与最小宽度，避免 Select 在行内表单中被压缩。

## 2026-07-22 共享字段主题

- [x] 与 Input 共用六种表面、真实描边标签、背景变量和状态动效。
- [x] 下拉浮层、过滤、多选标签和键盘交互保持独立且无裁切回归。

## 2026-07-27 下拉激活态视觉回归

- [x] 移除键盘激活项的内嵌蓝色描边，改为整行柔和背景与主色文字高亮；鼠标悬停使用相同表面语义，禁用项不响应高亮。
## 2026-07-28 未选项悬停反馈

- [x] 为未选中的可用选项提供明确的主题色悬停背景与文本对比度。
- [x] 保持 selected、disabled 和 keyboard-active 状态优先级不变。
