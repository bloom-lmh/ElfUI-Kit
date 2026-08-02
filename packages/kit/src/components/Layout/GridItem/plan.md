# GridItem Element Plus API 对标计划

更新时间：2026-07-15

## 对标定位

- ElfUI 组件：`Layout/GridItem`，对应 Element Plus `Col` 的子项职责。
- 支持 24 以内的 `span`、`offset`、`push`、`pull` 与 `xs / sm / md / lg / xl`。
- 采用固定 Custom Element 标签，动态 `tag` 与 ElfUI 的注册模型不兼容。
- 行级 `gutter`、`justify`、`align` 由父级 `Grid` 负责。

## 完成情况

- [x] 补齐 `span`、`offset`、`push`、`pull`。
- [x] 补齐 `xs`、`sm`、`md`、`lg`、`xl`，支持数字和 `{ span, offset, push, pull }` 对象。
- [x] 响应式值按 base → xs → sm → md → lg → xl 继承，未声明字段保持前一断点状态。
- [x] 输入统一截断并限制在 0～24；`span` 至少为 1，避免无效布局和除零。
- [x] 默认插槽完成类型声明；无组件事件和 expose 方法。
- [x] Props、类型导出、PropsTable 和独立案例同步。
- [x] 新增 offset、push、pull 和响应式断点案例，均提供 Template / Script 双视图。

## 架构说明

- Props 状态、派生断点、归一化方法、宿主绑定和模板按区块集中排列。
- 每个断点只写入宿主私有 CSS 变量；静态媒体查询负责选择生效变量，不动态注入 `<style>`。
- offset 由宿主占用总轨道、内部内容宽度与逻辑方向 margin 共同实现；push / pull 使用相对位移，不破坏 Grid 排版流。
- Shadow DOM 内部容器暴露 `part="item"`，默认插槽保持内容组合能力。

## 验收记录

- [x] 独立 `GridItem.test.ts` 6 项测试通过，覆盖基础值、边界归一化、offset、push/pull、响应式对象和动态更新。
- [x] 与 `Grid.test.ts` 联合执行共 10 项测试通过。
- [x] `pnpm build` 通过。
- [x] Playwright 真实视口验证：760px 为 span 12；1100px 为 span 4 + offset 2，总占用 span 6。
- [x] 页面截图完成，浏览器控制台 0 error。
