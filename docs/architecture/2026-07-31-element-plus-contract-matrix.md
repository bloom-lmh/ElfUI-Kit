# Element Plus Public Contract Matrix

> The **[machine-readable JSON](./element-plus-2.14.4-contract-matrix.json)** is the single source of truth.
> This Markdown is a human-readable summary. Owner paths, test paths, docs paths,
> and full difference descriptions are in the JSON matrix.

- Authority: `element-plus@2.14.4` · Kit: `@elfui/kit@0.0.2-beta.2`
- Scope: High-risk component families with shared Form boundary, tracking contract status per NEXT_GENERATION_PLAN.md Batch 4 (NG-400–NG-443).

## Status Distribution

| Status       | Count | Entries                                                                                     |
| ------------ | ----- | ------------------------------------------------------------------------------------------- |
| `equivalent` | 9     | Form, DatePicker, TimePicker, Tabs, Upload, Table, Tree, Menu, Select                       |
| `implement`  | 2     | **Cascader** (change payload gap, NG-421), **Scoped Slots** (compiler contract gap, NG-403) |
| `combined`   | 0     | —                                                                                           |
| `non-goal`   | 0     | —                                                                                           |

## Gap Summary

- **Cascader** (`element-plus.cascader`): emits `CascaderChangeDetail` instead of Element Plus `change(value)`. Form/field, overlay, virtual window, and ARIA owners are present but still mixed in the component layer. Planned: NG-421.
- **Scoped Slots** (`element-plus.scoped-slots`): Transfer and Tree have typed renderer callbacks; Segmented and Calendar require compiler contract proof before slot bindings are delivered. Planned: NG-403.

## Cross-Cutting Decisions

- Vue `v-model` → `modelValue` + `update:modelValue`; controlled inputs always win over defaults.
- Form inheritance uses `useDisabled()`, `useSize()`, `useFormControl()`, and FormItem context.
- Public payload differences are `implement`, not swept under equivalent.
- This matrix does not close the listed NG-* tasks; components still own pure models, cleanup, performance, and browser evidence.
