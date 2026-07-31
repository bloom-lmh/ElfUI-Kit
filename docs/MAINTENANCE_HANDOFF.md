<!-- cspell:words Sparkline -->

# ElfUI Kit 维护交接

更新时间：2026-07-31

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

### 2026-07-30 组件编写 Skill 与仓库质量门禁

- 新建并实际调用 `C:\Users\13575\.codex\skills\elfui-kit-component-authoring`；Skill 以 beta.20 与当前 `elfui-docs` 为事实源，要求先复用 directive/composable/Common/Provider/现有组件，再决定新增实现。
- Skill 已固化文档案例规则：状态变化放入 Playground 标题行的 `slot="status"`，预览水平与垂直居中，多变体案例必须提供可实时驱动状态的 `slot="controls"` 控制台。
- Skill 已补充格式与注释边界：Prettier 负责外围 TypeScript/SCSS/Markdown 等文件；`defineHtml` / `defineStyle` 原始模板由 ElfUI Language Tools 格式化；公共契约、状态机、资源生命周期和非直观算法使用 TSDoc，不给自解释语句堆注释。Skill 重新校验结果为 `Skill is valid!`。
- 仓库新增 Prettier、ESLint、CSpell、Commitizen、Commitlint、Husky 与 lint-staged 配置；Husky `core.hooksPath` 为 `.husky/_`，pre-commit 执行 lint-staged，commit-msg 执行 Commitlint。
- ESLint 增加 ElfUI 宏模板变量识别规则，并修复原有 64 条错误；没有关闭全局未使用变量检查。Prettier 使用内容哈希棘轮，新文件或已修改旧文件必须格式化；哈希归一化 CRLF/LF，`.gitattributes` 固定文本 LF；全库严格终态仍有 1395 个未改动历史文件。
- 修正两条已落后于现行信息架构的测试：安装页为首个导航项，Utilities 与 Accessibility 归 Guide，Quality 分组不存在；未修改路由实现。

验证结果：

- `pnpm format:check` 通过；人为加入坏格式探针时按预期失败并指出文件，删除探针后恢复通过。
- `pnpm lint` 全量 0 错误；`pnpm spellcheck` 检查 1459 个文件，0 问题。
- `pnpm typecheck` 通过：1077 个源文件禁用宏扫描 0 问题，119 个宏组件 0 宏错误、0 TypeScript 错误。
- 信息架构聚焦测试 3 个文件、17 项通过；全量测试 226 个文件、1608 项通过。
- `pnpm build` 通过，949 个模块；存在 1 条既有大 chunk 警告，主 chunk 约 1.45 MB，需在性能治理中继续拆分。
- `pnpm build:lib` 通过，313 个模块，`elfui-kit.js` 约 2.03 MB。
- Commitlint 合法消息 `chore(tooling): add repository quality gates` 通过；`bad message` 按预期以 `subject-empty`、`type-empty` 拒绝。
- 本批只修改工具、测试断言和代码质量，不改变组件 DOM/视觉；截图验证不适用，未伪造截图或浏览器 0 warning/error 结论。
- 30 号总计划仍为 38 个工作包，当前 38 个均未达到完整完成定义；`OP-13` 仅部分完成。

### 2026-07-30 TimePicker EP-11 文档页面批次

- 完成 `/picker/time` 页面入口、6 个 Playground、Template/Script、运行时状态和 Props/Events/Methods API 表双语；API 表按当前类型、默认值及 Provider 行为重写。
- 状态统一放入 Playground 标题行的 `slot="status"`，增加 live region；全部示例复用共享居中舞台，没有改动 TimePicker 组件实现或复制 overlay、field、form 行为。
- 文档审计为 `495/533`：pages `106/108`、examples `322/356`、props `67/69`，TimePicker 已从缺口清单移除，剩余 38 个文件位于 Table、Upload、Tabs、DatePicker。

验证结果：

- TimePicker 聚焦诊断测试在 `--hookTimeout=30000` 下 2 个文件、25 项通过；仓库标准 10 秒 hook 门限下，全组件入口冷加载超时，未修改测试代码或放宽仓库配置。
- 全量测试为 224/229 个文件、1568 项通过、47 项因套件超时跳过；4 个 `beforeAll` 超时，另有 1 个 FormPage 测试超时。该结果明确记为未通过。
- `pnpm lint` 全量 0 错误；`pnpm typecheck` 通过，1088 个源文件禁用宏扫描 0 问题，120 个宏组件 0 宏错误、0 TypeScript 错误。
- `pnpm build` 通过，961 个模块，保留 1 条既有大 chunk 警告；`pnpm build:lib` 通过，315 个模块，`elfui-kit.js` 约 2.04 MB。
- 仓库格式门禁被 Slider、Upload、Image、Splitter 及并行新增的数据组件等改动阻断；CSpell 被该新增数据组件的 11 个文件、55 处命名阻断。TimePicker 目标目录的 Prettier、ESLint、CSpell 均通过。
- Chromium 覆盖 1440x1000 与 390x844、Material/Midnight、中英文；Enter/Escape 可打开/关闭钟面，390px 横向溢出为 `false`，最终控制台 0 warning / 0 error。
- 截图保存在 `docs/screenshots/2026-07-30/time-picker-*.png`，包括中英文、Material/Midnight、桌面/移动端和打开浮层状态。

### 2026-07-30 Image / Splitter / Badge / Upload / Slider / Sparkline 文档批次

- Image 对象适配案例已改为带控制台的 Playground，使用本地真实图片 `/logo.png`；移除左上角 fit 文本，将星号说明移到适配方式下拉框下方。
- Splitter 五个案例统一占满 Playground 中央区，水平布局左黑右白、垂直布局上黑下白，通过公开 part 去除案例边框和圆角；桌面与移动端中央区均无尺寸缺口。
- Badge 的动态值、零值与 RTL 长状态标签已缩短文字到橙色标签的间距。
- Upload 公开 `UploadSlots`、`UploadElement` 与 `dropzone` slot，新增 Vuetify file input 和 file upload 两个完整案例及页面测试。
- Slider 公开 `tickLabels` 与三个 thumb label 插槽，新增四季刻度 range 案例；Sparkline 新增完整组件、Data 导出、路由、双语动画页面、周期切换与测试。

验证结果：

- 聚焦测试本批 8 个文件、32 项通过；Slider 组件另行复跑 `15/15`，合计 47 项通过。
- `pnpm typecheck` 通过：1088 个源文件、120 个宏组件、0 宏错误、0 TypeScript 错误。
- `pnpm build` 通过，961 个模块；`pnpm build:lib` 通过，315 个模块，`elfui-kit.js` 为 `2,041.66 kB`。
- 全量 `pnpm test -- --maxWorkers=4` 未全绿：1600 项通过、14 项跳过、5 个文件因资源时限失败。失败位置为 MessageBox/FormPage/SparklinePage 的 `beforeAll` 10 秒超时，以及 SkeletonPage/TimelinePage 的测试 5 秒超时；没有把该结果记为通过。
- Chromium 覆盖桌面 Material 中文与 `375 x 844` 移动端 Midnight 英文。Sparkline 桌面 SVG 为 `660 x 220`；移动端 card 为 `259px`，chart 与 segmented 均为 `230.265px`，周期标签无重叠，最终控制台 `0 warning / 0 error`。
- 截图：`image-playground-desktop-light-zh.png`、`splitter-desktop-light-zh.png`、`upload-vuetify-showcase-desktop-light-zh.png`、`slider-season-desktop-light-zh.png`、`sparkline-desktop-light-zh.png`、`sparkline-mobile-midnight-en.png`，均位于 `docs/screenshots/2026-07-30/`。

### 2026-07-30 DatePicker EP-11 文档页面批次

- 完成 `/picker/date` 页面入口、8 个 Playground、Template/Script、运行时状态和 Props/Events/Slots/Methods API 表双语；API 表按当前 `DatePicker/types.ts` 与 `defineProps` 默认值重写。
- 所有状态都是 Playground 直接子节点 `slot="status"`，预览复用共享水平/垂直居中舞台；双面板案例提供 3 个真实 `elf-switch` 控制，派生 `singlePanel` 复用框架 `useComputed`，Custom Element 布尔配置使用显式 property binding。
- Dialog 案例继续复用 `elf-dialog`、DatePicker 与共享 overlay stack；Escape 回归从真实日期触发器发出，确认第一次只关闭 DatePicker、第二次关闭 Dialog，没有页面级浮层 workaround。
- DatePicker 面板的结构性显隐是 `<Transition>` 候选，但它与原生 Popover Top Layer 的显示/隐藏时机耦合。本批不顺带改变共享生命周期；迁移留给 `EP-02`，并要求覆盖快速切换、leave、Popover 隐藏、焦点恢复和 reduced motion。
- 文档审计为 `504/534`：pages `107/108`、examples `329/356`、props `68/70`；DatePicker 已移出缺口清单，剩余 30 个文件位于 Table、Upload、Tabs。

验证结果：

- DatePicker 组件与页面聚焦测试 2 个文件、25 项通过；单页面复跑 1 个文件、5 项通过；全量测试 229 个文件、1619 项全部通过。
- `pnpm typecheck` 通过：1089 个源文件、120 个宏组件、0 宏错误、0 TypeScript 错误。
- `pnpm build` 通过，962 个模块，保留 1 条既有大 chunk 警告；`pnpm build:lib` 通过，315 个模块，`elfui-kit.js` 为 `2,041.69 kB`。
- DatePicker 目标范围的 Prettier、ESLint、CSpell 与 `git diff --check` 通过。全库格式检查被 18 个并行文件阻断；全库 CSpell 检查 1477 个文件，在 13 个 Sparkline 相关文件中报告 72 处问题，未修改并行文件或全局词典。
- Chromium 覆盖 1440x1000 与 390x844、Material/Midnight、中英文、禁用日期浮层、双面板控制台、移动端纵向堆叠和 Dialog 嵌套；390px 横向溢出为 `false`，最终控制台 0 warning / 0 error。
- 截图保存在 `docs/screenshots/2026-07-30/date-picker-*.png`，共 8 张。

### 2026-07-30 Tabs EP-11 文档页面批次

- 按当前 `Tabs/types.ts` 与 `defineProps` 重写 Props/Events/Slots/API 双语表，并终审 `/navigation/tabs` 的 10 个案例、13 个 Playground、Template/Script 与运行时状态；没有修改 Tabs 组件契约。
- 13 个状态均为 Playground 直接子节点 `slot="status"`，预览复用共享水平/垂直居中舞台；操作台使用 5 个真实 `elf-select` 与 2 个 `elf-checkbox`，英文 Template/Script 不再混入中文。
- 图片分类案例复用框架 `<Transition>` 并补 reduced motion。数据面板与 TabPane 的结构性显隐留给 `EP-03`；拖动列表仅在存在明确移动动画契约时使用 `<TransitionGroup>`。当前原生 section/slotted Custom Element 模型不适用 `<KeepAlive>`，禁止另建手写缓存。
- 当前仓库文档审计为 `506/535`：pages `108/109`、examples `329/356`、props `69/70`。并行新增的文档页面使审计总数增加 1；Tabs 已移出缺口清单，剩余 29 个文件只位于 Table 与 Upload。

验证结果：

- Tabs 组件与页面聚焦测试 2 个文件、26 项通过；全量测试 231 个文件、1626 项全部通过。
- `pnpm typecheck` 通过：1091 个源文件、120 个宏组件、0 错误；`pnpm build` 通过 962 个模块并保留 1 条既有大 chunk 警告；`pnpm build:lib` 通过 315 个模块，`elfui-kit.js` 为 `2,041.64 kB`。
- Tabs 目标范围的 Prettier、ESLint、CSpell 与 `git diff --check` 通过；全量 ESLint 通过。全库格式检查被 19 个并行文件阻断；全库 CSpell 在 13 个 Sparkline 相关文件中报告 74 处问题，未修改并行文件或全局词典。
- Chromium 覆盖 1440x1000 与 390x844、Material/Midnight、中英文、键盘切换、Gallery 状态、操作台布尔配置和移动端溢出；英文递归 Shadow DOM 汉字扫描为空，390px 横向溢出为 `false`，最终控制台 0 warning / 0 error。
- 截图为 `docs/screenshots/2026-07-30/tabs-desktop-en-midnight.png`、`tabs-desktop-zh-material.png`、`tabs-mobile-en-midnight.png` 与 `tabs-mobile-zh-material.png`。

### 2026-07-30 网图、配置说明与案例纯色治理批次

- Image 对象适配控制台改用 Unsplash 真实网图，Template/Script 同步完整 URL；页面测试锁定 `images.unsplash.com` 来源。Material 中文下网图加载完成，自然尺寸为 `1200 x 1800`。
- ConfigProvider 首个案例改为清晰的三层优先级：`blueprint` 是可复用基础预设，`config` 覆盖当前应用配置，组件显式属性优先级最高；示例真实展示 size/variant、color 与显式 props 的合并结果。
- 清除 `src/pages` 内全部 45 处 CSS 渐变：首轮 18 处覆盖 Home、Directives、Utilities、Image、List、Carousel、Toolbar、Sticky 和布局图；并行新增的 Overview 缩略图 27 处改用纯色色块、边框、伪元素和阴影复制；Timeline 中轴改为 `var(--elf-divider)` 纯色。
- 新增 `src/pages/__tests__/no-demo-gradients.test.ts`，扫描页面 `.ts`、`.scss`、`.css`、`.html` 并禁止 linear/radial/conic gradient。组件内部具备功能语义的数值填充、加载、棋盘格和媒体遮罩渐变保留。

验证结果：

- `rg -i "gradient\\s*\\(" src/pages` 为 0 结果；聚焦测试分两组共 12 个文件、50 项通过；移动端约束与 Overview 纯色补丁后再跑 3 个文件、10 项通过；全量测试 231 个文件、1626 项全部通过。
- `pnpm typecheck` 通过：1091 个源文件、120 个宏组件、0 宏错误、0 TypeScript 错误；`pnpm build` 通过 962 个模块，仅保留既有大 chunk 警告。
- Chromium 覆盖 `1440 x 1000` 与 `390 x 844`、Material 中文；移动端 Image 图片宽 `215px`、舞台宽 `259px`，完整包含且横向溢出为 `false`；Overview 9 类缩略图均为 `background-image: none` 且部件未越界；Timeline 连接线计算样式为 `background-image: none`、`background-color: rgba(0, 0, 0, 0.08)`，最终控制台 0 warning / 0 error。
- 截图为 `docs/screenshots/2026-07-30/image-network-flat-desktop-material-zh.png`、`image-network-flat-mobile-material-zh.png`、`config-priority-flat-desktop-material-zh.png` 与 `timeline-flat-desktop-material-zh.png`。

### 2026-07-31 Upload EP-11 文档页面终审

- `/form/upload` 的页面入口、7 个旧案例、2 个 Vuetify 案例、Template/Script、运行时状态与 Props/Events/Slots/Methods API 表已完成双语终审；9 个状态位于 Playground 标题行，9 个预览复用共享水平/垂直居中舞台。
- `UploadElement` 公开 Props 与 Expose；Vuetify “浏览文件”通过 `UploadElement.select()` 复用组件公开 API，并有原生 input 恰好触发一次的回归测试。文件列表的 `<TransitionGroup>` 生命周期迁移保留给 `EP-04`，本批没有手写动画替代。
- 文档审计为 `514/535`：pages `109/109`、examples `336/356`、props `69/70`，剩余 21 个文件全部属于 Table。

验证结果：

- Upload 组件与页面聚焦测试 2 个文件、21 项通过；目标 Prettier、ESLint、CSpell（13 个文件、0 问题）与 `git diff --check` 通过。
- `pnpm build` 通过 967 个模块，保留 1 条既有大 chunk 警告。全量测试 233 个文件中 232 个通过、1638 项中 1637 项通过；唯一失败为并行 `OverviewPage/style.scss` 的渐变守卫。`pnpm typecheck` 与 `pnpm build:lib` 被并行 `OverviewCard/index.ts` 的两条宏模板类型错误阻断，未修改并行文件。
- Chromium 覆盖 1440x1000 与 390x844、Material/Midnight、中英文组合矩阵；英文递归 Shadow DOM 汉字扫描为 0，移动端 9 个 Playground、9 个舞台和 9 个状态完整，390px 横向溢出为 `false`，最终控制台 0 warning / 0 error。
- 截图为 `docs/screenshots/2026-07-31/upload-desktop-zh-material.png`、`upload-desktop-en-midnight.png` 与 `upload-mobile-en-midnight.png`；另有 Vuetify 输入与 dropzone 细节图位于 `docs/screenshots/2026-07-30/`。

### 2026-07-31 Table EP-11 文档页面终审

- `/data/table` 的入口、22 个案例、Template/Script、运行时状态与 Props/Column/Events/Slots/Methods API 表完成双语；22 个预览使用共享居中舞台，12 个动态状态位于 Playground 标题行。
- 案例通过 Table 公开 expose 和 `useTemplateRef` 组合，继续复用 `useDismissibleOverlay` 与公共虚拟窗口算法；没有查询子组件 Shadow DOM、复制指令或实现框架 workaround。行 `<TransitionGroup>` 迁移保留给 `EP-05` 的完整 keyed-row 生命周期回归。
- 文档审计达到 pages `109/109`、examples `356/356`、props `70/70`，总计 `535/535`。独立英文文档测试覆盖可见文本、Template/Script、API 默认值与描述。

验证结果：

- Table 组件与页面聚焦测试 8 个文件、90 项通过；目标 Prettier、ESLint、CSpell、`git diff --check` 与本地化审计通过。
- 应用构建通过 968 个模块并保留既有大 chunk 警告。全量测试 234 个文件中 233 个通过、1642 项中 1641 项通过，唯一失败为并行 `OverviewPage/style.scss` 的渐变守卫。
- 类型检查扫描 1098 个源文件、121 个宏组件；唯一 2 个错误均位于并行 `OverviewCard/index.ts:24`。`build:lib` 被同一前置类型检查阻断，本批没有修改这些文件。
- Chromium 覆盖 1440x1000 中文 Material、1440x1000 英文 Midnight 与 390x844 英文 Midnight；22 个 Playground、22 个居中舞台和 12 个标题状态完整，英文可见文本扫描为 0，页面横向溢出为 `false`，控制台 0 warning / 0 error。
- 截图为 `docs/screenshots/2026-07-31/table-desktop-zh-material.png`、`table-desktop-en-midnight.png` 与 `table-mobile-en-midnight.png`。
- 全新 in-app Chromium 标签页已完成最小复现和责任归类：顶层原生语言按钮可正常切换，但 Table 基础选择、自定义排序、树展开、虚拟排序及案例外层 `elf-button` 均无法通过 Playwright、真实坐标或可见节点点击获得焦点或触发状态。Vite 实际编译产物已生成正式事件监听，聚焦测试 8 个文件、90 项通过，控制台 0 warning / 0 error，因此属于当前浏览器控制层对嵌套 Shadow DOM 的交互限制，不在 Kit 中增加 workaround。
- 诊断截图为 `docs/screenshots/2026-07-31/table-shadow-dom-control-limitation.png` 与 `docs/screenshots/2026-07-31/table-virtual-control-limitation.png`。该结论只关闭“责任归类”，不代表真实用户交互已经通过；仍需换用可投递嵌套 Shadow DOM 事件的独立 Chromium 会话或人工验收。
- 责任归类后重新执行：全量测试为 233/234 个文件、1641/1642 项，唯一失败仍为并行 `OverviewPage/style.scss`；类型检查扫描 1098 个源文件、121 个宏组件，唯一 2 个错误仍在并行 `OverviewCard/index.ts:24`；应用构建通过 968 个模块，`build:lib` 被同一前置类型检查阻断。
- 移动端 Table 页面本身无重叠或页面级横向溢出；全局 AppShell 固定 Footer 的英文末尾在 390px 下被截断，属于并行样式范围，未在本批修改。

## 3. 未作的工作（将要做的）

仓库级翻译 helper 参与度已经清零。2026-07-31 Table 批次收尾时的当前仓库准确基线：

- 页面入口：109/109 已接入，0 个待处理。
- 案例：356/356 已接入，0 个待处理。
- Props/API：70/70 已接入，0 个待处理。
- 总计：535/535 已接入，0 个待处理。

“接入”只表示文件显式使用翻译 helper，不代表所有路由都通过中英文内容、交互与视觉终审。Table 的浏览器控制层责任已经确认，下一轮启用 strict 门禁并继续剩余路由终审；Table 真实交互由独立 Chromium 或人工验收补齐。

### 执行顺序

1. 启用本地化 strict 门禁，再做剩余页面的中英文、双主题和桌面/移动端终审。
2. 使用能够向嵌套 Shadow DOM 投递事件的独立 Chromium 会话或人工验收 Table 排序、选择、筛选、树展开与虚拟表格交互；不得用 DOM patch、脚本直接调用公开方法或框架 workaround 伪造通过。
3. 每批同时处理页面入口、全部案例、Props/API、Template/Script、运行时状态和页面测试，并运行聚焦测试、审计与真实浏览器英文扫描。
4. 由样式线程修复 390px AppShell 英文 Footer 截断并补截图回归。
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
- 文档审计当前为 `535/535`；该数字只代表 helper 参与度，不能外推为全部路由已经完成严格视觉和交互终审。
- Table 浏览器控制层限制已经在全新会话中确认：顶层原生按钮正常，嵌套 Shadow DOM 控件和案例 `elf-button` 均无法由当前控制通道触发；组件聚焦测试 90/90 通过且 Vite 编译产物存在正式监听。真实用户交互仍待独立 Chromium 或人工验收，不能外推为通过。
- 390px 英文模式下全局 AppShell 固定 Footer 末尾截断，交由样式范围修复并补视觉回归。
- 当前全量测试唯一失败是并行 `OverviewPage/style.scss` 的渐变守卫；类型检查与 `build:lib` 被并行 `OverviewCard/index.ts:24` 的两条宏模板类型错误阻断。
- 审计脚本目前检查 helper 参与度；浏览器可见文本、属性、源码示例与布局仍需逐页终审。
- `src/components/Common/focus-scope.ts`、`overlay-protocol.ts` 等旧根路径已经迁入 `Common/focus/` 与 `Common/overlay/`；IDE 中仍打开的旧标签会显示删除状态，后续代码必须使用新路径。
- beta.20 宏类型检查器的虚拟模板声明仍遗漏部分运行时类型/API，并可能把依赖文件诊断按行号映射到当前模板。TreeSelect 通过正常的全局自定义元素组合与显式本地类型保持组件代码干净；后续应在框架类型检查器中补齐 stub，并仅映射属于当前虚拟源文件的诊断。
- 工作树已有大量用户改动，任何目录移动都必须保留并兼容这些改动。

### 常用命令

```text
pnpm check
pnpm format:check
pnpm format:check:all
pnpm lint
pnpm spellcheck
pnpm typecheck
pnpm test -- --maxWorkers=4
pnpm build
pnpm build:lib
node C:\Users\13575\.codex\skills\elfui-kit-component-authoring\scripts\check-beta8-migration.mjs
```
