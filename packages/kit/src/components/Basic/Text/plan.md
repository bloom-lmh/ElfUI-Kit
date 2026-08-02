# Text Element Plus API 对标计划

- 最近复核：2026-07-26 18:31（Asia/Shanghai）
- 组件目录：`Basic/Text`
- 对标文档：Element Plus `text.md`、`typography.md`

## 公共契约

- [x] 支持 `type`、`size`、`truncated`、`line-clamp`、`tag`、`mark`、`deleted`、`inserted`、`strong`、`italic`。
- [x] `size` 接受 Element Plus 的 `small/default/large`，并保留 `sm/md/lg` 兼容别名。
- [x] `tag` 只渲染白名单中的安全原生标签，非法值回退为 `span`。
- [x] 默认插槽承载文本、图标或其他行内内容，内部语义元素暴露 `part="text"`。
- [x] 不新增重复 Typography 组件；标题、段落与强调统一由原生语义 `tag` 组合。

## 本轮升级

- [x] 修正 `line-clamp=0` 的存在性判断：仍启用截断并将行数归一为 1；清空属性后正确移除状态。
- [x] 截断宿主具备可靠的收缩边界，单行省略和多行 clamp 不再依赖偶然的 inline 尺寸计算。
- [x] 将 5 个单薄案例收敛为外观矩阵、语义与响应式排版、截断与阅读边界 3 个完整场景。
- [x] 保留容量单位基线回归，使用 `inline-flex + align-items: baseline`，不滥用 `sub` 语义。
- [x] 补齐 Provider 驱动的中英文文档、完整 API 描述、Template / Script 和页面集成测试。

## 验证

- [x] Text 组件与页面定向回归共 15 项通过。
- [x] beta API 迁移扫描覆盖 850 个源文件，无遗留 API。
- [x] 宏类型检查扫描 109 个组件文件，0 macro error / 0 TypeScript error。
- [x] 应用构建 774 模块、发布库构建 252 模块通过。
- [x] 浏览器实测单行内部宽度 `226px`、内容宽度 `528px`；两行高度 `53px`、完整内容高度 `132px`。
- [x] 中文、英文、Material 与 Midnight 暗色皮肤均完成截图验收，控制台 0 error / 0 warning。
