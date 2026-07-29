# MessageBox Element Plus API 对标计划

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
