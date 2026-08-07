<!-- cspell:words CodeCard Shiki Sparkline VIEWBOX Fritsch Carlson bottomnav interp docsync editstart frameless -->

# ElfUI Kit 维护交接

更新时间：2026-08-07

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

### 2026-08-07 DocSync 全面下架

- 按用户决定彻底移除 DocSync：删除 kit `Labs/DocSync` 组件目录（6 个文件：index/model/types/style/plan/测试）与网站 `labs/DocSyncPage` 目录（index + 测试），清理 `scripts/wire-api-builder.mjs` 中 `labs/DocSyncPage` 映射。
- 路由、nav、menu-icons 此前已按用户未提交改动移除 `/labs/doc-sync`；`Labs/index.ts` 注册/导出在文件丢失事件中已回退为不含 DocSync（发布产物本来就不含）。
- 验证：`pnpm typecheck:website` / `typecheck:kit` 均 0 错误；Labs 测试 26 文件 144 项通过；全量 website **405/409**，DocSyncPage 5 项失败消失，剩余 4 项均为既有基线（routing 2、no-demo-gradients 1、IA 英文覆盖 1 并行超时）。

### 2026-08-07 收口发布：多 agent 明暗主题 QA + 死代码审计 + 路由下架确认

- **明暗主题 QA（theme_light_dark_qa）**：146/146 路由 light/dark 切换全部通过（`data-theme` 切换、真实渲染、背景色变化、按钮轮换、0 pageerror）；静态样式无破坏暗色的硬编码背景，约 15 处硬编码白/黑均为有意设计。审计脚本 `scripts/theme-light-dark-audit.playwright.js` 可复跑。
- **死代码审计（dead_code_audit）**：高置信度 6 项（VirtualListPage/ex1.ts、layout/demo-cards.scss、4 处无引用 demo 类）；不可达页 2 组（Container/Space 路由指向 Grid/Flex，需用户拍板；DocSync 确认按用户未提交改动**从路由与导航下架**）；kit 无死样式；docs 历史归档建议保留。报告 `docs/audits/2026-08-07-dead-code.md`。
- **路由状态**：`/labs/doc-sync` 路由与 navItem 按用户意图移除（与 menu-icons.ts 未提交改动一致）；`menu-icons.test` / `routes` IA / `pages` IA 三项 12/12 通过。
- **发布门禁**：`pnpm typecheck:website` 0 错误；全量 website **409/418**，剩余 9 失败 = DocSyncPage 5（恢复基线，浏览器正常）+ routing 2（既有）+ no-demo-gradients 1（既有）+ pages IA 英文覆盖 1（全量并行负载超时，隔离通过）。

### 2026-08-07 收口发布前置：API 表复合行拆分 + 全组件说明补全（api_table_cleanup）

- **复合属性行拆分**：全站 API 表（props/events/methods/slots/expose，含组件页、指令页、服务页、Labs、Providers、CSS 变量表）中 `name: "a / b"` 一行多属性的写法全部拆为独立行，共拆分 **405 行**（63 个文件），`type`/`default` 按位置同步拆分（`|` 类型联合不拆）；单行行与多行行、`defineHtml` 内联 `:rows=${[...]}` 均支持。
- **说明补全**：API 表 0 空 desc、0 缺 desc；TablePage 119 条纯中文说明全部转为 `pick(zh, en)` 并补英文，拆分产生的重复组说明同步细化为各自属性的准确中英文；4 个 picker 名为 `p` 的文件（Checkbox/InputOtp/InputTag/Mention）已适配 `p()`；FlexPage/GridPage/SpacePage 补充 `createDocsPicker` 声明；0 空 zh/en、0 空页面 description。
- **测试同步**：FormPage 表格行数断言 `[15,13,7,5,9] → [17,13,8,6,10]`；UploadPage/TabsPage 复合行名断言改为拆分后名称。
- **验证**：`pnpm typecheck:website` 0 宏错误/0 TS 错误；pages 范围 ESLint 通过；prettier 全 pages 通过；`audit-docs-locale` 574/574；聚焦测试（Form/Upload/Tabs/ApiBuilder/PropsTable/覆盖审计）36/36。全量 `pnpm lint` 仍被并行主题审计脚本 `scripts/theme-light-dark-audit.playwright.js` 的 1 个未使用变量阻断；spellcheck 已补充 `modelvalue`/`wolai` 两个文档词。
- **工具与过程备注**：一次性脚本在 git 忽略的 `output/audit/`（split-props.mjs / repair*.mjs），可复跑审计；拆分曾因解析器 `}` 提前入表达式产生单行行损坏，已由 repair2/3/4 修复并经 prettier + typecheck 双重验证，当前 0 残留。

### 2026-08-07 API 构建器覆盖收口审计 + DocSync 文件丢失事件

- **覆盖审计完成**：全部 **111 个元素组件文档页**已接入 `elf-api-builder`（67 个 `props.ts` 页 + 44 个内联 `index.ts` 页，含全部 Labs/Providers 与 Icon/Link/Quote/Sparkline/VirtualList/Rate/Upload/Masonry/Space/Toolbar/AppBar/BottomNavigation/Dropdown/Footer/PageHeader/ColorPicker 等）；13 个非元素页（Message/Notification/MessageBox 服务页、8 个指令页、2 个指南页）保持普通表格；`scripts/api-builder-coverage.test.ts` 扩展为同时扫描 `props.ts` 与 `index.ts` 防回归。
- **内联页迁移**：`wire-api-builder.mjs` 支持 `index.ts` 内联表（API h2 替换为构建器、表尾精确闭合）；子组件归组新增 `elf-icon-provider` / `elf-md-outline` / `elf-dropdown-item`；Provider 配置/上下文表（ElfUIConfig / Locale Context / Theme Context）与 DocSync `cssVars` 不参与勾选。
- **IA 测试修正**：AI Showcase 页面实际只有 5 个真实案例（其余 `elf-playground` 出现在代码示例字符串中），期望 6→5；隔离复跑 3/3 通过。
- **DocSync 文件丢失事件**：工作树中 `DocSyncPage/index.ts` + 测试与 kit `Labs/DocSync` 全部 6 个文件被意外删除（非本批命令所致），已从 git HEAD 恢复；HEAD 基线在 happy-dom 下 `elf-doc-sync` 注册缺失，导致 DocSyncPage 5 项测试失败（浏览器渲染正常，其余 labs 组件注册正常）。此前未提交的 DocSync 修复（见下方历史记录）需按需重建。
- 验证：`pnpm typecheck:website` 0 错误；覆盖审计 + IA 测试 6/6；全量 website **410/418**，剩余 8 失败 = routing 2 项（既有）+ no-demo-gradients 1 项（既有 5 个旧文件）+ DocSyncPage 5 项（恢复基线后）。

### 2026-08-07 API 构建器：移除预览功能

- 删除预览按钮与眼睛图标、`elf-dialog` 预览对话框、`previewOpen`/`previewHost`/`onPreview` 及 watch 填充逻辑，清理 `.api-builder-dialog-preview` 样式；动作栏保留「复制」「清空」两个无边框彩色图标按钮（成对标签生成逻辑不变）。
- 测试删除 `preview opens a dialog with the rendered component` 用例；ApiBuilder `plan.md` 行为说明同步（复制/清空/成对标签）。
- 验证：ApiBuilder/PropsTable/CardPage/覆盖审计 26 项测试通过；`pnpm typecheck:website` 0 错误；Prettier/ESLint/CSpell 通过；真实 Chromium 确认动作栏仅 2 个按钮、0 个 dialog、控制台无新报错。

### 2026-08-07 API 构建器：生成代码统一成对结束标签

- `codegen.ts` 不再输出自闭合 `/>`：无论是否选择插槽，生成结果统一为 `<elf-card ...></elf-card>` 成对标签（无子内容时开标签后直接闭合）。
- 测试同步：`always emits paired closing tags` 断言 `>` + `</elf-card>` 且不含 `/>`；多组件片段断言改为成对标签；ApiBuilder `plan.md` 行为说明更新。
- 验证：codegen/ApiBuilder/PropsTable/CardPage 测试通过；`pnpm typecheck:website` 0 错误；Prettier/ESLint 通过。

### 2026-08-07 CardPage 3D 倾斜 + API 构建器全站接入

- **3D 倾斜（替换点击按压）**：`.card-press` 改为鼠标跟随倾斜——`onPressMove` 按指针相对卡片的位置计算 `rotateX/rotateY`（±16°），`:style` 绑定 `perspective(720px)`，四个角分别得到不同倾斜方向（右上/左下/右下实测 `rotateX/Y` 正负组合正确），`mouseleave` 回弹归零；删除 `:active` 按压规则，文案/示例代码同步（`creativeCode`/`creativeScript`）。
- **API 构建器全站接入**：`elf-api-builder` 从 CardPage 试点扩展到全部元素组件文档页（66 个页面批量迁移 + CardPage 共 67 个）；新增 `scripts/wire-api-builder.mjs` 一次性迁移脚本（幂等，可重跑）与 `scripts/api-builder-coverage.test.ts` 防回归审计（纯函数式服务页 Message/Notification/MessageBox 保持普通表格）。
- **多组件片段生成**：`elf-props-table` 新增 `component` 属性，`registerTable/setSelected/isSelected` 按 `role + component` 归组；`codegen.ts` 按组件输出多个独立片段（实测 Form 页同时勾选 elf-form 与 elf-form-item 生成两个片段）。子组件表（avatar-group/carousel-item/collapse-item/descriptions-item/list-item/countdown/grid-item/splitter-panel/checkbox-group/radio-group/form-item/menu-item/sub-menu/menu-item-group/step/tab-pane/breadcrumb-item/anchor-link/spacer/cascader-panel）均带 `component` 归组；Parts/Service/Directive/FormRule/Column/TourStep/TimelineItem 等非元素表不参与勾选。
- **动作按钮无边框 + 彩色图标**：`.api-builder-*` 去掉边框，改 30×30 圆角幽灵按钮（悬停底色、按压缩放）；复制/预览/清空/已复制为两色渐变 SVG（蓝文档、紫粉眼球、琥珀红圆 ✕、翠绿圆对勾），复制成功态变 success 色。
- **CheckboxPage 结构修复**：该页 API 区原含「状态映射与无障碍」章节标题与一个 Playground 案例，迁移后手工恢复章节标题并把构建器移到 Playground 之后（原 `<h2>API</h2>` 由构建器标题接管）；FormPage 测试改为穿透 `elf-api-builder` shadow 断言标题。
- 验证：全量 `pnpm test:website` 419 项中 414 通过，剩余 5 项均为交接记录中的既有失败（routing 2、IA code-card 1、no-demo-gradients 的 6 个旧文件，隔离复跑确认，本批未新增）；`pnpm typecheck:website` 0 宏错误 / 0 TS 错误；Prettier/ESLint 通过；真实 Chromium 实测四角倾斜方向与回弹、Button/Form/Table 页构建器勾选列与行数据、多组件代码生成、预览对话框 teleport 渲染真实组件、图标无边框、控制台无新报错；截图归档 `output/playwright/api-builder-button.png`、`api-builder-form.png`、`api-builder-table.png`、`card-creative-tilt-default.png`、`card-creative-tilt-corner.png`。

### 2026-08-07 CardPage API 构建器：标题行对齐 85% + MDI 图标美化

- `.api-builder-head` 宽度改为 `max(85%, min(100%, 900px))` 并居中，与 `elf-props-table` 的 `:host` 宽度公式一致，标题行与表格左边界完全对齐（实测 876px / left 304px 相同）。
- 复制/预览/清空/已复制从文本符号（⧉/⛶/✕/✓）改为**两色渐变 SVG 图标**（`v-html` 注入静态字符串）：复制为蓝/天蓝双层文档（`#38BDF8→#2563EB`）、预览为紫粉渐变眼球（`mdiEyeOutline` 轮廓 + `#A78BFA→#EC4899` 虹膜 + 白色高光）、清空为琥珀红渐变圆形 ✕（`#FBBF24→#EF4444`）、复制成功为翠绿圆形对勾（`#34D399→#059669`）；复制成功态按钮变 success 色（`.is-copied`），图标带轻微 drop-shadow。
- 验证：ApiBuilder 7 项 + CardPage 4 项测试通过；`pnpm typecheck:website` 0 宏错误 / 0 TS 错误；Prettier/ESLint 通过；真实 Chromium 确认标题行与表格同宽同左边界、3 个渐变 SVG 渲染为 16px、控制台无报错；截图归档 `output/playwright/card-api-builder-color.png`。

### 2026-08-07 CardPage 创意卡片：灵感徽章重设计（两轮）+ 3D 按压改角压

- **灵感徽章重设计**：第一轮“圆章徽记 + 缎带 + 星光”徽章风经用户反馈后改为**极简编辑风**——去掉圆章/缎带/散落星光，改为 34px 渐变圆角图标块（✦）+ 大写 `IDEA` eyebrow + 22px 大字标题 + 悬停展开的渐变下划线；卡片从流动描边改为细主题色边框 + 两团柔和光晕（`.card-glow::before/::after` 径向渐变，悬停放大变亮）。`--elf-card-radius: 16px` 统一圆角。
- **3D 按压改角压**：`.card-press > elf-card` 从整卡下沉改为以左下角为轴（`transform-origin: 0 100%`）的 3D 倾斜——`:active` 为 `perspective(720px) translateY(6px) rotateX(7deg) rotateY(-5deg)`，模拟实体按键一角被按下；hover 保留轻微抬升与前倾。
- 文案同步：状态行“辉光→徽章”，tilt/glow 中英文说明更新；`creativeCode` / `creativeScript` 示例与实时模板保持一致。
- 验证：CardPage 聚焦测试 4 项通过；`pnpm typecheck:website` 0 宏错误 / 0 TS 错误；Prettier/ESLint 通过；真实 Chromium 实测光晕悬停 opacity 0.5→0.85、图标旋转、下划线 `scaleX(0.55)→1`、`:active` 角压规则生效、正文/徽章无溢出、控制台无报错；截图归档 `output/playwright/card-creative-editorial.png`、`card-creative-editorial-hover.png`、`card-creative-press-hover.png`。

### 2026-08-07 DocSync 四组件交互增强

- **组件删除**：结构块（component/columns/divider/image）支持两种删除——选中后按 Backspace/Delete 键盘删除（`onBlockKeydown` 新增分支，`deleteBlock` 复用），以及结构块悬停时右上角显示 × 删除按钮（`.doc-sync-delete`，点击 `onDeleteBlock`）。实测 Delete 删除 24→21 块。
- **md 序号**：源码面板列表/todo 块 textarea 显示 Markdown 语法——`sourceBlockText` 输出 `- item`（无序）、`1. item`（有序，`meta.ordered`）、`- [ ] item`（todo）；`applyEditedValue` 解析 md 前缀回 `items`。新增「有序列表」slash 命令（`meta.ordered: true`）。
- **表格左码右表**：结构块 component 在源码面板渲染**组件标签代码**（`<elf-table data="..." >`，`.doc-sync-component-code` 等宽代码样式），预览面板渲染真实组件。`blockMarkup` 对 component 在 source 模式输出代码、preview 输出组件。
- **slash 键盘导航**：确认 slash 面板打开时 ArrowUp/Down 移动高亮、Enter 选中、Escape 关闭（`onEditorKeydown` slash 分支），实测"正文→标题 1"移动正常。
- 验证：DocSync 组件 20 项 + DocSyncPage 6 项测试通过；typecheck 0 错误；Prettier/ESLint 通过；真实 Chromium 实测删除按钮+键盘删除、`- / 1. / - [ ]` md 语法、左码右表、slash 键盘导航，控制台 0 error。

### 2026-08-07 DocSync 五项交互修正

- **点击块无下划线**：移除 `.doc-sync-editor` 聚焦时的 `border-bottom-color`（及编辑器常驻 border），点击块不再显示下划线。
- **组件块占满整行**：组件/结构块（component/columns/divider/image）在源码面板不再走「行号列 + flex」布局，新增 `is-structural` class（`display:block`、不渲染行号列），实测 elf-table 从 142px 占满到 198px。根因：结构块被 flex + 行号列挤压。
- **/ 面板定位修正**：`.doc-sync-slash` 从 `position:fixed` 改回 `absolute`，坐标用 `getBoundingClientRect` 相对 host 容器计算。根因：`fixed` 受 Playground 的 `backdrop-filter` 影响（fixed 相对含 filter 的祖先），导致面板偏离 374px；修复后紧贴 `/` 下方（gap 4px、左对齐）。
- **slash 直接插入组件**：移除内置 `table` 块类型命令，`/表格` 现在插入 `elf-table` 组件（`component` 块，`blockMarkup` 渲染 `meta.props`）；页面 `componentCommands` 扩展至 10 个真实 kit 组件（卡片/告警/标签/进度/分隔条/表格/列表/折叠/标签页/时间线），带示例 props。
- **shift+enter 行内换行**：确认无 shift 的 Enter 建块、shift+enter 走默认换行且 auto-resize 高度增长（21→42px），块内多行不折叠。
- **行号只显示起始行**：`lineLabel` 移除多行块 `start–end` 区间（如 13–15），只显示起始行号。
- 验证：DocSync 组件 20 项 + DocSyncPage 6 项测试通过；typecheck 0 错误；Prettier/ESLint 通过；真实 Chromium 实测点击无下划线、elf-table 198px 占满、slash 紧贴 / 下方、插入 elf-table 双栏渲染、shift+enter 高度自适应、行号单一数字，控制台 0 error。

### 2026-08-07 DocSync 七项视觉与交互修复

- **块高度贴合内容**：`.doc-sync-editor` 设 `font-size:13px`、`line-height:1.6`（约 21px）、`min-height:0`；新增 `resizeEditor`（force reflow + scrollHeight 保底 lineHeight），输入与虚拟窗口测量时 auto-resize，单行块从 52px 收敛到 21px。
- **/ 面板触发与定位**：`onSlashInput` 改为任意位置输入 `/` 触发（正则 `/(?:^|\s)\/([^\s/]*)$/`），不再要求整行；`.doc-sync-slash` 改 `position:fixed`，用 `getBoundingClientRect` 屏幕坐标锚定在 textarea 下方（`slashAnchorLeft/Top`）。
- **组件插入生效**：`applySlashCommand` 替换后给 built 补 id（`newBlockId`），`focusBlockId` 设 id 让块聚焦有反馈。
- **四面圆角统一**：删除 `.doc-sync-pane:first-of-type/:last-of-type` 单侧圆角规则（`::part(pane)` 死选择器不匹配），统一由 splitter 容器 `--doc-sync-radius` 控制。
- **拖动图标改宽度**：splitter 加静态 `model-value` attribute 让守卫（`hasAttribute("model-value")`）通过，配合 `.prop` 绑定 `splitRatio`；实测左面板 242→302px。根因：splitter effect 守卫 `!host.hasAttribute("model-value")` 忽略外部 `.prop` 改值，且宏把 `:modelValue` 渲染成 `modelvalue`（无连字符）不匹配。
- **去除 workspace 外框**：`.doc-sync-workspace` padding 18→8px，去掉 warm/office 背景色；glass/vintage 大阴影减弱（24px→4px）；warm/office 阴影继承 `.doc-sync-stage elf-doc-sync` 的 `none`。
- **中间圆形进度环**：swap 按钮加 SVG ring（track + progress，`pathLength=100` + dashoffset 按 `progressValue`），`updateProgress` 写 `progressValue`；滚动时环进度实时更新（dashoffset 100→94）。中间保留 swap 图标（z-index 盖在环上）。
- 验证：DocSync 组件 20 项 + DocSyncPage 6 项测试通过；typecheck 0 错误；Prettier/ESLint 通过；真实 Chromium 实测块 21px、/ 任意触发+面板下方、elf-card 双栏渲染、圆角 0、拖拽 242→302px、无外框、环形进度随滚动更新，控制台 0 error；截图归档 `output/playwright/docsync-fixes.png`。

### 2026-08-07 elf-api-builder：API 表格勾选构建器（CardPage 试点）

- 新增 `apps/website/src/components/ApiBuilder/`（文档站内部基建，非 Kit 对外组件）：`elf-api-builder` 包裹一组带 `role` 的 `elf-props-table`，用户勾选 API 行即用**默认值**生成元素标记，可复制或用对话框预览真实组件。
- **复用 Table 内置 selection**：`PropsTable` 在构建器内（带 `role`）时列首加 `{ type: "selection" }` 列（多选 + 表头全选），`@selection-change` 的 `event.detail` 把选中行同步给构建器 `setSelected(role, names)`；不带 `role` 或不在构建器内时行为完全不变（向后兼容）。
- 生成规则：属性布尔输出裸属性名、其余输出 `name="默认值"`；事件 `@click="handleClick"`；插槽 default 占位文本、具名 `<span slot="footer">Footer</span>`；方法 `<!-- ref.value.openPreview() -->` 注释附注；无插槽自闭合 `<elf-card />`；**每个属性/事件/方法各占一行**（`<elf-card\nvariant="elevated"\n/>`）。
- 页面接线：`CardPage/props.ts` 的 API 区改为 `<elf-api-builder component="elf-card" title="API">` 包裹三张表（原 `<h2>API</h2>` 移入 builder，由 builder 渲染标题行）；`components/index.ts` 注册 ApiBuilder。
- 布局（按用户多轮反馈收敛）：**不用 Card 容器、不用代码卡片**；builder 渲染标题行「API」+ 右侧三个图标按钮——**复制 ⧉**（`navigator.clipboard` 直接复制生成标记，成功变 ✓）、**预览 ⛶**（`elf-dialog` 弹出渲染真实组件）、**清空 ✕**；生成的标记不落屏展示，仅复制/预览用；下方属性表格恢复 PropsTable 默认 85% 居中宽度；PropsTable 在构建器模式下**不再提升标题**（`active()` 提前 return）。
- 预览实现坑：`elf-dialog` 内容 `v-if=${model.value}`（open 才渲染）且 teleport 到 body，`previewHost` ref 在 open 前为空；用 `watch(() => previewOpen.value, ..., { flush: "post" })` 打开后填充。`v-model:open` 必须传 **ref 本身**（`v-model:open=${previewOpen}`）而非 `.value`，否则 set 不生效。
- 设计文档 `docs/plans/2026-08-07-api-builder-design.md`；组件 plan.md 同步。
- 验证：ApiBuilder 组件 10 项 + codegen 纯函数 6 项 + PropsTable 5 项 + CardPage 4 项测试通过（29 项）；typecheck 0 宏错误 / 0 TS 错误；ESLint/Prettier/CSpell 通过；真实 Chromium 实测标题行「API」+ 右侧复制/预览/清空图标、勾选 variant 后 `code()` 返回多行 `<elf-card\nvariant="elevated"\n/>`、复制按钮变 ✓、预览对话框 teleport 到 body 渲染真实 `<elf-card>`、清空复位、控制台 0 error。
- 说明：全量 website 测试的 4 个失败（routing 菜单序 2 项、IA DocSync code-card 1 项、no-demo-gradients 1 项）均为**改动前既有失败**，已在 baseline HEAD 复现，与本任务无关。

### 2026-08-07 DocSync 升级为 Notion/wolai 风格块编辑器

- **回车建块**：源码面板 textarea 内 Enter 在当前块后插入新块（Shift+Enter 块内换行）；空块 Backspace 合并到上一块。新增 `insertBlockAfter`/`onEditorKeydown`，插入后 `focusBlockId` effect 滚动并聚焦新块。
- **/ 斜杠命令面板**：textarea 输入 `/` 弹出命令面板（`BUILTIN_COMMANDS`：正文/标题1-3/无序列表/待办/引用/代码块/公式/表格/分割线/图片/两栏/三栏/四栏），ArrowUp/Down 导航、Enter 选中、Escape 关闭、鼠标点击/悬浮选择；选中后把当前块替换为目标类型。参照 `elf-ai-command-search` 交互。
- **分栏**：新增 `columns` 块类型（2/3/4 栏），`blockMarkup` 渲染 `--doc-sync-cols` 网格，双栏（源码/预览）都渲染；分栏各栏为子块数组。
- **自定义 web component 注册**：新增 `components` prop（`DocSyncComponentRegistry`），页面通过 `componentCommands` 注册 kit 组件（卡片/告警/标签/进度/分隔条）；`component` 块类型渲染 `<tag>`，`renderBlock` 对结构类块（columns/component/divider/image）强制走内置渲染，自定义渲染器只处理文本类 → **双栏都渲染插入的组件**。
- **样式**：`.doc-sync-block` 及源码块 border-radius 设为 0；删除 `.is-synced::before` 左侧竖线（保留 box-shadow inset 作为激活指示）；新增 `.doc-sync-todo`、`.doc-sync-component`、`.doc-sync-columns`、`.doc-sync-slash` 等样式。
- 新增块类型：`todo`、`component`、`columns`；`TEXT_BLOCK_TYPES` 判断哪些块走 textarea 编辑（结构类块渲染只读结构）。
- 验证：DocSync 组件 20 项 + DocSyncPage 6 项测试通过（新增回车建块/Shift+Enter/slash 菜单测试）；typecheck 0 错误；Prettier/ESLint 通过；真实 Chromium 实测 `/` 面板弹出选择、四栏插入双栏渲染、卡片组件双栏渲染、Enter 建块、圆角 0 无 ::before，控制台 0 error；截图归档 `output/playwright/docsync-block-editor.png`。

### 2026-08-07 DocSync 五项交互与页面调整

- **全屏模式**：6 个案例的 Playground `slot="status"` 加全屏按钮（`⛶`，`aria-label` 全屏），点击切换当前 workspace 为 `position: fixed` 全屏；页面新增 `.doc-fullscreen-btn`、`.doc-sync-status-row`、`.doc-sync-workspace.is-fullscreen` 样式与 `toggleFullscreen/fullscreenClass/fullscreenPressed` 逻辑。
- **始终可编辑**：组件编辑从「双击块进入 textarea」改为「源码面板每个块常驻 textarea」，直接输入实时同步双栏。删除 `editingId/editingSide/editingText/focusEditor`、`onBlockDblClick/commitEdit/cancelEdit/onEditorKeydown`，新增 `onLiveEdit(side, block, event)` 与 `blockText()`、`editablePane(side)`；`.doc-sync-editor` 改为透明无边框常驻样式（聚焦显示强调色底线）。`editable=false` 时源码面板仍走 renderLeft/内置渲染。
- **删终端 + 标题**：删除黑客终端案例（`terminalSource/Parse/Render/Code/Script`、状态 refs、`.is-terminal` 与 `.doc-terminal-*` 样式、翻译键）与「风格探索」章节标题/lead，玻璃拟态与复古报刊案例直接平铺。
- **删 code-card**：删除开放标准章节 customStyle 案例下的 `elf-code-card`（块模型/解析器/渲染器三张代码卡），同时清理 `standardItems/CodeCardItem/modelCode/parserCode/rendererCode` 与对应翻译键；customStyle 预览与代码展示组保留。
- **高亮条圆角**：`.doc-sync-block.is-synced::before`（左侧 3px 高亮条）的 `border-radius` 移除。
- 验证：DocSync 组件 17 项 + DocSyncPage 6 项测试通过（编辑测试改为直接输入、editable=false 回归、案例数 7→6）；typecheck 0 错误；Prettier/ESLint 通过；真实 Chromium 实测全屏切换 `position: fixed`、textarea 直接输入双栏同步、终端/标题/code-card 消失、高亮条 `border-radius: 0`，控制台 0 error；截图归档 `output/playwright/docsync-editable-fullscreen.png`。

### 2026-08-07 DocSync 风格探索：黑客终端 / 玻璃拟态 AI / 复古报刊

- 按用户要求新增三种创意风格案例，组成「风格探索」章节（三个 Playground），与既有暖白/蓝白形成质感对比。
- **黑客终端**：深色 `#0a0f0d` 底 + 荧光绿 `#3ddc84`，macOS 红黄绿标题圆点，命令带 `$` prompt，等宽字体；内容为 git/部署命令回放（新 `terminalSource`/`terminalParse`/`terminalRender`，左右同渲染器）。
- **玻璃拟态 AI**：深蓝紫渐变 `#0f172a→#1e1b4b` + `backdrop-filter` 毛玻璃半透明面板 + 漂浮光斑，靛蓝紫 `#818cf8` 强调；内容为 AI 思考/工具调用/洞察报告（`aiSource`/`aiParse`/`aiRender`）。
- **复古报刊**：米黄纸 `#f3ead9` + 橙色油墨 `#c2410c`，Georgia 衬线、主标题橙色下划线、首字下沉；内容为报纸文章（`vintageSource`/`vintageParse`/`vintageRender`）。
- **关键修复（重复踩坑）**：新渲染器最初输出页面自定义类（`.doc-vintage-*` 等），因内容注入组件 shadow DOM、页面样式跨 boundary 无法命中（与 `doc-sync-word-*` 同根因）；改为渲染器复用组件已下沉的 `.doc-sync-word-*` / `.doc-sync-code` 基类 + 少量特化类，特化类样式下沉组件 style.scss 由 `--doc-sync-*` 变量驱动。
- 验证：DocSync 组件 16 项 + DocSyncPage 6 项测试通过（断言 4→7 个 syncs/playground，补三个 workspace 存在性）；typecheck 0 错误；Prettier/ESLint 通过；真实 Chromium 实测复古橙色下划线 `2px solid #c2410c`、终端荧光绿 `$` prompt、玻璃紫色工具卡片均生效，控制台 0 error；截图归档 `output/playwright/docsync-style-gallery.png`。

### 2026-08-07 DocSync 工具栏源码泄漏修复

- 用户反馈工具栏按钮渲染成 `<span>` 源码文本：`defineHtml` 模板里 `${warmTools()}` 返回 HTML 字符串，宏模板插值是**文本插值（escape）**，HTML 被当纯文本显示。
- 修复：工具栏注入点改为 `<span class="doc-*-tools-host" v-html=${warmTools()}></span>`（框架支持 `v-html` 指令，同 MdPage 用法）；顺带删除左 header-extra 误重复的 div。
- 验证：CDP 实测暖白 9 个编辑工具按钮、蓝白 10 个工具栏按钮 + 4 个下拉按钮全部渲染为真实 DOM，0 处源码泄漏；DocSync 组件 16 项 + DocSyncPage 6 项测试通过；typecheck 0 错误；Prettier/ESLint 通过；截图更新 `output/playwright/docsync-warm-editorial.png`。

### 2026-08-07 DocSync 按桌面设计图校准

- 用户确认「以桌面设计图为准」覆盖之前规范文字的矛盾点，校准两处外壳：
- 图1（暖白风）右栏 Word 标题栏改深蓝 `#245c91` 白字：组件左右 header 的 part 拆分为 `pane-head-left` / `pane-head-right`，页面用 `::part(pane-head-right)` 单独着色；按设计图右栏不放工具栏按钮（移除 warmWordTools），仅保留 Word 品牌。
- 图2（蓝白风）代码块改浅绿背景白字：右栏 Word 代码块 `.doc-sync-word-code` 变量改 `#e7f5e9` 背景 + `#155724` 文字；左栏源码编辑器改白色（覆盖 `--doc-sync-source-*` 变量），并新增 `--doc-sync-code-bg/color` 变量让组件内置 source 代码块可换肤。
- parseLatex 新增 `\begin{verbatim}` 代码块支持（code 块类型 + 行号）；latexSource 中英文各补一段 `pnpm add @elfui/kit` verbatim；案例2 新增 `renderLatexSource` 自定义左渲染器，把 code 渲染成浅绿代码卡片。
- 验证：DocSync 组件 16 项 + DocSyncPage 6 项测试通过；typecheck 0 宏错误 / 0 TS 错误；Prettier/ESLint 通过；真实 Chromium 实测右栏深蓝标题栏 `#245c91`、两栏浅绿代码块 `#e7f5e9`、左栏白色编辑器，控制台 0 error；截图更新 `output/playwright/docsync-warm-editorial.png`、`docsync-office-blue.png`。

### 2026-08-06 DocSync 双栏外壳重设计：暖白编辑出版风 + 蓝白专业办公风

- 按用户提供的两张 UI 设计图与两套完整设计规范，重做 DocSync 页全部 4 个案例外壳：Markdown → Word 用「图1 暖白编辑出版风」，LaTeX → Word 用「图3 蓝白专业办公风」，最小实现统一蓝白外壳，自定义面板样式改为暖纸主题变量演示。
- 组件扩展：`DocSyncSlots`（`left/right-header-extra`、`left/right-footer`）；`defineHtml` 扩为三泛型；header 新增 `.doc-sync-pane-title`（flex:1 撑开让 extra slot 靠右）；footer 用 `footerEmpty()` 从 host light DOM 检测并加 `is-empty` 类隐藏（不依赖 slotchange，happy-dom 兼容）；中间按钮尺寸变量化 `--doc-sync-swap-size`（svg 按比例缩放）。
- **关键机制修复**：页面里定义的 `.doc-sync-word-*` Word 渲染样式从未生效（定义在页面 shadow DOM，内容注入组件 shadow DOM，跨 boundary 无法命中，实测标题字体为默认 Roboto 而非页面定义的 Georgia）。将整套 Word 渲染样式下沉到组件 style.scss，用 `--doc-sync-word-*` 变量驱动。
- **第二个机制坑**：CSS 变量设在外壳父容器（`.doc-sync-workspace`）无法穿透组件 `:host` 里的默认值（`:host { --doc-sync-swap-size: 34px }` 会阻断继承，`--doc-sync-heading-font: inherit` 却能穿透）。修复：外壳变量直接设在 host 元素（`.doc-sync-workspace.is-warm elf-doc-sync { --x: v }`），与既有 `.doc-sync-custom` 模式一致。
- 验证：DocSync 组件 16 项、DocSyncPage 6 项测试通过；typecheck 0 宏错误 / 0 TS 错误；Prettier/ESLint 通过；真实 Chromium（CDP）实测两套外壳变量穿透（暖白 swap 48px/衬线标题/深棕标题色、蓝白 swap 52px/蓝色标题 `#0757bd`）、滚动同步/双击编辑/交换回归正常，控制台 0 error；截图归档 `output/playwright/docsync-warm-editorial.png`、`docsync-office-blue.png`。

### 2026-08-06 AI 案例页图标尺寸、对齐与 Codex 移除批次

- AiLoading：`.ai-loading` 由 `inline-flex` 改为 `display: flex`。根因是文档页继承 `line-height: 1.6`（25.6px），inline-flex 行被基线挤到 line box 底部，网格相对 host 下移 5.25px；改为 block 级 flex 后 host 高度收敛为 22px、网格/文字/计时器中心完全重合（偏移 0）。
- AiTaskRow：`.status-icon` 16px→12px、`.step-icon` 12px→10px，勾选 `rotate(-45deg)` 的 translate 与 failed X 笔画按比例调小；实测 status 包围盒 25.5→19.8px、step 19.8→17px。
- AiContextCard：`.source-icon` 由 14×17px 窄高改为 14×14px 正方形（doc 变体 13×16→13×13），去除"被压缩"观感，保留折叠角文档语义。
- AiToolChips：`.item-icon` 16px→12px，success 勾选 translate 同步调整；实测包围盒 25.5→19.8px。
- AiShowcase：整段删除"完整 Codex 案例"（翻译键、CODEX_STEPS/codex* 状态与数据、codexCode/codexScript、`.codex-*` 样式、`<h2>codex>` 模板块与 `onUnmounted`/`useTemplateRef`/`useRef` 未用 import），保留 neon/terminal/cream/midnight/gradient 五个换肤案例，页面从 0.0.2-beta.1 的 875 行收敛到 435 行。
- 验证：4 个 AI 组件测试 16 项通过；路由信息架构测试 7 项通过；unsupported macro 扫描 728 文件 0 findings；`typecheck:website` 588 个宏文件 0 宏错误、0 TS 错误；真实 Chromium（CDP）逐一实测图标尺寸与垂直居中偏移，控制台 0 error；截图归档 `output/playwright/ai-loading-center-fixed.png`、`ai-task-row-icons-smaller.png`、`ai-context-card-source-icon-square.png`、`ai-tool-chips-item-icon-smaller.png`、`ai-showcase-no-codex.png`。

### 2026-08-05 AppBar 密度案例改为标题区选择按钮

- 密度案例从三张静态应用栏改为单个可交互应用栏：在 Playground 标题区（`slot="status"`）放入 `elf-segmented size="sm"`（默认 64px / 舒适 56px / 紧凑 48px），选中后通过 `:density.prop` 实时切换单个 `elf-app-bar`，下方标签同步显示当前档位与高度。新增 `density` ref、`onDensity`、`densityOptions()`、`densityMeta()`，并补充 `densityDefault/densityComfortable/densityCompact` 翻译键。
- 代码展示 `densityCode` 同步改为分段控件 + 单个动态应用栏。
- 测试：NavigationSurfacesPage 新增断言（标题区存在 `elf-segmented`，点击“舒适”后应用栏 `density=comfortable` 且标签为 56px）；13 项页面测试全部通过；ESLint、Prettier、`typecheck:website` 均 0 错误。
- 浏览器验证：三档点击实测高度 66→58→50px（含 2px border），标签同步；截图归档 `output/playwright/appbar-density-default.png`、`output/playwright/appbar-density-compact.png`。

### 2026-08-05 AppBar 滚动行为案例序号居中修复

- 滚动行为 01/02 的序号方块（`.content-index`）未垂直水平居中：根因是紧随的 `.content-row span { display: block }` 把 `display: grid`（place-items: center）覆盖为 block，且 `margin-top: 3px` 误加到序号方块。将这两条规则限定为文本列（`.content-row > div strong/span`），序号方块恢复 grid 居中并加 `justify-self: center` / `line-height: 1`。
- 验证：浏览器实测 01/02 数字相对方块中心水平偏移 0、垂直仅 0.5px 亚像素差，控制台 0 warning / 0 error；截图归档 `output/playwright/appbar-scroll-index-centered.png`。页面测试与构建因终端工具 14s 超时限制未在本轮跑完。

### 2026-08-05 Select outlined 内容再次下移（+3px）

- 视觉仍偏上，outlined trigger 内边距从 6/2 调整为 7/1，内容中心相对 trigger 中心下移 3px（value 与 arrow 偏移均为 +3px）。
- 验证：Select 测试 30 项通过；浏览器实测 +3px、控制台 0 warning / 0 error；截图归档 `output/playwright/select-outlined-nudge-3px.png`。kit 构建因终端工具 14s 超时未在本轮跑完（纯 SCSS 微调，风险低，后续可补）。

### 2026-08-05 Select outlined 内容下移微调

- Select outlined 内容（文字/箭头）在完全垂直居中后视觉偏上，为 outlined trigger 增加非对称内边距（padding-top 6px / padding-bottom 2px），内容中心相对 trigger 中心下移 2px。
- 验证：Select 测试 30 项通过；kit 构建通过；浏览器实测 value 与 arrow 中心偏移均为 +2px，控制台 0 warning / 0 error；截图归档 `output/playwright/select-outlined-nudge-down.png`。

### 2026-08-05 Input/Select outlined 描边样式修正

- Input outlined 聚焦时 label 不再用 `scale(0.75)`（缺口按未缩放宽度计算导致 label 偏左、右侧空隙大）：改为与 fieldset legend 一致的 11px 字号并校准 `left: 14px`，label 与缺口内容区完全对齐、左右空隙对称（实测 leftGap 0 / rightGap 0），呈现 `-标签-` 居中效果；共享 `_field-surface.scss` 的 floating-label mixin 同步修正（Select/Autocomplete/Cascader/TreeSelect 等 outlined 字段统一受益）。
- Select outlined 文字与箭头垂直居中：移除 `data-has-label` 的非对称 `padding-top: 18px`，`.value` 行高归一，`.arrow`/`.suffix` 改为 inline-flex + `line-height: 1`；实测 value 与 arrow 中心相对 trigger 中心偏移均为 0。
- 验证：Input 与 Select 聚焦测试 65 项通过；kit typecheck 0 错误；kit 构建通过；浏览器实测 label 缺口内对称居中、文字/箭头垂直居中，控制台 0 warning / 0 error；截图归档 `output/playwright/input-outlined-label-centered.png`、`select-outlined-centered.png`。

### 2026-08-05 Anchor 演示布局修复与 Tabs 平直滑块 / 图片滑动过渡

- Anchor：组件新增 `--anchor-min-width` CSS 变量（默认 160px）；三个文档案例（基础定位 / 嵌套受控 / 组合式链接）改为 `auto + 1fr` 布局，锚点仅保留容纳文字的宽度（102px / 102px / 75px），文档卡片相应变宽。
- Anchor：修复「水平滚动 / 下划线 / 无侧边标记」案例 `:marker=${false}` 绑定未生效的问题——布尔属性需用 `:marker.prop=${false}`，`smooth` 同步改为属性绑定；实测 track 已不再渲染，AnchorPage 测试补充 `marker=false` 与 track 缺失断言。
- Tabs：新增 `sliderVariant="rounded | flat"`，flat 为贴住标签底边的 2px 平直直线（无圆角、无内缩），水平/垂直布局均按标签完整尺寸定位；图片分类案例启用该样式。
- Tabs：图片分类切换改为可靠的横向滑动过渡——实测发现示例中原框架 `<Transition>` 与 `:key` 重建均未触发动画，改用 `useTemplateRef` + Web Animations API 在切换时从右侧滑入（220ms），并尊重 `prefers-reduced-motion`；删除失效的 Transition 包装与 enter/leave 样式。
- 验证：Anchor/Tabs 组件与页面 4 个测试文件 42 项通过；kit/website typecheck 0 宏错误、0 TS 错误；beta.8 扫描、Prettier、ESLint、docs locale `574/574` 通过；website（1288 模块）与 kit lib（566 模块）构建通过；真实 Chromium 确认 track 消失、flat 滑块 2px 全宽、切换 40ms 时 translateX 14.8px / 120ms 2.4px，截图归档 `output/playwright/anchor-fix-zh.png`、`tabs-fix-zh.png`。

### 2026-08-05 标签页操作台新增滑块样式选项

- 「标签页操作台」新增「滑块样式」Select（rounded / flat），操作台 Select 增至 6 个，Template 代码与页面测试同步更新。
- 修复真实交互中发现的问题：`sliderVariant` 运行时切换后 `syncSlider` 未重算（几何仍是 rounded 尺寸）——effect 依赖列表补充 `props.sliderVariant`，并新增运行时切换单测。
- 验证：Tabs/TabsPage 测试 28 项通过；kit/website typecheck 0 错误；website 构建 1288 模块通过；Chromium 实测选择「平直直线」后滑块变为 179×2、无圆角、无内缩，控制台 0 错误；截图归档 `output/playwright/tabs-playground-slider-variant-zh.png`。

### 2026-08-05 删除 Heading 组件及其文档页

- 按用户要求移除 `elf-heading` 组件（`packages/kit/src/components/Basic/Heading/`）与文档页（`apps/website/src/pages/basic/HeadingPage/`），同步清理全部引用：Basic 分类注册、`library.ts` 导出、路由表、侧栏菜单、`menu-icons.ts` 图标映射、组件总览目录与 `components/plan.md` 条目。
- 原文件已整体归档至 `.local-archive/deleted-2026-08-05-heading/`（组件、页面、两张 QA 截图），且此前已全部提交至 git，可随时恢复。
- 验证：kit/website typecheck 0 宏错误、0 TS 错误；`pnpm build`（1287 模块）与 `pnpm build:lib`（566 模块）通过；docs locale `573/573`；Prettier、ESLint 通过；全库已无 `elf-heading` / HeadingPage 功能引用（仅交接文档保留历史记录）。

### 2026-08-05 DocSync Markdown 案例操作台改为垂直复选框

- Markdown → Word 案例操作台由三个 `elf-switch` 改为三个 `elf-checkbox`（锁定滚动同步 / 行号 / 刻度尺），单列垂直排列、间距 8px；页面测试控件断言同步更新为 `elf-checkbox` + `.box` 点击。
- 验证：DocSyncPage 6 项聚焦测试通过；website 构建通过；浏览器实测 3 个复选框垂直堆叠（top 468/492/516），控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-controls-checkboxes.png`。

### 2026-08-05 DocSync 密集刻度、行号间距、面板圆角与顶部滚动指示

- 刻度尺加密到每 2% 一条（51 条）：细分 2px、每 10% 主刻度 3px、数字每 20%（0/20/…/100）；行号列靠左（28→22px）并与内容拉开（10→16px）。
- 左右面板各自圆角（左左圆角/右右圆角，10px），案例高度 420→520px；滚动指示改到顶部：移除右侧竖滚动条与底部联合进度线，每个面板标题栏底部新增 2px 进度条（左右独立 host 变量驱动）。
- 验证：DocSync 组件 14 项、DocSyncPage 6 项聚焦测试通过；kit/website typecheck 0 错误；website 构建通过；浏览器实测 51 刻度/6 标签、行号 22px/间距 16px、双面板圆角 10px、高度 520、顶部进度条随滚动增长，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-ruler-v3.png`、`docsync-top-progress.png`。

### 2026-08-05 DocSync 尺子刻度、圆角与把手拖拽

- 案例恢复 10px 圆角（无边框无阴影）；刻度尺重构为“尺子”：14px 高、每 5% 一条刻度（21 条）、数字标签每 25%、flex 首尾贴边，右端不再留白。
- 移除中间分割线（splitter bar 0 宽透明），两栏严格一人一半；中间交换按钮改为 pointer 长按拖动调宽（30–70%，位移 >6px 抑制 click），短按仍交换，键盘交换保留。
- 验证：DocSync 组件 14 项、DocSyncPage 6 项聚焦测试通过；kit/website typecheck 0 错误；website 构建通过；浏览器实测 21 刻度/14px/首尾贴边、两栏 184/184、拖动 70% 不触发交换、短按互换正常，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-ruler-dense.png`、`docsync-drag-resize.png`。

### 2026-08-05 DocSync 案例无外框、面板直接铺满 Playground

- 案例区域不再显示组件外框：Playground demo padding 置 0，`.doc-sync-stage` 全宽贴边，案例内 `elf-doc-sync` 通过 `--doc-sync-border/radius/shadow` 变量关闭边框/圆角/阴影，左右面板一人一半直接铺满；自定义样式案例脚本同步移除 radius/border/shadow 变量，预览与脚本一致。
- 验证：DocSyncPage 6 项聚焦测试通过（beforeAll 超时提升到 60s）；浏览器实测组件 0 边框/0 圆角/无阴影、铺满预览区、交换把手居中，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-frameless-md.png`、`docsync-frameless-latex.png`。

### 2026-08-05 DocSync 行号与刻度尺开关演示

- `lineNumbers` / `ruler` 本就是公开开关（默认 true、可关闭），Markdown 案例控件区新增「行号」「刻度尺」两个 `elf-switch`，实时演示关闭效果；Props 表已含两行。
- 验证：DocSyncPage 6 项聚焦测试通过（含关闭后行号列/刻度尺消失断言）；浏览器实测开关关闭后即时消失、属性同步 false，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-toggles-off.png`。

### 2026-08-05 DocSync 分割线圆形交换把手

- 分割线升级：中央 34px 圆形把手（swap-horizontal 图标），拖拽仍走 `elf-splitter` 调整宽度，把手通过 `--_doc-sync-split` host CSS 变量实时跟随分割线。
- 点击把手左右面板角色互换：标题、左暗右亮主题、行号列、刻度尺、渲染器整套镜像（左侧变 Word 亮色、右侧变 Markdown 深色编辑器）；滚动锚点/点击高亮/双击编辑基于 block id，互换后继续工作；新增 `swap` 事件。
- 验证：DocSync 组件 13 项、DocSyncPage 5 项聚焦测试通过；全仓 typecheck 0 错误；kit 与 website 构建通过；浏览器实测按钮居中、拖拽 70% 后按钮精确跟随、点击互换后标题/明暗/行号镜像正确，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-swap-handle.png`、`docsync-swapped.png`。

### 2026-08-05 DocSync 编辑器 × 文档双主题（左暗右亮、行号、刻度尺、统一滚动）

- 视觉重构为“左编辑器、右文档”：左面板默认深色代码编辑器（等宽字体、`--doc-sync-source-*` 变量、块级行号列），右面板保持亮色纸张阅读；块模型新增 `line` 起始行号，多行块行号显示起止（如代码块 `13–15`）。
- 新增顶部刻度尺（`ruler` 默认 true，0–100 刻度 + 数字标签）与 `lineNumbers`（默认 true）两个开关；隐藏原生滚动条，改用两侧 3px 自定义细滚动条（悬停显示）＋容器底部联合进度线（`--_doc-sync-progress` 直接写 host CSS 变量，跟随左侧滚动比例）。
- 页面解析器补行号，Props/CSS 变量表补新开关与 `--doc-sync-source-*` 变量；自定义样式案例同步覆盖源码面板暖色变量。
- 验证：DocSync 组件 12 项、DocSyncPage 4 项聚焦测试通过；全仓 typecheck 0 错误；kit 与 website 构建通过；浏览器实测左暗右亮、行号区间、刻度尺 11 刻度/6 标签、细滚动条与进度线随滚动更新（37.9%）、编辑同步回归正常，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-editor-theme.png`、`docsync-editor-scrolled.png`、`docsync-custom-theme-new.png`。

### 2026-08-04 DocSync 双击编辑同步与面板视觉升级

- 新增双击编辑：`editable`（默认 true），双击任意块进入编辑，左右面板同时显示同一草稿 textarea，输入实时镜像；Esc 取消，Ctrl/⌘+Enter 或失焦保存；提交后双栏同步渲染并派发 `editstart` / `edit` 事件。列表按行、表格按 `|` 分隔编辑。
- 面板视觉升级：公开 `--doc-sync-*` CSS 变量（容器/面板/标题栏/边框/圆角/阴影/强调色/字体），面板头加强调色圆点、块悬停与激活渐变、分割条改为发丝线 + 强调色悬停；页面新增「自定义面板样式」暖纸主题案例（仅用 CSS 变量换肤）与 CSS 变量 API 表。
- 验证：DocSync 组件 10 项、DocSyncPage 4 项聚焦测试通过；website typecheck 0 错误；ESLint、CSpell 通过；浏览器实测双击编辑双栏同步、失焦提交、Esc 取消、自定义变量生效、分割条与标题点样式正确，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-panels-polished.png`、`docsync-editing.png`、`docsync-custom-style.png`。

### 2026-08-04 DocSync 双栏同步面板：插拔契约与文档页

- 仓库已有并行会话实现的 `Labs/DocSync`（块模型 + FNV-1a 内容寻址 id + 虚拟窗口 + 双向锚点滚动 + 点击高亮/边距条 + 键盘），本批在其基础上补齐已确认的内容无关插拔契约：`source + parse`（自定义解析器，source 变化自动重新解析）与 `renderLeft/renderRight`（自定义渲染器，字符串视为可信 HTML，缺省回退内置 source/preview），`blocks` 直连模式保留。
- 渲染内容统一经本地 `v-doc-sync-content` 指令挂载；修复模板作用域 `split` ref 与 prop 同名遮蔽（改名 `splitRatio`），宏模板类型检查通过。
- 新增 `Labs/DocSyncPage`：Markdown → Word、LaTeX → Word 两个真实案例（同一 `renderWordBlock` + 两个自定义解析器，验证“换内容不换组件”）、滚动锁定开关、激活状态、开放标准 CodeCard（块模型/解析器/渲染器）与完整 API/Events/Expose 表；注册 `/labs/doc-sync` 路由、导航、`mdiDockLeft` 图标与信息架构测试；演示源文本双语。
- 记录宏编译器坑：多行模板字面量会被编译器重新缩进，导致 Markdown/LaTeX 按行首解析错位；演示源文本改用 `\n` join 数组规避。
- 开放标准以案例展示：在「开放标准」章节新增「最小实现」Playground，用十几行的 `parse` + `render` 函数实时演示同步阅读与点击高亮，协议 CodeCard 保留为规范参考。
- LaTeX 与最小实现案例加长到可滚动：LaTeX 源扩为六节（含 `tabular` 表格，`parseLatex` 新增表格行收集），最小实现扩为 16 项发布清单，Markdown 源补 FAQ 一节；三个案例左右双栏均真实可滚动（内容高 627–861px、视口 351px），滚动同步肉眼可验证。
- 验证：DocSync 组件 8 项、DocSyncPage 3 项、路由信息架构 7 项聚焦测试通过；ESLint、CSpell 通过；浏览器实测三种源解析（md/latex/最小实现）与渲染、双向锚点滚动、锁定开关、点击双栏高亮 + 边距条、移动端无溢出，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-md-word.png`、`docsync-latex-word-long.png`、`docsync-minimal-long.png`。全仓 typecheck 仍被并发会话的 Labs/MdOutline 模板错误与 MdPage markdown-it 类型声明错误阻塞，页面信息架构套件另有 Intersect 页硬编码中文与 FAQ 时序两个既有失败，均与 DocSync 无关。

### 2026-08-04 BottomNavigation Shift 模式对齐 Vuetify 并改进案例

- Shift 行为对齐 Vuetify v4.1.7：非选中项标签从「`width:0` + `visibility:hidden` 塌陷隐藏」改为「`opacity:0` 淡出且保留占位」，图标按 Vuetify 公式下移 8px（24px 图标三分之一），`.icon`/`.label` 增加过渡，选中切换不再生硬跳动。
- Shift 案例重做对齐 `prop-shift`：手机设备容器 + 视频/音乐/图书/图片四个目的地，每个目的地有专属强调色与文案；切换目的地时导航强调色、内容标题和摘要实时联动。
- 新增「滚动隐藏」案例对齐 `prop-hide-on-scroll`：消息列表向下滚动隐藏导航、向上滚动或回到顶部恢复，演示 `active` 的滚动联动用法。
- 验证：BottomNavigation 组件 6 项、NavigationSurfacesPage 12 项聚焦测试通过；全仓 typecheck 0 宏错误 / 0 TS 错误；浏览器实测 shift 位移/淡出、强调色联动、滚动隐藏与恢复正常，控制台 0 warning / 0 error；截图归档于 `output/playwright/bottomnav-shift.png`、`bottomnav-hide-on-scroll*.png`。验证期间被并发会话的 MdPage/menu-icons 改动短暂阻塞（`mdiMarkdown` 在 @mdi/js 7.4.47 不存在），非本任务引入。

### 2026-08-04 Sparkline 补充自定义标签、渐变配置与内嵌支出案例

- 补齐 Vuetify Sparkline 剩余三个代表性示例：ex6「自定义标签」对齐 `misc-custom-labels`（绿色卡片 + ¥/$ 货币化标签 + `padding=24` + 圆头平滑 + 报表按钮）；ex7「渐变与填充配置」对齐 `prop-fill`（6 组色板 + 填充开关 + 线宽/平滑/内边距滑杆实时驱动图表）；ex8「支出与内嵌趋势」对齐 `prop-inset`（深色卡片 + `inset` + `fill` + 渐变 + `show-markers` + `interactive` 悬停显示月份与金额），并补齐 `inset` 的公开演示。
- 页面现有 8 个案例：动画、柱状、仪表盘、交互悬停、心率、自定义标签、渐变配置、内嵌支出；API 表无需新增属性。
- 验证：Sparkline 页面测试 4 项通过；全仓 typecheck 0 宏错误 / 0 TS 错误；浏览器实测色板切换与填充开关生效、悬停读数更新、移动端无溢出，控制台 0 warning / 0 error；截图归档于 `output/playwright/sparkline-custom-labels-ex6.png`、`sparkline-gradient-playground-ex7.png`、`sparkline-inset-expenses-ex8*.png`。

### 2026-08-04 Toolbar 对齐 Vuetify VToolbar（prominent、extended、flat、折叠语义）

- 对标 Vuetify v4.1.7 `VToolbar` 源码与官方示例，补齐差距：新增 `density="prominent"`（主行 128px、标题 28px 底部对齐、prepend/append 顶部对齐）、`extended: boolean | null`（true 强制显示可空扩展区 / false 强制隐藏 / null 自动检测插槽）、`flat`（去除投影）。
- 扩展区高度随密度缩放（comfortable -4px、compact -8px、prominent 加倍），并将扩展区从 `v-show` 瞬时切换改为 `height` 过渡动画（对齐 Vuetify `VExpandTransition` 视觉）。
- 折叠语义修正为 Vuetify 行为：`collapse-position` 从「保留哪一侧」改为「折叠后对齐哪一侧」（默认 `start`），折叠时只隐藏标题，prepend/append 均保留，超宽内容由 `overflow: hidden` 裁剪。
- 文档页新增「突出工具栏」案例，灵活卡片案例改用 `extended flat`，折叠案例文案与代码同步；API 表补充 prominent/extended/flat。
- 验证：Toolbar 组件 11 项、页面 4 项聚焦测试通过；kit typecheck 0 宏错误 / 0 TS 错误；kit 与 website build 通过；浏览器实测 prominent 128px/标题 28px/扩展区 96px、折叠后标题隐藏且两侧按钮保留、`end` 对齐右移、扩展区 height 过渡、移动端无溢出，控制台 0 warning / 0 error；截图归档 `output/playwright/toolbar-prominent*.png`。

### 2026-08-04 Heading 增加 Markdown 列表标题

- `elf-heading` 新增 `markdown="bullet | ordered"`：bullet 渲染 `-` 前缀，ordered 在同一编号范围内按层级自动生成 `1.` `2.` `3.`；`index` 仍优先覆盖。纯函数 `formatMarkdownNumber` 位于 `Heading/numbering.ts`。
- 配套规则：guide 的 level 3 在 markdown 模式下不套胶囊，marker 前置并使用主色；terminal 的 `#` 前缀在有 marker 时自动隐藏；neon 的 `[]` 包裹在 bullet 模式关闭；guide 示例新增「Markdown 转换」区块，API 表新增 `markdown` 行。
- 验证：Heading 组件 12 项 + HeadingPage 2 项测试通过；kit/website typecheck 0 宏错误、0 TS 错误（此前 Labs 存量错误已修复）；Prettier、ESLint、beta.8 扫描通过；真实 Chromium 页面 0 error / 0 warning，`1.` `2.` `3.` 与 `-` 主色前置渲染确认，截图归档 `output/playwright/heading-markdown-zh.png`。

### 2026-08-04 ConfigProvider「配置优先级」与「显示与动效偏好」案例重做

- 「配置优先级」改为交互式三层演示：三个 `elf-switch` 分别控制基础预设、应用配置与显式属性，目标按钮与「当前生效值」面板实时显示每一层胜出的属性及来源（如关闭显式属性后 variant 回落为 blueprint 的 outlined、color 回落为 config 的 success）；样式移入独立 `ex1.scss`。
- 「显示与动效偏好」拆为两个真实效果区：显示区通过 `mobileBreakpoint` 下拉在相同窗口宽度下切换双栏/单栏布局，并显示断点、移动端与阈值状态；动效区并排展示 `motion: full` 与 `motion: reduced` 的圆点过渡对照，验证 ConfigProvider 通过主题过渡 token 全局控制动效。
- 子预览组件（display/motion preview）各自带 `defineStyle` 与独立样式，修复旧案例依赖 index.ts 页面样式、样式无法进入子组件 Shadow DOM 的问题。
- 验证：ProviderPages 9/9 通过；unsupported macro 扫描 0 findings；宏感知 typecheck 591 个宏文件 0 宏错误、0 TypeScript 错误；Prettier、ESLint 通过；Chromium 实测三层开关、移动端阈值切换、动效对照均符合预期；截图归档于 `output/playwright/config-priority-demo.png` 与 `output/playwright/config-display-motion-demo.png`。

### 2026-08-04 Table 分页联动案例状态不同步修复

- 用户反馈「展示 10 条但实际只有 5 条」：`TablePage/ex2.ts` 用 `:currentPage=` / `:pageSize=` 属性绑定，值没有到达 `elf-pagination` 的 props（浏览器实测 `pagination.pageSize` 为 undefined），组件内部回落到默认 10 条/页，而页面状态仍是 5；改为 `.prop` 属性绑定后触发器、表格行数与状态行完全同步。
- 新增回归测试：初始断言 `pageSize === 5` 与「5 条/页」，切到 10 后表格渲染 10 行、状态「显示 1-10 / 37 条」；TablePage 聚焦测试 2 文件 18 项通过；Chromium 实测同步生效，截图 `output/playwright/table-pagination-sync.png`。
- 说明：浏览器验收期间发现 dev 站点另有既有阻塞——`menu-icons.ts` 引用了 `@mdi/js` 不存在的 `mdiMarkdown` 导出（Heading 工作引入）；验证时临时替换为 `mdiLanguageMarkdown`，验证后已逐字节恢复。另外昨天记录的 8 个缺失 Labs 页面今日已补齐。

### 2026-08-04 Anchor 基础定位案例字段插值修复

- 用户反馈「显示名称 / 工作邮箱」字段内容显示 `{{ t(`：根因是宏模板 `model-value="${t("nameValue")}"` 的嵌套引号被编译器截断（编译产物为 `setAttribute("model-value", "{{ t(")` + 多余 `nameValue` 属性）；改为 `:label=${t(...)}` + `:modelValue.prop=${t(...)}` 后输入框正确渲染 label 与值。
- 全库审计 `="${t(` 模式：80 个文件命中，编译产物检查仅 AnchorPage/ex1 实际损坏（其余均位于 code 展示字符串，非宏模板）；审计脚本留在 `output/audit-broken-interp.mjs`（gitignored，删除被本机策略拦截）。
- 验证：AnchorPage 聚焦测试 4/4 通过；Chromium 实测字段 label（显示名称/工作邮箱）与值（林沐涵/lin@elfui.dev）正确渲染，页面不再出现 `{{ t(`；截图 `output/playwright/anchor-basic-fields-zh.png`。

### 2026-08-04 Dropdown 虚拟触发案例选中反馈修复

- 用户反馈「虚拟触发选中后无效」：案例输入框 `modelValue` 绑死为右键提示文案，`onCommand` 更新 `selectedLabel` 后输入框不刷新；改为 `:modelValue.prop=${selectedLabel.value}` 后选中菜单项会实时显示在输入框。
- 虚拟触发输入框补充 label「画布操作 / Canvas actions」，Template/Script 展示代码同步补 `@command` 绑定与 `selectedLabel` 状态。
- 新增回归断言：`command` 事件后输入框 `modelValue` 更新为选中项 label；DropdownPage 测试通过；Chromium 实测右键选择「刷新画布」后输入框与状态行同步；截图 `output/playwright/dropdown-virtual-trigger-zh.png`。

### 2026-08-05 Splitter / Scrollbar / Toolbar 案例批次

- Splitter：新增「转换与拖动」案例（ex6）——中部转换图标点击交换左右面板，按住图标拖动可代替分隔条调整比例，图标跟随分隔位置；Pointer 捕获对合成事件做了 try/catch 防御。
- Scrollbar：「滚动位置命令」的按钮与当前位置状态从 Playground 顶部移到滚动列表下方，操作栏紧贴内容。
- Toolbar：紧凑案例修复头部圆角穿模并改为「影像控制台」主标题 + 垂直快捷操作；折叠与对齐的内联箭头事件处理器不生效（checkbox/radio 点击无效）改为命名处理器并补操作读数；突出案例静态导航改为受控 `elf-tabs`，三个扩展案例增加「当前标签」读数；暗色工具栏图标在 Midnight 主题下强制白色；灵活卡片移除 -42px 悬浮与 96px 空扩展区，卡片正常排在下方。
- 验证：Splitter/Scrollbar/Toolbar 三页聚焦测试 9/9 通过；宏感知 typecheck 588 个宏文件 0 宏错误、0 TS 错误；Chromium 实测折叠 494→104px、tabs 切换读数更新、暗色图标白色、Splitter 点击交换与拖动 40%→65%、Scrollbar 按钮移位后功能不变；截图归档 `output/playwright/splitter-swap-drag.png`、`scrollbar-commands-below.png`、`toolbar-compact-vertical.png`、`toolbar-flexible-no-float.png`。

### 2026-08-05 Steps 步骤内容内边距

- `.step-main`（每个步骤的标题与描述内容块）由仅 `padding-inline-end: 10px` 改为 `padding: 6px 10px`，每个步骤的内容获得上下呼吸空间。
- 验证：Steps 组件与 StepsPage 聚焦测试 15/15 通过；Prettier 通过；浏览器截图因本机 Playwright CLI 会话故障未归档（改动为纯 SCSS，不影响结构断言）。

### 2026-08-05 观察器指令案例暗色主题修复

- 用户反馈「交叉观察器 / 尺寸观察器 / 变更监听」的进入视口案例没有适配 dark 主题：共享 `directive-demo.scss` 使用了未定义的旧 token `--elf-border-color` / `--elf-bg-color`，浅色兜底（`#dcdfe6` / `#fff`）始终生效；改为 `--elf-border` 与 `--elf-bg-paper` 后容器在 Material/Midnight 下随主题切换。
- 说明：`--elf-border-color` / `--elf-bg-color` 旧名在 AvatarGroup、Heatmap、Carousel 及多个页面内联样式中仍在使用（同样依赖浅色兜底），可作后续批次统一清理。

### 2026-08-05 Tooltip 箭头接缝修复

- 用户反馈「悬停或聚焦看得到内部的三角形」：原双三角形箭头（`::before` 描边 + `::after` 填充）在气泡边缘产生可见接缝；改为与 PopConfirm 一致的旋转方块方案（继承背景与边框、裁掉两条边、四方向旋转定位）。
- 跟进修复：旋转方块朝内的角会继承气泡背景，而深色气泡原为半透明 `rgba(33,33,33,0.9)`，内角会在气泡内叠出可见深色小三角；深色气泡改为不透明 `#212121` 后内角与气泡同色、被完全覆盖。
- 验证：Tooltip 组件与 TooltipPage 聚焦测试 19/19 通过；Prettier 通过；浏览器截图受 Playwright CLI 故障影响未归档。

### 2026-08-05 Avatar 文档案例真实化

- 用户要求「头像案例变得真实好看」：三个案例全部重做为真实产品界面——ex1 为通讯录风格成员行 + 带标签的图片/图标/徽标 + 尺寸档位标签；ex2 为项目负责人资料卡（头像、姓名、在线徽标、职务、说明、操作按钮）；ex3 为项目成员卡片（六位成员真实头像照片，保留 alt 与折叠/键盘行为）。
- 验证：AvatarPage 聚焦测试 2/2 通过；unsupported macro 扫描 0 findings；宏感知 typecheck 588 个宏文件 0 宏错误、0 TS 错误；Prettier、ESLint 通过；浏览器截图受 Playwright CLI 故障影响未归档。

### 2026-08-03 Heading 组件改为六套内置标题套装并支持样式配置

- 移除 11 种 Material variant 与三套手写演示（文档蓝/编辑杂志/开发者终端）；`elf-heading` 改为 `family` + `level` 驱动的配套标题体系，现内置六套：`guide`（文档指南）、`editorial`（编辑杂志）、`terminal`（开发者终端）、`brand`（品牌展示）、`neon`（霓虹）、`minimal`（极简）。guide 的 level 2 默认带主色强调条、level 3 默认胶囊小节；brand 的 level 1 默认渐变文字；`accent` / `chip` / `gradient` 支持显式 `false` 关闭。
- 新增 `numbered` 自动序号：同一页面/容器内按层级递增，guide/brand 为 `01` / `01.1`，editorial/minimal 为 `1` / `1.1`，terminal/neon 为 `01` / `01.01`（neon 渲染为 `[01]` 发光样式）；`index` 仍可手动覆盖；容器可用 `data-heading-scope` 指定编号范围。
- 新增样式配置 props：`line-height`（数字为倍率）、`margin-top` / `margin-bottom` / `font-size` / `letter-spacing`（数字换算 px），通过 host 属性 + CSS 变量覆盖，不破坏套装默认值。
- 重做 `/basic/heading` 文档页：7 个 Playground 用安装页、文章、API 文档、营销落地页、科技控制台、工作台与样式配置的真实页面骨架展示；API 表同步更新。
- 验证：Heading 组件 10 项 + HeadingPage 2 项测试通过；unsupported macro 扫描 0 findings；Prettier、ESLint 通过；docs locale `575/575`；真实 Chromium 页面 0 error / 0 warning，截图归档 `output/playwright/heading-suites-zh.png`。
- 说明：`pnpm typecheck:kit` / `typecheck:website` 仍被工作区未提交的 Labs AI 组件存量类型错误阻断（AiRecordsTable、AiSidebarNav、AiStreamingText、Labs/index.ts），与本次改动无关。

### 2026-08-03 Sparkline 对齐 Vuetify VSparkline 并补充柱状与仪表盘案例

- 调研 Vuetify v4.1.7 `VSparkline` 源码与文档：官方仅提供迷你图表组件（`trend` 趋势线 / `bar` 柱状），没有完整图表库；完整图表需第三方（如 ECharts）。`gradient` 停靠点数组会反转、`gradient-direction` 映射到 `linearGradient` 向量、柱状图正负值基线、`min`/`max` 与 `padding` 语义均按官方行为对齐。
- 组件新增公开 API：`type`、`gradient`、`gradientDirection`、`labels`、`showLabels`、`labelSize`、`autoLineWidth`、`padding`、`min`、`max`；柱状支持 `smooth` 圆角、首帧升起动画（`transform-box: fill-box`）与负值原点。
- 标签渲染为 Shadow DOM 内 HTML 行而非 SVG `<text>`，避免 `preserveAspectRatio="none"` 拉伸文字；缺失标签回退到数据值，`label-size` 默认 7px 与 Vuetify 一致。
- 修复多实例动画帧号共享问题：`frame` 由模块级 `let` 改为 `useRef`，仪表盘 4 图同时首帧绘制不再互相取消。
- 页面新增 ex2「柱状迷你图」（近 7 日营收：渐变柱、星期标签、自动柱宽、首帧绘制）与 ex3「仪表盘卡片与标签」（收入面积渐变、活跃用户柱状、转化率渐变线、订单横向渐变柱），ex1 随后按 Vuetify 官方示例重做（见下节）；API 表补齐全部公开属性。
- 验证：Sparkline 组件 4 项、页面 2 项聚焦测试通过；kit/website typecheck 宏扫描 0 findings，kit 0 TS 错误（website 仅 4 个既有 Labs 页 TS 错误，非本批引入）；kit 与 website build 通过；浏览器桌面/移动实测柱宽、渐变填充、标签不溢出、卡片单列堆叠，控制台 0 warning / 0 error；截图归档于 `output/playwright/sparkline-*.png`。

### 2026-08-03 Sparkline ex1 动画案例对齐 Vuetify prop-animation

- ex1 重做：卡片从 820px 大卡片收敛为 480px 紧凑卡片（`elf-card variant="outlined" density="comfortable"` + `--elf-card-radius: 12px`），头部为标题 + 周期副标题 + 右上角 `elf-segmented size="sm"`，图表高度从 220px 收敛到 78px，完整对应 Vuetify `prop-animation.vue` 的「Page Views」示例。
- 数据与默认周期改为 Vuetify 官方值：默认 `monthly`，weekly/monthly/quarterly 三组数据与官方一致；切换周期时副标题同步（最近 7 天 / 最近 12 个月 / 最近 6 个季度）。
- 示例属性改为 kebab-case 字符串（`auto-draw-duration="800"`、`line-width="2"`、`smooth="4"`、`stroke-linecap="round"`），规避宏模板 `:camelCase=${number}` 生成小写属性导致映射失败的问题；页面测试同步更新为官方数据并覆盖默认 monthly 与切换 quarterly。
- 验证：页面测试 2/2 通过；浏览器实测卡片 482px、图表 78px、分段控件右对齐且切换后数据/副标题/激活态同步；移动端 390px 下分段换行但不溢出；控制台 0 warning / 0 error；截图归档于 `output/playwright/sparkline-pageviews-*.png`。

### 2026-08-03 Sparkline 继续对齐 Vuetify（交互、标记、单调平滑）

- 继续研读 Vuetify v4.1.7 Sparkline 全部示例（usage / animation / fill / inset / smooth-mode / custom-labels / dashboard-card / heart-rate / interactive），补齐最有价值的能力：`interactive` + `update:currentIndex`（pointermove 最近点、聚焦默认末点、方向键切换、趋势十字线 + 悬停标记、柱状整列高亮）、`showMarkers`/`markerSize`/`markerStroke`、`inset`、`smoothMode="monotone"`、`itemValue`、`autoDrawEasing`。
- 标记采用 HTML 百分比定位圆点而非 SVG `<circle>`，避免 `preserveAspectRatio="none"` 非等比缩放把圆拉成椭圆；monotone 算法移植为纯模块 `packages/kit/src/components/Data/Sparkline/monotone.ts`（Fritsch-Carlson）。
- 页面新增 ex4「交互悬停」（每周下载量卡片：fill + 渐变 + min/padding + interactive，悬停/键盘联动头部数值与周区间，对齐 Vuetify misc-interactive）与 ex5「心率与平滑模式」（三色渐变 + autoDraw + showMarkers + animation + monotone 开关 + 平滑滑杆 + 重新测量，对齐 misc-heart-rate 与 prop-smooth-mode）；API 表新增对应 props 与 Events 表。
- 验证：Sparkline 组件 7 项、页面 3 项聚焦测试通过；kit typecheck 0 宏错误 / 0 TS 错误；kit 与 website build 通过；浏览器实测悬停更新头部、键盘切换、离开复位、重新测量数据变化、monotone 切换、移动端无溢出，控制台 0 warning / 0 error；截图归档于 `output/playwright/sparkline-interactive-ex4.png`、`sparkline-heart-ex5.png`、`sparkline-heart-mobile.png`。

### 2026-08-03 Splitter 演示面板主题化与主页定位文案

- Splitter 演示页左侧面板从写死 `#616161` 灰色改为主题化表面：首个面板使用主色 5% 混入 `--elf-bg-paper`，第二个面板使用 `--elf-bg-paper`，文字统一 `--elf-text-primary`；仅调整演示页 `::part` 样式，不修改组件默认视觉契约。
- 主页 hero 文案改为「构建精致界面，原生 Web Components 组件库。」，英文同步为 "Ship polished interfaces, a native Web Components library."，移除旧文案「不再绑定框架 / without framework lock-in」。
- 验证：SplitterPage 与 HomePage 聚焦测试 5/5 通过；Prettier、ESLint 通过；Chromium 实测 Material/Midnight 两套主题下首个面板计算背景均随主题变化，中英文主页文案均在真实浏览器确认；截图归档于 `output/playwright/splitter-theme-*.png`。

### 2026-08-03 ConfigProvider 程序化滚动案例内容升级

- 将「程序化滚动 · 共享滚动策略」预览改为真实应用风格：项目简报卡片（负责人、截止、任务 6/8、进度 72%）、实现任务清单（已完成/进行中/待开始状态）与评审卡片（评论 + 批准操作）；滚动区域高度 320px，全部文案中英文本地化，滚动目标仍为 `#config-goto-review`。
- 同步 ProviderPages 测试中两处过期断言：页面文案已于 2026-07-30 改为「基础预设 → 应用配置 → 显式属性」，测试仍期待旧标题，导致 9 项中 2 项在 HEAD 即失败。
- 验证：ProviderPages 9/9 通过；unsupported macro 扫描 697 个源文件 0 findings；Prettier、ESLint 通过。

### 2026-08-03 国际化组件级英文覆盖案例整理

- 将「组件级英文覆盖」的控件网格用 `elf-card variant="outlined"` 包裹，并让网格项顶部对齐，预览不再显得零散；案例 Template 代码与真实预览同步。
- 验证：ProviderPages 9/9 通过；Prettier、ESLint 通过；浏览器页面 0 error / 0 warning。

### 2026-08-03 Alert 强调样式重设计

- 移除 Alert tonal/elevated/filled 的 4px/8px 粗色左边框与彩色发光阴影；`prominent` 改为 3px 圆角渐隐强调条 + 更深表面，图标从 40px 圆形气泡改为 32px 圆角方形磁贴，`elevated` 阴影收敛为中性阴影。
- 页面章节「粗色强调条」更名为「强调提示」，PropsTable 描述同步；Alert 测试 14 项通过，浏览器验证截图归档。

### 2026-08-03 指令页真实化与选择器细节修正

- 交叉观察器：示例改为「推荐阅读」信息流，滚动到底部哨兵进入视口后追加 4 条（8→12），滚动条改为细圆角样式；同时修正 `onIntersect` 未先判断可见性就追加数据的问题。
- 变更监听：「添加 DOM 节点」按钮移入 Playground 标题栏（status slot），记录列表改为日志样式。
- 波纹：卡片从大面积蓝色 + 16px 圆角改为中性深色表面 + 12px 圆角 + 主色小标签，阴影中性化。
- 滚动：示例改为「版本记录」列表，容器内加入吸顶进度条与位置/进度状态。
- 颜色选择器：新增「RGB 滑块微调」案例（R/G/B 三个滑块 + 色块预览 + 选择器双向同步）。
- 日期选择器：展开面板与输入框不再有 8px 间隙，CSS `top` 与锚定 `offset` 同步改为 -1px 贴合。
- 验证：DatePicker 与 ColorPicker 页面测试 25 项通过；Prettier、ESLint、unsupported macro 扫描通过；浏览器逐页验证交互，截图归档于 `output/playwright/`。

### 2026-08-03 BackTop 案例真实化与按钮定位修正

- 基础用法示例改为「版本记录」长列表（6 条发布记录 + 吸顶标题），自定义外观示例改为「本周任务」清单（完成/进行中/待开始状态），两处均保留 `elf-scrollbar` 容器与滚动阈值演示。
- 按钮位置修正：BackTop 组件默认 `position: fixed` 会固定到视口右下角，与演示容器脱节；示例改为 `style="position:absolute"` + `bottom/right=24px`，按钮现在锚定在演示容器内右下角，视觉上像真实 App 的 FAB。
- 验证：BackTopPage 与 BackTop 组件测试 8 项通过；Prettier、ESLint 通过；浏览器实测按钮距容器右下 24px、滚动后正常显示，截图归档于 `output/playwright/`。

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

- dev 站点被未完成的 Labs 路由阻塞：`apps/website/src/routes/index.ts` 引用了 8 个尚未创建的 Ai*Page（AiLoading/AiThinking/AiApproval/AiTaskRow/AiContextCard/AiRecommendation/AiCommandSearch/AiCodeBlock），站点在 dev 下无法挂载；本轮验证期间临时指向 AiChatPage 并在截图后原样恢复，补齐页面或摘除路由前浏览器验收无法进行。
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
