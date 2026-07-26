# ListItem 组件计划

- [x] 支持 `title`、`subtitle`、`value`、`active`、`disabled`、`clickable` 与行数语义。
- [x] 支持 `leading`、默认内容和 `trailing` 插槽。
- [x] 派发原始 click 和语义化 select 事件。
- [x] 覆盖样式、禁用态、选择事件和声明式 List 组合测试。

## 2026-07-26 v0.0.2-beta.1 选择与布局复核

- [x] 受控 active 状态映射到原生按钮 `aria-pressed`，disabled 项退出父级 List 的键盘导航。
- [x] 动态检测 leading / trailing 插槽，空插槽不再保留多余网格列和间距。
- [x] 公开 `focusItem()` 供 List 的统一焦点策略使用，并补齐插槽、选择、禁用和焦点测试。
