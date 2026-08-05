# Tabs Element Plus API 对标计划

- [x] Material 默认导航表面使用 paper 背景，修复 grow 宽度与 start/center/end 对齐，并让操作台预览占满可用宽度。

## 2026-07-21 Playground 与变体回归

- [x] 修复 `grow` 铺满和 start/center/end 整体对齐，默认标签导航使用主题表面背景。
- [x] 配置项迁移至可折叠右侧控制台，保留标题栏当前值状态。
- [x] 图片分类切换加入懒加载与过渡，长标签、固定宽度、扩展卡片拆为三个案例。

更新时间：2026-07-15

## 对标定位

- ElfUI 组件目录：`Navigation/Tabs`、`Navigation/TabPane`
- Element Plus 文档：`tabs.md`
- 实现原则：对齐 Element Plus 的 Tabs / TabPane API 与交互语义，同时保留 ElfUI 数据驱动、主题色和面板过渡扩展。

## 当前 ElfUI API

### Tabs

- Props：`modelValue`、`defaultValue`、`type`、`closable`、`addable`、`editable`、`tabPosition`、`stretch`、`beforeLeave`、`tabindex`
- ElfUI 扩展 Props：`items`、`alignTabs`、`density`、`direction`、`color`、`grow`、`stacked`、`showPanels`、`hideSlider`、`transition`、`transitionDuration`、`props`
- Events：`update:modelValue`、`change`、`tab-click`、`tab-change`、`tab-remove`、`tab-add`、`edit`
- Slots：`default`、`add-icon`、兼容别名 `addIcon`
- Expose：`currentName`、`select`、`setActive`、`removeTab`、`add`、`scrollToActiveTab`、`removeFocus`、`update`、`tabListRef`、`tabBarRef`、`tabNavRef`

### TabPane

- Props：`label`、`name`、`disabled`、`closable`、`lazy`
- Slots：`default`、`label`

## 差距与任务

- [x] P1 补齐核心属性：`type`、`closable`、`addable`、`editable`、`tab-position`、`stretch`、`before-leave`、`tabindex`、`label`、`name`、`disabled`、`lazy`。
- [x] P1 补齐事件：`tab-click`、`tab-change`、`tab-remove`、`tab-add`、`edit`。
- [x] P1 补齐组合式 `elf-tab-pane`、`label`、`add-icon` / `addIcon` 插槽与导航公开能力。
- [x] P1 对齐数值名称、受控/非受控同步、Promise 拦截、方向键、禁用态、lazy、清空态和 ARIA 关联；Tabs 不提交表单值，无额外表单契约。
- [x] P2 更新页面示例：Template / Script 双视图，覆盖卡片、位置、编辑、组合面板、富标签和自定义新增按钮。
- [x] P2 补齐定向测试、类型导出、页面冒烟和真实浏览器视觉回归。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 数值名称、受控同步、Promise 拦截、键盘、禁用、lazy、清空与组合式场景有单测覆盖。
- [x] 文档示例可在 Playground 中显示并复制 Template / Script。
- [x] Tabs 定向测试、生产构建和真实浏览器验证通过。

## 实施记录

- [x] 2026-07-11：补齐类型、编辑能力、事件与基础公开方法。
- [x] 2026-07-14：为卡片和可编辑标签增加主题化滚动条与垂直高度约束。
- [x] 2026-07-15：新增组合式 `elf-tab-pane`、富标签投影、lazy 面板、数值 name、roving tabindex、Promise reject 拦截、自定义新增按钮和导航引用；完成 15 条定向测试、构建及浏览器验收。
- [x] 2026-07-17：组合式案例改为真实动态 pane 集合，新增按钮创建并激活面板，关闭当前项按“右侧优先、左侧回退、忽略禁用项”更新状态。
- [x] 2026-07-21：新增背景色、滑块色、固定标签、激活项居中和可插槽翻页箭头；补充响应式操作台、懒加载图片分类与扩展变体案例。
- [x] 2026-07-22：改为单一持久化激活指示器，水平与垂直布局均按标签尺寸计算位置，并通过 transform/尺寸过渡平滑滑动。

## 2026-07-30 EP-11 文档页面收口

- [x] 按当前 `TabsProps`、`TabPaneProps`、事件与 expose 契约重写双语 API 表，不把未类型化内部能力写成公开 API。
- [x] 10 个案例和 13 个 Playground 的动态状态统一放入标题行 live region，预览复用共享水平/垂直居中舞台；操作台继续使用 5 个 Select 与 2 个 Checkbox 真实驱动配置。
- [x] Template/Script 随当前 locale 生成，英文源码不再混入中文；图片分类切换使用框架 `<Transition>`，并覆盖 reduced motion 样式。
- [ ] 在 `EP-03` 收敛组件内部结构性动效：数据面板与 TabPane 的 enter/leave 应审计 `<Transition>`，拖动列表只有在提供移动动画契约时才使用 `<TransitionGroup>`。当前面板是原生 section 或已挂载的 slotted Custom Element，不是动态组件实例，`<KeepAlive>` 不适用于现有契约；不得另建手写组件缓存。

## 2026-08-05 平直滑块与图片分类滑动过渡

- [x] 新增 `sliderVariant="rounded | flat"`：flat 将激活指示条改为贴住标签底边的 2px 平直直线（无圆角、无左右内缩），水平/垂直布局均按标签完整尺寸定位。
- [x] 图片分类案例改用横向滑动过渡：旧面板向左滑出、新面板从右侧滑入，保留 reduced motion 降级。
- [x] 图片分类案例的标签页使用 `slider-variant="flat"` 展示新样式；API 表新增 `sliderVariant` 行，Tabs 单测新增 flat 滑块几何断言。
- [x] 标签页操作台新增「滑块样式」选择器（rounded / flat），操作台 Select 增至 6 个；页面测试同步更新。
