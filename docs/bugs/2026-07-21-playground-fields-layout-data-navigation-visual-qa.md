# 2026-07-21 Playground、表单、布局与数据导航细节修复

## 验收原则

- [x] 保持 ElfUI Custom Element、Shadow DOM、表单上下文和宏模板约束。
- [x] 同步实现、类型、样式、案例、API 表、测试及相关组件 `plan.md`。
- [x] 使用真实浏览器完成关键交互与截图验收，产物位于 `output/playwright/2026-07-21/`。
- [x] 检查本轮页面的中英文标题、说明、状态、控制项和按钮文案。
- [x] 检查桌面和移动端响应式布局。

## 第一批：公共案例基础设施

- [x] Playground 的 Select、Autocomplete、Input、InputNumber、Textarea、Cascader 控制项默认统一为 `underlined`。
- [x] Playground 的 RadioGroup、CheckboxGroup 控制项默认统一为按钮风格。
- [x] 控制台使用抽屉式宽度、透明度和位移动画收起，收起后预览区自动铺满。
- [x] Progress 操作按钮和速度选择器移入控制台，标题栏仅保留状态。
- [x] 无脚本静态案例禁用 Script 标签。
- [x] DocsToc 以页面段落 `h2` 为一级项，以所属 Playground 标题为二级项。

## 第二批：布局与字段体系

- [x] 九种响应式应用骨架拆分为九个独立案例，并用颜色区分导航、工具栏、内容和辅助区。
- [x] Input 的 outlined notch、filled、underlined、solo 系列表面以及内外前后图标完成统一。
- [x] beta6 回归：相同 `label/placeholder` 自动去重，内前置图标避让静止标签，outlined 聚焦以真实 legend 开口形成“— 标签 —”。
- [x] Autocomplete、Cascader、Select 复用共享字段表面与浮动标签规则。
- [x] InputNumber 支持 default、stacked、split、hidden 控制器外观以及 reverse、inset 语义。
- [x] 清除 InputNumber 对宿主原生 `focus`、`blur` 的重复 expose，浏览器控制台保持零警告。

## 第三批：选择器、媒体与进度

- [x] Image 懒加载支持 `loading` 插槽和默认动画，并改为真实页面滚动触发。
- [x] DatePicker 单选、范围、多日期和动作栏使用乐观草稿状态，消除受控旧值回灌闪烁。
- [x] DatePicker 多日期标签改为固定区域内换行，不再横向撑开页面。
- [x] Calendar 范围草稿与提交值分离，首击不再短暂恢复旧范围。
- [x] Progress 线性与圆形案例重新布局，圆形进度水平居中排列。

## 第四批：列表、导航与数据展示

- [x] List 与 VirtualList 文档职责分离，并新增可复用 `ListItem` 组件。
- [x] VirtualList 支持 `list-item-class`、`list-item-style` 和自定义渲染；快速滚动保留缓冲窗口。
- [x] Anchor 使用简洁分节导航和不同柔和背景，定位参数进入 Playground 控制台。
- [x] BackTop 更新外观、默认 SVG 图标、滚动状态标题展示和中英文案例。
- [x] Descriptions 使用稳定标签列、内容列和一致行高，基础详情严格对齐。
- [x] Table 分页案例改为声明式计算切片和直接事件绑定，减少页面切换更新路径。
- [x] Menu 实际生效的 `style-base.scss` 搜索区补齐下边距。

## 验证矩阵

- [x] 相关组件定向测试：14 个测试文件、181 项测试全部通过。
- [x] 全量测试通过：110 个测试文件、1004 项测试。
- [x] 应用构建通过。
- [x] 组件库构建通过，macro-aware typecheck 为 0 error。
- [x] `git diff --check` 通过。
- [x] Material 明亮主题桌面截图通过。
- [x] Midnight 暗色主题桌面截图通过。
- [x] 移动端窄屏截图通过。
- [x] Input、InputNumber、DatePicker、Calendar、Progress、Anchor、BackTop、Table 完成真实交互回归。

## 截图记录

- [x] `layout-nine-skeletons.png`
- [x] `input-playground.png`、`input-mobile.png`
- [x] `input-beta6-focus-notch.png`、`input-beta6-midnight-focus.png`
- [x] `input-beta6-empty-icons.png`
- [x] `input-number-fixed.png`
- [x] `progress.png`
- [x] `list.png`、`virtual-list-fast-scroll.png`
- [x] `image-lazy-custom.png`
- [x] `date-picker-range-updated.png`、`calendar-range-updated.png`
- [x] `descriptions.png`
- [x] `anchor-redesign.png`
- [x] `backtop-visible.png`
- [x] `table-page-2.png`
