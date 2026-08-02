# Avatar Element Plus API 对标计划

## 本轮记录

- [x] 第二阶段：补 `src-set`、`fit`、`error` 事件、默认 slot / icon slot fallback 和页面示例。
- [x] 2026-07-26 P1 文档审计：补图片失败重试、fallback 完整无障碍名称、AvatarGroup 本地化溢出标签；9 个分散案例收敛为 3 个场景化 Playground，并新增页面测试与双语 Script。
- [x] 浏览器截图发现并修复 `:host` display 覆盖原生 `[hidden]`，确保 AvatarGroup 的折叠头像在视觉上真正隐藏。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Avatar`
- Element Plus 文档：`avatar.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### avatar.md

#### Avatar API

- `icon`
- `size`
- `shape`
- `src`
- `src-set`
- `alt`
- `fit`
- `error`
- `default`

#### Avatar Attributes

- `icon`
- `size`
- `shape`
- `src`
- `src-set`
- `alt`
- `fit`

#### Avatar Events

- `error`

#### Avatar Slots

- `default`

#### AvatarGroup API ^

- `size`
- `shape`
- `collapse-avatars`
- `collapse-avatars-tooltip`
- `max-collapse-avatars`
- `effect`
- `placement`
- `popper-class`
- `popper-style`
- `collapse-class`
- `collapse-style`

#### AvatarGroup Attributes

- `size`
- `shape`
- `collapse-avatars`
- `collapse-avatars-tooltip`
- `max-collapse-avatars`
- `effect`
- `placement`
- `popper-class`
- `popper-style`
- `collapse-class`
- `collapse-style`

## 当前 ElfUI API 快照

### Props

- `alt`
- `color`
- `icon`
- `shape`
- `size`
- `src`

### Events

- 暂无记录

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：Avatar 本体的 `src-set`、`fit` 已完成；独立 AvatarGroup 已实现 `collapse-avatars`、`collapse-avatars-tooltip`、`max-collapse-avatars`、`effect`、`placement`、`popper-class`、`popper-style`、`collapse-class`、`collapse-style`，并支持尺寸与形状继承、溢出弹层和卸载还原。
- [x] P1 补齐事件差距：`error` 事件会透传原生图片错误事件，并切换到 fallback。
- [x] P1 补齐插槽/暴露方法：default fallback 与 icon slot 均已验证；Avatar 本体无 expose。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。Avatar 为非交互展示组件；图片具有 alt，加载失败后回退到可读文本或插槽。
- [x] P2 更新页面示例：覆盖图片、src-set、fit、error fallback、icon 与颜色场景。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；目标单测通过。
