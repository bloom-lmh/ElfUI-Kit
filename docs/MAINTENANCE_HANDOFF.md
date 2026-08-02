<!-- cspell:words CodeCard Shiki Sparkline VIEWBOX -->

# ElfUI Kit 维护交接

更新时间：2026-08-01

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

### 2026-08-02 CodeCard 图标与表面治理、安装页重排

- CodeCard 新增公开 `icons` prop，支持 file、lineNumbers、format、copy、copied、expand、collapse 的 SVG path 覆盖，默认保持 MDI；圆角统一到 `--elf-radius-md`，边框提升为 border/strong 混合，阴影移除；light 主题渲染暗色卡片，dark 主题渲染亮色卡片，Shiki 配色同步反选。
- 安装页改为 Installation 定位：环境要求、创建项目、安装、注册、使用、验证、下一步；脚手架、包管理器和可选入口改为 `elf-code-card` 代码组，创建项目说明改为 `-` 列表并增加“已有项目”tab，说明改用 `elf-quote`；公开入口表格与代码卡片同宽，“使用组件”双卡片水平对齐；章节间距收敛，创建项目标题下保留间距，“验证安装”与“下一步”卡片同排且下一步卡片只保留单个推进链接；DocsHero 标题与章节标题共用强调条，文档段落行距统一为 `--docs-line-height: 1.7`。
- 侧栏切换按钮改用 Backburger/Forwardburger 配套图标；Menu 搜索框升级为 40px 圆角字段，加入放大镜与聚焦光环。DocsHero 并发改动中的相对导入已修正，titleIcon/titleIconColor 使用 property 绑定。
- 浏览器支持内容已嵌入安装页环境要求，独立 Browser support 路由、导航、图标映射与页面已移除；安装与升级指南共用 guide-page 标题样式，h3 小标题增加强调短线。
- 后续反馈已撤销 h3 强调短线；环境要求统一行距，支持矩阵与平台能力继续使用 `elf-table`，报告兼容问题引用保持全宽。
- 安装页 h3 改为带主色底的小节标签并统一上下边距；“编写自己的 Macro 组件？”与“报告兼容问题”引用卡片宽度对齐代码卡片。
- 引用卡片宽度规则已修正为匹配 `.guide-content` 内任意层级的 `elf-quote`，两张卡片现在真正全宽。
- 安装页裸段落统一用紧凑 `elf-quote` 包裹，包含环境要求、安装、注册、使用、验证等章节导语。
- 安装页 quote 按语义区分颜色：一般说明用 info，跨浏览器注意、验证提醒和宏组件版本提醒用 warning。
- “下一步”卡片下方新增“推荐阅读”卡片，使用 secondary 主色，右列高度与验证清单列更均衡。
- 新增公开 `elf-heading` 标题组件，位于 `Basic/Heading`，支持 h1-h6 语义层级与 display、hero、page、section、subsection、card、overline、eyebrow、stat、label、caption 共 11 种 Material 变体；新增 `/basic/heading` 双语文档页与 3 个 Playground 案例。
- 聚焦验证：Heading 组件与 HeadingPage、路由与信息架构共 4 个文件、16 项通过；kit/website typecheck 0 宏错误、0 TypeScript 错误；docs locale `545/545`；website build 1124 模块、kit build 436 模块通过。
- Heading 新增 eyebrow、index、accent、chip 组合能力，文档新增“风格化标题组合”，展示 10 种编号、强调条、眉题与小标题美学组合。
- IconPage 新增图标画廊案例，补充 18 个常用图标、尺寸阶梯、语义色和第三方原始 SVG 插槽展示；聚焦验证 Heading/HeadingPage/IconPage 共 3 个文件、10 项通过；docs locale `547/547`；website build 1126 模块、kit build 436 模块通过。
- npm 发布前审计：`@elfui/kit` 为唯一非 private 包，tarball 仅含 LICENSE、README、lib-dist 与 package.json，website 文件数为 0；`@elfui/core@0.1.0-beta.20`、`@elfui/router@0.1.0-beta.10` 等依赖版本均可在 npm 解析；lib-dist 无 `@elfui/kit-src` 或本地路径泄漏。修复 Image 测试中依赖 SCSS 单行格式的脆弱断言，完整 Kit 测试 138 个文件、1424 项通过；包 README 已补充安装与使用说明。
- 首次 `npm publish` 被 `prepublishOnly` 的 `test:kit` 超时阻断，根脚本已固定 `--maxWorkers=4`，避免全组件入口并行导入超过 10 秒 hook 上限。
- 升级指南版本记录改为受控 `elf-collapse` 手风琴，移除 beta.7 迁移表，保留推荐门禁顺序；FAQ 中指向浏览器支持页的引用已清理，FAQ 重设计待讨论后实施。
- 文档本地化审计由 `540/540` 变为 `539/539`，website build 1115 个模块通过。
- 聚焦验证：CodeCard model、CodeCard、CodeCardPage、InstallationPage、information-architecture、DocsHero 共 6 个文件、26 项通过；Kit 与 website typecheck 均为 0 宏错误、0 TypeScript 错误；Prettier、ESLint、CSpell、docs locale `540/540`、website build 1116 模块、kit build 434 模块通过。
- 浏览器截图验收未在本轮执行。

### 2026-08-01 组件文档视觉与交互统一批次

- Select、Cascader、TreeSelect 与 Dropdown 的基础案例统一提供 Input 六种字段外观控制；前三者复用已有共享字段表面，Dropdown 补齐相同公开契约、分裂按钮结构、自定义背景和 Material 菜单表面。
- 新增内部 DocsHero 并迁移 92 个公开组件页，统一 PageHeader banner、分类、标签、描述与版本信息；DocsHero、Playground、PropsTable 使用 `max(85%, min(100%, 900px))` 同一响应式宽度规则。
- PropsTable 会把前置 API 标题提升到自身容器，解决标题左贴页面、表格居中的错位；语言切换和卸载恢复均有回归覆盖。
- Playground 暗色模式重新区分标题、预览、控制台和源码层级；Video 增加五段音量图标、百分比、弹层音量计与进度变量；AppBar 引入 4px 方向容差和 collapse release hysteresis，消除 prominent 高度变化导致的阈值闪动。
- Dropdown、AppBar 与 Sticky 示例升级为真实 Material 业务场景；Sticky disabled 不再是一条孤立说明条。
- 已通过 TreeSelect 18 项、Common 25 项、Dropdown 文档页 1 项、Sticky 页面 2 项及 Dropdown/Video/AppBar/Sticky 其余聚焦回归。路由套件 19 项中 18 项通过，剩余 1 项为 Loading 离场过渡节点仍在 DOM 的时序断言，需作为独立既有问题继续核验。
- 文档本地化审计 `540/540`、页面纯色案例守卫、目标 `git diff --check` 和应用构建通过；构建转换 1111 个模块，仅保留既有的大 chunk 警告。
- `pnpm typecheck` 的 unsupported macro 扫描为 0 findings；后续仅被既有 OverviewCard、MessageBox 与 CodeCard 诊断阻断，本批文件未进入诊断清单。

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

### 2026-07-31 文档本地化 strict 门禁

- `pnpm docs:locale-audit` 现在默认阻塞任何 helper 参与缺口；仅显式 `node scripts/audit-docs-locale.mjs --report-only` 作为非阻塞诊断。现有 package 脚本无需变更，因此未触碰并行工具链线程的 `package.json`。
- 新增 CLI 集成测试，使用隔离临时文档树覆盖默认失败、报告模式和满覆盖，共 1 个文件、3 项通过。
- CI 与 Release 均在构建或发布前执行默认 strict 命令；当前仓库通过 pages `109/109`、examples `356/356`、props `70/70`，总计 `535/535`。
- 目标 Prettier、ESLint、CSpell（7 个文件、0 问题）与 `git diff --check` 通过。全量测试为 234/235 个文件、1644/1645 项通过，唯一失败仍是并行 `OverviewPage/style.scss` 的渐变守卫。
- 类型检查扫描 1098 个源码文件与 121 个宏组件，0 个 TypeScript 错误；唯一 2 个宏错误仍位于并行 `OverviewCard/index.ts:24`。应用构建通过 968 个模块，`build:lib` 被同一前置类型检查阻断，本批未修改这些并行文件。
- helper strict 不替代逐路由浏览器终审；可见文本、属性、Template/Script、交互、主题、响应式布局、截图和控制台仍必须逐批记录。

### 2026-07-31 OP-01 能力所有权与复用清单

- `docs/architecture/2026-07-31-capability-ownership-and-reuse-inventory.md` 是当前共享能力权威入口。每个新任务先查该表，再决定复用 Core、directive、composable、Common controller、Provider 或现有组件。
- 清单覆盖 121 个非测试宏组件、9 个 composable 源文件、11 类公开 directive 能力（8 个 owner 文件）、8 个 Common controller、15 个 Provider 源文件和 beta.20 Core authoring API，并记录每项的 owner、消费者与禁止重复边界。
- Application Layout 没有临时 owner；ConfigProvider display context 只是 Platform/Display/SSR 的部分 owner，完整缺口仍归 `VU-02` / `VU-03`。beta.15 Core composable 矩阵已标为历史快照；Core beta.20 `useScrollLock` 是目标锁 owner，但 Loading service 的遗留计数器仍待 `OP-03` / `OP-07` 迁移。
- `scripts/capability-ownership.test.ts` 动态防止组件、共享源文件与 Core API 漏登记，聚焦测试 1 个文件、3 项通过。目标 Prettier、ESLint、CSpell（6 个文件、0 问题）和 `git diff --check` 通过；本批不改变 DOM 或视觉，浏览器截图不适用。
- 全量测试为 235/236 个文件、1647/1648 项通过，唯一失败仍是并行 `OverviewPage/style.scss` 的渐变守卫。类型检查扫描 1098 个源码文件与 121 个宏组件，0 个 TypeScript 错误；唯一 2 个宏错误仍位于并行 `OverviewCard/index.ts:24`。应用构建通过 968 个模块，`build:lib` 被同一前置类型检查阻断，本批未修改这些并行文件。
- OP-01 已完成。38 个总工作包现在为 1 个完成、37 个未完成；下一顶层工作包为 OP-02，之后是 EP-01 与 VU-01。

### 2026-07-31 OP-02 分层设计与边界测试（验收待门禁）

- `docs/architecture/2026-07-31-layering-and-state-ownership.md` 已覆盖 Overlay、Field/Form、Collection、Virtual Window、Date、Upload、Layout、Services 的当前 owner、目标依赖方向、状态/资源所有权、模式准入和迁移台账；没有把 Upload 拆分、Application Layout 或 Loading scroll lock 缺口写成已实现。
- `scripts/architecture-boundaries.test.ts` 防止页面反向依赖、选定基础层循环、pure/Common owner 上行依赖、Provider service 资源越权和新增 body lock 副本。新测试 1 个文件、5 项通过；与 OP-01 测试合跑为 2 个文件、8 项通过。目标 Prettier、ESLint、CSpell 与 `git diff --check` 通过。
- 仓库 ESLint 全量通过，本地化 strict 审计为 `535/535`。全量测试为 236/237 个文件、1654/1655 项通过，唯一失败是并行 `OverviewPage/style.scss`；类型检查为 0 个 TypeScript 错误、并行 `OverviewCard/index.ts:24` 的 2 个宏错误；应用构建通过 968 个模块，`build:lib` 被相同宏错误阻断。
- 仓库格式棘轮另被 17 个并行修改文件阻断；仓库 CSpell 被并行 Sparkline 的 11 个文件、62 处未登记词阻断。本批没有修改或回退这些文件。
- 本批不改变 DOM、ARIA、样式或视觉，浏览器截图不适用。按共同完成门禁，OP-02 暂不勾选；总进度仍为 1/38 完成、37 个未完成。

### 2026-07-31 VU-01 Vuetify 能力矩阵（验收待门禁）

- 新增 `docs/architecture/2026-07-31-vuetify-capability-matrix.md`，固定 Vuetify `4.1.7` authority，覆盖 Defaults、Theme、Locale、Icons、Display、Layout、Platform、Date、GoTo、Overlay、Services、Directives、Aliases、Tokens、SSR 共 15 类能力。
- Vuetify 事实来自 immutable `v4.1.7` 源码：`framework.ts` 的插件选项与注入 owner、Theme/Locale/Icons/Display/Layout/Date/GoTo composables、Overlay `stack.ts`、8 类官方 directives、`ssrBoot.ts` 与 `hydration.ts`。Kit owner 对应当前 DefaultsProvider、ThemeProvider、LocaleProvider、IconProvider、ConfigProvider、date adapter、GoTo、Common overlay、service defaults、directives 与 token stylesheet。
- 矩阵明确 `Layout`、完整 `Platform`、component `Aliases` 和统一 `SSR` owner 为 `missing`，Vuetify 没有跨组件 service registry 为 `not applicable`；Tokens/Display/Overlay 等现有能力标为 `equivalent` 并指向 `VU-04`、`VU-03`、`OP-07` 后续闭环。不得为提升对齐率增加空 API。
- 新增 `scripts/vuetify-capability-matrix.test.ts`：1 个文件、4 项通过；目标 Prettier、ESLint、CSpell 与 `git diff --check` 通过。该批只改架构文档和静态测试，不改变 DOM、ARIA、样式或视觉，浏览器截图不适用。
- 仓库 ESLint 与本地化 strict 审计 `535/535` 通过。全量测试为 234/238 个文件通过、1654/1661 项通过、4 项跳过；Tree、Table locale、Progress 三个失败文件以单 worker 复跑为 3 个文件、10 项通过，但全量结果仍有并行 `OverviewPage/style.scss` 渐变守卫等失败，因此不记录为通过。
- 类型检查扫描 1098 个源文件、121 个宏组件，0 个 TypeScript 错误；2 个宏错误均位于并行 `OverviewCard/index.ts:24`。应用构建通过 969 个模块并保留大 chunk 警告，`build:lib` 被相同前置宏错误阻断。格式棘轮被 20 个并行文件阻断；CSpell 被 Sparkline 11 个并行文件的 62 处词阻断。本批没有修改或回退这些文件。
- 按共同门禁 VU-01 暂不勾选。当前总进度仍为 `1/38`；该批只新增架构文档和静态测试，不改变 DOM、ARIA、样式或视觉，浏览器截图不适用。

### 2026-07-31 EP-01 Element Plus 公开契约矩阵（验收待门禁）

- 新增 `docs/architecture/2026-07-31-element-plus-contract-matrix.md`，以 Element Plus `2.14.3` 官方文档、版本化发布产物与 Kit 当前公开类型/实现为 authority，覆盖 Form、DatePicker、TimePicker、Tabs、Upload、Table、Cascader、Tree、Menu、Select 和 Scoped Slots 共 11 个组件族。
- 矩阵记录默认值与受控优先级、事件 payload、Form/键盘/ARIA 责任、Kit owner、差异状态和后续工作包。Cascader `change` payload 与 beta.20 scoped-slot 协议明确为 `missing`；Vue Router `routerResult` 为 `not applicable`，没有添加空兼容 API。
- `scripts/element-plus-contract-matrix.test.ts` 聚焦测试 1 个文件、4 项通过；目标 Prettier、ESLint、CSpell 均通过，Transfer、Tree、Segmented、Calendar 的精确 `2.14.3` 发布产物链接均返回 HTTP 200。该批不改变运行时 DOM、ARIA、样式或视觉，真实 Chromium 截图不适用。
- 当前仓库 ESLint 与本地化 strict 审计 `535/535` 通过；全量测试为 238/239 个文件、1666/1667 项通过，唯一失败是并行 `OverviewPage/style.scss` 渐变守卫。类型检查为 0 个 TypeScript 错误、并行 `OverviewCard/index.ts:24` 的 2 个宏错误；应用构建通过 969 个模块，`build:lib` 被同一前置错误阻断。
- 格式棘轮被 24 个并行修改文件阻断，`format:check:all` 报告 1286 个历史或当前文件；CSpell 被并行 Sparkline 的 11 个文件、62 处词阻断。本批没有修改或回退这些文件。EP-01 暂不勾选，总进度仍为 `1/38`。

### 2026-07-31 Image 案例外框修正

- 根据浏览器标注移除对象适配案例 `elf-image` 宿主的外框边线；保留控制台舞台外框，不改变 Image 组件公共 API。
- Image 页面聚焦测试 1 个文件、5 项通过；`git diff --check` 通过。
- Chromium 复核 `/data/image`、`1048 x 856`、Midnight 英文，图片正常加载，控制台 0 warning / 0 error。
- 截图：`docs/screenshots/2026-07-31/image-no-frame-comment.png`。

### 2026-07-31 路由懒加载反馈与 List 图标

- AppShell 通过 Router `beforeEach` / `afterEach` / `onError` 统一管理导航加载态；懒模块解析期间使用 `elf-progress` 显示顶部蓝色不确定进度条，并用 `elf-loading` 在内容区显示环形加载，不增加最短展示计时器。
- 路由聚焦测试与 List 页面测试合跑为 2 个文件、15 项通过；目标 ESLint 与 `git diff --check` 通过，应用构建通过 969 个模块。类型检查仍只被既有 `OverviewCard/index.ts:24` 两条宏模板错误阻断。
- List 受控选择案例改用 MDI IconProvider，4 个图标均渲染真实 SVG path，旧 `◇` 字符已移除；案例 Template / Script 同步展示第三方图标配置。
- Chromium 复核加载开始时顶部进度与内容区遮罩同时存在，完成后同时移除；1440 x 900 List 与 390 x 844 Empty 页面无横向溢出，控制台 0 warning / 0 error。
- 截图：`docs/screenshots/2026-07-31/route-loading-layout-desktop.png`、`docs/screenshots/2026-07-31/route-loading-layout-mobile.png`。
- 后续修复 `elf-loading` 包裹导致案例页滚动失效的问题：通过公开 `part="loading"` 约束内部高度，让 `.docs-scroll` 独立承担垂直滚动；虚拟表格桌面实测 `scrollTop=520`，移动端 `scrollTop=402`，控制台 0 warning / 0 error。
- 截图：`docs/screenshots/2026-07-31/virtual-table-scroll-desktop.png`、`docs/screenshots/2026-07-31/virtual-table-scroll-mobile.png`。

### 2026-07-31 OP-03 框架 API 收敛首批（验收待交互与门禁）

- 新增框架 API 采用矩阵；Loading 声明式与命令式实例统一由 Core beta.20 `useScrollLock` 管理 body 锁，service 不再维护 `bodyLockCount` 或直接写 overflow。稳定 document 监听迁移到 Core `useEventListener`，动态事务和深 Shadow DOM 焦点保留现有 adapter 并记录原因。
- 架构边界测试现在要求低层 body overflow 写入与 Loading 专用锁计数器均为 0；分层、复用清单和 Vuetify service 矩阵已同步删除旧迁移缺口。行为聚焦回归 9 个文件、115 项通过；架构修正后 3 个文件、19 项通过；目标 ESLint、Prettier、CSpell 与 `git diff --check` 通过。
- Chromium 静态矩阵覆盖 `/feedback/loading` 的 1440x1000 Material 中文和 390x844 Midnight 英文：无页面级横向溢出，控制台 `0 warning / 0 error`。截图为 `docs/screenshots/2026-07-31/op03-loading-desktop-material-zh.png` 与 `op03-loading-mobile-midnight-en.png`。
- 当前控制通道无法向嵌套 Shadow DOM 的命令式服务按钮投递用户事件；宿主/原生按钮点击、真实坐标与 Enter 均未触发。未直接调用 API 伪造通过，服务遮罩、滚动锁、退出和焦点恢复仍待独立 Chromium 或人工验收。
- 全库 ESLint 通过，本地化 strict 为 `535/535`，应用构建通过 970 个模块并保留大 chunk 警告；全量测试为 239/240 个文件、1672/1673 项通过，唯一失败为并行 Overview 渐变守卫。类型检查为 0 个 TypeScript 错误、并行 OverviewCard 2 个宏错误，`build:lib` 被同一前置错误阻断。
- 格式棘轮被 22 个并行文件阻断，全量 Prettier 报告 1257 个历史或当前文件；CSpell 被 Sparkline 11 个文件、62 处词阻断。OP-03 保持部分完成，总进度仍为 `1/38`。

## 3. 未作的工作（将要做的）

仓库级翻译 helper 参与度已经清零。2026-07-31 Table 批次收尾时的当前仓库准确基线：

- 页面入口：109/109 已接入，0 个待处理。
- 案例：356/356 已接入，0 个待处理。
- Props/API：70/70 已接入，0 个待处理。
- 总计：535/535 已接入，0 个待处理。

“接入”只表示文件显式使用翻译 helper，不代表所有路由都通过中英文内容、交互与视觉终审。helper strict 门禁已经启用；下一轮继续剩余路由终审，Table 真实交互由独立 Chromium 或人工验收补齐。

### 执行顺序

1. OP-02、EP-01 与 VU-01 的架构产物已落地；OP-03 首批已统一 Loading 锁 owner 和稳定全局事件，下一批继续 observer/adapter 审计并补独立 Chromium 服务交互证据。
2. 继续剩余页面的中英文、双主题和桌面/移动端终审；helper strict 门禁已经启用，不再重复实现。
3. 使用能够向嵌套 Shadow DOM 投递事件的独立 Chromium 会话或人工验收 Table 排序、选择、筛选、树展开与虚拟表格交互；不得用 DOM patch、脚本直接调用公开方法或框架 workaround 伪造通过。
4. 每批同时处理页面入口、全部案例、Props/API、Template/Script、运行时状态和页面测试，并运行聚焦测试、审计与真实浏览器英文扫描。
5. 由样式线程修复 390px AppShell 英文 Footer 截断并补视觉回归。
6. 继续按总计划推进 DateTimePicker、TimeSelect、metadata、单组件入口、resolver 和真实 tree-shaking 验证。
7. 每个批次结束立即更新总计划、语言基线和本交接。

### 已确认决策

- 独立栏目命名使用 `VirtualTable`，文档路由与 Table 分离。
- 不立即把公开组件标签从 `elf-table-v2` 改为 `elf-virtual-table`，避免破坏现有 API；后续如需公开 alias，必须补类型、注册、迁移策略和 consumer 测试。
- Playwright CLI 有用，继续用于真实滚动、拖动滚动条、键盘、主题、语言和截图验证。
- 截图保存在 `output/playwright/`；`.playwright-cli/` 仅为临时快照，不纳入交付。

## 4. 当前问题

- TableV2 完整性脚本仍按 `TableV2Page` 命名查找，不能识别实际的 `VirtualTablePage`，因此会给出 demo page false negative；实际页面和页面测试存在。
- TableV2 性能基线旧中位数来自拆分前的 `/data/table`；脚本已改为 `/data/virtual-table`，后续需重新跑 5 次中位数再替换旧页面级计时。
- 当前 authoring skill 的框架参考文件名仍为 `framework-beta15.md`，内容版本说明落后于仓库 beta.20；实际依赖以 `package.json` 为准。
- 文档审计当前为 `535/535`，默认命令、CI 和 Release 已严格阻塞缺口；该数字仍只代表 helper 参与度，不能外推为全部路由已经完成严格视觉和交互终审。
- Table 浏览器控制层限制已经在全新会话中确认：顶层原生按钮正常，嵌套 Shadow DOM 控件和案例 `elf-button` 均无法由当前控制通道触发；组件聚焦测试 90/90 通过且 Vite 编译产物存在正式监听。真实用户交互仍待独立 Chromium 或人工验收，不能外推为通过。
- 390px 英文模式下全局 AppShell 固定 Footer 末尾截断，交由样式范围修复并补视觉回归。
- 当前全量测试为 239/240 个文件、1672/1673 项通过，唯一失败是并行 `OverviewPage/style.scss` 的渐变守卫；类型检查为 0 个 TypeScript 错误，`build:lib` 被并行 `OverviewCard/index.ts:24` 的两条宏模板类型错误阻断。
- 当前格式棘轮被 22 个并行修改文件阻断，`format:check:all` 报告 1257 个历史或当前文件；CSpell 被并行 Sparkline 的 11 个文件、62 处 `Sparkline/sparkline/VIEWBOX` 阻断。
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

### 2026-07-31 Footer 参考案例与 Bottom Navigation Shift 稳定性

- Footer 的靛蓝、青绿案例已按本轮 Vuetify 参考图重做，保留全局主题继承并复用 ElfUI Button 与 MDI IconProvider；截图为 `docs/screenshots/2026-07-31/footer-vuetify-reference-cases.png`、`footer-teal-vuetify-reference.png`。
- Bottom Navigation 的 base、grow、horizontal、shift、visibility 已拆分状态；Shift 不再改变图标 transform 或选中项宽度。移动端截图为 `docs/screenshots/2026-07-31/bottom-navigation-shift-stable-mobile.png`。
- 聚焦测试 2 文件 15 项通过，Vite build 970 模块通过，浏览器控制台 0 warning / 0 error。`pnpm typecheck` 仍仅被并行 `src/components/Common/OverviewCard/index.ts:24` 的 2 条既有宏模板错误阻塞。

### 2026-07-31 Alert 说明块并入现有组件

- `elf-alert` 新增 `type="tip"` 和 `variant="soft"`，用于低强调静态说明块；默认值及已有 Alert 行为保持不变。页面新增双语案例和 Props API，推荐配合 `show-icon="false"`。
- Alert 聚焦测试 1 个文件、14 项通过；文档国际化审计 `537/537`，目标 ESLint、CSpell、Prettier 与 `git diff --check` 通过；`pnpm build` 通过 1094 个模块，仅保留既有大 chunk 警告。
- `pnpm typecheck` 两次在 184 秒外层时限内无输出而超时，未记为通过，也未终止不属于本批的 Node/Vitest 进程。
- Chromium `/feedback/alert` 覆盖 1440x1000 Material 中文与 390x844 Midnight 英文：四块宽度与间距稳定，无图标、无文字或页面横向溢出，语义底色可区分，控制台 `0 warning / 0 error`。
- 截图：`docs/screenshots/2026-07-31/alert-soft-desktop-material-zh.png`、`docs/screenshots/2026-07-31/alert-soft-mobile-midnight-en.png`。
- 根据页面反馈将 Alert 表面圆角从 `--elf-radius-md`（8px）收敛到 `--elf-radius-sm`（4px）；1440x1000 与 390x844 下 27 个实例均为 4px，无横向溢出，控制台 `0 warning / 0 error`。Alert 聚焦测试 14/14、生产构建 1094 个模块通过。

### 2026-07-31 Timeline、文档案例与 Quote 批次

- Timeline 页面改为 Vuetify 风格的居中轴、38px 抬升节点和平面内容布局，并提供移动端单轴回退；移动端右侧项与双侧项现在会把实际内容正确归入单轴内容列；Sticky 首个案例改为 58px 结构化列表项。
- Slider 四季范围统一为 `0..3` 离散刻度并修正双滑块起点；BackTop 与 Anchor 内容区重做，Anchor 在 390px 下单列且移除原生 range 滚动条。
- Dropdown 触发器统一为输入框外观，虚拟触发器复用 `elf-input`；Skeleton 案例缩小并使用纯色 pulse，未保留渐变 shimmer。
- 新增公开 `elf-quote`，覆盖 6 种语义色和 `soft`、`outlined`、`filled` 三种样式；本批页面标题说明已迁移为 Quote。
- Click Outside 案例把排除触发器移到 Playground title/status，并解释其用途。控制器收敛为所属文档的单一监听源，修复真实 Shadow DOM 中同树外部点击漏报；模板状态使用响应式 ref 直接插值。
- 最终 Click Outside 聚焦回归为 2 个文件、7 项通过；本批此前目标回归为 12 个文件、95 项通过。目标 `git diff --check` 通过。
- Chromium `/directives/click-outside`、1440x1000、Material 中文：外部区域点击将计数从 0 更新到 1，随后点击排除触发器仍为 1；页面控制台 0 warning / 0 error。截图为 `docs/screenshots/2026-07-31/click-outside-interaction-desktop.png`。其余截图包括 `timeline-vuetify-desktop.png`、`sticky-list-desktop.png`、`slider-season-mobile.png`、`anchor-responsive-mobile.png` 与 `skeleton-compact-mobile.png`。
- 并行资源争用曾使一次 `pnpm build` 无输出超时；释放资源后单独重跑最终通过，Vite 构建 `1096` 个模块，仅保留既有大 chunk 警告。`pnpm typecheck` 仍仅有既有 `OverviewCard` 与 `CodeCard` 宏模板诊断。

### 2026-07-31 OP-03 Observer 所有权子批次

- DefaultsProvider 不再直接创建 `MutationObserver`，改用公开 `createMutateController`；组件聚焦测试 `8/8` 通过，DOM、公开 API、ARIA 与视觉均未改变。
- Parallax 使用 Core `useResizeObserver` 管理稳定 host；动态滚动祖先使用模块级共享 root coordinator，每个 Document/ShadowRoot 只有一个 mutate controller，并按 mutation records 过滤 DOM move 与祖先 class/style 变化。
- Parallax 相关聚焦验证合计 `16/16` 通过；目标 Prettier、ESLint、CSpell（8 文件、0 问题）与 `git diff --check` 通过。全组件入口冷转换曾在 30 秒 hook 上限超时，使用 90 秒门限独立复核后 DefaultsProvider `8/8`、ParallaxPage `2/2` 通过。
- Chromium `/data/parallax`：1440x1000 Midnight 英文内部滚动 `520px`，首个 offset `-2.48px -> -54.72px`；390x844 Material 中文内部滚动 `480px`，首个 offset `9.4px -> -48.98px`。两端无横向溢出，控制台 `0 warning / 0 error`；截图只用于现场检查，未保存。
- `pnpm build` 通过 1096 个模块，仅保留既有大 chunk 警告。类型检查扫描 1114 个源文件、123 个宏组件，本批 0 TypeScript 错误，仅被并行 `OverviewCard/index.ts:24` 的 2 条宏模板诊断阻断。
- 提交必须保持 DefaultsProvider 与 Parallax 两个独立原子边界；本批只推进 OP-03，不能外推为该工作包或仓库总门禁完成。

### 2026-07-31 Overview catalog preview maintenance

- `OverviewPage` now renders 98 route-aware cards using 23 preview kinds and 97 specific `data-detail` values. Link, Tag, Badge, Upload, Watermark, Empty, Result, Carousel, Transfer, PopConfirm, navigation surfaces, virtual data views, picker variants, directives, and Labs examples were corrected where their prior thumbnail was ambiguous.
- Focused Vitest passed 3 files / 8 tests. Target ESLint, CSpell, Prettier, and `git diff --check` passed. `pnpm build` produced no output and timed out after 244 seconds; typecheck, full tests, and `build:lib` are not recorded as passing for this batch.
- Browser matrix: 1440x1000 Material Chinese and 390x844 Midnight English. Audits reported 98 cards, 0 unknown details, 0 card overflow, 0 page overflow, 0 gradients, and 0 console warnings/errors.
- Screenshots: `docs/screenshots/2026-07-31/overview-previews-desktop-material-zh.png` and `docs/screenshots/2026-07-31/overview-previews-mobile-midnight-en.png`.

### 2026-07-31 Labs CodeCard

- 新增 Labs `elf-code-card` 与 `/labs/code-card`：统一支持 workbench、window、minimal 三种外观，Shiki 多语言高亮，Prettier 分语言格式化，明暗与代码主题，展开/折叠，行号，复制，重点/聚焦/增删差异行，以及带可访问标签的代码组。
- Clipboard API 被浏览器策略拒绝时会回退到兼容复制路径，并新增拒绝场景测试；390px 下语言选择器作为唯一可收缩项，三个操作按钮继续保持 44px 触控尺寸。最终实测卡片工具栏 `clientWidth = scrollWidth = 274px`，不再裁剪复制按钮。
- 聚焦回归最终为 6 个文件、28 项通过；目标 Prettier、ESLint、CSpell 通过，`git diff --check` 仅报告并行文件的行尾转换提示。共享 `src/library.ts` 仍有并行格式差异，共享路由仍有 Sparkline 拼写词，本批没有修改这些无关内容。
- `pnpm build` 通过 1099 个模块；库 Vite 构建通过 438 个模块，`tsc -p tsconfig.lib.json` 与 `scripts/prepare-package.mjs` 通过。`pnpm typecheck` 在 244 秒内无输出后超时，未记为通过。
- Chromium `/labs/code-card` 覆盖 1440x1000 Material 中文与 390x844 Midnight 英文：两端页面横向溢出均为 0，控制台均为 `0 warning / 0 error`。截图为 `docs/screenshots/2026-07-31/code-card-desktop-material-zh.png` 与 `code-card-mobile-midnight-en.png`。
- 浏览器中格式化按钮已真实生效；当前控制通道仍不能向嵌套 Shadow DOM 的代码组标签投递点击/键盘事件，且页面剪贴板权限不可授予。代码组方向键/Home/End 与 Clipboard 拒绝回退由组件测试覆盖，仍需独立 Chromium 或人工补充真实交互证据，不能标记为浏览器通过。
- 图 1 视觉改进补充：`CodeCardLineSelection` 现在接受单行、`[start, end]` 与 `{ start, end }`，并新增错误/警告行及 `×`/`!` 非颜色标记；工具台采用文件标题栏，页面配置台与卡片底部语言菜单均改用 `elf-select`。`<pre><code>` 外层缩进产生的可见空白已移除，1440x1000 实测上下留白从 `58/68px` 降至 `10/20px`；390x844 页面、标题栏与操作区溢出均为 0，控制台 0 warning/error。最新聚焦回归为 6 文件、29 项通过；最终应用构建通过 1106 个模块、库构建通过 440 个模块，声明生成与包整理通过。
- 2026-08-01 参考图对齐补充：语言 `elf-select` 已从底部迁入 workbench 标题栏并使用下划线样式，冗余底栏删除；显式 light/dark 表面 Token 修复暗色标题栏、编辑区和控件混色。页面示例现在分别展示 VitePress Vue、单行 focus 与其余行弱化、error/warning/remove/add/highlight 完整行颜色、JS/TS 代码组，并在 Playground 源码区展示实际范围配置。CodeCard 组件与页面测试 10/10 通过；六文件套件 35/36，唯一失败为无关的路由 loading-overlay 退场过渡。目标 Prettier、ESLint、CSpell 通过，应用构建 1108 个模块、库构建 441 个模块、声明生成与包整理通过；浏览器两档均无页面横向溢出且控制台 0 warning/error。截图位于 `docs/screenshots/2026-08-01/code-card-desktop-material-zh.png`、`code-card-dark-desktop-material-zh.png`、`code-card-diagnostics-desktop-material-zh.png` 与 `code-card-mobile-midnight-en.png`。
- 2026-08-01 首例紧凑化补充：Workbench 改为直接展示 `@elfui/kit` 的 `<elf-button>` HTML 用法，六项 `elf-select` 配置在桌面为 2×3，并与其它 Playground 统一 24px 水平边距。1440x1000 Material 中文下首例 530px、不大于后续案例；390x844 Midnight 英文下五例均为 274px。页面、标题栏与代码滚动溢出均为 0，首例下方只有 24px 正常内边距，控制台 0 warning/error。聚焦测试 3 文件 15 项、目标 Prettier/ESLint/CSpell 与 1111 模块应用构建通过；最终桌面截图为 `docs/screenshots/2026-08-01/code-card-elfui-compact-desktop-zh.png`，最终移动端状态以浏览器尺寸审计记录。

### 2026-07-31 Theme Studio

- 新增顶级 `/theme-studio` 页面和五套统一主题预设。预设事实源位于 `src/components/Providers/ThemeProvider/presets.ts`；站点皮肤、ThemeProvider 与 ConfigProvider 的公开出口应继续复用这里，禁止另建页面私有预设表。
- 用户可在基础/高级模式编辑 Token，获得真实组件预览、WCAG AA 提示、本地草稿、JSON 导入，以及 TypeScript、JSON、CSS Variables 导出。移动端使用编辑/预览切换，页面不套用普通案例 Playground。
- 直接相关回归分别通过 9 个文件 / 47 项测试；目标 ESLint、CSpell、Prettier、`git diff --check`、本地化审计 `540/540` 与应用构建通过。浏览器覆盖桌面 Midnight 中文和移动 Material 中英文，页面无横向溢出，控制台 `0 warning / 0 error`。
- 截图：`docs/screenshots/2026-07-31/theme-studio-desktop-midnight-zh.png`、`theme-studio-mobile-material-zh.png`、`theme-studio-mobile-preview-material-zh.png`。
- 主题配置入口已统一，但 Notification、Loading 等 document 级服务尚未全部自动读取 ThemeProvider，遗留固定色也未完成全量 Token 化；不要据此把 `VU-04` 标为完成。`typecheck` 被 `OverviewCard`、`CodeCard` 的并行诊断阻断；`build:lib` 在串行门禁中运行至 244 秒外层时限且无新增输出，两项均未记为通过。

### 2026-07-31 Theme Studio Material 色板库

- 新增 `ThemeProvider/material-colors.ts`，公开 19 个 Material 颜色家族、稳定色阶顺序和查找函数；色值参考 Vuetify 官方颜色包。页面和外部消费者必须复用该 owner，不得另建色板副本。
- Theme Studio 保留五套完整主题，并把 Material 数据作为 Token 取色库呈现：支持搜索、颜色家族预览、完整 50–900 / A100–A700 色阶，以及 Primary、Secondary、Success、Warning、Danger、Info 六个应用目标。
- 聚焦回归 5 个文件、14 项通过；目标 ESLint、CSpell、Prettier、能力清单和无渐变守卫通过；本地化审计 `540/540`，应用构建 1106 个模块通过。
- Chrome 英文真实交互验证搜索 `grey` 为 2 个家族，Deep orange → Danger → 700 将 `#E64A19` 写入导出配置。1440x1000 Midnight 中文和 390x844 Midnight 中文均无页面横向溢出；浏览器控制台 `0 warning / 0 error`。in-app 浏览器仍无法投递嵌套 Shadow DOM 点击，未在组件中增加 workaround。
- 截图：`docs/screenshots/2026-07-31/theme-studio-material-palette-desktop-midnight-zh.png`、`theme-studio-material-palette-mobile-midnight-zh.png`、`theme-studio-material-palette-mobile-detail-midnight-zh.png`。
- `typecheck` 与 `build:lib` 都被非本批 `OverviewCard`、`MessageBox`、`CodeCard` 的 4 条宏诊断和 6 条 TypeScript 诊断阻断；unsupported macro 扫描为 1125 个源文件、0 findings，本批文件未出现在诊断中。

### 2026-07-31 Theme Studio Material 内置预设

- `ThemeProvider/presets.ts` 现在直接消费 `material-colors.ts`：内置方案为 Material Blue 700、Indigo 300、Teal 700、Deep Purple 500、Deep Orange 700；不要在页面或应用皮肤中另建色值副本。
- `material`、`midnight`、`forest`、`violet`、`sunset` ID 保持不变，已有持久化选择无需迁移；显示名已统一为 Material 系列。
- `_tokens.scss` 的 Light/Dark 首屏主色与 Provider 默认值同步，测试会同时锁定 Material 来源、旧 ID 和 CSS 首屏变量。
- 聚焦回归 5 个文件、18 项通过；目标 Prettier、ESLint、CSpell、能力所有权和本地化审计 `540/540` 通过；应用构建通过 1107 个模块。
- Chromium `/theme-studio` 覆盖 1440x1000 与 390x844 中文，页面/工作台横向溢出均为 0，控制台 `0 warning / 0 error`。截图：`docs/screenshots/2026-07-31/theme-studio-material-presets-desktop-zh.png`、`theme-studio-material-presets-mobile-zh.png`。
- `typecheck` 仍只被非本批 `OverviewCard`、`MessageBox`、`CodeCard` 的 4 条宏诊断和 6 条 TypeScript 诊断阻断；本批文件未出现在诊断中。

# 2026-08-01 CodeCard、快速入门与工作台收尾

- CodeCard 统一去除模板公共缩进与外层空行；无诊断行不再占用 marker 列，短命令左侧留白缩小。安装页改为 Markdown 式单列结构，6 个 CodeCard 均带 footer。
- AppShell 二级菜单项现在都有稳定字母图标；升级指南改为版本记录流；浏览器支持继续使用两个 `elf-table`；Progress 首例使用正式 Playground 操作台并移除内缩卡片；Dropdown 默认面板间距为 0。
- 聚焦验证为 7 文件 / 68 项及路由相关 2 项通过；文档本地化 `540/540`、unsupported macro `0`、目标 Prettier 与 1111 模块生产构建通过。用户明确接手浏览器验证，本批未记录新的浏览器证据。
- 桌面新增经官方校验的 `C:\Users\13575\Desktop\elfui-kit` skill，沉淀当前组件、案例、Material 视觉与门禁实践。

### 2026-08-01 CodeCard source indentation follow-up

- The CodeCard example source no longer passes through a multiline macro literal that re-indents later lines. Its rendered code loop also contains no whitespace text nodes.
- Installation uses six workbench CodeCards with visible filename headers and footer notes. Exact source lines and header presence are protected by focused tests.
- Focused verification passes 4 files / 19 tests. Browser acceptance remains with the user as requested.

### 2026-08-01 Material navigation icons

- AppShell letter placeholders were replaced with semantic `@mdi/js` paths for every route and navigation group. `src/app/menu-icons.ts` is the route-to-icon authority and has completeness tests against `navItems`.
- Menu renders SVG path strings as decorative 24x24 Material icons and preserves text-icon compatibility for existing consumers.
- Focused Menu/icon tests pass 2 files / 26 tests, the targeted AppShell route assertion passes, ESLint and the 1112-module production build pass. The unrelated route-loading leave-transition assertion remains flaky when the full routing file runs; browser visual acceptance remains with the user.

### 2026-08-01 Monorepo、npm 与网站发布边界

- 仓库采用 pnpm monorepo：可发布组件库位于 `packages/kit`，私有文档站位于 `apps/website`；根目录 `docs` 继续保存计划、架构、交接与截图证据。
- 历史文档中的 `src/components`、`src/composables`、`src/directives`、`src/styles` 等路径，迁移后对应 `packages/kit/src/*`；历史 `src/app`、`src/pages`、`src/routes` 对应 `apps/website/src/*`。
- DocsHero、DocsToc、OverviewCard、Playground、PropsTable 是 website 专用展示组件，不进入 `@elfui/kit` npm 构建；共享 focus/overlay owner 继续留在 Kit。
- 根包设为 `private: true`，`packages/kit/package.json` 是 `@elfui/kit@0.0.2-beta.1` 的唯一发布清单；`apps/website/package.json` 永久保持 `private: true`。
- npm 打包、远端发布与 Vercel 部署的最终验证结果记录在本节后续条目中。
