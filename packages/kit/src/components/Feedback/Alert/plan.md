# Alert Element Plus API 对标计划

生成时间：2026-07-05

## 本轮记录

- [x] 第四阶段：重写样式（借鉴 Vuetify），5 种变体 tonal/elevated/outlined/filled/plain，新增 density（compact）、prominent（渐变强调条），页面示例统一 50% 宽度垂直排布，PropsTable 同步更新。

## 2026-08-03 强调样式重设计

- [x] 移除 tonal/elevated/filled 的 4px/8px 粗色左边框与彩色阴影；`prominent` 改为 3px 圆角渐隐强调条与更深表面；图标气泡改为 32px 圆角方形磁贴；`elevated` 阴影收敛为中性。
- [x] 同步页面章节名（粗色强调条 → 强调提示）与 PropsTable 描述；Alert 聚焦测试通过，浏览器验证与截图归档。

## 对标定位

- ElfUI 组件目录：`Feedback/Alert`
- Element Plus 文档：`alert.md`
- 实现原则：对齐 Element Plus 对外 API 与交互语义；内部仍保持 ElfUI Web Components、细粒度响应式和 `${...}` 示例写法，不照搬 Vue 实现。

## Element Plus API 摘要

### alert.md

#### Alert API

- `title`
- `type`
- `closable`
- `center`
- `close-text`
- `show-icon`
- `effect`
- `close`
- `default`
- `icon ^`

#### Attributes

- `title`
- `type`
- `closable`
- `center`
- `close-text`
- `show-icon`
- `effect`

#### Events

- `close`

#### Slots

- `default`
- `title`
- `icon ^`

## 当前 ElfUI API 快照

### Props

- `center`
- `closable`
- `density` — `"default"` | `"compact"`
- `description`
- `prominent` — 8px 粗色条
- `showIcon`
- `title`
- `type` — `"info"` | `"tip"` | `"success"` | `"warning"` | `"danger"`
- `variant` — `"tonal"` | `"soft"` | `"elevated"` | `"outlined"` | `"filled"` | `"plain"`

### Events

- `close`

### Slots

- `default`

### Exposes

- 暂无记录

## 差距与任务

- [x] P1 补齐核心属性差距：`effect` 由 5 种 variant 承接；`close-text` 已完成。
- [x] P1 补齐事件差距：close 事件已对齐。
- [x] P1 补齐插槽/暴露方法：`title`、`icon` slot 已完成。
- [x] P1 对齐交互行为、键盘访问、禁用态、清空态、受控/非受控同步、表单联动和无障碍属性。（closable + density + prominent 等状态已完成）
- [x] P2 更新页面示例：所有示例 50% 宽度垂直排布，variant / density / prominent 全覆盖。
- [x] P2 补齐组件单测、页面冒烟和类型导出；必要时补视觉回归截图。

## 验收清单

- [x] API props/types 与页面 PropsTable 同步。
- [x] 关键交互和边界状态有单测覆盖。
- [x] 文档示例能在 Playground 中显示 Template / Script，且复制内容正确。
- [x] `pnpm build` 通过。

2026-07-15 验收：重写为直接注册 Custom Element 的 13 条单测，覆盖所有变体、ARIA、插槽、状态反射及关闭幂等；浏览器验证 23 个实例、关闭后可见实例 `23 → 22`，视觉截图与控制台均正常。

### 2026-07-31 说明块样式

- [x] 将说明块并入现有 `elf-alert`：新增 `type="tip"` 与 `variant="soft"`，默认值和已有变体行为保持不变。
- [x] 新增中英文 Playground 与 Props API，示例覆盖 info、tip、warning、danger，并使用 `show-icon="false"` 呈现静态说明块。
- [x] Alert 聚焦测试 1 个文件、14 项通过；文档国际化审计 `537/537` 通过；目标 ESLint、CSpell、Prettier 与 `git diff --check` 通过。
- [x] `pnpm build` 通过，1094 个模块完成生产构建，仅保留既有大 chunk 警告。`pnpm typecheck` 两次在 184 秒外层时限内无输出而超时，未记录为通过。
- [x] Chromium 验证 `/feedback/alert`：1440x1000 Material 中文与 390x844 Midnight 英文均无横向溢出，四个说明块无图标、颜色可区分、文字无溢出，控制台 `0 warning / 0 error`。
- [x] 截图：`docs/screenshots/2026-07-31/alert-soft-desktop-material-zh.png`、`docs/screenshots/2026-07-31/alert-soft-mobile-midnight-en.png`。
- [x] 根据页面复核将普通 Alert 圆角从 `--elf-radius-md`（8px）收敛到 `--elf-radius-sm`（4px），与紧凑模式及 Element Plus 警告提示观感一致；27 个实例在 1440x1000 与 390x844 下均为 4px，无组件或页面溢出，控制台 `0 warning / 0 error`。
