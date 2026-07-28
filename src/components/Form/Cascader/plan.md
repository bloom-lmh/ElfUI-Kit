# Cascader Element Plus API 对标计划

## 2026-07-28 统一浮层交互

- [x] 接入共享 overlay interaction stack，复用统一 Escape / outside click 事件认领协议。
- [x] 保留关闭前焦点恢复、Top Layer、外部滚动和持久化面板语义。
- [x] 增加 Select → Cascader 混合浮层关闭顺序回归测试。
- [x] 8 个示例模块、9 个 Playground、运行数据、页面标题和 API 表完整支持中英文。

## 本轮记录

- [x] 2026-07-16 修复多选浮层键盘状态机：上下键限制在当前列，左右键进入/返回层级，Enter/Space 选择；展开路径与焦点视觉解耦，并补回归测试和操作案例。
- [x] 2026-07-19 默认浮层与字段边框重叠 1px，消除输入框和面板之间的空隙；顶部/底部圆角与窄屏横向列滚动同步处理。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Cascader`
- Element Plus 文档：`cascader.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### cascader.md

#### Cascader API

- `model-value / v-model`
- `options`
- `props`
- `size`
- `placeholder`
- `disabled`
- `clearable`
- `clear-icon ^`
- `show-all-levels`
- `collapse-tags`
- `collapse-tags-tooltip`
- `max-collapse-tags-tooltip-height ^`
- `separator`
- `filterable`
- `filter-method`
- `debounce`
- `before-filter`
- `popper-class`
- `popper-style`
- `teleported`
- `effect ^`
- `tag-type`
- `tag-effect ^`
- `validate-event`
- `max-collapse-tags ^`
- `empty-values ^`
- `value-on-clear ^`
- `persistent ^`
- `fallback-placements ^`
- `placement ^`
- `popper-append-to-body ^`
- `show-checked-strategy ^`
- `virtual-scroll ^`
- `fit-input-width ^`
- ...另有 23 项，详见来源文档

#### Cascader Attributes

- `model-value / v-model`
- `options`
- `props`
- `size`
- `placeholder`
- `disabled`
- `clearable`
- `clear-icon ^`
- `show-all-levels`
- `collapse-tags`
- `collapse-tags-tooltip`
- `max-collapse-tags-tooltip-height ^`
- `separator`
- `filterable`
- `filter-method`
- `debounce`
- `before-filter`
- `popper-class`
- `popper-style`
- `teleported`
- `effect ^`
- `tag-type`
- `tag-effect ^`
- `validate-event`
- `max-collapse-tags ^`
- `empty-values ^`
- `value-on-clear ^`
- `persistent ^`
- `fallback-placements ^`
- `placement ^`
- `popper-append-to-body ^`
- `show-checked-strategy ^`
- `virtual-scroll ^`
- `fit-input-width ^`
- ...另有 2 项，详见来源文档

#### Cascader Events

- `change`
- `expand-change`
- `blur`
- `focus`
- `clear ^`
- `visible-change`
- `remove-tag`

#### Cascader Slots

- `default`
- `empty`
- `prefix ^`
- `suggestion-item ^`
- `tag ^`
- `header ^`
- `footer ^`

#### Cascader Exposes

- `getCheckedNodes`
- `cascaderPanelRef`
- `togglePopperVisible ^`
- `contentRef`
- `presentText ^`
- `focus ^`
- `blur ^`

#### CascaderPanel API

- `model-value / v-model`
- `options`
- `props`
- `virtual-scroll ^`
- `item-size ^`
- `height ^`
- `change`
- `update:modelValue`
- `expand-change`
- `close`
- `default`
- `empty ^`
- `getCheckedNodes`
- `clearCheckedNodes`

#### CascaderPanel Attributes

- `model-value / v-model`
- `options`
- `props`
- `virtual-scroll ^`
- `item-size ^`
- `height ^`

#### CascaderPanel Events

- `change`
- `update:modelValue`
- `expand-change`
- `close`

#### CascaderPanel Slots

- `default`
- `empty ^`

#### CascaderPanel Exposes

- `getCheckedNodes`
- `clearCheckedNodes`

#### CascaderProps

- `expandTrigger`
- `multiple`
- `checkStrictly`
- `emitPath`
- `lazy`
- `lazyLoad`
- `value`
- `label`
- `children`
- `disabled`
- `leaf`
- `hoverThreshold`
- `checkOnClickNode ^`
- `checkOnClickLeaf ^`
- `showPrefix ^`

## 当前 ElfUI API 快照

### Props

- `checkable`
- `checkOnClickLeaf`
- `checkOnClickNode`
- `clearable`
- `collapseTags`
- `collapseTagsTooltip`
- `disabled`
- `emitPath`
- `expandTrigger`
- `height`
- `itemSize`
- `maxCollapseTags`
- `maxCollapseTagsTooltipHeight`
- `modelValue`
- `multiple`
- `options`
- `placeholder`
- `props`
- `separator`
- `showAllLevels`
- `showCheckedStrategy`
- `showPrefix`
- `size`
- `virtualScroll`

### Events

- `blur`
- `change`
- `clear`
- `expand-change`
- `focus`
- `update:modelValue`
- `visible-change`

### Slots

- 暂无记录

### Exposes

- `clear`
- `close`
- `getCheckedNodes`
- `open`
- `presentText`
- `togglePopperVisible`

### CascaderPanel

- 新增 `elf-cascader-panel`
- Props：`modelValue`、`options`、`props`、`multiple`、`checkable`、`checkStrictly`、`emitPath`、`showPrefix`、`virtualScroll`、`itemSize`、`height`
- Events：`update:modelValue`、`change`、`expand-change`、`close`
- Exposes：`getCheckedNodes`、`clearCheckedNodes`

## 本轮已完成（2026-07-05）

- [x] P0 Add debounced `filterable` searching with selectable path results, custom `filter-method`, async `before-filter` cancellation, an empty slot fallback, tests, and a Playground example.

- [x] 兼容 Element Plus `props.multiple`、`props.checkStrictly`、`props.emitPath`、`props.expandTrigger`、`props.showPrefix`、`props.checkOnClickNode`、`props.checkOnClickLeaf`。
- [x] 补齐 `show-all-levels`、`collapse-tags`、`max-collapse-tags`、`show-checked-strategy` 的基础展示逻辑。
- [x] 补齐 `expand-change`、`focus`、`blur` 事件和 `getCheckedNodes`、`togglePopperVisible`、`presentText` 暴露方法。
- [x] 新增 `elf-cascader-panel` 独立面板，支持单选、多选、复选框前缀、`height/item-size`、`getCheckedNodes`、`clearCheckedNodes`。
- [x] 补充 Cascader / CascaderPanel 单测并接入 Form 注册和类型出口。

## 差距与任务

- [x] P0 完成 `teleported` Top Layer、`append-to`、`persistent`、`placement`、`fit-input-width`、`popper-class/style/options`，支持 offset、flip、碰撞约束、视觉视口与外部滚动关闭。
- [x] P0 完成可移除多选标签、`collapse-tags-tooltip` 和 `remove-tag` 原始模型值事件。
- [x] P1 完成 `empty`、`prefix`、`suggestion-item`、`tag`、`header`、`footer` 与节点默认插槽。
- [x] P1 完成触发器/菜单方向键、Home、End、Escape 键盘访问，并接入 change/blur 表单校验触发。
- [x] P2 新增裁切容器内的多选标签、插槽和 teleported Playground 案例与边界测试。
- [x] P0 补齐 `clear-icon`、`effect`、`tag-type/effect`、`empty-values`、`value-on-clear` 和多候选 fallback placement API 细节。
- [x] P1 完成 lazy/lazyLoad 真实加载状态、resolve 后展开、reject/异常后的可重试恢复，并避免重复值节点缓存冲突。
- [x] P1 使用原生 Custom Element focus/blur，提供 `getContentElement`、`getCheckedNodes` 等语义方法；CascaderPanel 默认/empty 插槽已核验。
- [x] P2 完成公开 emits/slots/expose/element 类型、PropsTable、页面冒烟和视觉回归终审。
- [x] 接入共享 `filled / outlined`、浮动标签、暗色/错误/禁用状态；面板内部滚动不误关闭。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `npm run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-22 共享字段主题

- [x] 与 Input 共用六种表面、真实描边标签、背景变量和状态动效。
- [x] 级联面板、搜索、多选标签与独立面板行为不受视觉抽取影响。
- [x] 多选标签完整保留父子路径文本，窄视口下不再裁掉“研发中心”。
- [x] 激活或半选父节点建立稳定的标签行盒，“研发中心”在浮层中不再因高度塌缩消失。
- [x] 传送面板取消示例额外偏移，触发器与面板边缘无缝衔接。
- [x] 新增真实异步节点与 Form 必填校验案例，补齐审计报告中的文档边界。
- [x] 新增 `panelMode: auto | columns | tree` 与 `treeThreshold`；默认超过 3 级自动改用可折叠树状面板，保留强制布局能力、树键盘导航与完整路径回写。
- [x] 将原五级横向长面板案例精简为四级“深层路径自动树化”，减少预览高度和脚本噪音，并完成真实浏览器尺寸与控制台验收。
