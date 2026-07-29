# ElfUI Kit 维护交接

更新时间：2026-07-29

本文件是持续更新的维护交接记录。每轮工作开始时先读取，完成一个阶段后立即更新，避免依赖对话上下文。

## 1. 目标

1. 对齐 Element Plus 的公开组件契约与交互语义。
2. 对齐 Vuetify 的跨组件能力、Provider 与设计系统边界。
3. 优化组件封装、顶层架构、测试与真实浏览器截图验收。
4. 框架问题只建立最小复现并上报，不在组件中写时序或 DOM workaround。
5. 持续推进 `docs/plans/2026-07-29_elfui-v0.0.2-beta.1-remaining-work-and-architecture-plan.md`。

### 仓库基线

- Kit 版本：`0.0.2-beta.1`。
- `@elfui/core`、`@elfui/compiler`、`@elfui/vite-plugin` 已统一到 `0.1.0-beta.18`。
- `@elfui/router` 当前为 `0.1.0-beta.10`。
- `typecheck` 同时执行 unsupported macro 扫描和 macro-aware TypeScript 检查。
- 工作树包含多批尚未提交的维护改动。不得回退不属于当前任务的文件。

## 2. 已经做的工作

### 2026-07-29 TableV2 层级展开

- 新增 `expand-column-key`、受控 `expanded-row-keys`、非受控 `default-expanded-row-keys` 和 `indent-size`。
- 新增 `expanded-rows-change`、`row-expand`。
- Tree 纯投影提升到 `src/components/Data/table-tree-model.ts`，经典 Table 保留 selection adapter。
- TableV2 使用专用虚拟树投影，内层 Table 不再二次进入经典树模式。
- 展开控件具备本地化 label、`aria-expanded`、Enter/Space 和 ArrowLeft/ArrowRight。
- 新增中英文文档案例、API 表、组件测试和页面测试。
- beta.18 已修复旧的 `useComputed` 同事务旧值和 `useScrollLock` 并发 owner 问题；两者保留回归测试。

验证结果：

- beta.8 迁移扫描：953 个源码文件，0 问题。
- 宏检查：939 个源码文件、110 个宏组件，0 错误。
- 聚焦测试：71 项通过。
- 全量测试：173 个文件、1368 项通过；本机需使用 `--maxWorkers=4` 避免全组件入口并行导入超过默认 10 秒 hook timeout。
- `pnpm build`、`pnpm build:lib` 通过。
- Chromium：Material/Midnight、中文/英文、桌面/移动、鼠标/键盘、ARIA 和有界窗口通过，0 warning / 0 error。

### 2026-07-29 VirtualTable、VirtualList 与 Common 反馈批次

- TableV2 的案例、API 和页面测试已从 Table 拆到独立 `/data/virtual-table`；公开标签继续使用 `elf-table-v2`。
- 固定数据和正文通过公开 `scroll` part 合并边框与圆角；固定行显式应用动态 `row-height`，不再出现预留高度空带。
- 有固定数据时表头只在顶部固定表格中渲染；正文滚到中段后表头和固定汇总仍可见。
- VirtualTable 三个 Playground title 与 DocsToc 完全一致。
- AppShell 在菜单映射边界按 locale 提取单语标签；中文不再显示 `Guide 指南`、`VirtualList 虚拟列表` 等双语并列。
- VirtualList 动态高度路径使用独立瞬时滚动层，同步跨区换窗但不修改声明式 keyed DOM。
- 动态测量改用 border-box 高度；普通锚点使用真实可见起点，底部测量保持 bottom pin。
- Chromium 验证：动态跨区四次始终 24 行且无空内容；240 条和追加后的 270 条均能到达 `distance: 0`，控制台 0 warning / 0 error。
- Common 根目录基础文件已迁入 `overlay/` 和 `focus/`，旧路径检索为 0。
- 最终验证：beta 迁移扫描通过；942 个源文件旧宏扫描 0 问题；110 个宏组件 0 宏错误、0 TypeScript 错误；174 个测试文件、1369 项测试通过；`pnpm build` 与 `pnpm build:lib` 通过。
- 截图：
  - `output/playwright/virtual-table-fixed-data-zh.png`
  - `output/playwright/virtual-table-fixed-header-scrolled-zh.png`
  - `output/playwright/virtual-list-dynamic-bottom-zh.png`

### 2026-07-29 VirtualTable、Grid/Flex 与语言审计反馈批次

- VirtualTable 固定层与正文统一使用稳定滚动条槽；固定层保留透明纵向滚动条宽度，Windows 原生滚动条下 fixed/body `clientWidth`、`offsetWidth` 和三列边界一致。
- 虚拟模式 sticky 责任提升到独立 `thead`；“5,000 行服务指标”滚动 `220px` 后表头 top 保持不变。
- “固定数据 · 动态行高 · 状态插槽”在十个 `scrollTop` 位置下 fixed bottom 与正文 viewport top 完全相等，间隙始终为 `0px`。
- Grid 基础案例改为 12 个连续大块蓝色色阶，组合案例改为 3 个等宽大块；Flex 案例同步采用大块蓝色布局。
- 390px Midnight 中文模式已复核 Grid/Flex：Grid 隐藏窄列中的 `span 1`，保留 1–12 编号，文本不重叠。
- VirtualTable、Grid、Flex 的页面、案例、运行时状态与源码示例完成中英文切换；英文模式递归扫描 open Shadow DOM 后，三条路由除语言切换命令“中文”外无汉字。
- 新增 `scripts/audit-docs-locale.mjs`、`pnpm docs:locale-audit` 与 `docs/baselines/2026-07-29-docs-locale-coverage.md`。
- Alert 已完成入口、3 个案例、运行时状态、Template 源码和 Props/Events/Slots 双语化。
- ConfigProvider 已完成入口、4 个案例、两个内部预览、Template/Script 和 API 双语化；Provider 页面测试新增中英文双路径。

聚焦验证：

- VirtualTable/TableV2/Grid 聚焦测试通过，共 8 项；Provider 页面聚焦测试 6 项通过。
- `pnpm typecheck` 通过：942 个源文件旧宏扫描 0 问题，110 个宏组件 0 宏错误、0 TypeScript 错误。
- beta 迁移扫描通过：959 个源码文件，0 问题。
- 全量测试通过：174 个测试文件、1370 项测试。
- `pnpm build`、`pnpm build:lib` 通过；Alert/ConfigProvider 文档批次后再次运行 `pnpm build` 通过。
- 五条严格路由在英文模式下均为 `han: []`，Playwright CLI 会话控制台 0 warning / 0 error。
- 截图：
  - `output/playwright/virtual-table-sticky-header-scrolled-zh.png`
  - `output/playwright/virtual-table-pinned-aligned-zh.png`
  - `output/playwright/grid-blue-blocks-zh.png`
  - `output/playwright/flex-blue-blocks-zh.png`
  - `output/playwright/grid-blue-blocks-mobile-midnight-zh.png`
  - `output/playwright/flex-blue-blocks-mobile-midnight-zh.png`

### 2026-07-29 Provider 文档国际化收尾

- DefaultsProvider、LocaleProvider、ThemeProvider 已完成页面入口、全部案例、运行时状态、Template/Script 和 API 表双语化。
- LocaleProvider 英文页面默认使用英文案例状态；嵌套作用域在中文文档中展示中文子作用域，在英文文档中展示德语子作用域，保留跨 locale 演示且不污染英文扫描。
- ThemeProvider API 表已按真实契约补充 `system`、命名主题和 `themes`，未新增组件 API。
- Defaults/Locale/Theme 的章节标题与 Playground 可见标题已统一，DocsToc 与可访问名称一致。
- beta.18 升级后必须重启 Vite；升级前启动的旧进程会保留陈旧 Runtime 预构建缓存并产生错误的 `defineExpose focus/blur` 警告。重启后警告消失，组件源码无需 workaround，也未发现新的框架问题。

验证结果：

- `ProviderPages.test.ts` 9/9 通过。
- `pnpm build` 通过，855 个模块完成生产构建。
- `/providers/defaults`、`/providers/locale`、`/providers/theme` 英文模式递归扫描 open Shadow DOM 均为 `han: []`；唯一允许项为全局语言切换按钮“中文”。
- 独立 beta.18 Playwright CLI 会话累计 0 warning / 0 error。
- 截图：
  - `output/playwright/providers-defaults-en-beta18.png`
  - `output/playwright/providers-locale-en-beta18.png`
  - `output/playwright/providers-theme-en-beta18.png`

### 2026-07-29 Message / Notification 文档与脱离 Provider 的服务本地化

- Message、Notification 已完成页面入口、8 个案例、运行时服务状态、Template/Script 和 API 表双语化；Message API 补齐真实公开的 `themeTokens`。
- 原案例中混入 Template 的 JavaScript 已拆回可运行的 Template 与 Script，章节标题、Playground 可见标题和 DocsToc 保持一致。
- 浏览器交互发现 body 级 Message 的关闭按钮在英文文档中仍使用中文。根因是服务直接创建 host 并挂到 `document.body`，不在 LocaleProvider 子树内；这是 Kit 默认 locale 架构缺口，不是 beta.18 框架问题。
- `DEFAULT_LOCALE_CONTEXT` 现在在无显式 Provider 时跟随 `document.documentElement.lang` / `dir`；显式 LocaleProvider 仍然优先。修复位于默认 locale 契约层，没有页面 workaround、全局可变 registry 或手写 Provider/Teleport 桥。
- 新增默认 context、脱离 Provider 的 Message / Notification 关闭标签回归测试，并把服务本地化验收写入两个组件的 `plan.md`。

验证结果：

- LocaleProvider、Message、Notification 组件及 Message/Notification 页面聚焦测试共 4 个文件、33 项通过。
- `pnpm typecheck` 通过：942 个源文件旧宏扫描 0 问题，110 个宏组件 0 宏错误、0 TypeScript 错误；beta 迁移扫描 959 个源码文件、0 问题。
- `pnpm build` 通过，855 个模块完成生产构建。
- `/feedback/message`、`/feedback/notification` 的静态页面和已触发服务状态在英文模式递归扫描 open Shadow DOM 均为 `han: []`；唯一允许项为全局语言切换按钮“中文”。
- 独立 beta.18 Playwright CLI 会话控制台 0 warning / 0 error。
- 截图：
  - `output/playwright/message-service-en-beta18.png`
  - `output/playwright/notification-four-corners-en-beta18.png`
  - `output/playwright/notification-rich-content-en-beta18.png`

### 2026-07-29 beta.20 升级与 Dialog / Drawer 文档国际化

- `@elfui/core`、`@elfui/compiler`、`@elfui/vite-plugin` 已从 beta.18 统一升级到 `0.1.0-beta.20`，锁文件中的 compiler-template、runtime、reactivity、shared 同步解析到 beta.20；Router 保持兼容的 beta.10。
- beta.20 迁移扫描、宏 typecheck、Provider/Message/Notification 回归和生产构建通过，未发现需要 Kit workaround 的框架问题。
- Dialog、Drawer 已完成页面入口、9 个案例、运行时状态、Template/Script 和 API 表双语化；两个已接入翻译的 Dialog 高级案例也补齐了复制源码的英文内容。
- API 表按真实组件类型补回 `open` 生命周期事件，并完整说明焦点、关闭、resize 事件与公开方法，未新增组件 API。

验证结果：

- Dialog、Drawer 组件及页面聚焦测试共 4 个文件、44 项通过；首次 beta.20 冷启动时两个页面套件并行导入超过 10 秒，缓存完成后同命令稳定通过，测试体没有失败。
- `pnpm typecheck` 通过：942 个源文件旧宏扫描 0 问题，110 个宏组件 0 宏错误、0 TypeScript 错误；beta 迁移扫描 959 个源码文件、0 问题。
- `pnpm build` 通过，859 个模块完成生产构建。
- `/feedback/dialog`、`/feedback/drawer` 的静态英文页面及打开的 Dialog / 可调整 Drawer 状态递归扫描 open Shadow DOM 均为 `han: []`；Drawer 键盘调整从 420px 正确更新到 430px。
- beta.20 Playwright CLI 会话控制台 0 warning / 0 error。
- 截图：
  - `output/playwright/dialog-focus-en-beta20.png`
  - `output/playwright/drawer-resizable-en-beta20.png`

## 3. 未作的工作（将要做的）

仓库级中英文覆盖仍未完成。准确基线：

- 页面入口：45/85 已接入，40 个待处理。
- 案例：169/332 已接入，163 个待处理。
- Props/API：28/63 已接入，35 个待处理。
- 总计：242/480 已接入，238 个待处理。

“接入”只表示文件显式使用翻译 helper，不代表已经通过中英文内容终审。Providers、Message、Notification、Dialog 和 Drawer 批次已完成，后续按 Feedback 剩余 4 页、Form、Data、Picker/Navigation、Layout/Guide/Utilities 的整页批次推进；每页必须同时处理入口、全部案例、Props/API、Template/Script、运行时状态、测试和真实浏览器扫描。

### 执行顺序

1. 按整页原子批次补齐剩余 238 个文件的中英文；下一批继续 Feedback 剩余 4 页。
2. 每批同时处理页面入口、全部案例、Props/API、Template/Script、运行时状态和页面测试。
3. 每批运行聚焦测试、`pnpm docs:locale-audit` 和真实浏览器英文可见文本扫描。
4. 审计清零后启用 strict 门禁，再做 85 个页面的中英文、双主题和桌面/移动端终审。
5. 继续按总计划推进 TreeSelect、MessageBox、DateTimePicker、TimeSelect、metadata、单组件入口、resolver 和真实 tree-shaking 验证。
6. 每个批次结束立即更新总计划、语言基线和本交接。

### 已确认决策

- 独立栏目命名使用 `VirtualTable`，文档路由与 Table 分离。
- 不立即把公开组件标签从 `elf-table-v2` 改为 `elf-virtual-table`，避免破坏现有 API；后续如需公开 alias，必须补类型、注册、迁移策略和 consumer 测试。
- Playwright CLI 有用，继续用于真实滚动、拖动滚动条、键盘、主题、语言和截图验证。
- 截图保存在 `output/playwright/`；`.playwright-cli/` 仅为临时快照，不纳入交付。

## 4. 当前问题

- TableV2 完整性脚本仍按 `TableV2Page` 命名查找，不能识别实际的 `VirtualTablePage`，因此会给出 demo page false negative；实际页面和页面测试存在。
- TableV2 性能基线旧中位数来自拆分前的 `/data/table`；脚本已改为 `/data/virtual-table`，后续需重新跑 5 次中位数再替换旧页面级计时。
- 当前 authoring skill 的框架参考文件名仍为 `framework-beta15.md`，内容版本说明落后于仓库 beta.20；实际依赖以 `package.json` 为准。
- 全站语言审计当前还有 238 个文件未接入，不能把十二条路由的严格扫描结果外推为全站完成。
- 审计脚本目前检查 helper 参与度；浏览器可见文本、属性、源码示例与布局仍需逐页终审。
- `src/components/Common/focus-scope.ts`、`overlay-protocol.ts` 等旧根路径已经迁入 `Common/focus/` 与 `Common/overlay/`；IDE 中仍打开的旧标签会显示删除状态，后续代码必须使用新路径。
- 工作树已有大量用户改动，任何目录移动都必须保留并兼容这些改动。

### 常用命令

```text
pnpm typecheck
pnpm test -- --maxWorkers=4
pnpm build
pnpm build:lib
node C:\Users\13575\.codex\skills\elfui-kit-component-authoring\scripts\check-beta8-migration.mjs
```
