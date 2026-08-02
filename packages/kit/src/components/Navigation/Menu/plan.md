# Menu Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Navigation/Menu`
- Element Plus 文档：`menu.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### menu.md

#### Menu API

- `mode`
- `collapse`
- `ellipsis`
- `ellipsis-icon ^`
- `popper-offset ^`
- `default-active`
- `default-openeds`
- `unique-opened`
- `menu-trigger`
- `router`
- `collapse-transition`
- `popper-effect ^`
- `close-on-click-outside ^`
- `popper-class ^`
- `popper-style ^`
- `show-timeout ^`
- `hide-timeout ^`
- `background-color ^`
- `text-color ^`
- `active-text-color ^`
- `persistent ^`
- `select`
- `open`
- `close`
- `default`
- `handleResize`
- `updateActiveIndex ^`

#### Menu Attributes

- `mode`
- `collapse`
- `ellipsis`
- `ellipsis-icon ^`
- `popper-offset ^`
- `default-active`
- `default-openeds`
- `unique-opened`
- `menu-trigger`
- `router`
- `collapse-transition`
- `popper-effect ^`
- `close-on-click-outside ^`
- `popper-class ^`
- `popper-style ^`
- `show-timeout ^`
- `hide-timeout ^`
- `background-color ^`
- `text-color ^`
- `active-text-color ^`
- `persistent ^`

#### Menu Events

- `select`
- `open`
- `close`

#### Menu Slots

- `default`

#### Menu Exposes

- `open`
- `close`
- `handleResize`
- `updateActiveIndex ^`

#### SubMenu API

- `index ^`
- `popper-class`
- `popper-style ^`
- `show-timeout`
- `hide-timeout`
- `disabled`
- `teleported`
- `popper-offset`
- `expand-close-icon`
- `expand-open-icon`
- `collapse-close-icon`
- `collapse-open-icon`
- `default`
- `title`

#### SubMenu Attributes

- `index ^`
- `popper-class`
- `popper-style ^`
- `show-timeout`
- `hide-timeout`
- `disabled`
- `teleported`
- `popper-offset`
- `expand-close-icon`
- `expand-open-icon`
- `collapse-close-icon`
- `collapse-open-icon`

#### SubMenu Slots

- `default`
- `title`

#### Menu-Item API

- `index ^`
- `route`
- `disabled`
- `click`
- `default`
- `title`

#### Menu-Item Attributes

- `index ^`
- `route`
- `disabled`

#### Menu-Item Events

- `click`

#### Menu-Item Slots

- `default`
- `title`

#### Menu-Item-Group API

- `title`
- `default`

#### Menu-Item-Group Attributes

- `title`

#### Menu-Item-Group Slots

- `default`
- `title`

## 当前 ElfUI API 快照

### Props

- `activeBackground`
- `activeTextColor`
- `backgroundColor`
- `collapse`
- `collapseWidth`
- `defaultActive`
- `defaultOpeneds`
- `elevation`
- `indent`
- `items`
- `mode`
- `modelValue`
- `props`
- `rounded`
- `router`
- `searchPlaceholder`
- `searchable`
- `showToggle`
- `textColor`
- `theme`
- `togglePlacement`
- `uniqueOpened`
- `width`

### Events

- `close`
- `collapse-change`
- `open`
- `select`
- `update:modelValue`

### Slots

- `footer`
- `header`
- `search`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`ellipsis`、`ellipsis-icon ^`、`popper-offset ^`、`menu-trigger`、`collapse-transition`、`popper-effect ^`、`close-on-click-outside ^`、`popper-class ^`、`popper-style ^`、`show-timeout ^`、`hide-timeout ^`、`persistent ^`、`index ^`、`popper-class`、`show-timeout`、`hide-timeout`、`disabled`、`teleported`、`popper-offset`、`expand-close-icon`、`expand-open-icon`、`collapse-close-icon`、`collapse-open-icon`、`route`、`title`
- [x] P1 补齐事件差距：`click`
- [x] P1 补齐插槽/暴露方法：`title`、`open`、`close`、`handleResize`、`updateActiveIndex ^`
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。
- [x] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，补齐 Element Plus 关键场景示例。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `npm --prefix ui-kit run build` 通过；涉及运行时能力时补跑目标测试。

## 本轮记录

- [x] 2026-07-21 所有文档案例放入 `elf-card` 应用表面；基础、水平、折叠、搜索、暗色、hover、多级和组合式案例在 390px 窄屏下不坍缩，页面无横向溢出。
- [x] 2026-07-19 搜索结果选择叶子菜单后同步清空内部状态、默认输入框与自定义 search 插槽输入框，完整菜单无需二次操作即可恢复。
- [x] 2026-07-28 架构收敛：将数据规范化、路径查找、可见项投影与样式/路由解析拆入纯 `model`，将 Light DOM 组合式子组件转换拆入 `composition-adapter`；组件仅协调响应式状态、DOM 与事件。横向子菜单接入共享 `useDismissibleOverlay` 交互栈，补齐模型、组合适配器、嵌套浮层互斥测试及中英文 API 文档。
- [x] 2026-07-29 持久隐藏的横向与折叠浮层同步 `aria-hidden` 和 `inert`，避免隐藏菜单项留在焦点树中。
- [x] 2026-08-01 `icon` 兼容 Material Design SVG path，同时保留原有文本图标；AppShell 为全部路由和菜单组配置语义化 `@mdi/js` 图标。聚焦测试 2 文件 / 26 项及精确路由回归 1 项通过，生产构建 1112 模块通过；浏览器视觉验收由用户接手。

- [x] 2026-07-11 Navigation 第一阶段：补 `ellipsis/ellipsisIcon/menuTrigger/showTimeout/hideTimeout/popperOffset/popperClass/popperStyle/collapseTransition/closeOnClickOutside/persistent` 兼容入口，支持 `title/route/popperClass/teleported` 字段映射，补 `handleResize/updateActiveIndex` 暴露方法，新增定向测试和 PropsTable/hover 案例。
- [x] 2026-07-14 增加可选 `bordered` 外框；修复自定义 toggle 双触发、搜索事件与折叠 header 裁切，并将稳定 toggle 放入 header 同行。
- [x] 2026-07-17 header toggle 改用 `--m-bg / --m-color` 主题语义变量，兼容暗色主题与自定义颜色。
- [x] 2026-07-15 完成组合式 `SubMenu / MenuItem / MenuItemGroup`，补齐子菜单级浮层样式、偏移、超时与状态图标，增加 `MenuItem click`、持久浮层、ARIA 和完整方向键导航；20 项定向单测、生产构建及真实浏览器交互通过（控制台 0 error）。`teleported` 保留层级语义，真实跨 Shadow DOM 锚定传送继续由 Dropdown 的共享浮层任务统一承接。
