# PropsTable Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Common/PropsTable`
- Element Plus 文档：无直接对标，按内部基础设施组件维护。
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

- 无直接公开 API 对标。

## 当前 ElfUI API 快照

### Props

- `rows`
- `title`

### Events

- 暂无记录

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P2 明确内部组件职责边界，保证 Playground/PropsTable 等文档基础设施不泄漏为 Element Plus 对外组件。
- [x] P2 补齐自身 props、空状态、插槽、样式变量与测试说明，服务所有组件示例。

## 验收清单

- [x] API props/types 与内部 README 同步（内部基础设施不建立公开页面 PropsTable）。
- [x] 关键渲染和边界状态有单测覆盖。
- [x] 文档 API 表能正确显示字符串、数字、布尔值和空状态。
- [x] `npm run build` 通过；涉及运行时能力时补跑目标测试。

## 2026-08-01 API 区域对齐

- [x] 自动识别紧邻 PropsTable 的 API 二级标题，并将标题提升到表格自身的响应式容器中。
- [x] API 标题与表格左边界保持一致，卸载时恢复原标题，不改变页面源码结构或目录语义。
- [x] MutationObserver 同步语言切换后的标题文本；PropsTable 与 DocsHero 聚焦回归共 8 项通过。
