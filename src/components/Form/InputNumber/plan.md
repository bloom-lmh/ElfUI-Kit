# InputNumber Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/InputNumber`
- Element Plus 文档：`input-number.md`

## 第一批实现

- [x] 基础 props：`model-value`、`min`、`max`、`step`、`step-strictly`、`precision`、`disabled`、`readonly`、`controls`、`controls-position`、`size`、`placeholder`、`name`。
- [x] 基础 events：`update:modelValue`、`change`、`input`、`focus`、`blur`。
- [x] 注册到 Form 组件族并补单测。

## 后续差距

- [x] 2026-07-07 补独立案例页：覆盖受控值、`min/max/step`、`precision`、`step-strictly`、`controls-position`、禁用/只读/无控制按钮。
- [x] 补齐 `value-on-clear`、`validate-event`、原生 ARIA 细节、`focus`/`blur` 代理和 FormItem 校验联动。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。

## 2026-07-22 Vuetify 字段对齐

- [x] 复用 Input 六种表面和真实 `fieldset/legend` 缺口，修复标签与边框重叠。
- [x] 增加 `default / comfortable / compact` 密度并统一输入行、按钮和分隔线位置。
- [x] 保持默认、stacked、split、无按钮、反向、禁用和只读模式，补齐 ARIA 与 placeholder 去重测试。

## 2026-07-22 控制器边界

- [x] 堆叠增减按钮按字段高度等分并限制溢出，所有控制器完全位于字段描边内部。
- [x] 描边模式为 fieldset 标签缺口预留 5px 顶部行，默认、分离与堆叠按钮均不越界。
