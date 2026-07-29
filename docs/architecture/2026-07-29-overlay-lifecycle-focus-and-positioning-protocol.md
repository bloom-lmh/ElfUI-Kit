# Overlay 生命周期、焦点与定位协议

日期：2026-07-29

## 分层

```text
overlay-protocol
  -> overlay-interaction-controller + overlay-stack
    -> modal-overlay-controller / useDismissibleOverlay
      -> anchored resource lifecycle / component focus policy
        -> Dialog、Drawer、Menu、Dropdown、Select、Picker 等组件
```

- `overlay-protocol.ts` 只拥有 `inactive -> active -> closing -> inactive` 状态和关闭原因。
- `overlay-stack.ts` 只拥有跨实例层级与同一物理事件的唯一认领。
- modal controller 拥有焦点捕获、初始焦点、Tab trap 和动画完成后的焦点恢复。
- dismissible adapter 统一 `escape` / `outside` 请求，具体组件继续决定关闭守卫、选中行为和焦点返回。
- anchored lifecycle 只拥有 ResizeObserver、window/Visual Viewport resize、外部 scroll/wheel/touchmove 与清理。组件注入“关闭”或“重新定位”策略。

## 关闭原因

内部稳定原因集合：

- `escape`
- `outside`
- `backdrop`
- `action`
- `selection`
- `external-motion`
- `programmatic`

Dialog 和 Drawer 已在关闭守卫通过后记录实际原因，不改变公开 `close` / `closed` 事件参数。非模态组件的公开事件保持原契约。

## 焦点与辅助技术

- modal 在激活前捕获深层 Shadow DOM active element，只允许最上层 trap，关闭动画完成后恢复。
- 持久隐藏且保留 DOM 的 Dropdown、Select、Cascader 和 Menu 同步使用 `aria-hidden` 与 `inert`。
- 条件渲染并卸载面板的组件不重复增加 `inert`。
- 组件在隐藏持久面板前必须先移出面板内部焦点；不得依赖 `aria-hidden` 自动移动焦点。

## 定位与资源

Dropdown、Autocomplete、Cascader、Pagination、PopConfirm、DatePicker、TimePicker 和 ColorPicker 已接入统一 anchored resource lifecycle。

- Dropdown、Autocomplete、Cascader、Pagination 和 Picker 在外部运动时关闭。
- PopConfirm 在外部运动时刷新固定定位，不关闭。
- Table 的过滤面板保留高频持续重定位热路径。
- Select 当前只需要外部运动关闭，不注册无用 resize/observer。

`readOverlayViewport()` 统一读取 Visual Viewport 尺寸和 offset。定位计算继续使用纯 `computeAnchoredPosition()`。

## 仍未完成

- z-index 分配与 overlay stack 层级尚未形成同一协议。
- `appendTo` / teleport 容器解析仍散落在组件中。
- fixed 定位与非 body 容器、嵌套缩放和 Visual Viewport 键盘场景仍需真实浏览器矩阵。
- Core `useScrollLock` 并发 owner 缺陷修复前，不扩大其采用范围。
