# Parallax 视差滚动计划

- [x] P0 提供基础 `elf-parallax` 组件，支持图片、内容插槽、高度、缩放、位置与禁用状态。
- [x] P0 使用 `requestAnimationFrame` 同步滚动位移，并支持 `prefers-reduced-motion` 降级。
- [x] P0 补充组件单测，覆盖图片渲染、尺寸变量、滚动位移和禁用状态。
- [x] P1 接入 Data 组件注册、路由与文档页面。
- [x] P1 将稳定 host 尺寸监听迁移到 Core beta.20 `useResizeObserver`，由组件作用域统一断开；动态滚动祖先集合保留本地 adapter，并在同一 owner 中连接和清理。
- [x] P1 DOM move 后通过每个根唯一的共享 mutate controller 重新解析滚动祖先，解绑旧容器并由新容器接管更新。
- [ ] P2 后续补充更多业务化视差组合案例，例如营销封面、统计图区块和分层前景内容。
