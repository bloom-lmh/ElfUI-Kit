# elf-api-builder：API 表格构建器设计

日期：2026-08-07
范围：`apps/website` 文档站内部基建（非 Kit 对外组件），试点页 `CardPage`。

## 目标

每个组件文档页有若干 API 表格（props / events / slots / methods / exposes）。新增 `elf-api-builder`，让用户**勾选**需要的行，用取值控件确定属性值，点击「构建」得到**元素标记代码片段 + 实时预览**，复制即用，无需手敲 `variant="outlined"`。

## 已确认的需求决策

- 输出形态：**元素标记本身**（属性名/值自动拼接），方法以 **HTML 注释**附注在标记下方。
- 取值：勾选即用**默认值**生成标记（布尔输出裸属性名）。
- 预览：**对话框**（`elf-dialog`）弹出渲染真实组件。
- 勾选：复用 **Table 内置 selection 列**（`type: "selection"` + `selection-change`），不自建 checkbox。
- 试点：**CardPage**。

## 架构（方案 A：构建器包裹表格 + PropsTable role）

```
<elf-api-builder component="elf-card" title="API 构建器">
  <elf-props-table role="props" :rows=${propsRows()} />
  <elf-props-table role="events" :rows=${eventsRows()} />
  <elf-props-table role="slots" :rows=${slotsRows()} />
</elf-api-builder>
```

- 新增 `apps/website/src/components/ApiBuilder/`：`elf-api-builder` 宏组件，用 `provide`/`inject` 提供构建器 context。
- `PropsTable` 新增可选 `role` prop：注入到构建器 context 时，列首加 **Table 内置 selection 列**（多选 + 表头全选），`selection-change` 事件把选中行同步给构建器；未设 `role` 或不在构建器内时**行为完全不变**（向后兼容）。
- 构建器拥有选中状态（`useRef` 单一来源），勾选后命令式重建代码区（`textContent`）与预览对话框（`innerHTML` 注入 `elf-*`）。

## 模块

| 文件                                            | 职责                                                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `context.ts`                                    | `createInjectionKey<ApiBuilderContext>` + 类型（registerTable/toggle/isSelected/getValue/setValue/clear） |
| `types.ts`                                      | role、选择项、Props/Slots 类型                                                                            |
| `parseType.ts`                                  | 纯函数：行 type + 当前值 → 控件类型（select/boolean/number/text），可单测                                 |
| `codegen.ts`                                    | 纯函数：selections + rows → 元素标记字符串，可单测                                                        |
| `index.ts`                                      | `elf-api-builder` 宏组件：骨架 + provide + watch 重建                                                     |
| `style.scss` / `plan.md` / `ApiBuilder.test.ts` | 样式 / 计划 / 测试                                                                                        |

## 取值规则（parseType）

- type 按 `|` 拆 token；纯 `boolean` → 开关；`boolean` 混并列 → 开关；token 数 > 1 且无 `()`/`[]` → 枚举下拉；含 `number` → number 输入；含 `string[]` → 文本（逗号分隔）；其余 → 文本。
- 初始值：default 清洗（去引号）后命中枚举/true 则用默认，否则枚举首项 / false / 空。

## 代码生成（codegen）

- 属性（props）：布尔 true → 裸属性名（`dashed`）；false → 跳过；字符串 → `name="value"`（HTML 转义）；空字符串 → 跳过。
- 事件（events）：`@click="handleClick"`（kebab 转 camel）。
- 插槽（slots）：default → 元素内占位文本 `Content`；具名 → `<span slot="footer">Footer</span>`。
- 方法（methods/exposes/expose）：`<!-- ref.value.openPreview() -->` 附注在元素下方。
- 无内容 → 自闭合 `<elf-card />`。

## 交互

1. 勾选表格行 → 构建器显示结果面板（已选项控件 + 预览 + 代码），随选择/取值实时更新。
2. 「清空」重置所有选择。复制按钮 `navigator.clipboard`，成功态反馈。
3. 语言：构建器文案加入 `DEFAULT_LOCALE_MESSAGES.playground` / EN（与 PropsTable 同命名空间）。

## 测试

- `codegen` / `parseType` 纯函数单测（枚举/布尔/数字/事件/插槽/方法/默认值跳过）。
- `ApiBuilder.test.ts`：构建器 + role 表格渲染复选框、勾选后生成代码与预览、取值控件切换、清空。
- `CardPage.test.ts` 现有用例不受影响（不覆盖 props 页）。

## 验收

- typecheck（宏感知 + unsupported macro 扫描）、lint、format、cspell、focused tests 通过。
- 真实 Chromium：勾选 → 控件 → 代码/预览联动，复制可用，控制台 0 error；截图归档 `output/playwright/api-builder-card.png`。
- 更新 `MAINTENANCE_HANDOFF.md`。
