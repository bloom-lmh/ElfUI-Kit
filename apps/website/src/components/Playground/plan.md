# Playground Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Common/Playground`
- Element Plus 文档：无直接对标，按内部基础设施组件维护。
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

- 无直接公开 API 对标。

## 当前 ElfUI API 快照

### Props

- `code`
- `script`
- `title`

### Events

- 暂无记录

### Slots

- `default`
- `status`
- `controls`

### Exposes

- 暂无记录

## 差距与任务

- [x] P2 明确内部组件职责边界，保证 Playground/PropsTable 等文档基础设施不泄漏为 Element Plus 对外组件。
- [x] P2 补齐自身 props、事件、样式变量与测试说明，服务所有组件示例。

## 验收清单

- [x] API props/types 与内部 README 同步（内部基础设施不建立公开页面 PropsTable）。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `npm run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-07-19 源码高亮回归

- [x] Script 高亮改为单次词法扫描，禁止生成的 token HTML 再次进入高亮流程。
- [x] 保留对象、数组和嵌套语句的结构缩进，不再裁掉源码前缀。
- [x] 注释、转义字符串、模板字符串、HTML 特殊字符及 token 泄漏均有单元测试。
- [x] 真实浏览器验证 Script 文本完整，控制台无错误或警告。

## 2026-07-21 可选控制台布局（历史方案，折叠能力已移除）

- [x] 控制台通过 `controls` slot 按需启用，不传 slot 时保留原有单栏案例布局。
- [x] 控制台占满预览工作区高度，并支持标题栏折叠、窄屏纵向布局和无障碍状态。
- [x] 预览区默认水平、垂直居中，控制台内容不再叠加卡片边框。

## 2026-07-22 控制台抽屉与浮层（历史方案，折叠能力已移除）

- [x] 控制台允许浮层越界展示，Select 等下拉面板不再被裁切。
- [x] 按钮式单选和复选保持单行，空间不足时横向滚动。
- [x] 折叠图标改为菜单图标，先完成抽屉退场再居中案例；折叠前后工作区高度保持一致。

## 2026-07-22 永久控制台契约

- [x] 移除控制台折叠入口、状态、事件与公开方法，存在 `controls` slot 时控制台始终可见。
- [x] 控制台单选与复选统一使用普通外观；字段默认样式由 Playground 集中管理。
- [x] 审计所有控制台案例，综合操作台均调整为组件页面的首个案例。

## 2026-07-22 控制台字段与窄容器回归

- [x] 控制台字段统一使用 filled + comfortable，CheckboxGroup 改为垂直排列。
- [x] 使用容器查询处理 Playground 自身变窄场景，避免控制台挤压或溢出。

## 2026-08-01 响应式宽度与暗色层级

- [x] 桌面默认使用 85% 内容宽度，同时以 900px 为响应式下限，窄页面会主动充满可用空间。
- [x] DocsHero、Playground 与 PropsTable 使用同一宽度公式，缩小页面时左右边界保持一致。
- [x] 暗色模式重新区分标题、预览、控制台、源码、标签和复制按钮层级，减少整块黑色表面的压迫感。
- [x] Playground 聚焦回归 17 项通过。

## 2026-08-01 Progress 工作台案例

- [x] Progress 首例继续使用正式 `controls` slot，并通过 Playground CSS 变量移除预览区二次卡片缩进；暗色初始值跟随文档主题，类型控制支持线性、环形与仪表盘。
