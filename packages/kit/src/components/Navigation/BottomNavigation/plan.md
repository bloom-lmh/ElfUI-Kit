# BottomNavigation component plan

- [x] Controlled items/value API with update and change events.
- [x] Grow, horizontal, shift, active, color, border, height, and elevation states.
- [x] Arrow/Home/End keyboard focus, Enter/Space activation, disabled items, and aria-current.
- [x] Public types, registration, focused tests, bilingual examples, and API tables.

## 2026-07-31 Shift stability follow-up

- [x] Removed selected-icon translation and selected-item growth so shift labels can change without moving icons; all shift items keep an equal width and shared vertical position.
- [x] Isolated base, grow, horizontal, shift, and visibility example values so one Playground cannot update another.
- [x] BottomNavigation and navigation-page regression tests pass 15/15; Chromium mobile inspection reports four 63.5px items with identical icon tops and `transform: none`.

## 2026-08-04 Shift 对齐 Vuetify VBottomNavigation 并改进案例

- [x] Shift 行为对齐 Vuetify v4.1.7：非选中项标签改为 `opacity: 0` 淡出（保留占位，不再 `width:0 + visibility:hidden` 塌陷），图标按 Vuetify 公式 `translateY(8px)`（24px 图标的三分之一）位移；`.icon` 与 `.label` 增加对应过渡，选中切换平滑。
- [x] Shift 案例重做对齐 `prop-shift`：去掉 `grow`，使用手机设备容器 + 四个媒体目的地；每个目的地有专属强调色（视频蓝/音乐青/图书棕/图片紫）与文案，选中项变化时导航强调色、内容标题和摘要联动。
- [x] 新增「滚动隐藏」案例对齐 `prop-hide-on-scroll`：消息列表滚动区域，向下滚动超过阈值隐藏导航（`active=false`），向上滚动或回到顶部恢复显示；示例内实现滚动方向判定。
- [x] 验证：BottomNavigation 组件 6 项、NavigationSurfacesPage 12 项聚焦测试通过；typecheck 0 宏错误 / 0 TS 错误；浏览器实测非选中项 `translateY(8px)` + 标签淡出、点击后强调色/内容联动、滚动隐藏与恢复均正常，控制台 0 warning / 0 error；截图归档 `output/playwright/bottomnav-shift.png`、`bottomnav-hide-on-scroll*.png`。
