# ElfUI beta.14 DevTools 原生 select 元数据异常

日期：2026-07-28

状态：已由 ElfUI beta.15 修复

## 现象

在 `happy-dom@20.10.6` 中渲染包含原生 `<select>` 的 ElfUI 模板时，beta.14 运行时会中断渲染：

```text
TypeError: Cannot convert a Symbol value to a number
  at HTMLSelectElement.defineProperty
  at attachDevtoolsTemplateNode (@elfui/runtime/dist/devtools.js:19)
```

当前最小触发条件是：模板包含原生 `<select>`，并启用 beta.14 新增的 DevTools 模板节点元数据挂载。组件业务逻辑尚未执行，因此不应在组件侧吞掉异常。

## 影响

- 应用构建和库构建正常。
- 浏览器原生 DOM 暂未观察到同类异常。
- happy-dom 单元测试中的模板渲染会中断；当前导致 Drawer 页面 1 条焦点回归测试无法执行。

## 建议

优先把节点元数据存入 `WeakMap<Node, Metadata>`，避免修改平台元素；若仍需挂载到节点，DevTools 元数据写入失败也不应阻断组件渲染。

## 验证门槛

- 原生 `select`、`input`、`button`、`option` 均可在 happy-dom 中渲染。
- DevTools 能读取模板节点元数据。
- 全量测试恢复为 165 个文件、1334 条测试通过。

## 修复验证

升级 `@elfui/core`、`@elfui/compiler`、`@elfui/vite-plugin` 至 `0.1.0-beta.15` 后，原失败的 Drawer focused 测试恢复为 2/2 通过，且不再输出 `Cannot convert a Symbol value to a number`。
