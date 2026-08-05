# MdPage 实验组件计划

生成时间：2026-08-04

## 定位

- 原生 Markdown 渲染页面组件，slot / content / src 三层输入，输出 VitePress 风格排版。
- 复用 CodeCard 的 Shiki 单例做代码高亮；Shadow DOM 隔离样式；`--elf-md-*` CSS 变量 + `part="content"` 支持个性化标题与页面样式。

## 公共契约

- Props：`content`、`src`、`max-width`、`base-heading-level`、`code-theme`、`toc`、`allow-html`、`density`。
- Events：`toc-change`、`title-change`、`load`、`error`。
- Expose：`render()`、`outline()`、`getHtml()`。
- Slots：默认（Markdown 源码）、`loading`、`error`。

## 行为约定

- 输入优先级：默认 slot > `content` prop > `src` 文件。
- Frontmatter 仅解析 `title`，通过 `title-change` 上报；标题锚点按 `base-heading-level` 偏移并生成唯一 slug。
- 代码块先输出转义占位，再用共享 Shiki 实例异步高亮；`code-theme="auto"` 跟随 `data-theme` 与 `prefers-color-scheme`。
- `allow-html` 默认开启（VitePress 行为），允许在 Markdown 中嵌入 ElfUI 组件。

## 验收清单

- [x] 组件单测覆盖 slot / content / src / frontmatter / toc / html 转义 / expose。
- [x] Labs 页面提供单个 Playground 案例与 API 表。
- [x] 路由、导航、菜单图标与信息架构测试同步。
- [x] Prettier、宏扫描、类型检查、中英审计通过。

## 2026-08-04 增强路线图

### 分层渲染管线（核心扩展点）

```
源码
 └─ 1) 解析层：默认 markdown-it + 内置插件；:parser 可完全接管
 └─ 2) 规则增强层：:extend = (md, ctx) => void，追加/覆盖插件与渲染规则
 └─ 3) 渲染后处理层：:render = (html, ctx) => html，注入组件或短代码
 └─ 4) DOM 增强层：Shiki 高亮、复制按钮、base 重写、link-click、sanitize
```

### 默认插件集（全部可开关）

- `taskLists`：GFM 任务列表。
- `containers`：`::: tip / warning / danger / info` 提示容器，支持自定义标题。
- `footnotes`：脚注。
- `codeTools`：代码块语言标牌、复制按钮、`{1,3-5}` 行高亮、`title="文件名"`。

### 新增公共契约

- Props：`parser`、`extend`、`render`、`task-lists`、`containers`、`footnotes`、`code-tools`、`base`、`theme`、`tokens`、`sanitize`。
- Events：`link-click`（cancelable，preventDefault 后不跳转）、`active-change`（滚动跟踪）。
- 主题：`default / minimal / paper / midnight` 四套 `--elf-md-*` 变量预设；`tokens` prop 逐变量覆盖。

### 实施批次

- [x] 第一批：解析/渲染扩展点 + 默认插件集 + 代码工具 + memoization。
- [x] 第二批：`base` 相对路径重写、`link-click` 拦截。
- [x] 第三批：四套主题预设、`tokens` prop、`sanitize`（DOMPurify 动态加载 + DOM 清洗兜底）。
- [x] 第四批：滚动跟踪 `active-change` + `elf-md-outline` 配套组件。
- [x] 第五批：代码块视口懒高亮、标题 `§` 锚点、复制按钮 `aria-live`。

## 2026-08-04 全局默认与标签覆盖

- [x] `labels` prop 覆盖复制 / 加载文案。
- [x] `elf-md-outline` 空状态。
- [x] 实验区新增“全局默认配置”案例：`elf-defaults-provider` 注入 md-page 默认，实例属性优先。

## 2026-08-04 滚动容器与公开工具

- [x] `scroll-root` prop：滚动跟踪与代码懒高亮的 IntersectionObserver root。
- [x] `anchors` prop：可关闭悬停标题锚点。
- [x] 公开导出：`createMdPipeline`、`normalizeMarkdownSource`、`parseFrontmatter`、`resolveMdPageTheme`、`rewriteRelativeUrls` 与 `DEFAULT_MD_CONTAINERS` / `MD_THEMES` / `MD_CODE_THEMES` / `MD_DENSITIES`。

## 2026-08-04 体验打磨

- [x] 提示容器（tip / warning / danger / info）增加前置图标。
- [x] 渲染图片自动补 `loading="lazy"`。
- [x] `src` 加载状态改为骨架屏（保留 `sr-only` 加载文案）。
- [x] 锚点与大纲滚动遵循 `prefers-reduced-motion`。
- [x] 实验区新增“自定义解析规则”案例：`extend` / `render` 运行时替换占位符。

## 2026-08-04 代码组与容器标题

- [x] VitePress 风格 `::: code-group`：tab 切换、懒高亮联动、`aria-selected`。
- [x] 提示容器标题支持行内 Markdown（`::: tip **重要**`）。
- [x] `code-groups` 开关（默认开启）。

## 2026-08-04 指南页与键盘导航

- [x] 代码组 tab 支持方向键 / Home / End 键盘导航，roving tabindex。
- [x] 新增 `--elf-md-scroll-margin-top` 变量，锚点滚动偏移可配置。
- [x] 新增 `/guide/markdown-page` 使用指南页（快速开始、输入方式、语法、主题、扩展点、大纲与全局默认）。

## 2026-08-04 发布前验证

- [x] `pnpm verify:package`：库构建 + 34 个顶层产物校验通过；DOMPurify 拆为独立懒加载 chunk（41KB），markdown-it 正常打进 labs 产物。
- [x] `pnpm build`：网站生产构建 1300 模块通过。
- [x] 全量 kit 测试 1568/1569 通过；唯一失败为 CodeCard 既有主题映射断言（light/dark 反色），与 md 组件无关。

## 2026-08-05 远程文件案例与 base 修复

- [x] 修复 `base` 为相对地址（如 `/md/`）时 `rewriteRelativeUrls` 抛错的缺陷（先按 `document.baseURI` 解析）。
- [x] 实验区新增“远程文件与链接拦截”案例：`src` 加载、`base` 重写、`link-click` 状态回显；配套 `public/md-page-demo.md`。
- [x] `elf-md-outline` 补充 Props / Events / Methods API 表。

## 2026-08-05 Template 代码与案例对齐

- [x] 主案例 Template 补齐 frontmatter、功能清单、任务列表、提示容器、脚注、表格、代码组与 outline，与运行内容同构。
- [x] 全局默认、自定义解析规则案例的 Template 改为运行案例的英文镜像（含 labels、warning 容器、占位符）。
