# Icon Element Plus API 对标计划

## 本轮记录
- [x] 第六阶段：新增可嵌套 `IconProvider`，局部提供 defaultSet / aliases / sets 且不污染全局注册表；未知 SVG 名称支持 fallback 属性或插槽。
- [x] 第五阶段：增加可配置 `defaultSet`、多集合、语义别名和 SVG path / CSS class 适配器；第三方图标库由应用按需安装，核心包保持零绑定。
- [x] 第四阶段：确定图标集合采用独立包 / 默认插槽按需引入策略，核心组件不全量内置 SVG；补 `loading` / `is-loading` 旋转、减少动态效果兼容、案例与测试。
- [x] 第二阶段：补 `aria-label` 可访问性属性和页面 PropsTable。
- [x] 第三阶段：页面补 Script 视图；单测扩展到 10 条覆盖 name/size/color/CSS 变量/aria-label/role/slot/part。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Icon`
- Element Plus 文档：`icon.md`

## 第一批实现

- [x] 基础 props：`name`、`size`、`color`。
- [x] 默认 slot 承载自定义图标内容。
- [x] 注册到 Basic 组件族并补单测。

## 后续差距

- [x] 补独立案例页：覆盖 `name`、`size`、`color` 属性和默认插槽。
- [x] SVG 图标库 / icon collection：对齐 Element Plus 的拆包方式，核心包只提供图标容器；图标通过默认插槽按需引入，未来集合以独立包发布，避免全量 SVG 进入主包。
- [x] 页面示例补 Script 视图和 PropsTable。

## Basic P1 案例边界复核（2026-07-26）

- [x] 将 6 个分散案例收敛为“尺寸/颜色/自定义 SVG”“Provider 图标集与未知回退”“按钮名称与加载状态”3 个真实场景。
- [x] 新增 `elf-icon-provider`，支持局部默认集、语义别名、SVG/CSS class 集合、嵌套继承与隔离；未提供 Provider 时继续使用全局 `configureIcons()`。
- [x] 已知 SVG 集合缺少名称时使用 `fallback="?"` 或 fallback 插槽，不再渲染空白；装饰图标保持 `aria-hidden`，交互名称由按钮承担。
- [x] Icon 组件 20 项 + IconProvider 2 项 + 页面 2 项定向测试通过；迁移扫描、109 个宏组件类型检查和 Vite 生产构建通过。
- [x] 真实浏览器验证 Provider 动态切换、未知回退、按钮焦点/名称与中文/英文文档；控制台 0 error / 0 warning。
- [x] 截图：`icon-provider-filled.png`、`icon-button-a11y-en.png`。
