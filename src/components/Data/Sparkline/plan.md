# Sparkline Plan

- Status: implemented
- Alignment: Vuetify animation example
- Scope: line and area rendering, smoothing, initial draw, data interpolation, reduced motion, accessible SVG labeling
- Verification: component tests, typecheck, build, and browser screenshots are recorded in the maintenance handoff after validation

## 2026-07-30 Vuetify documentation batch

- [x] 实现 SVG line/area、平滑曲线、颜色/填充/线宽、stroke linecap、数据插值动画、auto draw 与 reduced-motion。
- [x] 补齐 `role="img"` 和 `aria-label`，并通过静态 `viewBox="0 0 100 100"` 保持响应式缩放。
- [x] 新增 Vuetify Animation 对齐页面：Page Views、Weekly/Monthly/Quarterly 与 Segmented 周期切换。
- [x] 组件与页面聚焦测试 `3/3` 通过；桌面 SVG 为 `660 x 220`，移动端卡片 `259px`、图表和分段控件均为 `230.265px`，控制台 `0 warning / 0 error`。
- [x] 截图：`docs/screenshots/2026-07-30/sparkline-desktop-light-zh.png`、`docs/screenshots/2026-07-30/sparkline-mobile-midnight-en.png`。
