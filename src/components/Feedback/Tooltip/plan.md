# Tooltip Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Tooltip`
- Element Plus 文档：`tooltip.md`、`popover.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tooltip.md

#### API

- `append-to`
- `effect`
- `content`
- `raw-content`
- `placement`
- `fallback-placements`
- `visible / v-model:visible`
- `disabled`
- `offset`
- `transition`
- `popper-options`
- `arrow-offset ^`
- `show-after`
- `show-arrow`
- `hide-after`
- `auto-close`
- `popper-class`
- `popper-style`
- `enterable`
- `teleported`
- `trigger`
- `virtual-triggering`
- `virtual-ref`
- `trigger-keys`
- `persistent`
- `aria-label ^`
- `focus-on-target ^`
- `before-show`
- `show`
- `before-hide`
- `hide`
- `default`
- `popperRef`
- `contentRef`
- ...另有 4 项，详见来源文档

#### Attributes

- `append-to`
- `effect`
- `content`
- `raw-content`
- `placement`
- `fallback-placements`
- `visible / v-model:visible`
- `disabled`
- `offset`
- `transition`
- `popper-options`
- `arrow-offset ^`
- `show-after`
- `show-arrow`
- `hide-after`
- `auto-close`
- `popper-class`
- `popper-style`
- `enterable`
- `teleported`
- `trigger`
- `virtual-triggering`
- `virtual-ref`
- `trigger-keys`
- `persistent`
- `aria-label ^`
- `focus-on-target ^`

#### Events

- `before-show`
- `show`
- `before-hide`
- `hide`

#### Slots

- `default`
- `content`

#### Exposes

- `popperRef`
- `contentRef`
- `isFocusInsideContent`
- `updatePopper`
- `onOpen`
- `onClose`
- `hide`

### popover.md

#### API

- `trigger`
- `trigger-keys ^`
- `title`
- `effect`
- `content`
- `width`
- `placement`
- `disabled`
- `visible / v-model:visible`
- `offset`
- `transition`
- `show-arrow`
- `popper-options`
- `popper-class`
- `popper-style`
- `show-after`
- `hide-after`
- `auto-close`
- `tabindex`
- `teleported`
- `append-to ^`
- `persistent`
- `virtual-triggering`
- `virtual-ref`
- `tooltip`
- `default`
- `reference`
- `show`
- `before-enter`
- `after-enter`
- `hide`
- `before-leave`
- `after-leave`

#### Attributes

- `trigger`
- `trigger-keys ^`
- `title`
- `effect`
- `content`
- `width`
- `placement`
- `disabled`
- `visible / v-model:visible`
- `offset`
- `transition`
- `show-arrow`
- `popper-options`
- `popper-class`
- `popper-style`
- `show-after`
- `hide-after`
- `auto-close`
- `tabindex`
- `teleported`
- `append-to ^`
- `persistent`
- `virtual-triggering`
- `virtual-ref`
- `tooltip`

#### Slots

- `default`
- `reference`

#### Events

- `show`
- `before-enter`
- `after-enter`
- `hide`
- `before-leave`
- `after-leave`

#### Exposes

- `hide`

## 当前 ElfUI API 快照

### Props

- `content`
- `disabled`
- `effect`
- `hideAfter`
- `placement`
- `showAfter`
- `trigger`
- `visible`

### Events

- 暂无记录

### Slots

- `content`
- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 稳定核心契约：hover/focus/click/contextmenu/manual、延迟、auto 避让、长内容与触屏长按。
- [x] P1 生命周期事件：before-show/show/before-hide/hide；不暴露 CSS 动画的内部帧事件。
- [x] P1 插槽与公开方法：default/content、show/hide/isVisible/updatePosition，公开类型同步导出。
- [x] P1 完成 Escape、外部点击、计时器清理、`aria-describedby` 建立/恢复及受控显隐同步。
- [x] P2 页面示例覆盖方向、触发方式、键盘、长内容、自动避让和长按，Template / Script 可复制。
- [x] P2 组件测试、页面冒烟、类型导出与真实浏览器截图纳入本轮验收。
- [ ] P2 可选扩展：虚拟触发、复杂滚动容器锚定和挂载目标适配器；`raw-content` 因安全策略不进入默认 API。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、类型检查和目标测试通过。

## 2026-07-22 键盘、长内容与可访问描述

- [x] `focus` 触发时为目标建立 `aria-describedby`，隐藏或销毁后恢复目标原属性。
- [x] Escape 可关闭提示且不移动焦点；延迟计时器在销毁时完整清理。
- [x] 新增 `placement="auto"` 方向避让和 `max-width` 长内容约束。
- [x] 新增键盘焦点、自动避让与长内容案例，并完成组件/页面测试及截图。
- [x] 补齐触屏长按：默认适配 hover / focus，支持触发延迟和移动容差，松手保持、外部点击关闭。
- [x] 新增长按手势案例，补齐 Template / Script、组件测试、页面测试和真实页面截图。
- [ ] P2 后续补虚拟触发元素和复杂滚动容器锚定适配器。
