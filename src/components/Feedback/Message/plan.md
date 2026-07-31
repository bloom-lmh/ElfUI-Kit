# Message Element Plus API 对标计划

## 2026-07-31 Transition 生命周期批次

- [x] 用 Core `<Transition name="elf-message" appear>` 接管 Message 的结构性进入与退场，删除 `data-closing`、退场 keyframes 和 `220ms` 结构销毁 timer。
- [x] 保留 `duration` 自动关闭 timer 作为服务业务语义；组件公开 `close()` 只启动一次 leave，`after-leave` 发出唯一 `close`，service 随后统一完成栈移除、host 销毁与 `onClose`。
- [x] 补齐 `MessageProps`、`MessageEmits`、`MessageSlots`、`MessageExpose`、`MessageElement` 公共类型；重复关闭、`closeAll()`、外部卸载、回调时序和 reduced motion 有回归覆盖。
- [x] 聚焦矩阵：Message、MessagePage、service defaults、framework API adoption 共 4 个测试文件、25 项通过；Prettier、ESLint、CSpell 与 diff check 通过。
- [ ] 浏览器完成 1440×1000、Material、英文页面布局与 Playground 居中检查，并成功命中“三条消息”交互；Chrome 控制连接在交互后截图和移动端复核时超时，本批不把未完成的堆叠退场、390px、Midnight 与中文矩阵记为通过。

## 2026-07-29 detached service locale

- [x] Document-level Message hosts use the default locale context backed by `document.documentElement.lang`, while explicit LocaleProvider descendants continue to take priority.
- [x] Keep the detached close-button label covered by an English regression test.

## 2026-07-19 surface consistency

- [x] Use the compact shared small radius for all message types while preserving themed surfaces and stack spacing.
- [x] Keep dark-theme foreground/background tokens covered by focused tests.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Feedback/Message`
- Element Plus 文档：`message.md`、`message-box.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### message.md

#### API

- `message`
- `type`
- `plain ^`
- `icon`
- `dangerouslyUseHTMLString`
- `customClass`
- `duration`
- `showClose`
- `onClose`
- `offset`
- `placement ^`
- `appendTo`
- `grouping`
- `repeatNum`
- `close`

#### Methods

- `close`

### message-box.md

#### API

- `autofocus`
- `title`
- `message`
- `dangerouslyUseHTMLString`
- `type`
- `icon`
- `closeIcon ^`
- `customClass`
- `customStyle`
- `modal`
- `modalClass`
- `callback`
- `showClose`
- `beforeClose`
- `distinguishCancelAndClose`
- `lockScroll`
- `showCancelButton`
- `showConfirmButton`
- `cancelButtonText`
- `confirmButtonText`
- `cancelButtonType ^`
- `confirmButtonType ^`
- `cancelButtonLoadingIcon ^`
- `confirmButtonLoadingIcon ^`
- `cancelButtonClass`
- `confirmButtonClass`
- `closeOnClickModal`
- `closeOnPressEscape`
- `closeOnHashChange`
- `showInput`
- `inputPlaceholder`
- `inputType`
- `inputValue`
- `inputPattern`
- ...另有 8 项，详见来源文档

## 当前 ElfUI API 快照

### Props

- `danger`
- `error`
- `info`
- `success`
- `warning`

### Events

- `close`

### Slots

- `default`

### Exposes

- `danger`
- `error`
- `info`
- `success`
- `warning`

## 差距与任务

- [x] P1 稳定函数契约：字符串/选项入口、五种语义、duration/closable/action/position/offset/zIndex/customClass/themeTokens。
- [x] P1 回调与句柄：onAction/onClick/onClose、单实例 close() 与 closeAll()，回调触发时机有测试。
- [x] P1 组件只暴露 `close()`；内部 closing 状态不泄漏到公共实例。
- [x] P1 完成顶部/底部独立堆叠、关闭后重排、计时器清理、status/live-region 与本地化关闭标签。
- [x] P2 页面示例覆盖语义类型、持续时间、堆叠关闭、操作与上下位置，Template / Script 可复制。
- [x] P2 组件测试、页面冒烟、类型导出与真实浏览器截图纳入本轮验收。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、类型检查和目标测试通过。
