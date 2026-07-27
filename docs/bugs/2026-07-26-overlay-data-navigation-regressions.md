# 2026-07-26 浮层、数据与导航组件回归

本轮针对 beta.10 运行时及交互回归进行修复，并在 beta.11 下完成复验。组件实现统一使用当前 `defineHtml`、`defineStyle`、`onMounted` / `onUnmounted`、`useComputed` / `useEffect` API。

## 修复清单

- [x] Cascader：beta.11 下宿主对象 / 数组赋值告警已消失，展开浮层无控制台错误。
- [x] Drawer：拖动调整尺寸后在遮罩层释放鼠标时不得关闭。
- [x] PopConfirm：页面滚动时面板应持续锚定触发器。
- [x] Pagination：点击当前可见页码时保持页码窗口及按钮位置稳定。
- [x] Table：beta.11 下数据恢复显示，并修复树形数据直接选择子级。
- [x] VirtualList：快速拖动原生滚动条时不闪白。
- [x] Anchor：水平滚动按钮必须实际移动导航条。
- [x] Dropdown：beta.11 下宿主对象 / 数组赋值告警已消失，展开浮层无控制台错误。
- [x] Tabs：新增完整前后控制插槽、相对切换行为、数据驱动拖动排序及对应事件。
- [x] ColorPicker：修复文字与颜色选择器重叠。

## 验证要求

- [x] 为每个行为缺陷补定向单元测试。
- [x] 运行受影响组件测试。
- [x] 对 Drawer、PopConfirm、Pagination、VirtualList、Anchor、Tabs、ColorPicker 做浏览器交互检查。

## 验证记录

- 定向测试按组件批次通过：Drawer / Pagination / Anchor 与页面测试共 50 项；PopConfirm / Table / VirtualList / Tabs / ColorPicker / Cascader / Dropdown 与页面测试共 175 项；Tabs 完整控制插槽补丁后的 21 项测试全部通过。
- Tabs 浏览器验证：自定义“下一个”控制可切换激活项，标准 `DragEvent` 将顺序从“概览、任务”调整为“任务、概览”。
- Cascader、Dropdown、Tabs、ColorPicker 浏览器控制台均为 0 error / 0 warning。
- 截图保存在 `output/playwright/`：
  - `drawer-resize-mask-release.png`
  - `pop-confirm-scroll-anchor.png`
  - `pagination-stable-window.png`
  - `virtual-list-fast-jump.png`
  - `anchor-horizontal-scroll-controls.png`
  - `tabs-drag-custom-controls.png`
  - `color-picker-field-layout.png`
  - `cascader-beta11-overlay.png`
  - `dropdown-beta11-overlay.png`
