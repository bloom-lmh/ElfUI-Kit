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
- `@elfui/core`、`@elfui/compiler`、`@elfui/vite-plugin` 已统一到 `0.1.0-beta.20`。
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

### 2026-07-29 统一服务默认值与 MessageBox

- ConfigProvider 新增类型安全的 `services` 作用域配置；Message、Notification、Loading、MessageBox 分别通过 `useMessage()`、`useNotification()`、`useLoading()`、`useMessageBox()` 读取最近 Provider，调用参数优先于 Provider 默认值。
- Provider 只保存默认策略，各服务继续独立拥有实例、计时器、队列、滚动锁和清理生命周期，没有新增进程级 Provider 单例。
- 新增 MessageBox 的 alert、confirm、prompt、异步 `beforeClose`、输入校验、关闭原因区分、可信 Node 内容、挂载目标、主题 token、Promise 与 callback 契约。
- MessageBox 复用 modal overlay controller、focus scope、overlay stack 和滚动锁；新增 `data-autofocus` 作为命令式初始焦点标记，避免原生 `autofocus` 与 focus controller 重复竞争。
- 新增 `/feedback/message-box`、四个完整双语案例、API 表和 ConfigProvider 服务行为章节；文档审计因此扩展到 487 个目标文件。

验证结果：

- 服务与 MessageBox 聚焦测试 7 个文件、47 项通过；全量测试 179 个文件、1409 项通过。
- `pnpm typecheck` 通过：960 个源码文件旧宏扫描 0 问题，111 个宏组件 0 宏错误、0 TypeScript 错误。
- `pnpm build` 通过，872 个模块完成生产构建；`pnpm build:lib` 通过，283 个模块完成库构建和类型产物生成。
- 中文 Alert、英文 Prompt、输入校验、合法值回写、初始焦点、Alert Escape 策略均通过真实 Chromium 验收；最终会话 0 warning / 0 error。
- 截图：
  - `output/playwright/message-box-page-zh-beta20.png`
  - `output/playwright/message-box-alert-zh-beta20.png`
  - `output/playwright/message-box-prompt-en-beta20.png`

### 2026-07-29 TreeSelect 组合组件

- 新增 `elf-tree-select`，以 Tree collection、勾选/键盘/懒加载/虚拟窗口为数据内核，复用字段表面、FormItem 状态、ConfigProvider 清空值、锚定浮层和 dismissible overlay；没有复制第二套树选择算法。
- 完成单选、多选与联动/严格勾选、折叠标签、搜索和自定义匹配、懒加载、10,000 节点虚拟化、表单校验、禁用态、自定义字段、teleport、定位和公开方法。
- 新增 `/form/tree-select`、五组完整双语案例、Template/Script、Props/Events/Slots/Methods 和全局 `HTMLElementTagNameMap` 类型。
- 真实浏览器发现并修复“已聚焦触发器切换到 Tree 节点时，`focusout` 早于 `click` 关闭面板”的竞态；现在延迟到下一任务确认组合焦点边界，节点选择和焦点恢复均正常。

验证结果：

- TreeSelect、Tree、页面和路由聚焦测试共 5 个文件、49 项通过。
- 全量测试 183 个文件、1433 项通过。
- `pnpm typecheck` 通过：973 个源码文件旧宏扫描 0 问题，112 个宏组件 0 宏错误、0 TypeScript 错误。
- `pnpm build` 通过，883 个模块完成生产构建；`pnpm build:lib` 通过，286 个模块完成库构建和类型产物生成。
- Chromium 验证单选、搜索、懒加载、虚拟化和英文页面；10,000 节点场景实际渲染 12 个节点，英文主内容递归扫描 `han: []`，控制台 0 warning / 0 error。
- 截图：
  - `output/playwright/tree-select-virtual-zh-beta20.png`
  - `output/playwright/tree-select-basic-en-beta20.png`

## 3. 未作的工作（将要做的）

仓库级中英文覆盖仍未完成。准确基线：

- 页面入口：47/86 已接入，39 个待处理。
- 案例：182/337 已接入，155 个待处理。
- Props/API：30/64 已接入，34 个待处理。
- 总计：259/487 已接入，228 个待处理。

“接入”只表示文件显式使用翻译 helper，不代表已经通过中英文内容终审。Providers、Message、MessageBox、Notification、Dialog、Drawer 和 Loading 批次已完成，后续按 Feedback 剩余 3 页、Form、Data、Picker/Navigation、Layout/Guide/Utilities 的整页批次推进；每页必须同时处理入口、全部案例、Props/API、Template/Script、运行时状态、测试和真实浏览器扫描。

### 执行顺序

1. 按整页原子批次补齐剩余 228 个文件的中英文；下一批继续 Feedback 剩余 3 页。
2. 每批同时处理页面入口、全部案例、Props/API、Template/Script、运行时状态和页面测试。
3. 每批运行聚焦测试、`pnpm docs:locale-audit` 和真实浏览器英文可见文本扫描。
4. 审计清零后启用 strict 门禁，再做 85 个页面的中英文、双主题和桌面/移动端终审。
5. 继续按总计划推进 DateTimePicker、TimeSelect、metadata、单组件入口、resolver 和真实 tree-shaking 验证。
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
- 全站语言审计当前还有 228 个文件未接入，不能把已验收路由的严格扫描结果外推为全站完成。
- 审计脚本目前检查 helper 参与度；浏览器可见文本、属性、源码示例与布局仍需逐页终审。
- `src/components/Common/focus-scope.ts`、`overlay-protocol.ts` 等旧根路径已经迁入 `Common/focus/` 与 `Common/overlay/`；IDE 中仍打开的旧标签会显示删除状态，后续代码必须使用新路径。
- beta.20 宏类型检查器的虚拟模板声明仍遗漏部分运行时类型/API，并可能把依赖文件诊断按行号映射到当前模板。TreeSelect 通过正常的全局自定义元素组合与显式本地类型保持组件代码干净；后续应在框架类型检查器中补齐 stub，并仅映射属于当前虚拟源文件的诊断。
- 工作树已有大量用户改动，任何目录移动都必须保留并兼容这些改动。

### 常用命令

```text
pnpm typecheck
pnpm test -- --maxWorkers=4
pnpm build
pnpm build:lib
node C:\Users\13575\.codex\skills\elfui-kit-component-authoring\scripts\check-beta8-migration.mjs
```
