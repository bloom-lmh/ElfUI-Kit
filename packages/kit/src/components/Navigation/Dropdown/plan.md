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

## 2026-08-01 Material 字段外观与案例

- [x] 与 Input 共用 `filled / outlined / underlined / solo / solo-filled / solo-inverted` 六种字段表面，普通与分裂触发器使用同一契约。
- [x] 新增 `backgroundColor`，并通过宿主 CSS 变量保持自定义背景与状态样式一致。
- [x] 下拉面板改为 Material 菜单表面、行高、选中态、阴影和暗色 token；基础案例升级为真实命令菜单及实时外观控制台。
- [x] Dropdown 与文档页聚焦回归通过，共 45 项；英文文档测试适配统一 DocsHero 的嵌套结构。

## 2026-08-01 触发器与面板连接

- [x] 本地与 Teleport 定位的默认 offset 从 6px 收敛为 0，顶部/底部面板与输入式触发器直接相接；显式 Popper offset 仍保持调用方优先。
- [x] Dropdown 模型、组件与页面回归进入当前 7 文件 / 68 项通过批次。

## 2026-08-04 虚拟触发案例选中反馈修复

- [x] 修复「虚拟触发」案例选中后无效：输入框 `modelValue` 之前绑死为右键提示文案，`onCommand` 更新 `selectedLabel` 后输入框从不刷新；改为 `:modelValue.prop=${selectedLabel.value}` 绑定，选中菜单项后输入框实时显示选中项 label。
- [x] 虚拟触发输入框补充 `label`（画布操作 / Canvas actions），与 Template/Script 展示代码同步。
- [x] 新增回归断言：`command` 事件触发后虚拟触发输入框 `modelValue` 更新为选中项 label，且带 label 属性；DropdownPage 测试通过。
- [x] Chromium 实测右键打开菜单并选择「刷新画布」后输入框显示刷新画布、状态行显示当前命令；截图归档 `output/playwright/dropdown-virtual-trigger-zh.png`。
