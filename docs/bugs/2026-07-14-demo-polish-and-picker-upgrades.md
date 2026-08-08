# 2026-07-14 案例体验与 Picker 交互升级

本轮目标是消除文档案例中的布局、可读性和交互缺陷，同时升级日期与时间选择器。案例层修复不得偷偷改变组件公共行为；组件层升级必须同步实现、样式、测试和案例。

## P0：功能与布局缺陷

- [x] 01 Form：四个表单案例使用 Card 承载，验证 Card 标题、内容和操作区组合能力。
- [x] 02 Upload：所有上传触发区在演示区域内水平居中，文件列表仍保持可读宽度。
- [x] 03 InfiniteScroll：项目动态信息流在标题状态区展示“已加载 / 总条数”，加载完成后数量准确。
- [x] 04 Carousel：修复标签卡片不可见、垂直/键盘案例高度塌陷、基础案例非 100% 宽度；所有轮播面板使用统一圆角。
- [x] 05 Menu：案例容器增加可选边框能力；修复搜索、分组、徽章和折叠案例的 toggle；重新设计 toggle 位置；修复三级菜单折叠后 header 文字裁切。
- [x] 06 Tabs：卡片与可编辑标签在标签溢出时横向滚动，新增标签不再撑高面板。
- [x] 07 Steps：受控步骤标题、描述与连接线不重叠，窄屏下仍可读。
- [x] 08 Calendar：暗色主题完整覆盖年月选择界面，并移除突兀的原生下拉式年份选择。

## P1：视觉质量与案例完整度

- [x] 09 Loading：增加局部、卡片、列表、按钮、全屏等案例；统一骨架层级、遮罩、文案和动效，避免演示单薄。
- [x] 10 Table：固定列案例使用紧凑、主题化滚动条，保持横向滚动的可发现性。
- [x] 11 Skeleton：Dashboard 骨架固定为 2 × 2 卡片网格，窄屏降为单列。
- [x] 12 Timeline：重新设计基础视觉、时间信息层级、卡片事件和状态节点，覆盖暗色主题与窄屏。
- [x] 13 Tree：权限树使用主题化滚动条；“管理员面板”和“清空”操作移动到案例标题状态行。

## P1：Picker 交互升级

- [x] 14 TimePicker：参考 Vuetify 的“数字表头 + 圆形时钟盘 + 小时/分钟分步选择”，保留键盘、范围、清空和受控模型能力。
- [x] 15 DatePicker：参考 Vuetify 的“年月层级切换 + 日历网格 + 明确选中态”，减少机械列表感并保持范围、禁用日期和快捷项能力。

## Vuetify 调研结论

- DatePicker 应将“当前年月”作为可点击的层级入口，由日期视图切换到月份/年份视图，而不是依赖常驻原生 `select`。
- TimePicker 应提供空间化的钟面选择：表头明确当前小时和分钟，钟面负责粗粒度选择，键盘和文本输入负责精确调整。
- Picker 面板应是独立、紧凑、圆角的 surface；导航、当前值和主要操作具有稳定位置，深浅主题共用语义变量。
- 仅借鉴信息架构与交互语义，不复制 Vuetify 实现代码。

官方参考：

- https://vuetifyjs.com/en/components/date-pickers/
- https://vuetifyjs.com/en/components/time-pickers/
- https://github.com/vuetifyjs/vuetify/tree/master/packages/vuetify/src/components/VDatePicker
- https://github.com/vuetifyjs/vuetify/tree/master/packages/vuetify/src/labs/VTimePicker

## 验收

- [x] 相关组件定向 Vitest 通过，新交互包含键盘、受控值、禁用态和暗色主题所需断言（93 tests）。
- [x] `pnpm build` 通过，真实浏览器控制台 0 error / 0 warning。
- [x] 使用真实浏览器逐项检查桌面宽度、窄内容区和暗色主题。
- [x] 当时的组件总计划与涉及组件计划同步完成状态；旧计划现由 Git 保存。

## 验收补充

- Picker 与文档案例中的复杂值统一使用 `.prop` 绑定，避免字符串 Ref 在 Custom Element 边界丢失回显。
- Playwright 截图保存在 `output/playwright/`，包含 Calendar、DatePicker、TimePicker、Carousel、Timeline、Steps、Form、Upload 与 Loading 的暗色主题检查结果。
