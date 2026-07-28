# BackTop Element Plus API 对标计划

更新时间：2026-07-15

## 对标定位

- ElfUI 组件：`Navigation/BackTop`。
- 2026-07-15 复核 Element Plus 2.14.3 官方 API：`target`、`visibility-height`、`right`、`bottom`、`click`、默认插槽。
- `smooth`、`duration`、`easing`、`shape`、`size`、`icon`、`disabled`、`zIndex`、`visible-change` 和 `scrollToTop()` 为 ElfUI 扩展。

## 完成情况

- [x] 核心 Props、click 事件和默认插槽全部覆盖。
- [x] `visibilityHeight=200`、`right=40`、`bottom=40` 和 40px 按钮尺寸与 Element Plus 默认值一致。
- [x] click 详情改为原始 MouseEvent，内部阻止 Shadow DOM 原生 click 再冒泡，避免宿主收到两次事件。
- [x] target 支持当前 Shadow Root / document 选择器、HTMLElement、Window 和惰性函数。
- [x] target 动态变化时自动解绑旧容器并监听新容器。
- [x] 数字与数字字符串尺寸统一转换为非负 px，CSS 长度字符串保持原样。
- [x] 原生 button 提供 Enter / Space 键盘访问、焦点样式和 `aria-label`；disabled 时不可见且命令式调用无效。
- [x] Props、Events、Methods、Slots 类型与 PropsTable 同步。
- [x] 两个案例均提供 Template / Script 双视图，动态绑定使用 `${...}`。

## 架构说明

- Props、可见状态、目标解析、滚动方法、事件方法、生命周期、宿主绑定和模板分块集中。
- 可见性状态由唯一 `setVisible` 入口更新，确保 `visible-change` 只在边沿变化时触发。
- 目标滚动行为统一经公共 `useGoTo`；组件只维护阈值、可见状态和按钮交互。
- duration / easing 支持 ConfigProvider 默认值与组件级覆盖，reduced-motion 自动降级为即时滚动。
- 新滚动会替换旧任务，卸载时取消未完成任务。

## 验收记录

- [x] `BackTop.test.ts` 7 项测试通过：阈值、click、动画策略、disabled、shape、默认值归一化和动态 target。
- [x] 页面案例与 API 表完成同步。
- [x] 5 个相关组件联合回归 31/31 测试通过，`pnpm build` 通过。
- [x] Playwright 实测：滚动 180px 后按钮出现，点击收到 MouseEvent，平滑回到 0 后按钮隐藏，控制台 0 error。
- [x] 视觉截图：`output/playwright/backtop-upgrade.png`。
