<!-- cspell:words Fritsch Carlson pointerleave pointermove -->

# Sparkline Plan

- Status: implemented
- Alignment: Vuetify VSparkline (trend / bar, gradient, labels)
- Scope: line and area rendering, smoothing (default/monotone), bar rendering, gradients, labels, markers, hover interaction, inset, initial draw, data interpolation, min/max scale, item-value, reduced motion, accessible SVG labeling
- Verification: component tests, typecheck, build, and browser screenshots are recorded in the maintenance handoff after validation

## 2026-07-30 Vuetify documentation batch

- [x] 实现 SVG line/area、平滑曲线、颜色/填充/线宽、stroke linecap、数据插值动画、auto draw 与 reduced-motion。
- [x] 补齐 `role="img"` 和 `aria-label`，并通过静态 `viewBox="0 0 100 100"` 保持响应式缩放。
- [x] 新增 Vuetify Animation 对齐页面：Page Views、Weekly/Monthly/Quarterly 与 Segmented 周期切换。
- [x] 组件与页面聚焦测试 `3/3` 通过；桌面 SVG 为 `660 x 220`，移动端卡片 `259px`、图表和分段控件均为 `230.265px`，控制台 `0 warning / 0 error`。
- [x] 截图：`docs/screenshots/2026-07-30/sparkline-desktop-light-zh.png`、`docs/screenshots/2026-07-30/sparkline-mobile-midnight-en.png`。

## 2026-08-03 Vuetify VSparkline 对齐批次

- [x] 调研 Vuetify v4.1.7 `VSparkline`：官方仅提供迷你图表 `trend`（趋势线）与 `bar`（柱状）两种类型，无完整图表库；完整图表需第三方（如 ECharts）。
- [x] 新增 `type="trend|bar"`、`gradient` + `gradient-direction`、`labels` + `show-labels` + `label-size`、`auto-line-width`、`padding`、`min`/`max`；柱状支持 `smooth` 圆角、负值基线、自动绘制升起动画与首帧绘制。
- [x] 渐变语义与 Vuetify 对齐：停靠点数组反转、方向 `top/bottom/left/right` 映射到 `linearGradient` 向量；无渐变时保持纯色兼容。
- [x] 标签渲染为 HTML 行（避免 `preserveAspectRatio="none"` 拉伸文字），默认 `label-size=7`，缺失标签回退到数据值。
- [x] 新增案例：ex2「柱状迷你图」（近 7 日营收：渐变柱、星期标签、自动柱宽、首帧绘制）、ex3「仪表盘卡片与标签」（收入面积渐变、活跃用户柱状、转化率渐变线、订单横向渐变柱）；ex1 后续按 Vuetify 官方示例重做（见下节）。
- [x] 修复多实例动画帧号共享问题：`frame` 从模块级 `let` 改为 `useRef`，仪表盘多图同时首帧绘制不再互相取消。

## 2026-08-03 ex1 对齐 Vuetify prop-animation 案例

- [x] ex1「动画」重做：卡片宽度从 820px 收敛到 480px（`--elf-card-radius: 12px`），改用 `elf-card variant="outlined" density="comfortable"`，头部为「页面浏览量」标题 + 周期副标题 + 右上角 `elf-segmented size="sm"`，图表高度从 220px 收敛到 78px，整体对应 Vuetify `prop-animation.vue`。
- [x] 数据与默认值完全采用 Vuetify 官方示例：默认 `monthly`，weekly/monthly/quarterly 三组数据与官方一致；切换周期时副标题同步为「最近 7 天 / 最近 12 个月 / 最近 6 个季度」。
- [x] 属性写法修正为 kebab-case 字符串（`auto-draw-duration="800"`、`line-width="2"`、`smooth="4"`、`stroke-linecap="round"`），避免小写属性映射不到 camelCase prop。

## 2026-08-03 继续对齐 Vuetify VSparkline（交互、标记、单调平滑）

- [x] 新增 `interactive` + `update:currentIndex`：pointermove/pointerleave 最近点计算、聚焦默认最后一点、ArrowLeft/ArrowRight 键盘切换；趋势模式渲染十字线 + 悬停标记，柱状模式高亮整列。
- [x] 新增 `showMarkers` + `markerSize` + `markerStroke`：标记渲染为 HTML 定位圆点（百分比坐标），避免 `preserveAspectRatio="none"` 把 SVG 圆拉成椭圆。
- [x] 新增 `inset`：趋势线按首尾斜率延伸到图表边缘。
- [x] 新增 `smoothMode="monotone"`：移植 Vuetify Fritsch-Carlson 单调三次插值为纯模块 `monotone.ts`，局部极值不过冲。
- [x] 新增 `itemValue`：支持 `{ value: number }` 对象数据；新增 `autoDrawEasing`：首次绘制/柱状升起缓动可配置，默认对齐 Vuetify `ease`。
- [x] 新增案例 ex4「交互悬停」（每周下载量：fill + 渐变 + min/padding + interactive + 悬停联动头部数值与周区间）与 ex5「心率与平滑模式」（三色渐变 + autoDraw + showMarkers + animation + monotone 开关 + 平滑滑杆 + 重新测量）。
- [x] 验证：组件 7 项、页面 3 项聚焦测试通过；kit typecheck 0 宏错误 / 0 TS 错误；kit 与 website build 通过；浏览器实测悬停更新头部、键盘切换、离开复位、重新测量数据变化、monotone 切换、移动端无溢出，控制台 0 warning / 0 error；截图归档 `output/playwright/sparkline-interactive-ex4.png`、`sparkline-heart-ex5.png`、`sparkline-heart-mobile.png`。

## 2026-08-04 补充 Vuetify 剩余案例（自定义标签、渐变配置、内嵌支出）

- [x] ex6「自定义标签」：对齐 `misc-custom-labels`，绿色卡片 + 货币化标签（`labels` 数组传 ¥/$ 前缀）+ `padding=24` + 圆头平滑 + 「查看报表」按钮。
- [x] ex7「渐变与填充配置」：对齐 `prop-fill`，6 组色板 + 填充开关 + 线宽/平滑/内边距滑杆实时驱动图表。
- [x] ex8「支出与内嵌趋势」：对齐 `prop-inset`，深色卡片 + `inset` + `fill` + 渐变 + `show-markers` + `interactive` 悬停读数（月份 · 金额），补齐 `inset` 的公开演示。
- [x] 验证：Sparkline 页面测试 4 项通过；全仓 typecheck 0 宏错误 / 0 TS 错误；浏览器实测色板切换、填充开关、悬停读数、移动端无溢出，控制台 0 warning / 0 error；截图归档 `output/playwright/sparkline-custom-labels-ex6.png`、`sparkline-gradient-playground-ex7.png`、`sparkline-inset-expenses-ex8*.png`。
