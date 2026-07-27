# Mention Element Plus parity plan

## Baseline

- [x] Core props, events, form registration, and standalone playground.

## 2026-07-19 shared field surface

- [x] Use the same outlined field variants, theme tokens, focus ring, disabled state, and responsive width as Input.
- [x] Keep the suggestion panel below by default and verify filtered mouse/keyboard selection on narrow screens.

## Delivered in this batch

- [x] Add `split`, `filter-option`, `whole`, `check-is-whole`, loading state, placement, default/loading slots, and form validation linkage.
- [x] Add exact-range replacement, keyboard navigation, accessible combobox/listbox semantics, and `focus` / `blur` exposes.
- [x] Add API reference and a whole-word/keyboard playground case.

## Compatibility note

- [x] Provide `prefixes` for multiple trigger strings. Native `Node.prefix` is read-only, so a `prefix` array cannot be safely assigned as a Custom Element property.

## 2026-07-22 shared field regression

- [x] Default to the filled surface and share label, background, outline, disabled and placeholder behavior with Input.
- [x] Keep the suggestion panel outside the textarea clipping boundary and add a first-position integrated controls example.
