# Dialog Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Dialog`
- Element Plus 文档：`dialog.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### dialog.md

#### API

- `model-value / v-model`
- `title`
- `width`
- `fullscreen`
- `top`
- `modal`
- `modal-penetrable ^`
- `modal-class`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `append-to-body`
- `append-to ^`
- `lock-scroll`
- `open-delay`
- `close-delay`
- `close-on-click-modal`
- `close-on-press-escape`
- `show-close`
- `before-close`
- `draggable`
- `overflow ^`
- `center`
- `align-center ^`
- `destroy-on-close`
- `close-icon`
- `z-index`
- `header-aria-level ^`
- `transition ^`
- `custom-class ^`
- `default`
- `header`
- `footer`
- `title ^`
- ...另有 8 项，详见来源文档

#### Attributes

- `model-value / v-model`
- `title`
- `width`
- `fullscreen`
- `top`
- `modal`
- `modal-penetrable ^`
- `modal-class`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `append-to-body`
- `append-to ^`
- `lock-scroll`
- `open-delay`
- `close-delay`
- `close-on-click-modal`
- `close-on-press-escape`
- `show-close`
- `before-close`
- `draggable`
- `overflow ^`
- `center`
- `align-center ^`
- `destroy-on-close`
- `close-icon`
- `z-index`
- `header-aria-level ^`
- `transition ^`
- `custom-class ^`

#### Slots

- `default`
- `header`
- `footer`
- `title ^`

#### Events

- `open`
- `opened`
- `close`
- `closed`
- `open-auto-focus`
- `close-auto-focus`

#### Exposes

- `resetPosition ^`
- `handleClose ^`

## 当前 ElfUI API 快照

### Props

- `beforeClose`
- `closable`
- `closeOnEscape`
- `closeOnMask`
- `lockScroll`
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

- [x] P1 稳定核心契约：`v-model:open`、四档尺寸、遮罩/Escape 关闭、滚动锁与异步 `beforeClose`。
- [x] P1 生命周期事件：`open`、`opened`、`close`、`closed`、`open-auto-focus`、`close-auto-focus`。
- [x] P1 插槽与公开方法：default/header/footer、`close()`、`handleClose()`，公开类型同步导出。
- [x] P1 完成 Top Layer 投射、嵌套层级、焦点圈闭/恢复、最上层 Escape 与 ARIA 对话框语义。
- [x] P2 页面示例已包含受控状态、异步关闭守卫、焦点与嵌套边界，Template / Script 可复制。
- [x] P2 组件测试、页面冒烟、类型导出与真实浏览器截图纳入本轮验收。
- [ ] P2 可选扩展：自由宽度、拖拽、动态挂载目标和过渡适配器；不把底层实现参数纳入稳定 P1 API。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、类型检查和目标测试通过。

## 2026-07-22 焦点与嵌套浮层回归

- [x] 打开后优先聚焦 `[autofocus]`，否则聚焦首个可交互元素或对话框面板。
- [x] Tab / Shift+Tab 在最上层对话框内循环，支持穿透组件 ShadowRoot 收集真实焦点元素。
- [x] Escape 只关闭最上层嵌套对话框，关闭动画完成后恢复触发元素焦点。
- [x] 补 `open-auto-focus` / `close-auto-focus` 事件、页面案例与组件/页面回归测试。

## 2026-07-28 模态 Overlay 架构收敛

- [x] Dialog 不再自行扫描 DOM 判断层级，改用共享 modal overlay stack。
- [x] 焦点捕获、初始聚焦、Tab 圈定与关闭后恢复收敛到 focus scope / controller。
- [x] Escape、滚动锁与文档级键盘监听由 `useModalOverlay` 生命周期适配器统一管理。
- [x] 增加 Dialog 内打开 Drawer 的跨组件嵌套案例；Escape 依次关闭最上层浮层。
- [x] Chrome 验证两次 Escape 的关闭顺序、焦点恢复与 0 console warning；截图：`output/playwright/dialog-drawer-overlay-stack.png`。
