# ConfigProvider Plan

## Contract

- [x] Merge `blueprint`, inherited configuration, local `config`, and shortcut props with stable precedence.
- [x] Coordinate theme, locale, icons, component defaults, display, motion, scrolling, date behavior, field values, and service defaults.
- [x] Keep strategy objects such as date and locale adapters atomic during nested configuration merges.
- [x] Reflect locale, direction, breakpoint, mobile state, and motion preference on the host.
- [x] Preserve focused Providers as composable lower-level entry points.

## Documentation and verification

- [x] Publish a complete `ElfUIConfig` API table instead of documenting only the Provider wrapper props.
- [x] Demonstrate global `emptyValues` and `valueOnClear` behavior with local override precedence.
- [x] Cover nested configuration, Provider propagation, responsive state, locale adapters, and strategy replacement with focused tests.
- [ ] Add application-layout coordination after its ownership and registration protocol is stable.
- [ ] Add typed component aliases only after the framework exposes an application-scoped resolver contract.

## 2026-07-30 配置优先级说明

- [x] 将首个案例改为真实的三层合并示例：`blueprint` 提供可复用的 size/variant 基础预设，`config` 提供当前应用的 color 覆盖，组件显式属性拥有最终优先级。
- [x] 页面标题、正文、Template/Script 与 API 表用中英文解释 `blueprint -> config -> explicit props`，不再使用含义不明确的“统一入口 · 蓝图与默认值”。
- [x] Provider 页面中英文测试覆盖新标题、解释和 API 文案；Material 中文桌面截图为 `docs/screenshots/2026-07-30/config-priority-flat-desktop-material-zh.png`。
