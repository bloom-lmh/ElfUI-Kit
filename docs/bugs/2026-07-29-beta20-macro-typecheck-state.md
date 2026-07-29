# beta.20 宏类型检查存在进程级状态污染

## 结论

`@elfui/compiler@0.1.0-beta.20` 在同一进程中顺序检查大量宏组件时，组件元数据或模板类型检查状态可能泄漏到后续组件。当前 DateTimePicker 单文件检查无诊断，但在全量检查中会出现位置不稳定的模板类型错误。

## 复现现象

1. 单独调用 `compileMacroComponent()` 检查 `src/components/Picker/DateTimePicker/index.ts`，返回 `diagnostics: []`。
2. 执行 `pnpm typecheck`，在此前已检查一百余个组件后，DateTimePicker 模板出现 3 条诊断。
3. 仅调整无语义影响的局部 helper 后，诊断会在 `editable`、`popperOptions`、`popperStyle`、`clearable` 等不同属性间漂移。
4. TypeScript 诊断为 0，组件单元测试、文档测试、生产构建和真实浏览器交互均通过。
5. 安装包与本地同版本编译器均可复现全量顺序检查问题。

## 期望行为

同一个源文件的宏编译结果不应受此前编译组件、组件注册元数据或调用顺序影响；独立检查与批量检查应返回相同诊断。

## 建议排查

- 清理每次 `compileMacroComponent()` 调用之间的组件元数据、模板表达式类型和作用域缓存。
- 为“先检查 DatePicker，再检查 DateTimePicker”增加同进程回归测试。
- 对缓存键加入文件路径、组件注册表版本与 TypeScript Program 标识，避免跨组件复用旧节点或旧类型。

组件侧没有加入规避性写法，以免掩盖框架问题并降低公开 API 的可读性。
