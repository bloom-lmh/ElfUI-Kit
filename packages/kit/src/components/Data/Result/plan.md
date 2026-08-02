# Result Element Plus API 对齐计划

更新时间：2026-07-13

## 已完成

- [x] 核心 props：`icon`、`title`、`sub-title`。
- [x] Slots：`icon`、`title`、`sub-title`、`extra`。
- [x] 四种默认状态图形：success、warning、error、info 都使用主题色 SVG，且自定义 `icon` slot 可替换它们。
- [x] 结果容器提供 `role="status"` 与 `aria-live="polite"`。
- [x] 文档包含四种状态、extra 操作区和自定义图标案例，并同步 PropsTable。
- [x] 单测覆盖默认图形、状态属性与命名 slots。

## 验收记录

- [x] `pnpm test src/components/Data/Result/Result.test.ts` 通过。
- [x] `pnpm build` 通过。
