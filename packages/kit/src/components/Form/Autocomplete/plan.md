# Autocomplete Element Plus parity plan

## 2026-07-19 overlay alignment

- [x] Remove the default panel gap and join the popup to the field surface
- [x] Give the top-layer option panel explicit theme-token text colors so dark mode cannot inherit light-page text
- [x] Remove the redundant standalone appearance gallery and keep field variants in the shared interactive field contract

## Baseline

- [x] Core props: `model-value`, `options`, `fetch-suggestions`, `placeholder`, `disabled`, `clearable`, and `trigger-on-focus`.
- [x] Core events: `update:modelValue`, `input`, `change`, `select`, `focus`, `blur`, and `clear`.
- [x] Form validation linkage and focused component tests.

## Delivered in this batch

- [x] Add debounced asynchronous suggestions with last-request-wins protection and a loading state.
- [x] Add `placement`, `highlight-first-item`, accessible combobox/listbox semantics, arrow-key navigation, Escape, Enter selection, and `focus` / `blur` exposes.
- [x] Add default suggestion and `loading` slots, API reference, and a keyboard/top-placement playground example.

## Remaining gap

- [x] Support a correctly-positioned `teleported` panel with `append-to`, popper customization, collision handling, external-scroll closing, visual viewport support, and optional input-width fitting.
- [x] Share the `filled / outlined` field surface, floating label, dark/error/disabled states, and preserve scrolling inside the suggestion panel.

## 2026-07-22 shared field regression

- [x] Default to the filled surface and share the field label, background, outline, disabled and placeholder contract.
- [x] Keep the suggestion panel outside the field clipping boundary and add a first-position integrated controls example.
- [x] Keep the selected-value field height stable and pin the clear action to the trailing edge without letting it participate in field layout.

## 2026-07-22 outline and overlay follow-up

- [x] Centre the outlined floating label in the native legend gap shared by all field surfaces.
- [x] Remove the demo-only overlay offset, keep the teleported panel attached to the field, and explain viewport positioning.
- [x] Add debounced loading, explicit empty and rejected-request states with slots, `fetch-error`, recovery behavior, tests, and a complete remote-state demo.

## 2026-07-22 create and virtualized suggestions

- [x] Add `allowCreate` / `createText` and a typed `create` event while preserving the existing `select` contract.
- [x] Add fixed-height virtualization with `itemHeight`, `maxHeight`, `overscan`, bounded DOM rendering and active-option scroll alignment.
- [x] Consume handled Arrow / Enter / Escape events so document-level navigation cannot hijack combobox input.
- [x] Add a 500-item creation/virtualization demo, component/page tests and real-browser screenshot verification.

## 2026-07-28 overlay coordination

- [x] Join the shared overlay interaction stack without coupling suggestion loading, form state or anchored positioning to the stack.
- [x] Centralize panel open/close transitions so blur, selection, Escape, external motion and programmatic close unregister consistently.
- [x] Keep focus on the combobox input during Escape; avoid refocusing it and reopening `trigger-on-focus` suggestions.
- [x] Cover stacked suggestion panels so one Escape event closes only the topmost panel.

## 2026-07-28 聚焦触发回归

- [x] 用组件实例级焦点状态去重 `focus` / `focusin`，避免代理事件重复派发公共 focus 事件。
- [x] 在真实 pointerdown 时同步打开 `trigger-on-focus` 建议，兼容非冒泡焦点事件被宿主代理遗漏的场景。
