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
