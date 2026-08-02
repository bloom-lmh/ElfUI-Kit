# InputTag Element Plus API 对标计划

## 2026-07-19 字段表面

- [x] 接入统一 FieldVariant，并以 outlined 作为标签输入默认外观
- [x] 保持标签关闭操作和多行换行语义，案例不退化为普通文本输入框
- [x] 输入区与标签共用自动换行容器；中间项删除使用稳定 key，360px 下无横向溢出

## 2026-07-22 共享字段主题

- [x] 与 Input 共用六种字段表面、真实描边缺口、浮动标签和自定义背景变量。
- [x] 标签换行、删除、清空和输入交互不因统一主题发生回归。

## 本轮记录

- [x] 2026-07-16 标签渲染复用 `elf-tag`，统一 type/effect/size/round/close 视觉与事件语义，并保留拖拽排序和受控数组行为。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/InputTag`
- Element Plus 文档：`input-tag.md`

## 第一批实现

- [x] 基础 props：`model-value`、`placeholder`、`disabled`、`readonly`、`clearable`、`max`、`size`。
- [x] 基础 events：`update:modelValue`、`change`、`input`、`add-tag`、`remove-tag`、`clear`。
- [x] 注册到 Form 组件族并补单测。

## 后续差距

- [x] 补齐 trigger、tag-type、tag-effect、draggable、validate-event、suffix/prefix slot。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、受控数组、clearable、max、size、只读和禁用示例。

## 2026-07-22 状态案例回归

- [x] 无 label 时也保留真实字段轮廓；数量上限、只读与禁用示例补齐标签和输入框。
- [x] 收紧空输入区的弹性基准，保证标签与输入行在字段内垂直居中且仍能自动换行。
- [x] 校准 Tag 宿主与内部标签文字的垂直对齐，并完成真实浏览器截图回归。
