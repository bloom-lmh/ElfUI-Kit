# Grid Element Plus API 对标计划

## 2026-07-22 位移案例回归

- [x] 保留 `push / pull` 的相对列位移契约，将错误的相向 1 列示例改为两个等宽列完整换位，避免案例自身重叠。

更新时间：2026-07-15

## 对标定位

- ElfUI 组件：`Layout/Grid`，对应 Element Plus `Row` 的布局职责。
- 保留 ElfUI 原生 `columns`、`gap`、`auto-fit` 与 `min-column-width` 能力。
- 采用固定 Custom Element 标签，Element Plus 的动态 `tag` 不适用于 ElfUI 组件模型。
- `span`、`offset`、`push`、`pull` 与响应式断点由 `GridItem` 负责。

## 完成情况

- [x] 补齐 `gutter`，并作为 `gap` 的兼容别名与优先配置。
- [x] 补齐 `justify`、`align` 布局属性及语义化宿主反射。
- [x] 默认插槽完成类型声明；无组件事件和 expose 方法。
- [x] 被动布局组件无需键盘、禁用、清空、受控状态或表单联动。
- [x] Props、类型导出、PropsTable 和页面案例同步。
- [x] 所有案例提供 Template / Script 双视图，动态值使用 `${...}`。
- [x] 增加 `gutter / justify / align`、自定义列数和自动适应案例。

## 架构说明

- 状态与归一化逻辑集中在组件头部，宿主 CSS 变量与属性反射集中声明，`defineHtml` 保持在末尾。
- 数字间距统一转换为非负 `px`，令属性值和属性绑定具有一致结果。
- Shadow DOM 只消费语义属性和私有 CSS 变量，不依赖外部选择器穿透。

## 验收记录

- [x] `Grid.test.ts` 4 项测试通过，覆盖默认值、动态列数、gutter 优先级和对齐同步。
- [x] 与 `GridItem.test.ts` 联合执行共 10 项测试通过。
- [x] `pnpm build` 通过。
- [x] Playwright 页面冒烟通过，案例显示 9 组 Template / Script 标签，控制台 0 error。
- [x] 浏览器计算样式验证 `gutter="16"` 得到 `gap: 16px`。

## 2026-07-19 案例视觉修订

- [x] Grid 全部案例统一为低圆角虚线容器，移除渐变、卡片阴影和过大的圆角。
- [x] 浏览器逐项核验 33 个案例节点均为虚线边框、4px 圆角、无阴影和无渐变。

## 2026-07-22 布局文档统一

- [x] Grid 页面合并 Container 的页面边界用法与 Props 表，不新增子页面。
- [x] 全部案例改为统一实线、圆角、主题色和编号 1/2/3 的结构图。
- [x] 保留等分、非等分、gap、自定义列数、auto-fit、双轴对齐、偏移、响应式和组合布局能力。
- [x] 页面聚焦测试、应用构建和真实浏览器明暗主题视觉验收通过。
