# Empty Element Plus API 对齐计划

更新时间：2026-07-13

- [x] Props：`image`、`image-size`、`description`。
- [x] Slots：`default`、`image`、`description`。
- [x] 默认状态使用可主题化 SVG 插画；`--elf-empty-illustration` 与 `--elf-empty-illustration-accent` 支持明暗主题覆盖。
- [x] 自定义图片会替换默认插画，默认插画对辅助技术隐藏。
- [x] 文档覆盖默认、插槽及图片场景，PropsTable 同步。
- [x] 单测覆盖尺寸、默认插画、图片切换与 slots。

## 验收记录

- [x] `pnpm test src/components/Data/Empty/Empty.test.ts` 通过。
- [x] `pnpm build` 通过。

## 2026-07-26 v0.0.2-beta.1 空内容边界复核

- [x] 新增 `size="compact"` 密度，公开 `--elf-empty-min-height`、`--elf-empty-gap` 与 `--elf-empty-padding` 定制入口。
- [x] 数字与纯数字字符串 `image-size` 统一转换为 px，限制 40px 最小值并安全处理非有限数。
- [x] 默认操作插槽与说明插槽动态检测内容；空插槽不再保留无意义间距，长说明可安全换行。
- [x] 说明区域补齐 polite / atomic status 语义，自定义与外链插画保持装饰属性，避免重复朗读。
- [x] 案例收敛为默认/紧凑密度、搜索无结果、首次使用与操作区 3 个双语场景，补齐 Template、Script 和完整 API。
- [x] 组件与页面共 12 项定向测试通过；真实浏览器验证状态切换、创建/重置、英文和 Midnight，控制台 0 error / 0 warning。
