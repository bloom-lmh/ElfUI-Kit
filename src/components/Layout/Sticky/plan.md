# Sticky / Affix Element Plus API 对标计划

## 2026-07-19 目标容器回归

- [x] 验证 Teleport 节点在目标滚动容器顶部保持吸附，并受目标边界约束
- [x] 同时监听目标滚动容器及其外层可滚动祖先，避免文档主视口滚动时 Teleport 停留在示例外部。
- [x] 单元测试覆盖外层滚动后的上下边界和卸载监听清理；真实浏览器断言目标与 Teleport 同步移动且始终被目标矩形包含。

更新时间：2026-07-15

## 对标定位

- ElfUI 组件：`Layout/Sticky`，对标 Element Plus `Affix`。
- 2026-07-15 复核官方 API：`offset`、`position`、`target`、`z-index`、`teleported`、`append-to`、`change`、`scroll`、`update`、`updateRoot`。
- 保留原有 `top`、`bottom` 和 `disabled` 作为 ElfUI 向后兼容与扩展能力。

## 完成情况

- [x] 补齐 `offset` 和 `position="top | bottom"`，并保留 top / bottom 旧写法。
- [x] 补齐 `target`，支持在当前 Shadow Root 和 document 中解析 CSS 选择器。
- [x] 补齐 `teleported` 与 `append-to`，支持选择器或 HTMLElement 目标。
- [x] Teleport 使用 `projectLightDom` 移动原始节点，保留事件监听、组件状态和表单能力。
- [x] 补齐 `scroll`，事件详情为 `{ scrollTop, fixed }`；`change` 仅在 fixed 状态变化时触发。
- [x] 暴露 `update()` 与 `updateRoot()`。
- [x] 默认插槽、Props、事件、Expose 类型和组件导出同步。
- [x] 被动布局组件无需键盘交互、清空态、受控值或表单校验；disabled 回到普通文档流。
- [x] 示例全部提供 Template / Script 双视图，动态绑定使用 `${...}`。
- [x] 新增 target、teleported、append-to、scroll 综合案例。

## 架构说明

- 状态、派生值、查询方法、布局更新、监听器、宿主绑定、生命周期和模板分区集中。
- 非 Teleport 模式使用浏览器原生 `position: sticky`；Teleport 模式保留宿主占位，并按真实几何信息定位投影内容。
- 目标容器边界会限制 Teleport 内容，超出有效范围时隐藏；容器滚动、窗口滚动和 resize 均触发布局更新。
- 数字和数字字符串偏移统一转换为非负 px；CSS 长度字符串保持原样。

## 验收记录

- [x] `Sticky.test.ts` 7 项测试通过：兼容属性、position/offset、change/scroll、滚动容器、target、Expose、Teleport 投影。
- [x] `pnpm build` 通过。
- [x] Playwright 页面冒烟通过，4 个案例均显示 Template / Script，控制台 0 error。
- [x] 浏览器实际滚动验证：scrollTop 140、fixed true、Light DOM 位于 append-to、占位高度 48px。
- [x] 视觉截图：`output/playwright/sticky-upgrade.png`。

## 2026-08-01 Disabled 案例视觉升级

- [x] 将单一说明条改为项目摘要、统计指标和动态列表组成的真实业务场景。
- [x] 保留 disabled 回到普通文档流的核心行为，并通过容器滚动直观展示卡片不会吸附。
- [x] 使用纯色 Material 表面与暗色 token，移动端隐藏低优先级信息；页面测试 2 项通过。
