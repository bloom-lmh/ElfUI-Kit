# Flex 弹性布局

基于原生 CSS Flex 的容器组件，所有配置走 attribute selector + CSS 变量，无 JS 计算。

## 用法

```html
<elf-flex direction="row" gap="md" justify="space-between" align="center">
  <elf-button>左</elf-button>
  <elf-button>右</elf-button>
</elf-flex>
```

## Props

| 名称            | 类型                                                                                           | 默认值       | 说明         |
| --------------- | ---------------------------------------------------------------------------------------------- | ------------ | ------------ |
| `direction`     | `row \| row-reverse \| column \| column-reverse`                                               | `row`        | 主轴方向     |
| `justify`       | `flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly`            | `flex-start` | 主轴对齐     |
| `align`         | `stretch \| flex-start \| flex-end \| center \| baseline`                                      | `stretch`    | 交叉轴对齐   |
| `align-content` | `stretch \| flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | `stretch`    | 多行内容对齐 |
| `gap`           | `0 \| xs \| sm \| md \| lg \| xl`                                                              | `0`          | 元素间距     |
| `wrap`          | `boolean \| nowrap \| wrap \| wrap-reverse`                                                    | `false`      | 换行策略     |

## Slots

默认 slot：内部子元素

## 设计

- 用 attribute selector 派发样式，不在 JS 里做条件渲染，保持组件零运行时开销
- gap 取自全局 token `--elf-space-*`，主题切换时自动响应
- 响应式方向、子项顺序、伸缩和自对齐由布局工具类承担，避免扩大组件 props

## 文件结构

```
Flex/
  index.ts      # 组件注册
  style.scss    # 样式（独立文件）
  Flex.test.ts  # 单测
  README.md     # 本文档
```
