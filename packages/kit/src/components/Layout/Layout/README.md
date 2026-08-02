# Layout 应用骨架

一组 flex 容器原语：`<elf-layout>` `<elf-header>` `<elf-aside>` `<elf-main>` `<elf-footer>`，组合可拼出常见后台布局。

## 用法

```html
<!-- 经典后台布局：顶栏 + 侧栏 + 内容 + 底栏 -->
<elf-layout>
  <elf-header>顶栏</elf-header>
  <elf-layout direction="horizontal">
    <elf-aside width="220px">导航</elf-aside>
    <elf-main>内容</elf-main>
  </elf-layout>
  <elf-footer>© 2026 ElfUI</elf-footer>
</elf-layout>
```

## 组件 / Props

| 标签           | Prop      | 类型                     | 默认值     | 说明                 |
| -------------- | --------- | ------------------------ | ---------- | -------------------- |
| `<elf-layout>` | direction | `vertical \| horizontal` | `vertical` | 子区排列方向         |
| `<elf-header>` | height    | `string`                 | `60px`     | 顶栏高度             |
| `<elf-aside>`  | width     | `string`                 | `240px`    | 侧栏宽度             |
| `<elf-main>`   | —         | —                        | —          | 占据剩余空间，可滚动 |
| `<elf-footer>` | height    | `string`                 | `48px`     | 底栏高度             |

## 设计

- 全部基于 flex；`elf-main` 用 `flex: 1` 自动撑满
- `elf-header` / `elf-footer` `flex-shrink: 0` 不被压缩
- 嵌套 `<elf-layout direction="horizontal">` 实现"顶栏全宽 + 下方左右分栏"

## 区域主题变量

浅色主题默认用轻微色阶和分隔线区分 Header、Aside、Main、Footer。业务应用可覆盖以下变量，包含将它们统一为同一背景：

- `--elf-layout-bg`
- `--elf-layout-header-bg`
- `--elf-layout-aside-bg`
- `--elf-layout-main-bg`
- `--elf-layout-footer-bg`
- `--elf-layout-divider`
- 所有尺寸 / 颜色走 CSS 变量（`--elf-*`），主题切换自动响应
- 高度 100vh 等外层撑高交给消费方（顶层 `:host` 自身 `flex: 1`，便于嵌套）

## 与 Element Plus 的差异

完全一致的心智模型；ElfUI 走 Web Components + Shadow DOM，每个区域独立隔离，CSS 不串。
