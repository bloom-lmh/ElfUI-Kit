# Drawer Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Drawer`
- Element Plus 文档：`drawer.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### drawer.md

#### API

- `model-value / v-model`
- `append-to-body`
- `append-to ^`
- `lock-scroll`
- `before-close`
- `close-on-click-modal`
- `close-on-press-escape`
- `open-delay`
- `close-delay`
- `destroy-on-close`
- `modal`
- `modal-penetrable ^`
- `direction`
- `resizable ^`
- `show-close`
- `size`
- `title`
- `with-header`
- `modal-class`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `z-index`
- `header-aria-level ^`
- `custom-class ^`
- `open`
- `opened`
- `close`
- `closed`
- `open-auto-focus`
- `close-auto-focus`
- `resize-start ^`
- `resize ^`
- `resize-end ^`
- ...另有 5 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `append-to-body`
- `append-to ^`
- `lock-scroll`
- `before-close`
- `close-on-click-modal`
- `close-on-press-escape`
- `open-delay`
- `close-delay`
- `destroy-on-close`
- `modal`
- `modal-penetrable ^`
- `direction`
- `resizable ^`
- `show-close`
- `size`
- `title`
- `with-header`
- `modal-class`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `z-index`
- `header-aria-level ^`
- `custom-class ^`

#### Events

- `open`
- `opened`
- `close`
- `closed`
- `open-auto-focus`
- `close-auto-focus`
- `resize-start ^`
- `resize ^`
- `resize-end ^`

#### Slots

- `default`
- `header`
- `footer`
- `title ^`

#### Exposes

- `handleClose`

## 当前 ElfUI API 快照

### Props

- `beforeClose`
- `closable`
- `closeOnEscape`
- `closeOnMask`
- `direction`
- `lockScroll`
- `modal`
- `open`
- `size`
- `title`

### Events

- `close`
- `closed`
- `opened`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 稳定核心契约：`v-model:open`、四方向、尺寸约束、遮罩/Escape 关闭、滚动锁与异步 `beforeClose`。
- [x] P1 生命周期与调整事件：open/opened/close/closed、焦点事件和 resize-start/resize/resize-end。
- [x] P1 插槽与公开方法：default/header/footer、`close()`、`handleClose()`、`resetSize()`，公开类型同步导出。
- [x] P1 完成鼠标/触屏拖动、键盘调宽、嵌套层级、焦点圈闭/恢复、最上层 Escape 与 separator ARIA。
- [x] P2 页面示例已包含四方向、可调整尺寸、移动端安全区和嵌套边界，Template / Script 可复制。
- [x] P2 组件测试、页面冒烟、类型导出与真实浏览器截图纳入本轮验收。
- [ ] P2 可选扩展：动态挂载目标、延迟开关和自定义过渡适配器。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、类型检查和目标测试通过。

## 2026-07-22 焦点、嵌套与窄屏回归

- [x] 打开后优先聚焦 `[autofocus]`，Tab / Shift+Tab 在最上层抽屉内循环。
- [x] Escape 只关闭最上层嵌套抽屉，关闭动画结束后恢复触发元素焦点。
- [x] `aria-modal` 与 `modal` 保持一致，补 `open-auto-focus` / `close-auto-focus` 事件。
- [x] 新增移动端安全宽度、滚动锁和焦点恢复案例，并完成组件/页面测试及截图。
- [x] 补齐 `resizable`、`minSize`、`maxSize`，支持四方向拖动、键盘方向键、Home / End 和尺寸边界。
- [x] 补齐 `resize-start` / `resize` / `resize-end`、`resetSize()`、分隔条无障碍语义及中英文标签。
- [x] 新增可调整尺寸案例，完成组件 17 项、页面 2 项测试和真实页面键盘调宽截图。
- [x] P1 补嵌套抽屉可视案例和四方向/移动端关键截图。

## 2026-07-28 模态 Overlay 架构收敛

- [x] Drawer 与 Dialog 共用 modal overlay stack，消除按组件类型查询 DOM 的层级判断。
- [x] 焦点策略、Escape、滚动锁和监听清理由共享 controller / composable 管理。
- [x] mask 关闭只对当前最上层浮层生效，跨组件嵌套不会误关父层。
- [x] 复用 Dialog 混合嵌套案例和跨组件契约测试验证关闭顺序。

## 2026-07-29 beta.20 与整页国际化

- [x] 页面入口、4 个案例、运行时状态、Template/Script 和 API 表完成中英文覆盖。
- [x] API 文档补齐真实 `open` 生命周期事件，并完整说明 resize 事件与 `resetSize()`。
- [x] beta.20 下组件/页面聚焦测试、宏 typecheck、生产构建和打开状态英文扫描通过。
- [x] 真实浏览器验证键盘调宽 420px → 430px、英文无障碍标签与 0 warning / 0 error；截图：`output/playwright/drawer-resizable-en-beta20.png`。

## 2026-07-31 OP-04-TR-02 Transition 生命周期迁移

- [x] 结构显隐改由 Core `<Transition name="elf-drawer" appear>` 管理，移除 `PANEL_LEAVE_MS`、结构定时器、重复投射微任务、手工离场 class 和手工 Teleport 根删除；resize 手势结束后的零延迟点击抑制定时器保留为浏览器事务边界。
- [x] 显式维护快速重开时的 `activeRoot`，同步 restore/project Light DOM，确保投射、焦点和 resize 指向替代根；旧 leave 完成不会触发 `closed`、恢复焦点或释放新浮层资源。
- [x] 四方向位移动画改为 `elf-drawer-enter/leave-*` class 协议，遮罩与面板同一结构事务离场，并补齐 `prefers-reduced-motion`。
- [x] 组件、页面与架构聚焦测试共 3 文件 32 项通过；覆盖事件顺序、leave 完成、快速重开、真实节点身份、Escape、焦点/滚动锁、resize 与离场卸载清理。
- [x] 目标 Prettier、ESLint、CSpell、`git diff --check` 通过；生产构建 1098 modules 通过，仅保留既存大 chunk warning。
- [x] 浏览器验证：1440x1000 Material 中文下 RTL 开关、快速重开、焦点恢复、滚动锁及无横向溢出通过；390x844 Midnight 英文下滚动锁、无横向溢出、separator 键盘调宽 420px → 430px、关闭清理通过，控制台 0 warning / 0 error。截图仅用于现场检查，按要求未保存文件；移动打开态截图通道超时，DOM、尺寸与资源状态已独立核验。
- [ ] 仓库全量 typecheck：Unsupported Macro 1114 文件 0 问题；被本批范围外的 `OverviewCard` 2 个宏类型错误与 `CodeCard` 2 个 TypeScript 错误阻断，Drawer 无报错。
