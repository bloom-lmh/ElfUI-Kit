<!-- cspell:words nodeNext treegrid overscan axe-core FormData ElementInternals AbortSignal WeakMap NodeNext codemod -->

# ElfUI Kit 下一代对标与架构收敛总计划

> 状态：Active / 唯一计划事实源
> 建立日期：2026-08-08（Asia/Shanghai）
> 更新日期：2026-08-14（Asia/Shanghai）
> 当前基线：`@elfui/kit@0.0.2-beta.5`、ElfUI Core/Compiler/Vite Plugin `0.1.0-beta.21`
> 对标快照：Element Plus `2.14.4`、Vuetify `4.1.8`（均以 2026-08-07 官方 release 为准）

本文件取代仓库中此前 11 份日期计划和 133 份组件/页面级 `plan.md`；其中 192 个未完成勾选项已归并到下方批次。旧文件不再保留在工作树；需要追溯历史时使用 Git。今后不得再建立第二份平行总计划，也不得在组件目录重新维护完成度清单。

## 1. 最终目标

ElfUI Kit 的下一代版本必须同时达到以下结果：

1. 对齐 Element Plus 的高频公开契约与交互语义，包括 props、默认值、events、slots、exposes、受控优先级、表单、键盘和 ARIA；不机械复制 Vue 实现。
2. 对齐 Vuetify 的跨组件系统能力，包括 Defaults、Theme、Locale、Icons、Display、Platform、Application Layout、Date、GoTo、Overlay、Aliases、Blueprint/Presets、Tokens 和 SSR/Hydration。
3. 保持 ElfUI 的 Custom Elements、Shadow DOM、Provider、Teleport 和宏编译优势；框架已有能力必须优先使用。
4. 所有组件、类型和 Kit 公共 API 只从 `@elfui/kit` 根入口命名导入；同时支持手动按需注册、`registerAllComponents()` 全量注册、真实 tree-shaking 和稳定类型提示。
5. 用户能够通过语义 token、组件 CSS 自定义属性和 `::part()` 完成稳定样式覆盖，不依赖 Shadow DOM 内部结构。
6. 所有公开能力都有模型测试、组件测试、真实消费者测试和适用的浏览器证据；测试绿色不能靠跳过、放宽断言或任意等待。
7. 达到可发布 `1.0` 的稳定性：没有未解释循环依赖、外部输入原地修改、资源泄漏、异步陈旧写回和未声明破坏性差异。

“对标”不等于组件名称一一复制。对于上游的每项能力，ElfUI 必须明确记录为：`equivalent`、`combined`、`implement` 或 `non-goal`，并给出源码、测试和文档证据。只有带证据的 `equivalent/combined/implement` 才计入完成。

## 2. 官方事实源

- Element Plus release：<https://github.com/element-plus/element-plus/releases/tag/2.14.4>
- Element Plus 组件总览：<https://element-plus.org/en-US/component/overview.html>
- Element Plus 完整/按需导入：<https://element-plus.org/en-US/guide/quickstart.html>
- Element Plus Config Provider：<https://element-plus.org/en-US/component/config-provider.html>
- Vuetify release：<https://github.com/vuetifyjs/vuetify/releases/tag/v4.1.8>
- Vuetify 官方仓库与系统实现：<https://github.com/vuetifyjs/vuetify>
- ElfUI 框架契约：相邻 `elfui-docs` 仓库的当前中英文文档和实际安装类型。

每次开始新的对标批次时重新确认上游最新稳定版；升级对标快照必须单独提交矩阵差异，不得顺手扩大正在执行的组件范围。

## 3. 当前事实基线

### 3.1 已有优势

- 源码、宏组件、测试、公开入口、包体、Style API、依赖、资源和浏览器数据以[当前机器生成基线](./baselines/current-repository-baseline.md)为准；通过 `pnpm baseline:collect` 从源码和构建产物重新采集。
- Kit、Website 与架构脚本均有独立测试入口；默认高并发冷加载 `register-all` 的超时已由本轮验证暴露，必须在 `NG-007` 拆分测试注册 setup，不以提高 timeout 掩盖。
- `@elfui/kit` 已收敛为 side-effect-free 单根入口；显式全量注册、组件自带默认样式、可选 utilities 安装和 Button/Input consumer tree-shaking 已有自动门禁。
- Overlay stack/lifecycle、focus scope、date adapter、virtual window、Provider defaults 已有可复用基础。
- 双语文档严格审计当前为 567/567。
- TableV2、TreeSelect、DateTimePicker、TimeSelect、MessageBox、主题与服务默认值等功能已落地。

### 3.2 已确认阻塞项

- 稳定 Form 控件未接入 `defineOptions({ formControl: true })` / `useFormControlContext()`，原生 `FormData`、reset、disabled fieldset 和状态恢复没有完整契约。
- Tree、Cascader、Upload 存在修改用户输入对象或数组的路径。
- Upload 存在 data/beforeUpload rejection、同步完成 request handle、chunk abort 和陈旧异步写回风险。
- Table 选择同时维护响应式状态和手工 DOM 状态；快速虚拟路径监听器密度高。
- Input/Textarea/Switch 手工覆写 host 原生方法，没有使用 `defineExpose(..., { overrideNative })`。
- Metadata、类型、根导出、注册 manifest 与文档表格仍未由同一生成器产出，存在后续漂移风险。
- Website 为保证全部文档示例可用，当前启动时调用 `registerAllComponents()`；[当前 bundle 数据](./baselines/current-repository-baseline.md#public-package-and-bundle)显示其仍需改为路由级显式注册并建立首屏预算。
- Tarball 的 Vite、TypeScript NodeNext、纯浏览器 ESM、SSR 与 CDN consumer matrix 尚未闭合；当前只有 Rollup Button/Input 按需门禁。
- [当前 Style API 基线](./baselines/current-repository-baseline.md#style-api)仍显示 parts、组件级 CSS 变量和覆盖文档未闭合。
- Style API metadata、稳定 parts、组件 token 和覆盖示例仍未达到全组件 100%。

## 4. 目标架构

```mermaid
flowchart LR
  A["公开契约与 metadata"] --> B["纯模型 / 状态机"]
  B --> C["Controller / Resource owner"]
  C --> D["Framework / Platform adapter"]
  D --> E["内部 primitive"]
  E --> F["公开 Custom Element"]
  A --> G["生成 types / docs / exports / resolver"]
  G --> H["完整导入与单组件消费"]
```

依赖只能从右侧公开组件向左侧稳定能力流动，低层不得导入公开组件实现。共享契约类型放在定义语义的最低层。类型环和运行时环都视为架构失败。

采用模式的边界：

- Strategy：日期、图标、locale、排序、筛选、格式化等真实可替换算法。
- Adapter：浏览器、框架、请求、外部 i18n、流媒体等边界翻译。
- State Machine：Upload task、Cascader lazy transaction、Picker range、Overlay lifecycle 等有明确状态转换的领域。
- Controller：持有监听器、observer、timer、AbortController、object URL、焦点或滚动资源的对象。
- Facade：ConfigProvider 和应用级创建 API，只聚合稳定服务，不复制具体实现。
- Registry：仅用于 overlay stack、layout items 等确实需要跨实例协调的资源，并且必须 Provider/application scoped。

禁止万能 composable、进程级可变单例、仅为减少行数建立的共享 DOM 外壳，以及通过 timeout/手工 DOM 修补框架时序。

## 5. 执行与勾选规则

1. 批次严格从上到下执行；前一批次退出门禁未通过，后一批次不得宣布完成。
2. 同一批次可拆原子提交，但每个提交必须保持公开契约、实现、类型、样式、测试和文档同步。
3. `[x]` 只表示完整达到该项验收标准；“已写文档”“局部测试通过”或“已有代码”不能单独勾选。
4. 命令结果、bundle 数据、截图和浏览器结论写入 `docs/reports` 或 `docs/baselines`，本文件只链接证据，不复制流水账。
5. 新发现的缺口加入对应批次，不新建日期计划或组件 `plan.md`。
6. 上游框架缺口必须进入 `docs/framework-issues` 的最小复现；Kit 中的临时 workaround 必须带移除条件和回归测试。
7. 所有性能数字使用固定环境五次中位数；超过当前确认基线 10% 的退化必须解释或回退。

## 6. 二十五个实施批次

NG 编号继续作为原子验收与 Git 追踪键；实施时按下表把相关 NG 项合并为一个可独立审核的完整批次。批次严格自上而下推进，前一批退出门禁未通过，不勾选后一批。状态以批次内全部 NG 项为准：全部为 `[x]` 才算 Done，部分完成记为 In progress。

| 批次 | 优先级 | 范围           | 结果                                       |       状态        |
| ---: | :----: | -------------- | ------------------------------------------ | :---------------: |
|   01 |   P0   | NG-000～NG-007 | 可信基线与唯一发布门禁                     |       Done        |
|   02 |   P0   | NG-100～NG-104 | 原生表单完整协议                           |       Done        |
|   03 |   P0   | NG-110～NG-113 | 外部输入不可变                             |      Pending      |
|   04 |   P0   | NG-120～NG-124 | 框架 API 与异步资源安全                    |      Pending      |
|   05 |   P0   | NG-200～NG-203 | Metadata 单一数据源                        |      Pending      |
|   06 |   P0   | NG-210～NG-216 | 单根入口、注册与主题契约                   | Partial / Blocked |
|   07 |   P0   | NG-220～NG-224 | Tarball 消费、预算与路由按需               | Partial / Blocked |
|   08 |   P1   | NG-300～NG-303 | Overlay、Collection、Virtual、Async 协议   |      Pending      |
|   09 |   P1   | NG-304～NG-308 | Field、指令、动效、服务作用域与分层        |      Pending      |
|   10 |   P1   | NG-400～NG-403 | 全组件公开契约矩阵                         |      Pending      |
|   11 |   P1   | NG-410～NG-412 | Upload 领域重构                            |      Pending      |
|   12 |   P1   | NG-420～NG-423 | Tree、Cascader、Select、TreeSelect         |      Pending      |
|   13 |   P1   | NG-430～NG-434 | Table、TableV2、VirtualList                |      Pending      |
|   14 |   P1   | NG-440～NG-443 | Picker、Tabs、Menu、Dropdown               |      Pending      |
|   15 |   P1   | NG-500～NG-502 | Application Layout、Display、Platform      |      Pending      |
|   16 |   P1   | NG-503～NG-506 | Defaults、Theme、Presets、Aliases          |      Pending      |
|   17 |   P1   | NG-507～NG-510 | Locale、Icons、Date、GoTo、Overlay、Config |      Pending      |
|   18 |   P1   | NG-600～NG-604 | Tokens、Parts 与 Host State                |      Pending      |
|   19 |   P1   | NG-605～NG-608 | Style 文档、覆盖验证、视觉与 Utilities     |      Pending      |
|   20 |   P2   | NG-700～NG-703 | 性能、DOM 与资源预算                       |      Pending      |
|   21 |   P2   | NG-710～NG-712 | 无障碍、键盘与输入环境                     |      Pending      |
|   22 |   P2   | NG-720～NG-723 | 浏览器、SSR、CSP 与截图证据                |      Pending      |
|   23 |   P2   | NG-800～NG-802 | 安装、组件与自动 API 文档                  |      Pending      |
|   24 |   P2   | NG-803～NG-808 | 质量文档、迁移、Starter 与 1.0 发布        |      Pending      |
|   25 |   P3   | NG-900～NG-903 | Labs 与可选扩展                            |      Pending      |

## Batch 01 — P0 计划、事实基线与发布门禁

目标：先让“完成”可信，避免测试或计划继续提供假绿色。

- [x] **NG-000 旧计划收敛。** 删除 144 份日期与组件/page 旧计划，归并其中 192 个未完成项，建立本文件为唯一事实源；Git 保留历史。
- [x] **NG-001 锁定对标矩阵。** 以 Element Plus 2.14.4 和 Vuetify 4.1.8 建立机器可读 capability/contract matrix；每项包含上游链接、ElfUI owner、状态、差异、测试和文档入口。
- [x] **NG-002 重新生成仓库基线。** 记录源码/宏组件/测试数量、bundle、公开 entries、Style API、依赖图、10k 数据性能、listener/observer/timer 和浏览器矩阵，不复制旧计划中的历史数字。证据：[可读报告](./baselines/current-repository-baseline.md)、[机器数据](./baselines/current-repository-baseline.json)、[浏览器原始数据](./baselines/current-critical-pages.json)。
- [x] **NG-003 修复能力清单门禁。** 删除 `toHaveLength(119)` 等硬编码计数，由源码扫描生成期望集合；缺失 owner 时输出具体文件。证据：[源码集合门禁](../scripts/capability-ownership.test.ts)、[当前 owner inventory](./architecture/2026-07-31-capability-ownership-and-reuse-inventory.md)。
- [x] **NG-004 建立全图循环依赖门禁。** 扫描全部非测试 TS，包括 type-only import；禁止跨层反向依赖和 SCC，先消除 Form/FormItem、Table 模型环。证据：[全图架构门禁](../scripts/architecture-boundaries.test.ts)、[扫描器回归测试](../scripts/dependency-graph.test.ts)、[当前依赖基线](./baselines/current-repository-baseline.md#dependency-graph)。
- [x] **NG-005 建立唯一 release gate。** `pnpm release:check` 串行执行 format ratchet、ESLint、CSpell、全量 typecheck、架构/契约与 Kit/Website 全量测试、strict locale audit、Website/Library build、built package、真实 tarball consumer 和无 DOM SSR import。证据：[唯一编排器](../scripts/release-check.mjs)、[发布契约门禁](../scripts/release-contract.test.ts)、[tarball consumer](../scripts/verify-tarball-consumer.mjs)。
- [x] **NG-006 收紧 prepublish。** 根包与 Kit 的 `prepublishOnly`、CI 和 release workflow 均只调用 `release:check`，契约测试禁止重新加入局部 test/build/locale 旁路。证据：[根脚本](../package.json)、[Kit 发布钩子](../packages/kit/package.json)、[CI](../.github/workflows/ci.yml)、[release workflow](../.github/workflows/release.yml)。
- [x] **NG-007 测试纪律。** 契约门禁禁止 skip/only/todo/条件禁用、retry、扩大 timeout 和 Playwright 固定等待；Kit/Website/契约拆分为低并发入口，在默认 timeout 下分别通过 1556/413/66 项测试；测试环境禁止外部资源加载，MD Page 使用拒绝意外 URL 的本地 fixture。证据：[测试纪律门禁](../scripts/test-discipline.test.ts)、[确定性 Happy DOM 配置](../vitest.config.ts)、[文档 fixture](../apps/website/src/pages/test-helpers.ts)。

退出门禁：`pnpm test` 包含全部 7 类架构/契约脚本并全绿；依赖图 0 环；`release:check` 可从干净 checkout 重复执行且失败能阻止发布。

验证记录（2026-08-14）：`pnpm release:check` 12/12 通过；架构/契约 66、Kit 1556、Website 413 项测试全绿，567/567 双语文档覆盖，Website/Library 构建、tree-shaking、tarball 类型消费与无 DOM SSR import 全部通过。

## Batch 02 — P0 原生 Form Associated Custom Elements

目标：组合 Kit 字段协议与 Core ElementInternals 协议，让全部适用控件具备一致的原生表单语义。

- [x] **NG-100 下沉 Form 契约。** 将 rule、trigger、context、field size 等共享类型移到 `types`/domain 层，`composables` 不再导入 Form/FormItem 组件层。证据：[共享 Form 类型](../packages/kit/src/types/form.ts)、[架构门禁](../scripts/architecture-boundaries.test.ts)。
- [x] **NG-101 组合双层表单协议。** Kit Form/FormItem 继续负责规则、字段、消息和布局；Core `useFormControlContext()` 唯一负责 ElementInternals、native form value、validity、reset、disabled 和 restore，不建立第二套注册表。证据：[Kit 原生表单 adapter](../packages/kit/src/composables/native-form.ts)、[所有权门禁](../scripts/native-form-contract.test.ts)。
- [x] **NG-102 接入全部适用控件。** Input、Textarea、InputNumber、Checkbox/Group、Radio/Group、Switch、Select、Cascader、TreeSelect、Autocomplete、Mention、InputTag、InputOtp、Slider、Rate、ColorPicker、Date/Time 系列和 Upload 明确声明是否 form-associated；适用者使用 `defineOptions({ formControl: true })`。证据：[24 个 value owner 清单](./architecture/2026-08-14-native-form-control-contract.md#associated-controls)。
- [x] **NG-103 序列化协议。** 定义 string/number/boolean/array/date/file 的 `setFormValue` 规则、空值、`name`、`form`、multiple 和受控值优先级；破坏性差异写迁移说明。证据：[序列化与迁移契约](./architecture/2026-08-14-native-form-control-contract.md)、[纯函数回归](../packages/kit/src/composables/__tests__/native-form.test.ts)。
- [x] **NG-104 原生表单测试矩阵。** 覆盖 `new FormData(form)`、native submit/reset、required/custom validity、外部 `form` 关联、disabled fieldset、state restore、受控/非受控、Shadow DOM 和 standalone。证据：[三浏览器矩阵](../scripts/native-form.playwright.ts)、[Playwright 配置](../playwright.native-form.config.ts)。

退出门禁：适用控件的 FormData、submit/reset、validation、fieldset、restore、受控/非受控和 Shadow DOM 矩阵全绿，且只有 Core 持有 ElementInternals 平台职责。

验证记录（2026-08-14）：24 个 value owner 全部接入同一 adapter；聚焦回归 31 个文件、390 项测试通过；Chromium、Firefox、WebKit 共 18/18 个真实浏览器场景通过；`pnpm release:check` 12/12 通过，架构/契约 69、Kit 1562、Website 413 项测试全绿，567/567 双语文档覆盖，Website/Library 构建、tree-shaking、tarball consumer 与无 DOM SSR import 均通过。

## Batch 03 — P0 外部输入不可变

目标：Tree、Cascader 与 Upload 只操作组件拥有的规范化状态，不写入用户对象。

- [ ] **NG-110 建立冻结输入门禁。** 对 data/options/fileList/modelValue 等对象输入使用 `Object.freeze`/deep-freeze 契约测试，组件不得抛错或写入用户对象。
- [ ] **NG-111 Tree 内部 Store。** lazy children、append/remove/insert/update/setData 只修改内部规范化 store；受控数据通过事件/model 通知父级，禁止 `props.data.push/splice` 和写 `row.raw.children`。
- [ ] **NG-112 Cascader 私有 lazy 状态。** 使用 keyed store/WeakMap 保存 loading/resolved/children；加入 options epoch 和 unmount token，旧 callback 不得写入新实例或新 options。
- [ ] **NG-113 Upload owned snapshot。** controlled fileList 复制为内部 task snapshot，所有更新生成新 item；用户对象和原始 File 只读。

退出门禁：所有 data/options/fileList/modelValue 冻结输入测试全绿；Tree、Cascader、Upload 的命令、lazy 与受控同步均不修改用户数据。

## Batch 04 — P0 框架 API 采用与异步资源安全

目标：复用 Core 生命周期与 expose API，并为 lazy、remote、upload、validation 建立统一取消和最后写入规则。

- [ ] **NG-120 原生方法暴露。** Input/Textarea/Switch 迁移到 `defineExpose(..., { overrideNative })`；删除手工 `Object.defineProperty` 和卸载 delete。
- [ ] **NG-121 生命周期资源审计。** 稳定事件使用 `useEventListener/useClickOutside/useEscapeKey`，Observer 使用 Core helper；动态语义 adapter 可保留 controller，但资源获取与释放必须同 owner。
- [ ] **NG-122 消除重复 slot observer。** 已有 `slotchange` 足以覆盖的组件删除 MutationObserver；保留者写明无法由 slotchange 表达的语义并测试。
- [ ] **NG-123 Upload 立即止血。** 捕获 beforeUpload/data/request rejection；同步 success/error 后不得重新登记 request handle；chunk upload 接入 AbortSignal/epoch；abort 后不得回写 progress/success。
- [ ] **NG-124 异步通用规则。** 所有 lazy/remote/upload/validation 路径具有 request id、取消、最后写入规则、unmount cleanup 和 rejection 测试。

退出门禁：非测试源码无手工 host `focus/blur` 覆写或可由 `slotchange` 替代的 observer；挂卸后资源归零，abort、换 props、卸载和 rejection 不产生陈旧写回或未处理 Promise。

## Batch 05 — P0 Metadata 单一数据源

目标：从宏声明生成可验证的公共契约与产物，消除类型、导出、注册和文档的手工副本。

- [ ] **NG-200 定义 metadata schema。** 至少包含 component name、tag、category、stability、dependencies、props/defaults、emits、slots、exposes、form association、host attrs、parts、CSS properties、side effects 和 docs route。
- [ ] **NG-201 从宏声明生成。** 从 defineProps/Emits/Slots/Expose/Options 生成规范化 metadata；禁止手写第二份 props 表或注册列表。
- [ ] **NG-202 生成公共产物。** 由 metadata 生成 HTMLElement types、`elements.generated.d.ts`、API JSON、category exports、registration manifest、ConfigProvider defaults 类型、Style API 表和文档 props rows。
- [ ] **NG-203 漂移门禁。** 生成过程稳定、排序确定；CI 执行后 `git diff --exit-code`，任何源码/类型/文档/exports 漂移直接失败。

退出门禁：同一次 metadata 生成稳定产出 types、API、exports、registration、defaults 和 Style API；干净生成后 `git diff --exit-code` 为 0。

## Batch 06 — P0 单根入口、注册与主题覆盖契约

目标：发布包只有一个 side-effect-free 公共入口，同时支持 Core 按需注册、Kit 全量注册、组件派生和稳定样式覆盖。

- [x] **NG-210 唯一根入口。** `package.json#exports` 只公开 `.`；Basic、Data、Form、Feedback、Layout、Navigation、Picker、Providers、AI 与 Labs 的构造器和类型全部从 `@elfui/kit` 命名导出，禁止 `/labs`、`/utils`、`/components/*` 和 CSS subpath。
- [x] **NG-211 显式注册。** 根入口必须 side-effect-free，不得因 `import { Button } from "@elfui/kit"` 自动注册任何标签；按需注册直接使用 `@elfui/core` 的 `registerComponents()`/`useComponents()`，Kit 不重复包装或重导出框架 API。
- [x] **NG-212 全量注册。** 根入口导出幂等的 `registerAllComponents()`，只有调用时才注册稳定、AI 与 Labs 全集；同标签同构造器重复调用成功，不同构造器保持 Core 冲突诊断。
- [ ] **NG-213 组件派生与命名。** 用户通过 Core `useVariant()`/`useExtend()` 派生新构造器和真实自定义标签；普通外观继续使用组件 `variant` prop，Kit 不建立第二套 aliases/rename registry。
- [x] **NG-214 样式副作用。** 组件结构样式只通过 `defineStyle()` 随组件进入 Shadow DOM，不发布或要求额外 CSS；可选工具类只通过根入口的 `installUtilityStyles(target?)` 显式安装且可释放，不得随 import 自动注入；并以 `var(--component-token, var(--semantic-token, fallback))` 保证无全局样式也有默认外观。
- [ ] **NG-215 主题覆盖契约。** 复用 Core `theme()` 做按 tag 的 CSS Variables/`::part()` 注入，ConfigProvider/ThemeProvider 负责可嵌套上下文；每个组件公开并记录稳定 tokens、parts 和 fallback，禁止依赖私有 `--_*` 变量。
- [ ] **NG-216 公共导出一致性。** 全类别由生成器统一导出和生成注册 manifest；消除“已注册但根类型/构造器缺失”以及 Website 源码深路径 alias。

退出门禁：tarball 只暴露 `@elfui/kit` 根入口；命名导入无注册副作用，Core 按需注册与 Kit 全量注册均幂等，派生、tokens、parts 和 fallback 契约有测试与文档。

## Batch 07 — P0 Tarball 消费、Bundle 预算与 Website 路由按需

目标：用真实发布产物证明单组件消费、全量消费、SSR/CDN 与文档站路由级加载均符合用户契约和体积预算。

- [ ] **NG-220 Tarball matrix。** 对 `pnpm pack` 产物建立 Vite、Rollup、TypeScript NodeNext、纯浏览器 ESM 四类 fixture，禁止直接 alias 到 `packages/kit/src`。
- [x] **NG-221 Tree-shaking 断言。** 从根入口只导入 Button/Input 的消费产物不得包含 Table、Picker、AI、Labs 或注册任何未请求标签；调用 `registerAllComponents()` 时才允许进入全量组件和样式。
- [ ] **NG-222 Bundle budgets。** 固定 external/core 口径，记录 full、单组件、典型表单、典型后台页；任一五次中位数 gzip 增长超过 10% 必须阻断并调查。
- [ ] **NG-223 Package verifier。** 校验 exports 可解析、声明路径存在、sideEffects 正确、无源码别名/本地绝对路径、CDN 可用、重复注册有明确诊断。
- [ ] **NG-224 Website 路由级注册。** 文档站不得在首屏同步调用全量注册；由路由 metadata 声明组件依赖并在页面 chunk 内注册，AI/Labs/稳定组件均可直达显示，首屏主 chunk gzip 建立预算且不得因新增组件线性增长。

退出门禁：Vite、Rollup、NodeNext、浏览器 ESM、SSR 与 CDN fixture 全绿；单组件消费者 0 个无关注册；Website 无源码 alias/subpath，首屏与典型消费包五次中位数未超过预算。

## Batch 08 — P1 Overlay、Collection、Virtual 与 Async 协议

目标：在重构大型组件前建立四项无 UI 的共享协议与唯一 owner，防止领域组件继续复制底层状态和算法。

- [ ] **NG-300 Overlay 最终协议。** 统一 z-index、appendTo/teleport container、fixed/non-body、嵌套缩放、Visual Viewport/iOS keyboard、nested close cascade、focus return、inert 和 Top Layer；Dialog、Drawer、Menu、Dropdown、Tooltip、PopConfirm、Picker 共用 owner。
- [ ] **NG-301 Collection 协议。** 定义 key、field mapping、selection、expansion、disabled、roving focus 和 typeahead 的无 UI 纯模型；Tree/Select/Menu/Tabs 只复用契约一致部分。
- [ ] **NG-302 Virtual Window 协议。** 统一 fixed/variable size、resize、prepend/append、scrollTo、overscan、anchor preservation 和 bounded DOM；Table、TableV2、Tree、Select、VirtualList 使用同一算法层。
- [ ] **NG-303 Async Task 协议。** 建立 request id、AbortSignal、state transition、retry、progress、resource disposal 的最小无 UI 协议；Upload、remote Select、Cascader lazy 通过领域 adapter 使用。

退出门禁：四项协议均为无 UI 纯 contract/model/controller，具有唯一 owner、focused tests 和明确消费者，且不反向依赖公开组件。

## Batch 09 — P1 Field、指令、动效、服务作用域与分层

目标：收敛组件表面、生命周期工具和 imperative service 的作用域，锁定公共组件的依赖方向。

- [ ] **NG-304 Field surface。** 统一 label、outline/fill、prefix/suffix、clear、density、disabled/readonly/error、focus ring、form reflection；不建立共享 DOM 巨型组件。
- [ ] **NG-305 Directives。** 统一 Draggable、Loading、Infinite Scroll、Click Outside、Observer、Ripple、Tooltip、Touch、Scroll 的 owner、导出、类型和文档，禁止组件手写同义底层监听。
- [ ] **NG-306 Transition/TransitionGroup。** 结构性 enter/leave、快速切换、reduced motion、leave cleanup 和 keyed movement 使用框架能力；Popover Top Layer 时序先最小复现，不写 timeout workaround。
- [ ] **NG-307 服务作用域。** Message/Notification/Loading/MessageBox 等 imperative service 获取创建点的 Config/Theme/Locale/Defaults 上下文；多应用互不污染，资源随 app 销毁。
- [ ] **NG-308 分层门禁。** public component 只能依赖 contract/model/controller/adapter；Common 不得导入具体公开组件，Provider policy 不持有 DOM/XHR/timer。

退出门禁：共享 Field/Directive/Transition 能力无同义副本；服务组件继承创建点上下文并随应用释放；分层门禁阻止 Common/Provider 反向持有公开组件或平台资源。

## Batch 10 — P1 全组件公开契约矩阵

目标：完成 Element Plus 组件级公开契约映射，优先闭合真实迁移所需 API，并明确 Compiler scoped-slot 边界。

- [ ] **NG-400 覆盖全部上游组件。** Element Plus 2.14.4 总览中的每个组件都有映射；Affix/Sticky、Popover/Tooltip、SelectV2/virtual Select、TreeV2/virtual Tree、panel 类组件等必须明确 equivalent/combined/implement/non-goal。
- [ ] **NG-401 契约字段。** 每个稳定组件比较 props/defaults、events detail、slots、exposes、controlled priority、empty/valueOnClear、form、keyboard、ARIA、loading/empty/error 和 breaking differences。
- [ ] **NG-402 高频 API 优先。** 先闭合用户迁移会直接遇到的命名、默认值、事件 payload 和暴露方法；低价值外观别名不得污染核心模型。
- [ ] **NG-403 Scoped slot 边界。** Transfer、Tree、Segmented、Calendar 建立当前 Compiler 最小复现；支持则交付可运行 slot，不支持则保持未公开并链接框架 issue。

退出门禁：Element Plus capability matrix 无 `unknown`；每个 `implement` 有源码和测试，每个 `non-goal` 有 Web Component/产品理由；高频 breaking difference 与框架阻塞均有证据。

## Batch 11 — P1 Upload 领域重构

目标：以单一 Task State Machine 和可取消 Request Adapter 管理 Upload 状态、并发与资源。

- [ ] **NG-410 Task State Machine。** 明确 validating/ready/uploading/success/error/aborted/retrying 状态和合法转换；状态只由 task owner 写入。
- [ ] **NG-411 Request Adapter。** XHR/custom/chunk 共用 AbortSignal、headers/data、progress、response/error normalization；同步 callback、Promise、abort handle 均只完成一次。
- [ ] **NG-412 资源与并发。** 覆盖并发上限、retry、remove/clear/unmount、object URL、目录、分片、错误恢复和受控 fileList；列表动画不得延迟取消或释放。

退出门禁：每个上传任务只完成一次；abort/remove/clear/unmount 后无写回和资源残留；受控 fileList、retry、目录、分片和并发测试全绿。

## Batch 12 — P1 Tree、Cascader、Select 与 TreeSelect

目标：以内部 Store、索引和共享 Collection 协议消除输入修改、重复扫描和选择模型复制，并通过 10k 数据验收。

- [ ] **NG-420 Tree Store。** 分离 collection、展开、级联选择、lazy transaction、virtual flatten、filter 和 drag transaction；所有公开命令作用于 store。
- [ ] **NG-421 Cascader Index。** 建立 value/path/parent/leaf 索引和一次性 display projection，消除模板中重复全树扫描；lazy、搜索、多选传播和 columns/tree view 分层。
- [ ] **NG-422 Select Collection。** 统一本地/remote/virtual、label cache、options 变化、multiple selection、end-reached 和 overlay adapter；Autocomplete/TreeSelect 组合公开协议，不复制选择模型。
- [ ] **NG-423 10k 数据验收。** Tree/Cascader/Select 的 DOM 保持有界，键盘、筛选、展开、选择、异步替换和返回焦点均通过。

退出门禁：Tree/Cascader/Select/TreeSelect 不修改用户输入、不复制等价选择模型；10k 场景 DOM 有界，键盘、异步替换、筛选、选择与焦点返回全绿。

## Batch 13 — P1 Table、TableV2 与 VirtualList

目标：拆分无环领域模型，统一选择与虚拟协议，治理滚动热路径并补齐公开契约。

- [ ] **NG-430 单一选择状态。** 删除手工 DOM optimistic selection 与 rAF/setTimeout 双状态；用 transaction/model 保证一次提交和可测渲染。
- [ ] **NG-431 模型拆分。** column、row、sort/filter、selection、tree projection、fixed regions、summary、overlay 和 virtual window 独立且无环。
- [ ] **NG-432 热路径治理。** 使用 event delegation 或可回收 row/cell pool；滚动热路径不创建全量 Map、成百上千闭包或不受控 observer。
- [ ] **NG-433 契约补齐。** 核对 column-sort、expanded-rows-change、end-reached、rows-rendered、row-expand、half-selection、ARIA sort/selection 和移动端表头语义。
- [ ] **NG-434 能力边界。** Table 与 TableV2 共享纯模型/虚拟协议，不通过复制代码保持两个版本；动态高度、fixed data、footer/overlay slots 有明确支持矩阵。

退出门禁：Table/TableV2 主文件只组合模型和视图；选择只有一个状态源；滚动热路径资源有界；两种表格的共享与差异能力均有契约和性能证据。

## Batch 14 — P1 Picker、Tabs、Menu 与 Dropdown

目标：让 Picker 系列、Tabs、Menu 与 Dropdown 复用 Date、Collection、Overlay 和 Transition 协议，只保留各自领域语义。

- [ ] **NG-440 Picker 分层。** DatePicker/TimePicker 分离 parse/format、date/time model、range state、panel projection 和 overlay；Calendar/DateTimePicker/TimeSelect 共用 DateAdapter。
- [ ] **NG-441 Picker 结构动效。** 正确协调 Transition 与 native Popover；rapid toggle、leave、focus restore、reduced motion、disabled dates 和 SSR 全覆盖。
- [ ] **NG-442 Tabs。** 分离 collection、controlled active value、roving tabindex、overflow、drag transaction 和 panel lifecycle；不建立手写 KeepAlive。
- [ ] **NG-443 Menu/Dropdown。** 缩小 DOM 协调层，保留各自 role、nested close、typeahead、roving focus 和 command payload，复用 Overlay/Collection。

退出门禁：Picker/Tabs/Menu/Dropdown 无重复 Date/Collection/Overlay 实现；rapid toggle、受控状态、键盘、嵌套关闭、焦点恢复、reduced motion 与 SSR 测试全绿。

## Batch 15 — P1 Application Layout、Display 与 Platform

目标：建立 Provider-scoped 应用布局和响应式平台快照，确保 SSR 到客户端接管稳定。

- [ ] **NG-500 Application Layout。** 建立 Provider-scoped layout registry；AppBar、BottomNavigation、Header/Footer/Aside 等注册 edge、order、size、active、overlap，Main 消费稳定 inset CSS vars；支持动态挂卸、多个 layout scope 和 SSR 初始值。
- [ ] **NG-501 Display。** 统一 breakpoint、name、mobile、width/height、platform flags 和响应式订阅；只在安全 lifecycle 访问 matchMedia/window。
- [ ] **NG-502 Platform/SSR/Hydration。** ConfigProvider 接受服务端 platform/display 初始快照；客户端接管不闪跳、不 hydration mismatch；无 DOM 环境可导入和渲染。

退出门禁：多个 layout scope 动态挂卸互不污染；Display/Platform 无 DOM 可导入；SSR 初始快照到 hydration 无布局闪跳和 warning。

## Batch 16 — P1 Defaults、Theme、Presets 与 Aliases

目标：完成应用级默认值、主题、品牌预设和 typed aliases 的合并优先级与作用域隔离。

- [ ] **NG-503 Defaults。** app/category/component/instance defaults 的合并、优先级、reset 和 Teleport 继承可预测；service-created components 消费相同 defaults。
- [ ] **NG-504 Theme。** 主题 registry、light/dark、局部 scope、color-scheme、动态切换、服务组件、SSR CSS 和品牌扩展边界统一。
- [ ] **NG-505 Presets/Blueprints。** Material 与 Midnight 成为类型安全 preset；允许品牌 preset 组合 tokens/defaults/icons/density，不复制组件实现。
- [ ] **NG-506 Aliases。** 基于 metadata/resolver 的 application-scoped typed aliases；定义 defaults/props merge 和冲突优先级，不做字符串 tag 替换。

退出门禁：defaults/theme/presets/aliases 的优先级、reset、Teleport 和 service 继承可预测；两个应用同页运行相互隔离，SSR 样式与客户端主题一致。

## Batch 17 — P1 Locale、Icons、Date、GoTo、Overlay 与 Config

目标：以 Strategy 和 Facade 聚合跨组件服务，同时保持每项资源的唯一 owner 与应用作用域。

- [ ] **NG-507 Locale/i18n adapter。** 稳定 key、fallback、RTL、number/date adapter 和外部 i18n 接口；组件和 imperative services 无 Provider 时仍有一致默认文案。
- [ ] **NG-508 Icons/Date/GoTo。** 明确 Strategy API、应用 scope、SSR 和用户扩展；Tour/DocsToc 等滚动消费者使用统一 GoTo 取消和焦点协议。
- [ ] **NG-509 Overlay service。** overlay stack、z-index、contained/global、scroll strategy、location strategy 和 activator ownership 形成公开稳定边界。
- [ ] **NG-510 ConfigProvider Facade。** 聚合 namespace/tagPrefix、size/density、zIndex、emptyValues/valueOnClear、table/button/link/dialog/message 等 typed config；具体资源仍由各 owner 管理。

退出门禁：Vuetify 对标能力均有唯一 owner 或 non-goal；Locale/Icons/Date/GoTo 可替换且 SSR 安全；Overlay/Config 只聚合策略，不复制资源实现，多应用服务相互隔离。

## Batch 18 — P1 Tokens、Parts 与 Host State

目标：建立稳定的三层 token、组件变量、parts 和 host state，让用户无需穿透 Shadow DOM 即可定制组件。

- [ ] **NG-600 Token 分层。** 建立 primitive → semantic → component token 三层；组件不得直接硬编码跨主题颜色、elevation、shape、density 和 motion。
- [ ] **NG-601 命名与稳定性。** 公共组件变量统一 `--elf-<component>-*`，内部变量使用 `--_`；定义 deprecated/rename 流程和默认 fallback。
- [ ] **NG-602 Parts 基线。** 所有交互复杂组件至少审计 root/trigger/content或panel/item/empty/loading/header/footer；没有 part 必须说明无需内部定制的理由。
- [ ] **NG-603 优先补齐复杂组件。** Dialog、Drawer、Tour、DatePicker、TimePicker、Tabs、Menu、Tree、Transfer、Carousel、Progress 等补稳定 parts 和组件级变量。
- [ ] **NG-604 Host state。** disabled、readonly、loading、open、selected、invalid、density、variant 等通过 host attr/flag/CSS var 暴露，用户无需穿透内部选择器。

退出门禁：稳定组件具有命名一致且带 fallback 的 token/变量；复杂组件关键区域可由稳定 parts 定制；交互状态通过 host surface 暴露而不依赖私有选择器。

## Batch 19 — P1 Style 文档、覆盖验证、视觉系统与 Utilities

目标：让 Style API 可生成、可测试、可视觉审计，并保证显式 utilities 安装不会跨作用域泄漏。

- [ ] **NG-605 自动 Style API 文档。** metadata 生成每个组件的 CSS Properties、Parts、host states、token 默认值和示例；FAQ 不再是唯一说明。
- [ ] **NG-606 局部覆盖测试。** 验证单实例变量、ThemeProvider 子树、part、service overlay、Teleport 和 nested Shadow DOM；全局主题不得意外污染局部 scope。
- [ ] **NG-607 Material 视觉系统。** 统一 typography、4/8px spacing、shape、density、state layer、elevation、motion 和 reduced motion；有意变化保存前后截图和设计理由。
- [ ] **NG-608 Utilities。** 工具类只通过根入口 `installUtilityStyles(target?)` 显式安装到指定 Document/ShadowRoot；打印、断点、RTL、暗色和释放行为有测试，不得自动注入或泄漏到非目标作用域。

退出门禁：Style API 文档覆盖稳定组件 100%；主题、局部覆盖、Teleport/service overlay 与 nested Shadow DOM 浏览器测试全绿；utilities 只影响目标作用域并可完整释放。

## Batch 20 — P2 性能、DOM 与资源预算

目标：以固定环境、五次中位数和挂卸归零探针，把关键组件性能与资源生命周期变成可阻断的门禁。

- [ ] **NG-700 关键基准。** Table/TableV2、Tree/TreeSelect、Select、Cascader、VirtualList、Overlay 以 10k 数据和固定环境五次中位数建立基线。
- [ ] **NG-701 有界 DOM。** 虚拟组件 DOM 数量与 viewport + overscan 成正比，不随总数据量增长；动态高度和 prepend/append 保持锚点。
- [ ] **NG-702 交互预算。** 记录首次渲染、滚动、选择、展开、筛选、overlay open/position 和键盘移动；Long Task、frame、layout 和 GC 退化超过 10% 阻断。
- [ ] **NG-703 资源释放。** 挂卸循环后 listener、observer、timer、rAF、AbortController、object URL 和 overlay entry 回到基线；无陈旧 callback。

退出门禁：关键 10k 场景具有可复现五次中位数基线，DOM 与资源有界；相对基线退化超过 10% 会阻断，挂卸后资源回到起始值。

## Batch 21 — P2 无障碍、键盘与输入环境

目标：让全部稳定交互组件在 Shadow DOM、键盘、缩放、RTL、触摸和 IME 环境下可访问且可操作。

- [ ] **NG-710 自动无障碍。** axe-core serious/critical 为 0；ARIA name/role/value、aria-sort、mixed selection、live region 和 dialog semantics 正确。
- [ ] **NG-711 键盘与焦点。** 所有交互组件只用键盘完成主流程；Shadow DOM composed path、focus trap/return、roving tabindex、Escape 和 nested overlay 有浏览器测试。
- [ ] **NG-712 环境矩阵。** LTR/RTL、reduced-motion、200% zoom、触摸、鼠标、IME、320/390/768/1440 宽度均无不可达控件、遮挡或溢出。

退出门禁：axe serious/critical 为 0；所有稳定交互组件主流程可仅用键盘完成；规定方向、动效、缩放、输入方式和宽度矩阵无不可达或遮挡。

## Batch 22 — P2 浏览器、SSR、CSP 与截图证据

目标：用三浏览器、移动模拟、SSR/Hydration、严格 CSP 和最终视觉证据证明真实应用可发布。

- [ ] **NG-720 浏览器矩阵。** Chromium、Firefox、WebKit 的桌面关键流全绿；移动模拟覆盖 Visual Viewport、软键盘和触摸。
- [ ] **NG-721 SSR fixtures。** 无 window/document 导入、server render、hydrate、Provider/Teleport、form association fallback 和 client takeover 全覆盖。
- [ ] **NG-722 CSP。** 严格 CSP 下不依赖 eval/new Function/运行时模板编译；样式注入策略和 nonce 有文档及 fixture。
- [ ] **NG-723 截图证据。** Material/Midnight、中文/英文、桌面/移动端、RTL/reduced-motion 的关键页面保存最终截图，控制台 0 未解释 warning/error。

退出门禁：Chromium/Firefox/WebKit 关键流、SSR/Hydration 和严格 CSP fixtures 全绿；最终截图矩阵完整且控制台 0 未解释 warning/error；门禁进入 `release:check` 或受保护 nightly。

## Batch 23 — P2 安装、组件与自动 API 文档

目标：让外部用户只读公开文档即可正确安装、按需注册、全量注册、定制组件并复制运行示例。

- [ ] **NG-800 安装文档。** 根入口命名导入、Core 按需注册、`registerAllComponents()`、Core `theme()`/`useVariant()`、CDN 与 SSR 示例全部使用真实 tarball 验证；不得展示已删除 subpath 或额外样式入口。
- [ ] **NG-801 组件文档。** 每个稳定组件至少有 basic、controlled、disabled/readonly、empty/loading/error、clear/reset、keyboard/a11y、style override 和边界案例；Template/Script 可复制运行。
- [ ] **NG-802 自动 API。** props/events/slots/exposes/form/parts/CSS properties/host states 由 metadata 生成，公开 TypeScript 与页面表格不可漂移。

退出门禁：安装、三种注册方式、主题和样式覆盖、CDN/SSR 示例均由真实 tarball 验证；稳定组件示例可复制运行；API 页面与 TypeScript/metadata 无漂移。

## Batch 24 — P2 质量文档、迁移、Starter 与 1.0 发布

目标：交付双语质量说明、可执行迁移路径、真实 starter、版本政策以及可审计和可回滚的 1.0 发布流程。

- [ ] **NG-803 Quality 章节。** 完成 Testing、Performance、SSR & Hydration、Compatibility & Release、CSP、Accessibility、Theming 和 On-demand Import 双语文档。
- [ ] **NG-804 迁移指南。** 记录 beta.2 → next 的 root entry、form、immutable data、Tree commands、Upload state、CSS variables/parts 和 aliases 变化，提供 codemod 或明确替换表。
- [ ] **NG-805 真实 starter。** 提供 Vite CSR、SSR、按需后台页和 CDN 最小项目；CI 从空缓存安装发布 tarball。
- [ ] **NG-806 版本策略。** 定义 semver、deprecation 周期、Labs 稳定化、浏览器支持、Core/Compiler/Vite Plugin 兼容矩阵和安全响应。
- [ ] **NG-807 发布审计。** tarball 仅含允许文件；无 workspace alias/绝对路径；npm provenance、Git tag、GitHub Release、网站生产部署和回滚路径验证。
- [ ] **NG-808 1.0 决策。** 所有 P0/P1/P2 批次关闭后才允许 1.0；未完成能力只能明确移至 Labs 或写 non-goal，不能以“后续优化”隐藏。

退出门禁：从空缓存运行全部 starter 和 release checklist 全绿；迁移、兼容、弃用、安全、provenance、tag、Release、网站部署和回滚证据完整；P0/P1/P2 全部关闭才允许 1.0。

## Batch 25 — P3 Labs 与可选扩展

目标：在不阻塞稳定核心、不污染根入口的前提下完善 Video、Heatmap、AI 与可选外观能力。

- [ ] **NG-900 Video contract。** 受控/非受控播放、loading/error/retry、字幕、键盘和媒体状态同步；HLS/DASH 只定义可取消 adapter，不内置引擎。
- [ ] **NG-901 Heatmap。** 非地理矩阵热图复用 Tooltip/virtual 能力，提供屏幕阅读器摘要、键盘详情、空值、降采样和性能预算。
- [ ] **NG-902 AI/Labs 边界。** AIChat、CodeCard、MdPage 等只依赖公开稳定协议；重依赖独立 chunk/subpath，明确实验 API 和升级策略。
- [ ] **NG-903 可选 P2 外观能力。** Dialog/Drawer/Tour 动态挂载与过渡 adapter、Tooltip virtual activator、Parallax 业务案例等仅在真实需求和契约稳定后实现。

退出门禁：Labs 只依赖公开稳定协议，实验 API 和升级路径明确；重依赖按页面独立加载且不进入单组件或稳定首屏产物。

## 7. 全局完成定义

只有同时满足以下条件，下一代计划才可关闭：

- [ ] Element Plus 2.14.4 组件矩阵和 Vuetify 4.1.8 系统矩阵 0 个 `unknown`、0 个无证据“已支持”。
- [x] 原生 FormData/reset/validation/fieldset/restore 契约覆盖全部适用控件。
- [ ] 非测试源码 0 个外部 props/data/options/fileList 原地修改。
- [ ] 全依赖图 0 个 type/runtime cycle，低层 0 个组件层反向依赖。
- [ ] 根入口命名导入、按需注册、`registerAllComponents()`、CDN 和 SSR consumer 全部基于 tarball 通过。
- [ ] 单组件 bundle 0 个无关组件注册；Labs/重依赖不进入稳定入口。
- [ ] 稳定组件 metadata、types、docs、exports、parts/CSS properties 100% 同源。
- [ ] 关键 10k 数据性能、DOM 上限、资源释放和三浏览器矩阵达到预算。
- [ ] axe serious/critical 为 0；键盘、RTL、reduced-motion、200% zoom 和移动端关键流通过。
- [ ] `pnpm release:check` 从干净 checkout 通过，且 prepublish/release workflow 无旁路。
- [ ] 迁移指南、版本策略、发布与回滚证据完整。

## 8. 当前下一步

推进 **Batch 03 的 NG-110～NG-113**：以冻结输入契约先锁定 Tree、Cascader 与 Upload 的外部数据不可变，再把 lazy、fileList 和受控同步迁入组件自有 store。
