# Loading Element Plus API 对标计划

生成时间：2026-07-05

## 第一批实现

- [x] 基础 props：`loading`、`text`、`fullscreen`、`background`。
- [x] 默认 slot 承载被覆盖内容。
- [x] 接入 Feedback 注册和单测。

## 后续差距

- [x] 补齐 `v-loading` 指令、Loading service、custom svg、lock、body/fullscreen 行为。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、局部受控、background 和 fullscreen 示例。
- [x] 2026-07-14 增加 `spinner / dots / pulse / bars` 四种动效与卡片刷新案例，统一圆角遮罩和暗色主题。
- [x] 2026-07-15 完成指令与 service 生命周期、局部/body/fullscreen 定位、并发滚动锁、自定义 SVG path、公开类型和 API 表；9 项专项测试及真实浏览器交互/截图通过，控制台无错误。
- [x] 2026-07-16 修复四动效案例的模板局部值绑定，确保 spinner / dots / pulse / bars 结构可辨识；全屏 service 默认提供退出按钮，补齐 dialog 语义、焦点进入/恢复、滚动锁与实例清理测试，并修复 API 表数据绑定。
- [x] 2026-07-22 全屏声明式遮罩进入浏览器 Top Layer，提供 SVG 退出按钮并隔离后续局部 Loading 的层叠上下文；命令式服务同步提升层级。
- [x] 2026-07-31 OP-03 框架 API 收敛：声明式与命令式 Loading 统一复用 Core `useScrollLock`，移除 service 的第二套 body lock 计数器，并补充跨 owner 回归测试。
- [ ] 2026-07-31 OP-03 浏览器交互复核：静态页面已覆盖 1440x1000 Material 中文和 390x844 Midnight 英文，控制台无 warning/error；当前控制通道无法向嵌套 Shadow DOM 示例按钮投递用户事件，命令式服务的锁定、退出与焦点恢复仍需独立 Chromium 或人工验收，不得用脚本直接调用 API 代替。
- [x] 2026-08-01 Transition 生命周期批次：遮罩结构统一改用 Core `<Transition name="elf-loading" appear>`，`close` 保持请求事件并新增 leave 完成后的 `closed`；Top Layer、共享 `useScrollLock`、焦点恢复、目标几何与共享定位上下文 lease 均延迟到最终 leave 后释放，覆盖重复关闭、rapid reopen、外部卸载和 reduced motion。Loading、LoadingPage、ConfigProvider service defaults 共 3 个文件 21 项测试通过。
- [ ] 2026-08-01 最终浏览器复核：需在 1440px / 390px、Material / Midnight 下现场验证全屏进入、退出动效、Top Layer、滚动锁、焦点恢复和控制台输出。
