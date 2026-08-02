# ui-kit Components Element Plus 全量对标计划

生成时间：2026-07-05

## 范围

- 本目录下已为 83 个现有组件目录生成或更新 `plan.md`。
- 每份组件计划包含 Element Plus API 摘要、当前 ElfUI API 快照、差距任务和验收清单。
- 后续实现顺序：先 Form/Picker/Feedback 的用户阻塞问题，再 Navigation/Data/Layout，最后 Basic/Providers 与内部文档组件。

## 现有组件目录

- [x] `Basic/Avatar`
- [x] `Basic/Badge`
- [x] `Basic/Button`
- [x] `Basic/Icon`
- [x] `Basic/Link`
- [x] `Basic/Tag`
- [x] `Basic/Text`
- [x] `Basic/Heading`
- [x] `Common/Playground`
- [x] `Common/PropsTable`
- [x] `Data/Card`
- [x] `Data/Carousel`
- [x] `Data/Collapse`
- [x] `Data/Descriptions`
- [x] `Data/Divider`
- [x] `Data/Empty`
- [x] `Data/Image`
- [x] `Data/InfiniteScroll`
- [x] `Data/Pagination`
- [x] `Data/Progress`
- [x] `Data/Result`
- [x] `Data/Skeleton`
- [x] `Data/Statistic`
- [ ] `Data/Table`
- [x] `Data/Timeline`
- [ ] `Data/Transfer`
- [x] `Data/Tree`
- [ ] `Data/Watermark`
- [x] `Feedback/Alert`
- [ ] `Feedback/Dialog`
- [ ] `Feedback/Drawer`
- [x] `Feedback/Loading`
- [ ] `Feedback/Message`
- [x] `Feedback/Notification`
- [ ] `Feedback/PopConfirm`
- [ ] `Feedback/Tooltip`
- [ ] `Feedback/Tour`
- [x] `Form/Autocomplete`
- [x] `Form/Cascader`
- [x] `Form/Checkbox`
- [x] `Form/CheckboxGroup`
- [ ] `Form/Form`
- [ ] `Form/FormItem`
- [x] `Form/Input`
- [x] `Form/InputNumber`
- [x] `Form/InputOtp`
- [x] `Form/InputTag`
- [x] `Form/Mention`
- [x] `Form/Radio`
- [x] `Form/RadioGroup`
- [x] `Form/Rate`
- [ ] `Form/Segmented`
- [x] `Form/Select`
- [x] `Form/Slider`
- [x] `Form/Switch`
- [x] `Form/Textarea`
- [ ] `Form/Upload`
- [x] `Layout/Aside`
- [x] `Layout/Container`
- [x] `Layout/Flex`
- [x] `Layout/Footer`
- [x] `Layout/Grid`
- [x] `Layout/GridItem`
- [x] `Layout/Header`
- [x] `Layout/Layout`
- [x] `Layout/Main`
- [x] `Layout/Scrollbar`
- [x] `Layout/Splitter`
- [x] `Layout/Sticky`
- [x] `Navigation/Anchor`
- [x] `Navigation/BackTop`
- [x] `Navigation/Breadcrumb`
- [x] `Navigation/Dropdown`
- [x] `Navigation/Menu`
- [x] `Navigation/PageHeader`
- [x] `Navigation/Steps`
- [x] `Navigation/Tabs`
- [ ] `Picker/Calendar`
- [ ] `Picker/ColorPicker`
- [ ] `Picker/DatePicker`
- [ ] `Picker/TimePicker`
- [ ] `Providers/DefaultsProvider`
- [ ] `Providers/LocaleProvider`
- [ ] `Providers/ThemeProvider`

## 尚未在 ElfUI 中建目录的 Element Plus 组件

- 无

## 已由现有目录或样式体系承接的 Element Plus 文档

- `border.md` / `color.md`：属于 Element Plus 样式规范文档，先由全局 token、基础样式和后续文档承接，不新增运行时组件目录。
- `text.md` / `typography.md`：由 `Basic/Text` 先承接基础文本能力，后续再决定是否拆 Typography 组合组件。
- `popover.md`：由 `Feedback/Tooltip` 先承接浮层定位能力，后续按 API 差距决定是否拆 `Popover`。
- `table-v2.md` / `tree-v2.md` / `tree-select.md`：先挂在 `Data/Table`、`Data/Tree` 的对标计划里，后续按复杂度拆目录。

## 统一验收

- [ ] 所有对外组件 API 名称、默认值、事件 payload、slot/expose 能力对齐 Element Plus 文档。
- [ ] 所有组件页面示例支持 Template / Script 视图；动态绑定统一使用 `${...}`。
- [ ] 每个组件至少覆盖基础用法、受控状态、禁用/清空/空数据、键盘或可访问性核心路径。
- [ ] `pnpm verify` 通过；大范围变更前可先用 `npm --prefix ui-kit run build` 和目标测试分批验证。

## 2026-07-14 体验升级批次

- [x] 完成 Form / Upload / InfiniteScroll / Skeleton 案例布局修复。
- [x] 完成 Carousel / Timeline / Tree / Table / Loading 视觉升级。
- [x] 完成 Menu / Tabs / Steps 溢出、折叠和交互回归修复。
- [x] 完成 Calendar / DatePicker / TimePicker 的 Vuetify 信息架构参考升级，并通过定向测试、构建和真实浏览器暗色验收。
- [x] 完成 Splitter / InputTag / Image / Sticky 的真实交互修复，并补齐 Tour / InfiniteScroll / Picker 案例。
- [x] 完成 AvatarGroup 暗色外观、Tree 无边框默认值及 Flex / Grid / Container 响应式布局增强。
- [x] 本批 15 个目标测试文件共 108 条用例通过，生产构建及关键浏览器路径验收通过。
