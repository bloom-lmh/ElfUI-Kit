# 2026-07-22 Grid / Sticky / Tabs / Parallax / PopConfirm 细节修复

- [x] Playground 增加可选刻度尺；刻度紧贴标题栏下边框、朝下延伸，并区分长短刻度。
- [x] Grid 全部结构案例启用 Playground 刻度尺，移除案例内部重复刻度，栅格块统一为单色。
- [x] Sticky 的 Teleport 可见层限制在 target 的水平和垂直边界内。
- [x] Tabs 消除标签导航与内容面板之间的空隙。
- [x] Parallax 监听文档页面的实际滚动容器及外层滚动祖先，嵌套滚动时持续更新视差。
- [x] PopConfirm 显式覆盖原生 Popover 的 overflow，消除面板滚动条。
- [x] 完成针对性单元测试与真实浏览器滚动验证。
