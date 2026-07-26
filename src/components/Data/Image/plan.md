# Image Element Plus API 对标计划

## 2026-07-21 文档懒加载回归

- [x] 懒加载案例改用页面自然滚动与单张真实图片，不再嵌套自建滚动容器。
- [x] 案例补充 Script 数据来源并接入中英文说明。

## 2026-07-19 lazy-loading lifecycle

- [x] Keep `src` unset until IntersectionObserver reports a real intersection.
- [x] Preserve the loading shimmer after intersection until the image `load` event, then fade the image in.
- [x] Keep an error slot and disable shimmer/fade motion for `prefers-reduced-motion` users.
- [x] Cover pre-intersection, loading, loaded, failure, and reduced-motion states with focused tests.

## 2026-07-17 regression completion

- [x] Verify runtime fit and fixed-size updates instead of only initial CSS variables.
- [x] Verify lazy loading keeps `src` unset until intersection and disconnects its observer afterwards.
- [x] Expose semantic load/error events and document the complete Props, Events, and Slots surface.

生成时间：2026-07-05

## 第一批实现

- [x] 基础 props：`src`、`alt`、`fit`、`width`、`height`、`lazy`。
- [x] 基础 slot：`error`。
- [x] 接入 Data 注册和单测。

## 后续差距

- [x] 补齐 preview-src-list、initial-index、preview-teleported、zoom-rate、toolbar、viewer 预览能力：支持本地或 body Teleport 渲染、遮罩/键盘关闭、轮换与缩放工具栏。

## 本轮案例页

- [x] 新增独立展示页面，覆盖 Template / Script、src、fit、width/height、lazy、error slot 与 preview / zoom / navigation 示例。

## 2026-07-26 v0.0.2-beta.1 响应式与预览组复核

- [x] 补齐 `srcset` / `sizes` 原生响应式图片契约，并让懒加载在进入视口前同时延迟 `src` 与 `srcset`。
- [x] 补齐同地址重试、加载/错误宿主状态、内置错误回退，以及 `retry()` / `openPreview()` / `closePreview()` 方法。
- [x] 预览组支持 Enter / Space 打开、方向键和 Home / End 切换、缩放与重置、Escape 关闭、焦点陷阱、焦点恢复和页面滚动锁。
- [x] 预览控件接入 LocaleProvider，补齐中英文无障碍名称，并支持 Teleport 与动态空列表安全关闭。
- [x] 将案例收敛为对象适配矩阵、失败重试、响应式懒加载、预览组键盘 4 个完整场景，补齐双语 Template、Script 与完整 API。
- [x] 组件与页面共 21 项测试、beta 迁移扫描、宏类型检查、应用/发布库构建、完整度检查和真实浏览器截图均通过。
