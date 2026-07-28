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
