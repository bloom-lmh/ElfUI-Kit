# InputOtp Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/InputOtp`
- Element Plus 文档：`input-otp.md`

## 第一批实现

- [x] 基础 props：`model-value`、`length`、`type`、`size`、`disabled`、`readonly`、`placeholder`、`separator`。
- [x] 基础 events：`update:modelValue`、`input`、`change`、`focus`、`blur`。
- [x] 注册到 Form 组件族并补单测。

## 后续差距

- [x] 补齐 formatter/parser、mask、独立 separator slot、`focus`/`blur` 代理和表单校验联动。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、受控值、数字模式、分隔符、只读和禁用示例。
