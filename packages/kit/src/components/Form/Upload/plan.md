# Upload Element Plus API 对标计划

## 2026-07-19 multi-file documentation and recovery

- [x] Center Upload demos within a responsive content width and keep file rows usable on mobile.
- [x] Add a controlled multi-file list demo covering ready, uploading, success, and error states.
- [x] Add an accessible SVG retry action for failed files and test the error-to-success flow.

生成时间：2026-07-05

## 对标定位

- ElfUI 组件目录：`Form/Upload`
- Element Plus 文档：`upload.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### upload.md

#### API

- `action ^`
- `headers`
- `multiple`
- `data`
- `with-credentials`
- `show-file-list`
- `drag`
- `accept`
- `crossorigin`
- `on-preview`
- `on-remove`
- `on-success`
- `on-error`
- `on-progress`
- `on-change`
- `on-exceed`
- `before-upload`
- `before-remove`
- `file-list / v-model:file-list`
- `list-type`
- `auto-upload`
- `http-request`
- `disabled`
- `limit`
- `directory ^`
- `default`
- `trigger`
- `tip`
- `file`
- `abort`
- `submit`
- `clearFiles`
- `handleStart`
- `handleRemove`

#### Attributes

- `action ^`
- `headers`
- `multiple`
- `data`
- `with-credentials`
- `show-file-list`
- `drag`
- `accept`
- `crossorigin`
- `on-preview`
- `on-remove`
- `on-success`
- `on-error`
- `on-progress`
- `on-change`
- `on-exceed`
- `before-upload`
- `before-remove`
- `file-list / v-model:file-list`
- `list-type`
- `auto-upload`
- `http-request`
- `disabled`
- `limit`
- `directory ^`

#### Slots

- `default`
- `trigger`
- `tip`
- `file`

#### Exposes

- `abort`
- `submit`
- `clearFiles`
- `handleStart`
- `handleRemove`

## 当前 ElfUI API 快照

### Props

- `accept`
- `action`
- `autoUpload`
- `beforeRemove`
- `beforeUpload`
- `buttonText`
- `chunkRequest`
- `chunkSize`
- `crossorigin`
- `data`
- `customRequest`
- `disabled`
- `directory`
- `drag`
- `fileNamePattern`
- `headers`
- `httpRequest`
- `limit`
- `listType`
- `method`
- `maxSize`
- `modelValue`
- `multiple`
- `name`
- `onChange`
- `onError`
- `onExceed`
- `onPreview`
- `onProgress`
- `onRemove`
- `onSuccess`
- `showFileList`
- `tip`
- `withCredentials`

### Events

- `change`
- `error`
- `exceed`
- `invalid`
- `preview`
- `progress`
- `remove`
- `success`
- `update:modelValue`

### Slots

- 暂无记录

### Exposes

- `abort`
- `clearFiles`
- `handleRemove`
- `handleStart`
- `select`
- `submit`

## 本轮已完成（2026-07-05）

- [x] 补齐 `headers`、`data`、`method`、`with-credentials`、`crossorigin`、`directory`、`http-request` 基础能力。
- [x] 补齐 Element Plus 风格 callback props：`on-preview`、`on-remove`、`on-success`、`on-error`、`on-progress`、`on-change`、`on-exceed`。
- [x] 补齐 exposes：`abort`、`handleStart`、`handleRemove`、`clearFiles(statuses)`，保留 `select`、`submit`。
- [x] 文件列表模板核心动态绑定迁移为 `${...}`，文件 action 改为事件代理。
- [x] 补充 `httpRequest` 参数、`directory`、暴露方法和 `abort` 单测。

## 差距与任务

- [x] P0 核心属性：补齐 `file-list / v-model:file-list` 别名、带 action 的真实 XHR 默认请求、目录兼容提示、图片对象 URL 缩略图及资源回收。
- [x] P0 事件：统一 modelValue/fileList、change、invalid、exceed、progress、success、error、remove、preview 的 payload 和触发时机。
- [x] P1 插槽/暴露方法：trigger 提供 select/disabled，file 提供 file/remove/preview，tip 支持纯插槽；abort 可取消定时器、XHR 和返回 abort handle 的自定义请求。
- [x] P1 行为：完成拖拽区键盘语义、父 Form 禁用与校验联动、受控列表同步、清空/移除请求取消以及卸载资源清理。
- [x] P2 更新页面示例：Template / Script 双视图、所有动态绑定使用 `${...}`，覆盖文件列表、拖拽、手动提交、校验和目录上传。
- [x] P2 补齐组件单测、页面冒烟和类型导出，并完成真实浏览器视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build`、Form/Providers 分类测试与宏类型检查通过。

## 2026-07-30 Vuetify documentation batch

- [x] 公开类型补齐 `UploadSlots`、`UploadElement` 与 `dropzone` slot，并保持上传任务、请求和文件列表行为由现有 Upload 所有者维护。
- [x] 新增 Vuetify 风格文件输入案例：outlined 字段、纸夹图标、placeholder 与已选文件 chips。
- [x] 新增 Vuetify 风格文件上传案例：虚线 dropzone、上传图标、Drag and drop、or 与 Browse Files。
- [x] 新增 Upload 页面回归测试；桌面 Material 中文截图为 `docs/screenshots/2026-07-30/upload-vuetify-showcase-desktop-light-zh.png`。

## 2026-07-30 EP-11 page-family finalization

- [x] 页面入口与 7 个旧案例全部接入双语；9 个 Playground 的变化状态统一为标题行 live region，预览统一复用共享水平/垂直居中舞台，Template/Script 随语言生成。
- [x] API 表按当前 `UploadProps`、`UploadEmits`、`UploadSlots` 与 `UploadExpose` 重写；`UploadElement` 同时公开 Props 与 Expose，并为新增公开类型补 TSDoc。
- [x] “浏览文件”通过 `UploadElement.select()` 复用组件公开 API；真实浏览器发现原按钮没有打开选择器后补回归测试，未查询或修改 Upload 内部 Shadow DOM。
- [x] 文档审计达到 `514/535`，Upload 的 8 个缺口全部清零；剩余 21 个文件只位于 Table。
- [x] Upload 组件与页面聚焦测试 2 个文件、21 项通过；页面目标 CSpell 13 个文件、0 问题。
- [x] 完成 1440x1000 与 390x844、Material/Midnight、中英文组合矩阵终审；移动端 9 个 Playground、9 个居中舞台与 9 个标题行状态完整，英文 Shadow DOM 汉字扫描为 0，390px 横向溢出为 `false`，最终控制台 0 warning / 0 error。截图保存在 `docs/screenshots/2026-07-31/upload-*.png`。
- [ ] 全库终态门禁仍被并行 Overview 改动阻断：全量测试 233 个文件中 232 个通过、1638 项中 1637 项通过，唯一失败为 `OverviewPage/style.scss` 渐变守卫；`pnpm typecheck` 与 `pnpm build:lib` 被 `OverviewCard/index.ts` 两条宏模板类型错误阻断。Upload 目标 Prettier、ESLint、CSpell、`git diff --check`、聚焦测试与应用构建均通过。
- [ ] 在 `EP-04` 审计文件列表的 `<TransitionGroup>`：现有列表具备稳定 `uid`，但 leave 会影响移除、abort、对象 URL 释放、文件插槽焦点与异步进度节点，迁移必须同时覆盖快速增删、`clearFiles()`、reduced motion 和卸载清理。本批没有添加手写列表动画；`<Teleport>`、`<KeepAlive>` 与 `<Suspense>` 不适用于当前同树、非动态组件、非异步渲染边界。
