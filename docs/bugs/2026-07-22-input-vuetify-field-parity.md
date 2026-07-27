# Input Vuetify 字段外观与动效对齐

## 目标

只处理 `elf-input`，以 Vuetify Text Field 官方页面及其 `VField` 实现为视觉基准，保留 ElfUI 的 Web Component、表单、事件和主题契约。

## 验收清单

- [x] `filled/default`：静止标签位于输入行，聚焦后缩放上浮并出现底部激活线。
- [x] `outlined`：静止标签位于框内，聚焦后平滑进入真实边框缺口，边框由 1px 过渡为 2px。
- [x] `underlined`：透明表面、底部线条和标签上浮行为与 Material 字段一致。
- [x] `solo`、`solo-filled`、`solo-inverted`：分别实现独立表面、填充表面和聚焦反色，不错误叠加描边。
- [x] 内部前后图标与外部前后图标布局稳定；内部前图标存在时标签按 variant 采用自然的斜向/垂直浮动轨迹，不与图标、输入值重叠。
- [x] 支持 `default / comfortable / compact` density，并保留 `small/default/large`、`sm/md/lg` size 兼容语义。
- [x] 标签与相同 placeholder 不重复，placeholder 只在标签浮动后出现。
- [x] 明暗主题、禁用、只读、错误、清空、密码、字数统计状态不回归。
- [x] 文档案例完整展示六种外观、三种密度与四类图标位置，Template/Script 可复制。
- [x] 定向测试、完整测试、构建和浏览器控制台检查通过。
- [x] 保存静止、聚焦、图标、密度及暗色主题截图作为视觉验收证据。

## 验证结果

- Input 定向测试：33/33 通过。
- 全量测试：110 个测试文件、1008 项测试全部通过。
- `pnpm build`、`pnpm build:lib`、macro-aware typecheck 全部通过。
- 浏览器控制台：0 errors、0 warnings。
- 默认/舒适/紧凑实测高度：56px / 48px / 40px。
- 标签动画实测：150ms，`cubic-bezier(0.4, 0, 0.2, 1)`；outlined + 内图标场景的横纵坐标均出现连续中间态。

## 参考

- Vuetify Text Field：`https://vuetifyjs.com/zh-Hans/components/text-fields/`
- Vuetify density：`https://vuetifyjs.com/zh-Hans/components/text-fields/#density`
- Vuetify icons：`https://vuetifyjs.com/zh-Hans/components/text-fields/#section-56fe6807-icons`
- Vuetify `VField.sass`：标签缩放为 `0.75`，字段高度 56px，聚焦边框 2px，动效时长 150ms。
