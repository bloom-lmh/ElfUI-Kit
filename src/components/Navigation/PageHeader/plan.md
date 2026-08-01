# PageHeader Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Navigation/PageHeader`
- Element Plus 文档：`page-header.md`

## 第一批实现

- [x] 基础 props：`title`、`content`、`icon`。
- [x] 基础 event：`back`。
- [x] 基础 slots：`icon`、`title`、`content`、`extra`。

## 后续差距

- [x] 对齐 breadcrumb slot、默认图标策略和导航示例。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、back 事件和 icon/title/content/extra 插槽示例。

## 本轮记录

- [x] 2026-07-11 Navigation 第一阶段：补 `breadcrumb` slot、默认图标策略复核、breadcrumb 示例和 Props/Events/Slots 表，新增 slot 单测。
- [x] 2026-07-15 验收：7 项组件测试通过；浏览器验证 2 个 PageHeader 案例、2 个 Script 视图和 `back` 事件状态，控制台无错误。
- [x] 2026-07-31 Hero 扩展：在保持标准返回页头兼容的基础上，新增 `hero` 模式、`plain/card/banner` 结构、起始/居中对齐、默认/主色/深色色调，以及 eyebrow、tag、description、meta、visual 插槽。
- [x] 2026-07-31 案例与验收：新增数据洞察、团队空间、发布中心、设计系统、安全中心 5 张业务页头卡片，使用独立标题、标签、描述和 MDI 图标；15 项聚焦测试通过，生产构建转换 1105 个模块，桌面及 390px 视口无横向溢出。
- [x] 2026-07-31 参考图复核：按 `banner / icon card / primary banner / centered banner / dark banner` 五种结构逐项对齐，仅第 2 张保留前导图标；操作型卡片统一使用星标 28、复制和设置，居中卡片标签换行且几何中心偏差为 0px。
- [x] 2026-07-31 文档页试用：页面顶部改用主色横幅呈现“页头 / PageHeader”，API 标题采用 PropsTable 同款宽度公式；浏览器测得标题与表格左边缘偏差为 0px。
