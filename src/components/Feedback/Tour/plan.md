# Tour Element Plus API 对标计划

## 2026-07-19 案例回归

- [x] 修复 Playground 标题操作区造成的启动按钮坍缩

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Tour`
- Element Plus 文档：`tour.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tour.md

#### Tour API

- `Property`
- `append-to`
- `show-arrow`
- `placement`
- `content-style`
- `mask`
- `gap`
- `type`
- `model-value / v-model`
- `current / v-model:current`
- `scroll-into-view-options`
- `z-index`
- `show-close`
- `close-icon`
- `close-on-press-escape`
- `target-area-clickable`
- `default`
- `indicators`
- `close`
- `finish`
- `change`

#### Tour Attributes

- `Property`
- `append-to`
- `show-arrow`
- `placement`
- `content-style`
- `mask`
- `gap`
- `type`
- `model-value / v-model`
- `current / v-model:current`
- `scroll-into-view-options`
- `z-index`
- `show-close`
- `close-icon`
- `close-on-press-escape`
- `target-area-clickable`

#### Tour slots

- `default`
- `indicators`

#### Tour events

- `close`
- `finish`
- `change`

#### TourStep API

- `Property`
- `target`
- `show-arrow`
- `title`
- `placement`
- `content-style`
- `mask`
- `type`
- `next-button-props`
- `prev-button-props`
- `scroll-into-view-options`
- `show-close`
- `close-icon`
- `default`
- `header`
- `close`

#### TourStep Attributes

- `Property`
- `target`
- `show-arrow`
- `title`
- `placement`
- `content-style`
- `mask`
- `type`
- `next-button-props`
- `prev-button-props`
- `scroll-into-view-options`
- `show-close`
- `close-icon`

#### TourStep slots

- `default`
- `header`

#### TourStep events

- `close`

## 当前 ElfUI API 快照

### Props

- `current`
- `gap`
- `keyboard`
- `lockScroll`
- `maskClosable`
- `steps`
- `visible`
- `zIndex`

### Events

- `update:current`

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 稳定核心契约：步骤、受控可见/索引、四方向、mask/showClose/contentStyle、键盘、滚动锁、间距与层级。
- [x] P1 事件契约：update:current/change/close/finish，首步即可键盘驱动且流程完成语义固定。
- [x] P1 插槽与公开方法：header/indicators、open/close/prev/next/skip/finish，公开类型同步导出。
- [x] P1 完成目标卸载降级、MutationObserver 跟踪、视口翻转、首焦点/焦点恢复、Escape 与 ARIA dialog。
- [x] P2 页面示例覆盖基础流程、键盘焦点和目标动态卸载，Template / Script 可复制。
- [x] P2 组件测试、页面冒烟、类型导出与真实浏览器截图纳入本轮验收。
- [ ] P2 可选扩展：动态挂载目标、目标区域穿透和按钮配置适配器。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、类型检查和目标测试通过。

## 2026-07-16 首步键盘回归

- [x] Teleport 层使用实例级稳定 ID，首轮模板 ref 尚未建立时仍能精确聚焦当前 Tour 的关闭按钮。
- [x] 键盘监听覆盖打开生命周期，首步无需鼠标交互即可使用方向键；避免遮罩与全局监听重复驱动步骤。
- [x] 键盘案例的状态和启动操作移动到 Playground 标题行。
- [x] 7 项定向测试、构建及暗色真实浏览器方向键 / Esc / 焦点检查通过，控制台无错误和警告。

## 2026-07-29 公共滚动协议

- [x] 目标超出最近滚动容器时使用 ConfigProvider `goTo`，可见目标不启动无用任务。
- [x] 步骤切换、关闭和卸载取消旧滚动任务，滚动完成后刷新目标几何。
- [x] 保持 Tour 操作面板焦点，不把焦点移动到被引导目标。
- [x] 覆盖快速步骤切换取消离屏滚动和焦点稳定性。

## 2026-07-31 Core Transition 与模态所有权收敛

- [x] 使用 Core `Transition` 管理结构进入与退场，删除 180ms 结构定时器和重复面板动画。
- [x] 复用 `useModalOverlay` 统一管理 Escape、焦点作用域、滚动锁和浮层栈所有权。
- [x] 保留 Tour 自有的目标几何、`MutationObserver`、`GoTo` 和滚动任务，并在退场开始时精确释放。
- [x] 快速关闭后重开以活动根节点身份隔离旧 leave，旧根完成时不会释放新事务。
- [x] 添加 reduced-motion、退场完成时序、焦点恢复、滚动锁和快速重开回归测试。
