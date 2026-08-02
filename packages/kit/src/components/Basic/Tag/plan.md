# Tag Element Plus API 对标计划

## v0.0.2-beta.1 案例缺口复核（2026-07-26）

- [x] 7 个外观碎片收敛为“外观矩阵”“选择与溢出”“动态列表与行内编辑”3 个真实场景。
- [x] 默认插槽增加独立 `label` part，宿主受限宽度时使用单行省略且不删除完整插槽内容。
- [x] 可选择 Tag 通过 slotchange 同步无障碍名称，`role="button"`、`aria-pressed`、Enter 与 Space 形成完整键盘契约。
- [x] `size`、`round`、`disabled` 与既有颜色/变体状态统一反射到宿主；非法尺寸回退 `md`。
- [x] 动态列表案例覆盖新增、关闭、行内重命名、Enter 保存、Escape 取消和关闭按钮键盘操作；编辑状态保留在列表组合层，不污染 Tag 公共 API。
- [x] 页面、Template、Script、Props、Events、Slots 全部接入 LocaleProvider 中英文。
- [x] 组件 15 项 + 页面 2 项测试通过；应用和发布库构建通过；真实浏览器验证键盘选择、键盘关闭、编辑、溢出和暗色英文。

## 本轮记录

- [x] 第二阶段：补 `type`、`effect`、`disable-transitions`、`hit`、`checked`、`change`/`update:checked` 基础行为和页面示例。
- [x] 2026-07-15：完成 Tag / CheckTag 行为收口，支持任意 CSS `color`、受控同步、内部切换、键盘访问与禁用语义；12 项组件测试、生产构建和浏览器交互冒烟均通过。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Tag`
- Element Plus 文档：`tag.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### tag.md

#### Tag API

- `type`
- `closable`
- `disable-transitions`
- `hit`
- `color`
- `size`
- `effect`
- `round`
- `click`
- `close`
- `default`

#### Tag Attributes

- `type`
- `closable`
- `disable-transitions`
- `hit`
- `color`
- `size`
- `effect`
- `round`

#### Tag Events

- `click`
- `close`

#### Tag Slots

- `default`

#### CheckTag API

- `checked / v-model:checked`
- `disabled ^`
- `type ^`
- `change`
- `default`

#### CheckTag Attributes

- `checked / v-model:checked`
- `disabled ^`
- `type ^`

#### CheckTag Events

- `change`

#### CheckTag Slots

- `default`

## 当前 ElfUI API 快照

### Props

- `closable`
- `color`
- `disabled`
- `round`
- `size`
- `variant`
- `type`
- `effect`
- `disableTransitions`
- `hit`
- `checked`

### Events

- `click`
- `close`
- `change`
- `update:checked`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`type`、`disable-transitions`、`hit`、`effect`、`checked / v-model:checked`、`type ^`
- [x] P1 补齐事件差距：`change` 与 `update:checked`
- [x] P1 复核插槽/暴露方法：默认插槽已类型化；Tag 无需额外 expose 方法。
- [x] P1 对齐交互行为、键盘访问、禁用态、受控/非受控同步和无障碍属性；Tag 不参与表单值提交，清空态不适用。
- [x] P2 更新页面示例：Template / Script 双视图，补齐颜色、效果、关闭、CheckTag、禁用和无过渡场景。
- [x] P2 补齐组件单测、页面冒烟、类型导出和视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；`pnpm test src/components/Basic/Tag/Tag.test.ts` 12/12 通过。
