# InfiniteScroll Element Plus API 对标计划

生成时间：2026-07-05

## 第一批实现

- [x] 基础 props：`disabled`、`distance`、`immediate`、`loading`。
- [x] 基础 event：`load`。
- [x] 接入 Data 注册和单测。

## 后续差距

- [x] 2026-07-15：基于 ElfUI 全局指令运行时实现 `v-infinite-scroll`，对齐 `infinite-scroll-disabled`、`infinite-scroll-distance`、`infinite-scroll-delay`、`infinite-scroll-immediate`，并补齐更新与销毁清理；8 项组件/指令测试、生产构建和浏览器滚动冒烟均通过。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、distance、loading、load、disabled 和 immediate 示例。
- [x] 新增任意滚动容器的指令案例，真实滚动验证从 8 条加载到 12 条，控制台无错误。

## 2026-07-26 v0.0.2-beta.1 异步边界与容器策略复核

- [x] 新增 `finished` 停止条件、公开 `check()` 方法，以及内置、外部元素、选择器和 `Window` 四类滚动目标。
- [x] 统一数值高度、距离与延迟的容错处理，补齐滚动区域语义、键盘焦点、加载状态和自定义滚动条。
- [x] 加固组件和 `v-infinite-scroll` 的监听、观察器、延迟任务与卸载清理，覆盖异步加载结束后的内容填充复查。
- [x] 重写失败重试、容器策略、指令销毁三组双语案例，并补齐 Props、Events、Slots、Exposes 与 Directive API。
- [x] 通过组件与页面定向测试、完整度检查、迁移扫描、宏类型检查、应用/发布库构建和浏览器截图验证。
