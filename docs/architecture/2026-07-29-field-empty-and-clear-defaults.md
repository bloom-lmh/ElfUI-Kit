# Field 空值与清空默认协议

日期：2026-07-29

## 优先级

```text
组件 emptyValues / valueOnClear
  -> ConfigProvider config.field
    -> 组件类型专属回退
```

- `emptyValues` 的库默认值是 `[undefined, null, ""]`。
- ConfigProvider 只负责默认值继承，不解释具体字段的值类型。
- `valueOnClear` 在 Provider 中保持 `unknown | (() => unknown)`；Select、Cascader、Picker 和 InputNumber 在各自边界归一化。
- 未配置 Provider 时，Select、日期和颜色继续回退到 `""`，多选/范围继续回退到空数组，InputNumber 继续回退到 `null`。
- 组件显式 prop 始终覆盖 Provider，包括函数形式。

## 采用组件

- Select
- Cascader
- DatePicker
- TimePicker
- ColorPicker
- InputNumber

Autocomplete 和 Input 当前没有 `valueOnClear` 公开契约，不为对齐名称伪造新 API。
