# MessageBox Element Plus API 对标计划

## 2026-07-31 Transition 生命周期批次

- [x] 复用 Core `<Transition name="message-box" appear>` 管理结构性 enter/leave，删除 `closeTimer`、结构 `setTimeout` 与 `.is-closing`。
- [x] 继续复用 `useModalOverlay`；leave 开始释放 overlay stack，leave 完成后先恢复焦点与滚动，再派发 `closed` 让 service 结算 Promise 并删除 host。
- [x] `startClose()` 返回事务是否被接受，service 仅在接受后提交 action/value，避免 confirm leave 期间的 hashchange 覆写最终结果。
- [x] 覆盖重复关闭、两层 Escape 交接、leave 中卸载、异步 guard 卸载、输入验证、Provider defaults 与 action 竞态；5 个文件、35 项测试通过。
- [x] 真实 Chromium 现场检查 Material English：1440×1000 与 390×844 的确认框均居中、无裁切；移动端 `scrollWidth = clientWidth = 390`，截图只用于现场判断，未写入仓库。

生成时间：2026-07-29

## 定位

MessageBox 用于简短的 alert、confirm 和 prompt 任务。复杂表单与任意布局继续使用 Dialog，不把 MessageBox 扩张成第二套 Dialog。

## 稳定契约

- [x] `ElfMessageBox()`、`alert()`、`confirm()`、`prompt()` 和 `closeAll()`。
- [x] Promise 确认结果、取消/关闭拒绝原因与 `distinguishCancelAndClose`。
- [x] 输入校验、异步 `beforeClose`、按钮 pending 状态和回调兼容。
- [x] Escape、遮罩、滚动锁、最上层认领、焦点圈闭和焦点恢复。
- [x] 字符串、DOM Node 与 Node factory 内容；不解析危险 HTML 字符串。
- [x] ConfigProvider `services.messageBox` 默认值与 `useMessageBox()`。
- [x] 语义色、主题 tokens、RTL 兼容、reduced-motion 和可访问名称。

## 有意不复制

- 不支持 `dangerouslyUseHTMLString`；使用可信 DOM Node 或 slot。
- 拖拽、任意溢出和可变复杂内容属于 P2，可在明确交互需求后扩展。
- 不暴露 Vue VNode 或 AppContext，使用 Web Components、DOM Node 与 Provider 契约。

## 验收

- [x] 聚焦测试、完整测试、typecheck、应用构建和库构建通过。
- [x] 中英文页面、Template/Script、API 与真实浏览器交互完成。
