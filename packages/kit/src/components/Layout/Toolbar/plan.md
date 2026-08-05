# Toolbar component plan

- [x] Vuetify-inspired prepend, title, actions, append, background, and extension regions.
- [x] Default/comfortable/compact/prominent density, collapse alignment, floating, surface, elevation, and flat states.
- [x] Responsive desktop/mobile height behavior and theme-token styling.
- [x] Public types, registration, focused tests, bilingual examples, and API tables.

## 2026-08-04 对齐 Vuetify v4.1.7 VToolbar

- [x] 新增 `density="prominent"`：主行 128px、标题 28px 底部对齐、prepend/append 顶部对齐、扩展区高度按 Vuetify 公式加倍（48 → 96）。
- [x] 新增 `extended: boolean | null`：`true` 强制显示扩展区（可空）、`false` 强制隐藏、`null` 按插槽内容自动检测；扩展区改为高度动画展开/收起（`height` 过渡），替代原来的 `v-show` 瞬时切换。
- [x] 新增 `flat`：即使设置 `elevation` 也移除投影。
- [x] 扩展区高度随密度缩放：comfortable 减 4px、compact 减 8px、prominent 加倍，与 Vuetify `extensionHeight` 计算一致。
- [x] 折叠语义对齐 Vuetify：`collapse-position` 从「保留哪一侧」改为「折叠后对齐哪一侧」（默认 `start`，`end` 时 `margin-inline-start: auto`）；折叠时只隐藏标题，prepend/append 均保留，超出 `collapse-width` 的内容被 `overflow: hidden` 裁剪。
- [x] 文档页：新增「突出工具栏」案例（prominent + extended + 扩展导航），「灵活卡片工具栏」改用 `extended flat`，折叠案例文案与代码同步为对齐语义；API 表补充 `density=prominent`、`extended`、`flat`。
- [x] 验证：组件 11 项、页面 4 项聚焦测试通过；kit typecheck 0 宏错误 / 0 TS 错误；kit 与 website build 通过；浏览器实测 prominent 128px/标题 28px/扩展区 96px、折叠后标题隐藏且两侧按钮保留、`end` 对齐右移、扩展区 height 过渡、移动端无溢出，控制台 0 warning / 0 error；截图归档 `output/playwright/toolbar-prominent*.png`。
