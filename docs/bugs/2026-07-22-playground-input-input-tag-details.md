# Playground、Input 与 InputTag 细节回归

## 问题与验收标准

- [x] Playground 在自身宽度不足时切换为上下布局，不再让右侧控制台挤压预览区或越出边界。
- [x] 所有 Playground 控制台中的 Select、Input、InputNumber、Textarea、Autocomplete、Cascader 统一使用 `filled` 外观和 `comfortable` 密度；案例显式标记 `data-playground-variant` / `data-playground-density` 时允许覆盖默认值。
- [x] 控制台 CheckboxGroup 使用单列垂直布局，选项不横向挤压、不产生内部横向滚动条。
- [x] Input 的 outlined 浮动标签在聚焦或有值时垂直居中穿过描边开口，不贴在描边上方。
- [x] InputTag 标签宿主、标签文字和关闭按钮在字段内垂直居中；自动换行、删除和窄屏布局保持可用。

## 验证

- [x] Playground、Input、InputTag 定向测试通过（55 项）。
- [x] 浏览器截图覆盖宽屏控制台、窄宽控制台、Input outlined 聚焦态和 InputTag 标签布局。
- [x] 浏览器控制台无新增错误或警告。
