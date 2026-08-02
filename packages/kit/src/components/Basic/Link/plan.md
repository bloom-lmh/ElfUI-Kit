# Link Element Plus API 对标计划

## v0.0.2-beta.1 案例缺口复核（2026-07-26）

- [x] 新增 `to` / `replace`，直接对接当前 `@elfui/router`；普通点击走客户端导航，修饰键、非主键和新窗口继续使用浏览器原生行为。
- [x] 路由目标优先于 `href`，并输出真实可复制 `href`；没有激活 router 时字符串和 path 对象仍具备降级地址。
- [x] 路由活动态反射为 `data-active` / `data-exact-active`，内部链接同步 active class、exact active class 与 `aria-current="page"`。
- [x] 新增 `rel`；`target="_blank"` 自动合并 `noopener noreferrer` 且保留用户 token。
- [x] 禁用态移除 `href` / `target` / `rel`，设置 `tabindex="-1"` 与 `aria-disabled="true"`，拦截 click、Enter 和 Space。
- [x] 长链接允许自然换行；空图标不再产生无意义间距，属性图标与图标插槽保持一致间距。
- [x] 3 组双语案例覆盖语义外观与长文本、Router/hash history、外链安全与禁用键盘，并补齐 Template、Script、Props、Events、Slots。
- [x] 组件 12 项 + 页面 2 项测试通过；应用和发布库构建通过；中文、英文、暗色和真实路由跳转均完成浏览器截图验证。

## 本轮记录

- [x] 第二阶段：调整 icon slot 优先级高于 `icon` prop，并补 PropsTable 说明。
- [x] 第三阶段：复核 icon slot 优先级无误；页面示例补 Script 视图；单测扩展到 15 条覆盖 type/href/target/disabled/underline/icon/slot。

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Basic/Link`
- Element Plus 文档：`link.md`
- 实现原则：对齐 Element Plus Link 的外部 API 与禁用/跳转语义，内部保持 ElfUI Web Components 与 `${...}` 模板写法。

## 第一批实现

- [x] 基础 props：`type`、`underline`、`disabled`、`href`、`target`、`icon`。
- [x] 基础 slot：`default`、`icon`。
- [x] 禁用态阻止跳转和 click 冒泡。
- [x] 注册到 Basic 组件族并补单测。

## 后续差距

- [x] 补独立案例页：覆盖 `type`、`underline`、`disabled`、`href/target`、`icon` 属性和 `icon` 插槽。
- [x] 复核 Element Plus icon 对象/组件传入方式与 slot 优先级：slot 优先于 icon prop，符合预期。
- [x] 页面示例补 Template / Script 双视图和 PropsTable。
