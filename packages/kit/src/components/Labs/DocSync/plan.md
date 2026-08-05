<!-- cspell:words syncchange docsync editstart -->

# DocSync 双栏同步面板

## 契约

- Props: `blocks`（共享块模型）、`leftMode/rightMode`（source | preview）、`leftLabel/rightLabel`、`lockScroll`、`overscan`、`estimatedHeight`、`split`、`height`、`ariaLabel`。
- Events: `activate`（`id | null`）、`syncchange`（`{ side, id }`）。
- Expose: `activate(id)`、`clearActive()`、`scrollTo(id, side)`。
- Host: `active-id` 属性、`--_doc-sync-height` CSS 变量。

## 开放标准（ElfUI Sync Document Protocol）

- 块模型：`{ id?, type, level?, text?, items?, rows?, refs?, meta? }`；`id` 缺省时按 `sync-{type}-{fnv1a(type + 归一化文本 + 同级序号)}` 确定性生成。
- 渲染契约：任意渲染器输出带 `data-sync-id`（可选 `data-sync-type`）的块即可参与同步；组件内置 source/preview 两种通用渲染。
- 视口适配：虚拟窗口基于 `buildVirtualOffsets` + `computeVariableVirtualWindow`，两侧维护测量高度，滚动锚点用偏移数组二分定位。

## 行为

- 双向锚点滚动：滚动一侧 → 取视口顶部块 id → 另一侧滚动到同 id 块顶部；程序化滚动用抑制标志防止反馈环，`lockScroll` 可关闭跟随。
- 点击/键盘激活：块获得 `is-synced` 高亮 + 两侧边距指示条；目标块不在视口时先滚动到目标再标记。
- 虚拟滚动：只渲染可见窗口 + overscan；渲染后用 ResizeObserver 测量块高并维护偏移，视口上方块尺寸变化时保持视觉锚点。
- 懒渲染：块内容仅在进入窗口时渲染（`v-for` 窗口切片）。

## 验证

- [x] 组件测试覆盖模型 id 生成、source/preview 渲染、虚拟窗口、点击激活标记、滚动锚点同步、键盘切换。
- [x] 页面案例：md → word 双栏同步、latex → word 双栏同步。

## 2026-08-04 插拔契约与文档页

- [x] 新增内容无关插拔契约：`source + parse`（自定义解析器，source 变化时重新解析）与 `renderLeft/renderRight`（自定义渲染器，返回字符串视为可信 HTML，缺省回退内置 source/preview）；`blocks` 直连模式保留。
- [x] 渲染内容统一通过本地 `v-doc-sync-content` 指令挂载（复用 kit 列表渲染器思路，字符串走 innerHTML、Node 走 appendChild）。
- [x] 新增 `Labs/DocSyncPage`：Markdown → Word 与 LaTeX → Word 两个真实案例（同一个 `renderWordBlock` 渲染器 + 两个自定义解析器，证明“换内容不换组件”）、滚动锁定开关、激活状态读条、开放标准 CodeCard（块模型/解析器/渲染器）与完整 API 表。
- [x] 注册路由 `/labs/doc-sync`、导航、菜单图标与信息架构测试；页面演示内容按 locale 双语（zh/en 源文本）。
- [x] 修复模板作用域 `split` ref 与 prop 同名遮蔽：ref 改名 `splitRatio`，宏模板类型检查通过。
- [x] 页面演示源文本改用 `\n` join 数组：宏编译器会对多行模板字面量重新缩进，导致 Markdown/LaTeX 解析错位；数组 join 规避该行为。
- [x] 开放标准以案例展示：新增「最小实现」Playground（十几行 `parse` + `render` 的实时同步面板，源码/预览双栏 + 点击高亮），与协议 CodeCard 同处「开放标准」章节。
- [x] LaTeX 与最小实现案例加长到可滚动：LaTeX 源扩展为引言/安装/公式/记号/表格对比/结论六节（含 `tabular` 表格，解析器新增 tabular 行收集），最小实现扩展为 16 项发布清单；Markdown 源补充 FAQ 一节；三个案例左右双栏均真实可滚动（内容高 627–861px，视口 351px）。

## 2026-08-04 编辑同步与面板视觉升级

- [x] 双击编辑：新增 `editable`（默认 true）；双击块进入编辑，双侧面板同时显示同一草稿 textarea，输入实时镜像，Esc 取消、Ctrl/⌘+Enter 或失焦保存；提交后双栏渲染同步更新，并派发 `editstart` / `edit` 事件（携带更新后的块）。列表按行、表格按 `|` 分隔编辑。
- [x] 面板视觉升级：公开 CSS 变量（`--doc-sync-bg/pane-bg/header-bg/header-color/border/radius/shadow/accent/font/heading-font`），面板头加强调色圆点与渐变底色、块圆角/悬停/激活渐变、分割条改为 1px 发丝线 + 强调色悬停；页面新增「自定义面板样式」暖纸主题案例与 CSS 变量 API 表。
- [x] 验证：DocSync 组件 10 项、DocSyncPage 4 项聚焦测试通过；website typecheck 0 错误；浏览器实测双击编辑双栏同步、Esc/失焦提交、自定义变量生效、分割条/标题点样式正确，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-panels-polished.png`、`docsync-editing.png`、`docsync-custom-style.png`。

## 2026-08-05 编辑器 × 文档双主题（左暗右亮、行号、刻度尺、统一滚动）

- [x] 视觉重构：左面板默认深色代码编辑器（`--doc-sync-source-bg` 等变量、等宽字体、块级行号列），右面板保持亮色纸张文档；`DocSyncBlock` 新增 `line` 起始行号，多行块行号显示起止（如 `13–15`）。
- [x] 顶部刻度尺：`ruler`（默认 true）在源码面板标题栏下方渲染 0–100 刻度与数字标签，可关。
- [x] 滚动条重构：隐藏原生滚动条（`scrollbar-width: none`），左右面板各一条 3px 自定义细滚动条（悬停显示、thumb 按比例定位），容器底部新增联合进度线（`--_doc-sync-progress`，直接写 host CSS 变量，跟随左侧滚动比例）。
- [x] 页面：解析器补行号、Props/CSS 变量表补 `lineNumbers`/`ruler`/`--doc-sync-source-*`，自定义样式案例同步覆盖源码面板暖色变量。
- [x] 验证：DocSync 组件 12 项、DocSyncPage 4 项聚焦测试通过；全仓 typecheck 0 错误；kit/website 构建通过；浏览器实测左暗右亮、行号含区间、刻度尺 11 刻度 6 标签、细滚动条与进度线随滚动更新（37.9%）、编辑同步回归正常，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-editor-theme.png`、`docsync-editor-scrolled.png`、`docsync-custom-theme-new.png`。

## 2026-08-05 分割线圆形交换把手

- [x] 分割线不再只是直线：中央增加 34px 圆形交换按钮（swap-horizontal 图标），仍保留拖拽调宽能力；拖拽时按钮通过 `--_doc-sync-split` host CSS 变量实时跟随分割线位置。
- [x] 点击把手左右面板角色互换：标题、明暗主题、行号列、刻度尺、渲染器全部镜像（左侧变 Word 亮色、右侧变 Markdown 深色编辑器），滚动锚点/高亮/编辑同步基于 block id 不受影响；派发 `swap` 事件。
- [x] 验证：DocSync 组件 13 项、DocSyncPage 5 项聚焦测试通过；全仓 typecheck 0 错误；kit/website 构建通过；浏览器实测按钮居中于分割线、拖拽到 70% 后按钮精确跟随、点击互换后标题/明暗/行号整套镜像，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-swap-handle.png`、`docsync-swapped.png`。

## 2026-08-05 行号与刻度尺开关演示

- [x] `lineNumbers` / `ruler` 本就是公开开关（默认 true、可关闭），文档 Markdown 案例控件区新增「行号」「刻度尺」两个 `elf-switch`，实时切换演示；Props 表已有对应行。
- [x] 验证：DocSyncPage 6 项聚焦测试通过（含关闭后 `.doc-sync-line` / `.doc-sync-ruler` 消失断言）；浏览器实测两个开关关闭后行号列与刻度尺即时消失、`lineNumbers`/`ruler` 属性同步为 false，控制台 0 warning / 0 error；截图归档 `output/playwright/docsync-toggles-off.png`。
- [x] 既有能力回归：md/latex/最小实现三种源解析、Word 渲染、双向锚点滚动、锁定开关、点击双栏高亮 + 边距条、移动端无溢出均保持正常；路由信息架构 7 项通过。全仓 typecheck 仍被并发会话的 Labs/MdOutline 模板错误与 MdPage 类型声明错误阻塞（非本组件）。
