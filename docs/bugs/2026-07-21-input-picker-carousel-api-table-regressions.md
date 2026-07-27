# 2026-07-21 输入、选择器、轮播与 API 表格细节修复

## 提交基线

- [x] 上一轮改动已提交：`972e097 feat: refine component interactions and documentation`
- [x] 已推送 Gitee `main`

## 本轮目标

- [x] VirtualList 增加 `list-item` part、`list-item-class`、`list-item-style` 自定义入口，并补充案例、类型和测试。
- [x] Descriptions 基础详情重新整理标签、内容、跨列与间距，避免文字离散、视觉关系混乱。
- [x] Input 对齐 Material Text Field：实现 outlined、solo、filled、underlined 视觉，聚焦浮动标签，支持内外前后图标插槽及对应案例、测试。
- [x] 页面主滚动条移动到右侧目录外侧并使用统一的非原生视觉；目录只收集页面段落标题，不再收集 Playground 标题；缺失段落标题的相关页面已补齐。
- [x] Carousel 隔离箭头点击与拖拽手势，修复左右箭头点击无效。
- [x] Tabs 修复 Material 变体背景、铺满宽度与 start/center/end 对齐，完善可操作 Playground。
- [x] DatePicker 仅在外部值签名变化时同步草稿，消除高亮回闪；多日期固定宽度并支持横向滚动。
- [x] TimePicker 分钟点击后立即同步 active 与 aria-pressed。
- [x] Calendar 使用本地已提交范围与草稿起点，消除旧日期回闪并修复范围选择。
- [x] API 文档表格统一由 ElfUI Table 承担，并为 Table 增加 `title` / `title-variant` 标题栏样式。

## 质量门槛

- [x] 组件契约、类型、样式、测试、案例和组件 plan 同步。
- [x] 关键交互使用真实浏览器验证（Input、DatePicker、Calendar、Carousel、Tabs、Table、VirtualList）。
- [x] 相关专项测试通过（14 个测试文件、181 项测试）。
- [x] 全量测试通过（110 个测试文件、1004 项测试，beta6）。
- [x] 应用构建与组件库构建通过，macro-aware typecheck 为 0 error。
- [x] `git diff --check` 通过。
