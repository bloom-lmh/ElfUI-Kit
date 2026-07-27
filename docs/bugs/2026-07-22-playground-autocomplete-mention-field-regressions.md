# Playground 与表单字段细节回归

## 目标

- [x] Scrollbar 所有案例只展示纵向滚动条，不产生横向滚动条。
- [x] Playground 控制台永久可见，移除折叠入口与折叠状态；兼容属性保留但不再改变布局。
- [x] Playground 内的单选和复选使用普通控件外观，不再强制按钮变体。
- [x] 审计全部带 `controls` slot 的案例，综合操作台必须是页面第一个案例。
- [x] InputTag “数量上限、自动换行与状态”恢复完整输入框，标签和输入行垂直居中。
- [x] Autocomplete 默认使用填充表面，接入统一字段主题，修复标签、输入、清空按钮与下拉面板样式。
- [x] Autocomplete 首个案例升级为包含外观、触发与清空设置的综合操作台。
- [x] Mention 接入统一字段主题，补齐标签、背景与六种表面，修复文本域和候选面板样式。
- [x] Mention 首个案例升级为包含外观、位置与 whole-word 设置的综合操作台。
- [x] InputNumber 默认和堆叠控制按钮完全限制在字段描边内部。

## 质量与验证

- [x] 补充 Playground、Autocomplete、Mention、InputTag、InputNumber、Scrollbar 定向测试。
- [x] 浏览器截图验证 Autocomplete、Mention、InputTag、InputNumber、Scrollbar 和综合 Playground。
- [x] 浏览器控制台无错误和警告。
- [x] 全量测试、宏类型检查、应用构建与组件库构建通过。
