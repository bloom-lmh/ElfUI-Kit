# 2026-07-22 Input、Tabs 与 ColorPicker 细节回归

## 修复清单

- [x] Input 带浮动标签时，内部前置/后置图标与编辑行垂直居中。
- [x] Input 提升输入文字与插入光标的可读高度，保持图标和光标间距。
- [x] Tabs 使用单一激活指示器，在标签切换时平滑滑动到新标签。
- [x] Tabs 同时覆盖水平、垂直、伸展和滚动标签布局。
- [x] ColorPicker 所有案例在 Playground 内容区水平居中。
- [x] 补充定向测试、组件完整性检查、构建和真实浏览器截图验证。

## 验收标准

1. Input 图标中心与带标签输入行的光标中心误差不超过 1px。
2. Tabs 从 Tab 1 切换到 Tab 2 时复用同一个指示器节点，并通过 transform/尺寸过渡移动。
3. ColorPicker 案例容器中心与 Playground 预览区中心一致。
