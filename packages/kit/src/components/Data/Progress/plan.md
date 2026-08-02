# Progress Element Plus API 对标计划

## 2026-07-19 案例交互

- [x] 增减与增长速度控制移入标题区，并改用 elf-select
- [x] 圆形与仪表盘案例共用受控百分比，支持增减、自动增长、速度选择和 100% 边界停止
- [x] 页面卸载时清理自动增长计时器，并在 reduced-motion 下取消数值过渡
- [x] `percentage` 模式的 `aria-valuenow` 与实际圆环百分比保持一致

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Progress`
- Element Plus 文档：`progress.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### progress.md

#### API

- `percentage ^`
- `type`
- `stroke-width`
- `text-inside`
- `status`
- `indeterminate`
- `duration`
- `color`
- `width`
- `show-text`
- `stroke-linecap`
- `format`
- `striped ^`
- `striped-flow ^`
- `default`

#### Attributes

- `percentage ^`
- `type`
- `stroke-width`
- `text-inside`
- `status`
- `indeterminate`
- `duration`
- `color`
- `width`
- `show-text`
- `stroke-linecap`
- `format`
- `striped ^`
- `striped-flow ^`

#### Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `color`
- `format`
- `height`
- `indeterminate`
- `max`
- `showText`
- `size`
- `status`
- `striped`
- `strokeWidth`
- `textInside`
- `trackColor`
- `value`
- `variant`

### Events

- 暂无记录

### Slots

- 暂无记录

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`percentage`、`type`（含 `dashboard`）、`duration`、`width`、`stroke-linecap`、`striped-flow`；保留 `value/max/variant/size/height` 兼容扩展。
- [x] P1 补齐事件差距：Element Plus Progress 无公开事件。
- [x] P1 补齐插槽/暴露方法：已提供带默认百分比文案的 default slot；无 expose。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。输出 `progressbar` role 与完整 aria 值；该组件无交互行为。
- [x] P2 更新页面示例：补充 `percentage/type/dashboard/striped-flow/duration` 场景。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；目标单测通过。

2026-07-15 验收：Progress 定向测试通过；浏览器验证增量交互 `48% → 60%`、4 种进度展示及源码双视图，控制台无错误。

## 2026-07-22 速度与环形布局回归

- [x] 文档控制台正确解包 Select 事件值，速度选择真实传入 `transition-duration`。
- [x] 环形、完成态和仪表盘进度在宽屏水平居中排列，并在窄屏弹性换行。
