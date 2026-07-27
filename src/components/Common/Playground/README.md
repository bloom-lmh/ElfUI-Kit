# Playground 演示容器

文档站点内部使用的“演示 + 代码”组合容器。它属于 docs 基础设施，不是 ElfUI 对外组件 API，也不应从未来的组件库公开入口导出。

## 用法

```html
<elf-playground title="基础按钮" code="<elf-button>OK</elf-button>">
  <elf-button>OK</elf-button>
</elf-playground>
```

## Props

| 名称    | 类型     | 默认值 | 说明                       |
| ------- | -------- | ------ | -------------------------- |
| `title` | `string` | `""`   | 标题（不传则不渲染头部）   |
| `code`  | `string` | `""`   | 源码字符串（不传则不渲染） |
| `script` | `string` | `""` | Script 标签源码（不传时禁用 Script 标签） |

## Events

| 名称   | 参数             | 说明           |
| ------ | ---------------- | -------------- |
| `copy` | `(code: string)` | 复制成功后触发 |
| `copyError` | `(error: unknown)` | Clipboard API 拒绝或不可用时触发 |

## Slots

默认 slot：渲染区

`status` slot：与案例标题平齐的状态文本，适合展示当前值、命令或交互结果。状态节点应使用 `slot="status"`，避免状态变化影响组件演示区的位置。

`controls` slot：可选的右侧配置控制台。存在时保持可见，预览区自动水平、垂直居中；Playground 自身变窄时控制台堆叠到预览区下方。字段统一使用填充外观和舒适密度，复选组使用普通控件外观并垂直排列。

## Exposes

- `showTemplate()`：切换到 Template。
- `showScript()`：存在 Script 源码时切换到 Script。
- `copy()`：复制当前标签源码，返回 `Promise<boolean>`。

## CSS 变量

- `--elf-playground-demo-padding`
- `--elf-playground-demo-justify`
- `--elf-playground-code-max-height`
- `--elf-playground-status-max-width`
- `--elf-playground-controls-width`
- `--elf-playground-demo-min-height`
