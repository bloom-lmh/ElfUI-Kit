# Timeline 对标与质量计划

## API 与布局

- [x] 支持 `items`、`reverse` 与 `start`、`end`、`alternate`、`alternate-reverse`、`horizontal` 模式。
- [x] TimelineItem 支持 timestamp、placement、type、color、size、icon、hollow 与双侧内容。
- [x] 使用 `ol` / `li` 语义结构，节点为装饰内容；窄屏下交替布局回退为单列。
- [x] 支持 `body-N`、`node-N` CSS parts 和 cardStyle 样式变量入口。

## 示例与验证

- [x] 覆盖基础、反转、交替、双侧、横向和 Element Plus 节点属性案例。
- [x] 覆盖明暗主题、窄屏回退、Template/Script 展示与定向单测。
- [x] 2026-07-15：浏览器验证 7 个时间轴案例正常渲染且控制台无错误。

## 2026-07-21 自定义卡片契约

- [x] 为每项提供 `item-N`、`item-N-secondary` 和 `dot-N` 命名插槽，避免只能依赖 HTML 字符串拼装卡片。
- [x] 增加 `cardClass`、`cardStyle` 与现有 `body-N` part 样式入口，同时保留旧版 `dot` 插槽。
- [x] 增加真实自定义卡片案例，并使用 SVG 节点图标代替普通字符功能图标。

## 2026-07-30 纯色视觉复核

- [x] 移除默认连接线的主色渐变，统一使用 `var(--elf-divider)` 纯色；交替与横向中轴继续共用同一语义色。
- [x] Material 中文桌面下确认连接线计算样式为 `background-image: none`、`background-color: rgba(0, 0, 0, 0.08)`，控制台 0 warning / 0 error。
- [x] 截图为 `docs/screenshots/2026-07-30/timeline-flat-desktop-material-zh.png`。
