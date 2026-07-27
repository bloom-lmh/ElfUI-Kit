# 共享字段主题、InputNumber 与 Playground 回归

## 问题范围

- [x] Input 描边外观的内部前置图标与输入行垂直对齐，聚焦标签位于真实边框缺口内。
- [x] InputTag、Textarea、Select、Cascader 复用统一字段表面主题，支持 `filled`、`outlined`、`underlined`、`solo`、`solo-filled`、`solo-inverted`。
- [x] 上述字段组件统一浮动标签、聚焦线、错误、禁用、暗色、自定义背景和减少动画状态。
- [x] InputNumber 使用同一字段表面与真实 `fieldset/legend` 描边，修复标签与边框重叠。
- [x] InputNumber 增加 `default / comfortable / compact` 密度，并保持 controls、stacked、split、readonly、disabled 与 ARIA 语义。
- [x] Playground 浮层不再被控制台裁切；按钮式单选/复选在控制台中保持单行并允许横向滚动。
- [x] Playground 折叠按钮改为菜单图标；先执行控制台抽屉退场，再让案例区居中过渡。
- [x] Playground 折叠前后工作区高度不变，避免案例区域突然跳高。

## 实现约束

- [x] 公共视觉变量与六种表面收敛到 `src/styles/_field-surface.scss`，各组件保留自身交互结构。
- [x] 描边标签使用真实 `fieldset/legend` 形成缺口，不用背景色遮挡边框。
- [x] 标签与同名 placeholder 去重；有值或聚焦时再显示 placeholder。
- [x] Web Component 属性、事件、表单关联和 Shadow DOM 边界保持不变。

## 验收

- [x] Input、InputNumber、InputTag、Textarea、Select、Cascader、Playground 定向测试通过（136 项）。
- [x] 浏览器验证 Input 前置图标、InputNumber 描边、InputTag、Textarea、Select、Cascader 与 Playground 展开/折叠状态。
- [x] Playground 展开和折叠工作区实测均为 320px 高。
- [x] 浏览器控制台无错误和警告。
- [x] 全量测试、应用构建、组件库构建及差异检查通过。

## 对标参考

- Vuetify Text Field：`https://vuetifyjs.com/en/components/text-fields/#usage`
- Vuetify Number Input：`https://vuetifyjs.com/en/components/number-inputs/#usage`
- Vuetify VNumberInput 源码：`packages/vuetify/src/components/VNumberInput/VNumberInput.tsx`
