# PopConfirm Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/PopConfirm`
- Element Plus 文档：`popconfirm.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### popconfirm.md

#### API

- `title`
- `effect ^`
- `confirm-button-text`
- `cancel-button-text`
- `confirm-button-type`
- `cancel-button-type`
- `icon`
- `icon-color`
- `hide-icon`
- `hide-after`
- `teleported`
- `persistent`
- `width`
- `tooltip`
- `confirm`
- `cancel`
- `reference`
- `actions ^`
- `popperRef ^`
- `hide ^`

#### Attributes

- `title`
- `effect ^`
- `confirm-button-text`
- `cancel-button-text`
- `confirm-button-type`
- `cancel-button-type`
- `icon`
- `icon-color`
- `hide-icon`
- `hide-after`
- `teleported`
- `persistent`
- `width`
- `tooltip`

#### Events

- `confirm`
- `cancel`

#### Slots

- `reference`
- `actions ^`

#### Exposes

- `popperRef ^`
- `hide ^`

## 当前 ElfUI API 快照

### Props

- `cancelText`
- `closeOnClickOutside`
- `closeOnEscape`
- `confirmText`
- `content`
- `disabled`
- `placement`
- `title`
- `trigger`
- `visible`
- `width`

### Events

- `update:visible`

### Slots

- `content`
- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 稳定核心契约：四方向、四种触发、受控显隐、禁用、Top Layer、宽度与异步 `beforeConfirm`。
- [x] P1 事件契约：confirm/cancel/open/close/confirm-error/update:visible，确认并发与失败时机有测试。
- [x] P1 插槽与公开方法：default/content/actions、show/hide/toggle/confirm/cancel/isVisible，公开类型同步导出。
- [x] P1 完成碰撞翻转、滚动重定位、焦点圈闭/恢复、Escape、外部点击和 alertdialog ARIA。
- [x] P2 页面示例覆盖基础确认、受控异步、裁切容器与自定义操作，Template / Script 可复制。
- [x] P2 组件测试、页面冒烟、类型导出与真实浏览器截图纳入本轮验收。
- [ ] P2 可选扩展：图标/按钮视觉令牌和持久挂载策略；不公开底层 Popper 实例。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、类型检查和目标测试通过。

## 2026-07-22 文档交互状态

- [x] 基础确认和受控异步案例将交互结果移入 Playground 标题状态区，内容区只保留触发操作。
- [x] 真实浏览器验证确认操作后标题状态即时更新。
- [x] 新增 `beforeConfirm` 异步守卫、提交加载态、重复点击防护及失败重试语义。
- [x] 异步完成、返回 `false` 与 Promise 拒绝均有组件测试覆盖，文档案例使用真实 Promise。
- [x] `teleported` 默认使用原生 Popover Top Layer，支持 top/bottom/left/right 碰撞翻转、视口约束、尺寸更新和外部滚动关闭。
- [x] 新增 `actions` 插槽与 `confirm/cancel` 公开方法；自定义操作仍复用异步守卫、事件和焦点闭环。
- [x] 新增裁切滚动容器案例、组件与页面回归测试和真实浏览器截图。

## 2026-07-31 Transition 生命周期批次

- [x] 复用 Core `<Transition>` 接管 enter/leave，删除结构 `setTimeout`、关闭 class 与重复焦点微任务，并覆盖 reduced motion。
- [x] 复用 `useDismissibleOverlay` 的 `beginClose/completeClose`，leave 开始即释放栈所有权，快速重开以活动面板 identity 隔离旧 leave。
- [x] 触发行为收敛为 wrapper hover 与宿主委托 click/focus 的单 owner；复用 `elf-button` 公共 click，不再逐个绑定 Light DOM 子节点。
- [x] 扩展公共 `focus-scope`，支持 slot 分配节点及嵌套 Shadow DOM；真实 `elf-button` actions 首焦点、首尾 Tab 闭环已有回归。
- [x] 聚焦矩阵 `6 files / 67 tests` 通过；Prettier、ESLint、CSpell、diff-check 通过。
- [x] 真实浏览器检查桌面与 `390×844` 打开态，移动端 `scrollWidth = clientWidth = 390`，控制台 `0 warning / 0 error`；截图仅现场判断，未写入仓库。
