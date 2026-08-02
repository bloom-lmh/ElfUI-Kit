# Container 容器

居中、限宽的页面骨架容器。

## 用法

```html
<elf-container max-width="md" padding="lg">
  <h1>页面标题</h1>
  <p>正文</p>
</elf-container>
```

## Props

| 名称        | 类型                                 | 默认值 | 说明         |
| ----------- | ------------------------------------ | ------ | ------------ |
| `max-width` | `xs \| sm \| md \| lg \| xl \| full` | `lg`   | 最大宽度档位 |
| `padding`   | `0 \| sm \| md \| lg`                | `md`   | 内边距档位   |

## 档位映射

| 档位 | max-width | padding（参考 token） |
| ---- | --------- | --------------------- |
| `xs` | 480px     | —                     |
| `sm` | 600px     | `--elf-space-3`       |
| `md` | 900px     | `--elf-space-4`       |
| `lg` | 1200px    | `--elf-space-6`       |
| `xl` | 1536px    | —                     |

## Slots

默认 slot：内部子元素
