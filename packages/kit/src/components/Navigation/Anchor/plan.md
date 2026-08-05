# Anchor 对标与质量计划

## API 与行为

- [x] 支持 items、modelValue、defaultActive、container、offset、bound、marker、type、direction 与字段别名。
- [x] 支持数据模式和 AnchorLink 组合式模式，并同步嵌套层级和激活状态。
- [x] 支持窗口、选择器、元素和函数容器，容器变化时重新绑定监听器。
- [x] 提供 `scrollToAnchor` 方法；不覆盖 HTMLElement 原生 `scrollTo`，避免 defineExpose 宿主冲突警告。
- [x] 使用导航、列表、链接和 aria-current 语义，并覆盖禁用项、滚动监听和点击事件。
- [x] 接入公共 `useGoTo`，支持 Provider 级 duration / easing、组件级覆盖、横纵轴和 reduced-motion。

## 2026-07-21 横向滚动回归

- [x] 横向项目使用固有宽度，不再被 flex 压缩或互相覆盖。
- [x] 选择不可见项目时自动将其滚入导航视口，最后一项可完整到达并保持激活。
- [x] 示例使用唯一 href 和受控状态，真实展示溢出、滚动及末项选择。
- [x] 定向测试和真实浏览器验证通过，页面无组件错误与宿主暴露警告。
- [x] 长水平列表支持滚轮转横向滚动、SVG 翻页按钮和原生触摸平移。
- [x] 水平内容的示例滚动条改为可拖动、可键盘操作的 range 控件，并与内容 scrollLeft 双向同步。

## 2026-07-28 公共能力收敛

- [x] 删除组件内部重复的容器解析、目标坐标和平滑滚动实现。
- [x] Anchor 只维护 item model、scroll spy、激活状态和自身交互；滚动执行交给 `goTo` service。
- [x] 组件卸载与新导航会取消旧滚动任务，避免悬挂动画。
- [x] duration / easing 的优先级为组件 prop → ConfigProvider `goTo` → service 默认值。

## 2026-08-04 基础定位案例字段修复

- [x] 修复「基础定位」案例中「显示名称 / 工作邮箱」输入框值渲染为字面量 `{{ t(` 的问题：宏模板里 `model-value="${t("nameValue")}"` 的嵌套引号会被编译器截断，改成 `:label=${t(...)}` + `:modelValue.prop=${t(...)}` 绑定写法。
- [x] 两个字段补上输入框自带 label（显示名称 / 工作邮箱），与 Template 代码示例一致。
- [x] 全库审计：80 个文件含 `="${t(` 模式，编译产物检查仅 AnchorPage/ex1 实际损坏（其余均位于 code 展示字符串）。
- [x] 验证：AnchorPage 聚焦测试 4/4 通过；Chromium 实测输入框 label 与值正确渲染、页面不再出现 `{{ t(`；截图归档 `output/playwright/anchor-basic-fields-zh.png`。
