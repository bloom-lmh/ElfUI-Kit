# Picker、Input、Utilities、Flex 与 Parallax 修复计划

日期：2026-07-22

## 目标

- [x] TimePicker 展开面板进入顶层并正确定位，不再被后续 Playground、代码区或案例遮挡。
- [x] ColorPicker 选色后可立即清空；受控与非受控状态、展示值和 `clear` 事件保持一致。
- [x] Input 内置图标与光标按 Vuetify 的 filled、outlined、underlined 节奏对齐，并补充前置/后置外部图标案例。
- [x] Utilities Content 的指针事件预览不再文字重叠；用途说明移动到控制项下方，并随选项更新。
- [x] Utilities Display 的用途说明移动到控制项下方，并随显示类和响应式断点更新。
- [x] Flex“多行内容对齐”改成与“换行策略”统一的虚线结构示意。
- [x] 新增 Parallax 滚动视觉差组件、页面案例、API 文档、测试与导航入口。

## 验收

- [x] 为行为修复补充或更新单元测试。
- [ ] 相关定向测试、类型检查和构建通过。
- [ ] 在真实文档页面分别验证浅色/深色外观、展开层级、交互和响应式布局。
- [ ] 保存关键页面截图，确认没有遮挡、重叠、溢出或控制台错误。
