# Collection 与 Virtual Window 边界复核

日期：2026-07-29

## 结论

- `src/utils/virtual-window.ts` 是固定高度与动态高度窗口算法的唯一权威实现。
- `src/components/Data/virtual-window.ts` 只保留兼容重导出，不复制算法。
- VirtualList、Table、Tree、Transfer 和 Select 继续消费同一窗口契约：`start` 包含、`end` 排除、`offset` 为首个渲染项偏移、`totalSize` 为完整内容尺寸。
- 当前不建立跨 Tree、Menu、Table、Tabs、Select 的通用 collection 状态容器。它们分别拥有层级展开、Light DOM 组合、行列状态、roving tab 和表单选择语义，只有稳定 key 与有界索引相似，状态转换并不相同。

## 已验证边界

- 空数据返回 `{ start: 0, end: 0, offset: 0, totalSize: 0 }`。
- 负数、`NaN`、无限滚动偏移和非法 item size 会被规范化，不产生越界范围。
- 数据缩减后，旧 scroll offset 会夹取到新最大值。
- 零尺寸视口在非空数据中保留一个可测量项，避免初次布局形成永久空窗口。
- 动态高度 offsets 由 `buildVirtualOffsets()` 生成单调正向累计值；外部调用者不得传入非单调 offsets。
- 高频 scroll 路径不创建完整数据映射；VirtualList 和 Table 保留各自的同步 DOM 热路径与缓存。

## Collection 准入

只有出现三个以上语义一致的消费者时，才考虑抽取以下纯协议：

- 稳定 key 解析与重复 key 诊断；
- 有效、禁用项之间的线性前后导航；
- 数据替换后的 active/selected key 归一化。

层级展开、级联勾选、异步加载、表单值提交、DOM composition 和虚拟渲染不进入同一个 collection 抽象。
