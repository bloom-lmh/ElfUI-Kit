# Steps Element Plus API 对标计划

更新时间：2026-07-15

## 对标定位

- ElfUI 组件目录：`Navigation/Steps`、`Navigation/Step`
- Element Plus 文档：`steps.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义，同时保留 ElfUI 的 Web Components、细粒度响应式和数据驱动 `items` 扩展。

## 当前 ElfUI API

### Steps

- Props：`active`、`direction`、`space`、`processStatus`、`finishStatus`、`alignCenter`、`simple`
- ElfUI 扩展 Props：`items`、`size`、`clickable`、`alternativeLabel`
- Events：`update:active`、`change`
- Slots：`default`（组合式 `elf-step`）
- Expose：`activeIndex`、`next`、`prev`、`setActive`

### Step

- Props：`title`、`description`、`icon`、`status`、`disabled`、`value`
- Slots：`icon`、`title`、`description`

## 差距与任务

- [x] P1 补齐核心属性：`space`、`process-status`、`finish-status`、`align-center`、`simple`、`title`、`description`、`icon`、`status`。
- [x] P1 补齐 `change` 事件，并保留 ElfUI 的 `update:active` 受控更新事件。
- [x] P1 补齐组合式 `elf-step`、`icon`、`title`、`description` 插槽和公开控制方法。
- [x] P1 对齐点击、方向键、禁用态、清空态、受控/非受控同步和无障碍属性；Steps 不提交表单值，无额外表单契约。
- [x] P2 更新页面示例：Template / Script 双视图、动态绑定使用 `${...}`，覆盖 Element Plus 关键场景和组合式写法。
- [x] P2 补齐组件单测、页面冒烟、类型导出和真实浏览器视觉回归。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 状态推断、受控同步、清空态、禁用态、点击和键盘交互有单测覆盖。
- [x] 文档示例可在 Playground 中显示并复制 Template / Script。
- [x] Steps 定向测试、生产构建和真实浏览器验证通过。

## 实施记录

- [x] 2026-07-11：补齐间距、状态和简洁模式，新增状态推断测试与案例。
- [x] 2026-07-14：隔离内容与连接线，水平步骤在窄容器内滚动。
- [x] 2026-07-15：新增组合式 `elf-step`、三类插槽、统一事件、方向键跳过禁用项、受控同步和独立案例；完成定向测试、构建及浏览器验收。
- [x] 2026-07-21：参考 Vuetify Stepper 增加集成内容卡片、前后操作、本地化文字、隐藏操作、editable、alt-labels 和移动端纵向布局，并新增可操作配置台。
