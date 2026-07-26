# Divider Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Divider`
- Element Plus 文档：`divider.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### divider.md

#### API

- `direction`
- `border-style`
- `content-position`
- `default`

#### Attributes

- `direction`
- `border-style`
- `content-position`

#### Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `contentPosition`
- `dashed`
- `direction`

### Events

- 暂无记录

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`border-style`。支持 `solid`、`dashed`、`dotted`、`double`；原有 `dashed` 保留为兼容别名。
- [x] P1 补齐事件差距：无 Element Plus 对应事件。
- [x] P1 补齐插槽/暴露方法：默认插槽已支持；无 expose。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。Divider 为静态分隔元素，无交互、表单或受控状态。
- [x] P2 更新页面示例：补充 `dashed`、`dotted`、`double` 场景。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；目标单测通过。

2026-07-15 验收：Divider 定向测试通过；浏览器验证 9 个分割线实例、4 组 Template/Script 和 PropsTable 均正常，控制台无错误。

## 2026-07-26 v0.0.2-beta.1 RTL 与语义复核

- [x] 归一化 `direction`、`content-position`、`border-style`，非法值回退到公开默认值，`dashed` 兼容别名保持最高优先级。
- [x] 宿主补齐 `role="separator"`、`aria-orientation`、动态插槽可访问名称与 `has-content` 状态反射。
- [x] 水平与垂直线改用逻辑边框，文字位置和间距在 RTL 书写方向下自然镜像；长文字提供稳定省略边界。
- [x] 将 4 个松散案例收敛为“线型与文字位置”“垂直分组与 RTL”2 个双语场景，补齐 Template、Script、Props 与 Slots。
- [x] 组件与页面共 13 项定向测试通过；浏览器验证四种线型、三种位置、RTL 切换、英文与 Midnight，控制台 0 error / 0 warning。

---

## 历史计划保留

以下为本轮 Element Plus 对标计划生成前的目录计划，暂保留供核对。

# Divider 分割线 — 开发计划

## 功能

- [x] 水平分割线
- [x] 垂直分割线
- [x] 虚线模式 (dashed)
- [x] 中间文字（slot）
- [x] 文字位置 (left/center/right)
- [x] 单测
- [x] 展示页面
