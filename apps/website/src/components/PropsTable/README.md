# PropsTable 组件文档表

文档站点内部展示组件 props / events / slots / methods / parts 的表格。它不属于 ElfUI 对外组件 API，也不应从未来的组件库公开入口导出。

## 用法

```html
<elf-props-table title="Props" .rows="propsList"></elf-props-table>
```

## Props

| 名称         | 类型         | 默认值       | 说明             |
| ------------ | ------------ | ------------ | ---------------- |
| `title`      | `string`     | `"Props"`    | 表头标题         |
| `rows`       | `TableRow[]` | `[]`         | 行数据           |
| `empty-text` | `string`     | `"暂无数据"` | 无行数据时的提示 |

```ts
interface TableRow {
  name: string;
  type?: string | number | boolean | null;
  default?: string | number | boolean | null;
  desc?: string | number | boolean | null;
}
```

## Slots

- `empty`：覆盖默认空状态。

## CSS 变量

- `--elf-props-table-cell-padding`
- `--elf-props-table-header-bg`
- `--elf-props-table-min-width`
