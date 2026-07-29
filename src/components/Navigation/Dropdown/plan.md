# Dropdown 对标与质量计划

## API 与交互

- [x] 支持 click、hover、contextmenu、多触发模式、分裂按钮、禁用、位置、尺寸和主题。
- [x] 支持 items 数据模式、嵌套子菜单、字段映射以及 DropdownMenu / DropdownItem 组合式模式。
- [x] 支持键盘打开、方向键、Home、End、Escape、外部点击和多实例互斥。
- [x] 支持 virtualRef、Popover top layer、碰撞翻转、外部滚动关闭和面板内部滚动。
- [x] 提供 handleOpen、handleClose、show、hide 与 toggle 方法。

## 2026-07-21 组合式选中反馈

- [x] 组合式菜单选择后同步 DropdownItem `selected` / `data-selected` / `aria-current` 状态。
- [x] 选中项提供主题化背景和 CSS 绘制的勾选图标，不使用普通字符模拟图标。
- [x] 示例触发项直接展示所选标签，状态区展示 command，不再只更新不可见内部状态。
- [x] 32 个定向测试和真实浏览器选择流程通过，控制台无错误。
- [x] 组合式菜单补充跨 Shadow DOM 键盘焦点识别，方向键跳过禁用项，重新打开后保留 `aria-current` 选中状态。

## 2026-07-28 beta.12 结构性重构

- [x] 将字段映射、数据规范化、触发模式、尺寸、按钮类型和 Popper modifiers 抽为纯模型模块。
- [x] 使用 `useComputed()` 缓存规范化数据和展示状态，避免模板更新期间重复转换完整菜单树。
- [x] beta.12 曾试用命名 Fragment；该方案已于 2026-07-29 废止并完整回迁到根静态模板。
- [x] 保留 Core 的 click outside、Escape 和事件资源管理，组件文件只维护 Dropdown 专属的定位与弹层协调。
- [x] 将虚拟触发器、Observer、定位监听和计时器清理返回给 `onMounted()`，资源创建与释放保持同一生命周期边界。
- [x] 新增纯模型测试，原有 35 条组件交互测试保持通过。
- [x] 浏览器截图：`docs/screenshots/2026-07-28-dropdown-beta12-refactor/dropdown-selected.png`、`dropdown-split-open.png`，控制台 0 warning / 0 error。

## 2026-07-29 Fragment 移除

- [x] 将 StandardTrigger、SplitTrigger 和 MenuPanel 原样内联回根 `defineHtml()` 模板。
- [x] 保留 DOM 顺序、class、part、ARIA、事件、稳定 key 和现有样式。
- [x] 页面标题、6 个案例文件、7 个 Playground、运行时数据、Template / Script 和 API 表完整适配英文。
- [x] 组件测试、宏类型检查、应用构建、库构建和真实浏览器视觉回归通过；覆盖桌面/移动端、浅色/Midnight、中英文、键盘、嵌套菜单、分裂按钮、虚拟触发和 top layer，控制台 0 warning / 0 error。
