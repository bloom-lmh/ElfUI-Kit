# Skeleton Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Skeleton`
- Element Plus 文档：`skeleton.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### skeleton.md

#### ## Skeleton API

- `animated`
- `count`
- `loading`
- `rows`
- `throttle`
- `default`
- `template`

#### Skeleton Attributes

- `animated`
- `count`
- `loading`
- `rows`
- `throttle`

#### Skeleton Slots

- `default`
- `template`

#### SkeletonItem API

- `variant`

#### SkeletonItem Attributes

- `variant`

## 当前 ElfUI API 快照

### Props

- `animated`
- `count`
- `gap`
- `height`
- `variant`
- `width`

### Events

- 暂无记录

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`loading`、`rows`、`throttle`。number 节流延迟显示；对象支持独立 `leading/trailing` 延迟。
- [x] P1 补齐事件差距：Element Plus Skeleton 无公开事件。
- [x] P1 补齐插槽/暴露方法：支持 `default`（加载完成内容）与 `template`（自定义骨架）。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。使用 `aria-busy` 与 loading status；该组件无键盘、表单或受控输入。
- [x] P2 更新页面示例：补充 loading、throttle 与 template 场景。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；目标单测通过。
- [x] 2026-07-14 Dashboard 案例固定为 2 × 2 卡片骨架，保持窄屏单列回退。
