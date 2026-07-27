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
