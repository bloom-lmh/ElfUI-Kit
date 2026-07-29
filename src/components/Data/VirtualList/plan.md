# List / VirtualList 组件计划

## 2026-07-21 自定义列表项

- [x] 暴露 `list-item` part，允许主题通过 Shadow Parts 定制列表项。
- [x] 增加 `list-item-class` 与 `list-item-style`，声明式和同步复用渲染路径保持一致。
- [x] 文档案例、API 表格和组件测试同步覆盖自定义列表项。

## 2026-07-19 快速滚动回归
- [x] 增加预渲染窗口并在滚动事件内同步换窗，避免原生滚动先绘制、响应式窗口后更新造成的闪白。
- [x] 使用绝对 `top` 定位可见窗口，缓存窗口结果和切片，保持稳定 key 与有界 DOM。
- [x] 真实浏览器连续跨区跳转 80 次无空白帧，最终正确显示第 10,000 项。

## 2026-07-19 原生滚动条按住回归

- [x] 可见窗口使用绝对 `top` 定位，避免独立 transform 合成层在原生滚动条 active scroll 期间延迟换窗。
- [x] 去除窗口的 `will-change` 与行项目 containment，避免拖动原生滚动条时延迟绘制可见项。
- [x] 滚动事件内同步复用 DOM 行并更新内容，随后再同步声明式状态，不依赖鼠标松开后的批量渲染。
- [x] 单测及真实浏览器连续跨区 80 次无等待滚动：0 空白帧、每帧 9 个可见行、DOM 上限 18 行。

## 2026-07-17 首版完成

- [x] `elf-list` 提供稳定 key、自定义渲染器、边框、分隔线和空状态。
- [x] `elf-virtual-list` 提供固定行高窗口化、overscan、稳定滚动空间和公开定位方法。
- [x] 窗口计算抽为 `computeVirtualWindow`，与 Table 大数据模式复用。
- [x] 覆盖 10,000 项案例、边界计算、DOM 数量和滚动换窗测试。

动态行高现已作为显式 `dynamic` 契约接入；固定行高仍使用独立的同步快速换窗路径，避免降低既有 10,000 项滚动性能。
# 2026-07-21 快速滚动绘制回归

- [x] 滚动期间同步复用可视行节点，停止滚动后再提交声明式窗口，避免 keyed 重排造成空帧。
- [x] 可视窗口至少预渲染一屏并使用合成层位移，覆盖滚动条拖拽时的浏览器合成延迟。
- [x] 连续大跨度滚动保持 DOM 数量有界且始终存在非空行。

## 2026-07-22 P0 dynamic-height and interaction completion

- [x] Added estimated offsets, ResizeObserver measurement cache, binary-search windows, and scroll anchoring for variable-height rows.
- [x] Added key/index positioning with alignment, Arrow/Home/End focus navigation, visible-range introspection, append loading, and empty state.
- [x] Added a 240-row variable-height activity feed; browser measurement observed an 11-row DOM window and 73px / 93px row heights.
- [x] Passed 11 component/page tests and the 800-module production build.

## 2026-07-28 动态虚拟窗口收敛

- [x] 将累计偏移构建、无效尺寸回退和动态窗口二分定位收敛到 `virtual-window` 纯逻辑模块。
- [x] VirtualList 只保留测量缓存、滚动锚定和 DOM 复用职责，与 Table 共用同一窗口语义。
- [x] 独立纯逻辑测试覆盖固定高度、动态高度、overscan、越界滚动与空集合。
## 2026-07-28 动态高度稳定性

- [x] 合并动态滚动事件到 requestAnimationFrame，避免追加数据和快速滚动触发连续重排。
- [x] ResizeObserver 测量结果批量提交并修正滚动锚点，降低动态高度列表闪动。
- [x] 固定高度窗口继续同步复用 DOM 行，快速拖动时保持非空窗口并覆盖回归测试。

## 2026-07-29 动态拖动、盒模型测量与底部锚点

- [x] 动态高度路径增加独立瞬时滚动层，在原生滚动事件内同步复用 24 行，避免快速拖动时出现白帧。
- [x] 瞬时层和声明式窗口分别拥有 DOM；状态提交后再切回声明式窗口，不手工修改 keyed 模板节点。
- [x] 普通测量锚点基于真实 `scrollTop` 和 `overscan: 0` 的首个可见行，不再误用缓冲窗口起点。
- [x] ResizeObserver 优先记录 `borderBoxSize.blockSize`，把行 padding 与分隔边框计入累计偏移。
- [x] 已在底部时按本批全部高度差保持底部锚点；追加到 270 条后仍可稳定滚动到最后一项。
- [x] 组件测试覆盖同步动态换窗、盒模型测量、可见区锚点与底部锚点。
- [x] Chromium 跨区跳转、240/270 条底部滚动通过，控制台 0 warning / 0 error；截图为 `output/playwright/virtual-list-dynamic-bottom-zh.png`。
