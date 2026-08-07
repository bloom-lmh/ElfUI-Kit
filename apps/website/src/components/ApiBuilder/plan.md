# ApiBuilder 组件计划

文档站内部基建组件（不属于 ElfUI 对外组件 API，不从组件库公开入口导出）。

## 定位

每个组件文档页有若干 API 表格（props / events / slots / methods / exposes）。`elf-api-builder` 让用户勾选需要的行、用取值控件确定属性值，得到**元素标记代码片段**，无需手敲标记。

## 用法

```html
<elf-api-builder component="elf-card">
  <elf-props-table role="props" .rows="propsRows"></elf-props-table>
  <elf-props-table role="events" .rows="eventsRows"></elf-props-table>
  <elf-props-table role="slots" .rows="slotsRows"></elf-props-table>
</elf-api-builder>
```

- `elf-props-table` 在构建器内时（带 `role`）渲染复选框列；在构建器外保持纯文档表，完全向后兼容。
- `component` 指定生成标记的标签名；`title` 覆盖面板标题。
- **多组件页面**：`elf-props-table` 可另传 `component` 归组（如 `elf-form-item`、`elf-checkbox-group`），
  生成结果按组件拆成多个片段；不传时使用构建器默认 `component`。
- 全站组件页已批量接入（`scripts/wire-api-builder.mjs` 一次性迁移；`scripts/api-builder-coverage.test.ts` 防回归）。

## 模块

| 文件         | 职责                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| `context.ts` | `provide`/`inject` 上下文（registerTable/setSelected/isSelected/clear） |
| `types.ts`   | role 枚举、role 归类、选择状态类型                                      |
| `codegen.ts` | 选择状态 → 元素标记字符串（属性/事件/插槽/方法注释）                    |
| `index.ts`   | `elf-api-builder` 宏组件：骨架 + provide + 勾选重建 + 预览对话框        |

## Props

| 名称        | 类型     | 默认值 | 说明                                     |
| ----------- | -------- | ------ | ---------------------------------------- |
| `component` | `string` | `""`   | 目标组件标签，如 `elf-card`              |
| `title`     | `string` | `""`   | 面板标题；缺省用本地化默认「API 构建器」 |

## 行为

- 表格列首为 **Table 内置 selection 列**（多选 + 表头全选），勾选行即用**默认值**生成标记。
- 属性：布尔输出裸属性名（`disabled`）；其余输出 `name="默认值"`；无论是否选择插槽，元素统一输出**成对结束标签**（`<elf-card ...></elf-card>`），不自闭合。
- 事件：`@click="handleClick"`；插槽：default 生成占位文本、具名生成 `<span slot="footer">Footer</span>`；方法：`<!-- ref.value.openPreview() -->` 注释附注。
- 「复制」`navigator.clipboard`（失败回退 `execCommand`），成功提示「已复制」。
- 「清空」重置全部选择。
- 右侧动作按钮为无边框图标按钮（两色渐变 SVG：复制/清空/已复制），悬停仅底色变化。

## 验收

- codegen / parseType 纯函数单测 + ApiBuilder 组件测试通过。
- typecheck（宏感知）、lint、format、cspell 通过。
- 真实 Chromium：勾选 → 代码联动、复制可用、控制台 0 error；截图归档 `output/playwright/api-builder-card.png`。
- 更新 `MAINTENANCE_HANDOFF.md`。
