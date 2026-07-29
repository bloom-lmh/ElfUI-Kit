# Notification alignment plan

## 2026-07-29 detached service locale

- [x] Document-level Notification hosts use the default locale context backed by `document.documentElement.lang`, without duplicating locale state in the service singleton.
- [x] Keep the detached close-button label covered by an English regression test.

## Completed

- [x] Typed service API, four positions, timed/manual close, stacking and `closeAll`.
- [x] `appendTo` selector/element resolution with a safe body fallback.
- [x] `customClass`, `zIndex`, `offset`, `showClose`, `closeIcon`, custom icon glyph, `onClick`, and once-only `onClose` support.
- [x] Per-position stack reflow honors the first notification's configured offset.
- [x] Accessible status announcement and a labeled keyboard-focusable close button.
- [x] Documentation example and target tests for service options and lifecycle behavior.

## Follow-up

- [x] P1 Add a safe rich-content renderer only after defining a trusted-content policy; the API accepts trusted DOM nodes/factories while HTML strings remain plain text.
- [x] P2 Add browser visual regression coverage for all four corners and large close labels.

## 2026-07-15 acceptance

- [x] Added trusted DOM content and injection-regression tests, fixed non-functional position demo bindings, and added a safe-rich-content example.
- [x] Passed 10 focused tests and the production build; real-browser verification rendered all four corners, an adaptive `关闭` label, and an interactive DOM action with no console errors.
