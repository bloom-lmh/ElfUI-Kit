# Statistic / Countdown 对齐计划

## 2026-07-19 案例回归

- [x] 修复动态增长案例标题操作按钮坍缩

更新时间：2026-07-13

- [x] Statistic：数值、标题、前后缀、精度、分隔符、formatter、value-style 与命名 slots。
- [x] 新增独立 `elf-countdown`：目标时间、DD/HH/mm/ss/SSS 格式、字面量、change 与单次 finish 事件。
- [x] Countdown 提供 `role="timer"` 无障碍语义，且清理定时器生命周期。
- [x] 文档案例覆盖统计格式化和倒计时，PropsTable 同步。
- [x] 单测覆盖 Statistic 格式化/slots 和 Countdown 格式边界、事件与 timer 语义。
- [x] 2026-07-16 Statistic 新增 opt-in 数值增长：`animated`、`start-value`、`duration` 与 linear / ease-out / ease-in-out；后续 value 更新从当前显示值继续过渡，并自动尊重 reduced-motion。
- [x] 2026-07-16 新增三组动态指标案例，交互按钮与目标状态放在 Playground 标题行；同步 Props 表和确定性动画测试。

## 验收记录

- [x] `pnpm test src/components/Data/Statistic/Statistic.test.ts src/components/Data/Countdown/Countdown.test.ts` 通过。
- [x] `pnpm build` 通过。
- [x] 2026-07-16 Statistic / Countdown 联合测试 8/8、构建、暗色真实浏览器交互与控制台检查通过。
