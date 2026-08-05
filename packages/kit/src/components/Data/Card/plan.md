# Card Element Plus API 对标计划

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Data/Card`
- Element Plus 文档：`card.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### card.md

#### API

- `header`
- `footer ^`
- `body-style`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `shadow`
- `default`
- `footer`

#### Attributes

- `header`
- `footer ^`
- `body-style`
- `header-class ^`
- `body-class ^`
- `footer-class ^`
- `shadow`

#### Slots

- `default`
- `header`
- `footer`

## 当前 ElfUI API 快照

### Props

- `avatar`
- `clickable`
- `image`
- `imageHeight`
- `imagePlacement`
- `imageWidth`
- `overlay`
- `subtitle`
- `title`
- `variant`

### Events

- `click`

### Slots

- `cover`
- `default`
- `extra`
- `footer`
- `header`
- `title`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`header`、`footer`、`body-style`、`header-class`、`body-class`、`footer-class`、`shadow`。具名 slot 优先于同名文本 prop。
- [x] P1 补齐事件差距：Element Plus Card 无公开事件；保留 Kit `click` 扩展事件。
- [x] P1 补齐插槽/暴露方法：`default`、`header`、`footer` 均已支持；无 Element Plus expose。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。`clickable` 卡片具备 button role、tabindex 与 Enter/Space 触发。
- [x] P2 更新页面示例：补充 `header/footer/shadow` Element Plus 兼容 API 案例。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过；目标单测通过。

2026-07-15 验收：Card 定向测试通过；浏览器验证交互计数 `0 → 1`，全部案例源码与 API 表格正常渲染，控制台无错误。

## 2026-07-15 Vuetify 视觉升级

- [x] 参考 Vuetify VCard 的 surface、variant、density 和 actions 信息层级，重做圆角、边界、阴影与内容间距。
- [x] 新增 `tonal` / `flat` 变体与 `default` / `comfortable` / `compact` 密度。
- [x] 点击卡片悬浮时仅提升边界和阴影，不再位移造成布局跳动；封面缩放遵循 reduced-motion。
- [x] 案例和 PropsTable 同步中文化并覆盖新增能力。

## 2026-07-19 旅行图片卡片

- [x] 新增带内嵌封面、标题收藏操作与日期元信息的旅行卡片案例。
- [x] 收藏和日历均使用 SVG 图标，收藏按钮具备 `aria-pressed` 状态。
- [x] 修复纯图片 `cover` 插槽被误判为空的问题，并补齐组件与页面回归测试。

## 2026-07-26 v0.0.2-beta.1 状态与案例复核

### 公共契约

- [x] 新增 `disabled` / `loading`，整卡交互在禁用或加载期间退出 Tab 顺序，并同步 `aria-disabled` / `aria-busy`。
- [x] 新增 `image-alt`、`image-load` / `image-error` 事件与 `image-error` 插槽；快捷封面失败后保持卡片尺寸并允许恢复。
- [x] 整卡点击、Enter、Space 统一触发 `click`；按钮、链接、输入控件等嵌套交互不再额外激活整卡。
- [x] `shadow`、`variant`、`density`、`image-placement` 非法输入具有稳定回退值。
- [x] 加载与封面动效遵循 `prefers-reduced-motion`。

### 案例与文档

- [x] 将分散案例收敛为“Surface 与内容密度”“整卡交互与键盘”“加载、骨架与媒体恢复”3 个完整场景。
- [x] Skeleton 继续作为可组合组件负责正文占位，Card 只负责容器加载语义与交互锁定，避免重复 API。
- [x] 页面标题、状态、Template、Script、Props、Events、Slots 全部支持中英文运行时切换。

### 验证

- [x] Card 组件 27 项 + 页面 2 项，共 29 项定向测试通过。
- [x] 宏类型检查扫描 109 个组件文件，0 macro error / 0 TypeScript error。
- [x] beta API 扫描 850 个源文件通过。
- [x] 应用 775 模块、发布库 252 模块构建通过。
- [x] 真实浏览器验证键盘激活、嵌套收藏、禁用状态、加载切换、图片失败恢复、中英文与暗色主题；控制台 0 error / 0 warning。
- [x] 截图：`card-keyboard-nested-action.png`、`card-loading-media-recovery.png`、`card-loading-media-dark-en.png`。

## 2026-08-03 圆角收敛与组合案例

- [x] 卡片默认圆角从 `--elf-radius-md` 收敛到 `--elf-radius-sm`（4px），与 Element Plus / Vuetify 卡片规范对齐；保留 `--elf-card-radius` 覆盖入口。
- [x] “Surface 与内容密度”案例更名为“内容与密度”，重做四张层级 / 密度卡片视觉。
- [x] 新增“组合卡片”案例：媒体封面、个人资料、数据指标、横向布局四张卡片。
- [x] “组合卡片”封面与头像改为本地真实图片（`apps/website/public/cards/`），`image` prop 接管加载与失败兜底。
- [x] 新增“创意卡片”案例：3D 悬停倾斜、3D 翻转、渐变辉光、层叠相册堆；纯 CSS 实现并适配 `prefers-reduced-motion`。
- [x] 页面测试补充组合案例断言；Prettier / 宏扫描 / 聚焦测试通过。
