# 2026-07-16 Vuetify 体验对齐与回归修复计划

本轮以“先统一底层契约，再逐组件修复”为原则。参考 Vuetify 的公开 API 与交互语义，不复制其实现代码；ElfUI 继续遵守 Custom Element、Shadow DOM、表单关联和按需依赖约束。

## P0：基础设施与输入体系

- [x] 01 Icon：支持 `defaultSet`、多图标集合和语义别名；提供 SVG path / CSS class 适配器，核心包不绑定 MDI、Font Awesome 等第三方依赖。
- [x] 02 Text：修复语义排版案例中容量单位 `GB` 的基线对齐。
- [x] 03 Input：修复命令式聚焦案例；动作按钮移动到 Playground 标题状态行。
- [x] 04 InputTag：标签视觉复用 Tag 的语义、圆角、颜色与关闭按钮规范。
- [x] 05 Switch：修复 action icon 遮挡；增加 default / inset / material / square、loading、disabled 和 icon 案例。
- [x] 06 Cascader：修复多选标签与视口浮层中的键盘路径状态污染，保证上下移动仅更新焦点、左右移动仍可切列。
- [x] 07 Form：重做卡片、内容宽度和字段对齐，补登录、资料、动态字段、校验与提交状态案例。
- [x] 08 Slider：步进轨道显示节点；支持不等距自定义 marks（例如 0 / 30 / 100 ℃）及自定义节点内容。
- [x] 27 Field Surface：建立 Vuetify 风格的 filled / outlined 输入外观、浮动标签、底部激活线、暗色和错误/禁用状态；已覆盖 Input、Textarea、Select、Autocomplete、Cascader、DatePicker、TimePicker、ColorPicker。

## P0：关键功能回归

- [x] 09 Loading：四种动效形成可辨识差异；全屏 service 提供退出操作并验证焦点与清理。
- [x] 11 Tour：打开第一步即建立焦点与键盘监听，不依赖首次点击“下一步”。
- [x] 13 Image：修复 fit / fixed-size / lazy 案例，补完整 Props、Events、Slots 表格。
- [x] 14 Transfer：修复容器宽度塌缩和全部失效案例，覆盖移动、筛选、禁用与受控值。
- [x] 15 Pagination：页码窗口保持稳定，点击边界页时省略号变化不造成按钮位移回弹。
- [x] 20 Dropdown：浮层使用锚点定位，外部滚动关闭、内部滚动保留，消除随页面滚动的 sticky 错觉。
- [x] 22 Tabs：修复组合式标签面板的新建、关闭和当前项回退逻辑。
- [x] 23 ColorPicker：预设色按钮使用实际色值渲染，并兼容浅色/暗色对比边框。
- [x] 24 DatePicker：日期选中态为正圆；点击外部关闭；范围重新选择时立即清理旧预览并明确新起点。
- [x] 25 TimePicker：点击外部关闭面板，并保证面板内交互不误关闭。
- [x] 26 Calendar：选中态为正圆；范围重选语义与 DatePicker 一致。

## P1：视觉、导航与数据体验

- [x] 10 Message：按 snackbar 信息层级重新设计容器、图标、操作、关闭、堆叠和暗色样式。
- [x] 12 Statistic：增加可配置起始值、时长、缓动和 reduced-motion 兼容的数值增长。
- [x] 16 VirtualList / List：新增通用虚拟滚动列表；Table 大数据渲染接入同一窗口化内核并补性能基准案例。
- [x] 17 Tree：案例统一使用 Card 承载，保持标题操作与树内容层级。
- [x] 18 Anchor：horizontal 案例在窄视口提供可见、可操作的水平滚动。
- [x] 19 Breadcrumb：修复组合式 BreadcrumbItem 的布局、分隔符和最近导航状态。
- [x] 21 Menu：theme + custom colors 案例的 toggle 使用主题语义变量，修复暗色白底。

## 实施顺序

1. Icon registry 与 Field Surface tokens。
2. Text / Input / InputTag / Switch / Cascader / Slider / Form。
3. Overlay 公共能力，再处理 Dropdown、Picker、Tour。
4. Loading / Message / Statistic / Image / Transfer / Pagination。
5. VirtualList 与 Table 性能接入。
6. Tree / Anchor / Breadcrumb / Menu / Tabs 文档体验收尾。

## 单组件完成定义

- 组件实现、类型、样式和当时的组件计划同步完成，状态集中、派生状态集中、方法按交互域集中；旧计划现由 Git 保存。
- 每个新增行为具有针对性 Vitest；修复必须有能在修复前失败的回归断言。
- 每个能力具有独立 `ex*.ts` 案例，动态状态和操作放在 Playground 标题状态行。
- Props / Events / Slots / Exposes 表格同步，不用仅靠案例暗示 API。
- 定向测试、相关页面测试、`pnpm build` 通过；布局或交互改动完成真实浏览器浅色/暗色检查。
- 不触碰无关工作区修改；每个可独立验收的组件单独提交。

## 官方参考

- https://vuetifyjs.com/en/features/icon-fonts/
- https://vuetifyjs.com/en/components/text-fields/
- https://vuetifyjs.com/en/components/switches/
- https://vuetifyjs.com/en/components/snackbars/
