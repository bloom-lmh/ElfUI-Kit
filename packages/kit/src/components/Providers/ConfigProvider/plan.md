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

## 2026-08-03 程序化滚动案例内容升级

- [x] 将「程序化滚动 · 共享滚动策略」预览从三个占位区块改为真实应用风格的项目评审面板：项目简报（负责人、截止、任务 6/8、进度 72%）、实现任务清单（已完成/进行中/待开始）与评审卡片（评论、批准操作）；滚动区域高度提升到 320px，文案全部中英文本地化。
- [x] 同步 ProviderPages 测试中两处过期断言：页面已于 2026-07-30 改用「基础预设 → 应用配置 → 显式属性」，测试仍期待旧标题导致 HEAD 即失败。

## 2026-08-04 配置优先级与显示/动效案例重做

- [x] 「配置优先级」改为交互式三层演示：三个开关分别控制基础预设（size=sm · variant=outlined）、应用配置（color=success）与显式属性（variant=contained · color=warning），目标按钮和「当前生效值」面板实时显示每一层最终胜出的属性与来源；样式移到独立 `ex1.scss`，不再依赖页面级样式。
- [x] 「显示与动效偏好」拆为两个真实效果区：显示区用 `mobileBreakpoint` 下拉在相同窗口宽度下切换双栏/单栏布局并显示断点、移动端与阈值状态；动效区并排展示 `motion: full`（400ms 平滑滑动）与 `motion: reduced`（0ms 立即到位）的圆点过渡对照，验证 ConfigProvider 通过主题过渡 token 全局控制动效。
- [x] 每个子预览组件自带 `defineStyle` 与独立样式文件，修复旧案例依赖 index.ts 样式无法进入 Shadow DOM 的问题。
- [x] 聚焦验证：ProviderPages 9/9 通过；unsupported macro 扫描 0 findings；宏感知 typecheck 591 个文件 0 宏错误、0 TypeScript 错误；Prettier、ESLint 通过；Chromium 实测三层开关切换、移动端阈值切换布局、动效对照（full 0.4s / reduced 0s）均符合预期；截图归档于 `output/playwright/config-priority-demo.png` 与 `output/playwright/config-display-motion-demo.png`。
