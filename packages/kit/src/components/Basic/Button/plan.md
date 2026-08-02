# Button Element Plus API 对标计划

## 2026-07-19 尺寸兼容

- [x] 兼容 small/default/large 并归一化为 sm/md/lg，消除案例按钮坍缩

## 本轮记录

- [x] 第二阶段：补 `type` 语义色兼容、`native-type`、`text`、`bg`、`link`、`round`、`circle`、`icon`、`loading-icon`、`dark`、`direction` 基础行为和页面示例。
- [x] 第三阶段：修复 handleClick 逻辑反写（disabled/loading 才阻止事件）；新增 noHover 属性禁用 hover 效果；校验 size/type/disabled 可直接通过 Custom Element props 读取且无 expose 冲突；补齐 host flag（block/plain/dashed/no-hover）。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Button`
- Element Plus 文档：`button.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### button.md

#### Button API

- `size`
- `type`
- `plain`
- `text ^`
- `bg ^`
- `link ^`
- `round`
- `circle`
- `dashed ^`
- `loading`
- `loading-icon`
- `disabled`
- `icon`
- `autofocus`
- `native-type`
- `auto-insert-space`
- `color`
- `dark`
- `tag ^`
- `default`
- `ref`
- `shouldAddSpace`

#### Button Attributes

- `size`
- `type`
- `plain`
- `text ^`
- `bg ^`
- `link ^`
- `round`
- `circle`
- `dashed ^`
- `loading`
- `loading-icon`
- `disabled`
- `icon`
- `autofocus`
- `native-type`
- `auto-insert-space`
- `color`
- `dark`
- `tag ^`

#### Button Slots

- `default`
- `loading`
- `icon`

#### Button Exposes

- `ref`
- `size`
- `type`
- `disabled`
- `shouldAddSpace`

#### ButtonGroup API

- `size`
- `type`
- `direction ^`
- `default`

#### ButtonGroup Attributes

- `size`
- `type`
- `direction ^`

#### ButtonGroup Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `autofocus`
- `autoInsertSpace`
- `bg`
- `block`
- `circle`
- `color`
- `dark`
- `dashed`
- `direction`
- `disabled`
- `form`
- `icon`
- `link`
- `loading`
- `loadingIcon`
- `nativeType`
- `noHover` — 禁用 hover 效果
- `plain`
- `round`
- `shape`
- `size`
- `tag`
- `text`
- `type`

### Events

- `click`

### Slots

- `default`
- `icon`
- `suffix-icon`
- `loading`

### Custom Element 公共属性

- `size`
- `type` — 语义色或原生 button type
- `disabled`

## 差距与任务

- [x] P1 补齐核心属性差距：所有 props 已对齐 Element Plus + 新增 noHover。
- [x] P1 补齐事件差距：handleClick 已修复（disabled/loading 阻止 click 冒泡）。
- [x] P1 补齐插槽/公共属性：loading/icon/suffix-icon slot；size/type/disabled 通过 Custom Element props 读取。
- [x] P1 对齐交互行为：disabled/loading/noHover/block 状态完整。
- [x] P2 更新页面示例：全部案例已统一为 Template/Script 双视图，并校正展示源码与实际渲染内容。
- [x] P2 补齐组件单测：25 条测试覆盖所有 props/flags/slots/expose/事件。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例 Playground 已统一刷新。
- [x] `pnpm build` 通过。

2026-07-15 验收：Button 25 条定向测试通过；浏览器验证 37 个按钮、12 组 Template/Script、禁用及 loading 状态均正常，控制台无错误。

## Basic P1 案例边界复核（2026-07-26）

- [x] 将 12 个分散案例收敛为“语义色与外观矩阵”“尺寸、形状与图标”“异步操作”“原生表单”4 个场景、3 个示例模块。
- [x] `type="submit|reset"` 在 Shadow DOM 内部按钮没有原生 form owner 时桥接最近外层表单，也支持 `form="id"`；click 被 `preventDefault()` 后不执行默认动作。
- [x] 图标按钮的 `aria-label` 转发到内部原生按钮；loading/disabled 同步反射到宿主并阻止重复触发。
- [x] 组件 33 项 + 页面 2 项定向测试通过；宏迁移扫描、108 个宏组件类型检查和 Vite 生产构建通过。
- [x] 真实浏览器通过 Tab/Enter 提交、异步禁用/恢复、中文/英文切换验证；控制台 0 error / 0 warning。
- [x] 截图：`button-appearance-en.png`、`button-async-form-section.png`。
