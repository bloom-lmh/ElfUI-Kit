# IconProvider 实施记录

## 2026-07-26 局部图标集

- [x] 通过 injection 为子树提供 `defaultSet`、`aliases` 与 `sets`，未提供时继承父 Provider 或全局 `configureIcons()`。
- [x] 支持嵌套 Provider 局部替换默认集，同时保留父级集合与语义别名。
- [x] Provider 配置不修改进程级图标注册表，页面切换和组件卸载不会污染其他子树。
- [x] 补齐局部隔离、嵌套继承和全局注册表不变的定向测试。
