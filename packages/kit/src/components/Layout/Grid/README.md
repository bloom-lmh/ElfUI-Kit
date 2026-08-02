# Grid 栅格布局

基于原生 CSS Grid 的 12 列栅格系统。

## 用法

```html
<elf-grid gap="md">
  <elf-grid-item span="6">左半</elf-grid-item>
  <elf-grid-item span="6">右半</elf-grid-item>
  <elf-grid-item span="4">三分之一</elf-grid-item>
  <elf-grid-item span="4">三分之一</elf-grid-item>
  <elf-grid-item span="4">三分之一</elf-grid-item>
</elf-grid>
```

## elf-grid Props

| 名称      | 类型                         | 默认值 | 说明     |
| --------- | ---------------------------- | ------ | -------- |
| `columns` | `number`                     | `12`   | 列数     |
| `gap`     | `xs \| sm \| md \| lg \| xl` | `0`    | 间距档位 |

## elf-grid-item Props

| 名称   | 类型     | 默认值 | 说明             |
| ------ | -------- | ------ | ---------------- |
| `span` | `number` | `1`    | 占用列数（1-12） |

## 设计

- columns / span 走 prop → useEffect → host.style 设置 CSS 变量；prop 变化时
  自动同步，无需手写 attributeChangedCallback
- gap 走 attribute selector，不需要 JS

## Slots

默认 slot：内部子元素
