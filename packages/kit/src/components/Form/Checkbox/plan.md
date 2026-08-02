# Checkbox alignment plan

## Completed

- [x] Boolean, array, and group selection with minimum/maximum constraints and inherited disabled state.
- [x] `true-value` / `false-value`, state fallback labels, border appearance, IDs, tab order, and ARIA control metadata.
- [x] Indeterminate state, keyboard toggling, change events, and accessible disabled tab behavior.
- [x] Examples, API documentation, and unit coverage for boolean mapping and accessibility.
- [x] Keep the non-boolean mapping example controlled so `true-value` changes both the emitted value and visible checked state.
- [x] Emit explicit `true` / `false` / `mixed` ARIA states and cover mouse plus keyboard state mapping.

## Follow-up

- [x] P1 Add button-style Checkbox through the shared CheckboxGroup `variant/fill/text-color` contract and existing size tokens.
- [x] P2 Verify bordered, indeterminate and disabled states in a real browser; focused screenshots are stored under ignored `output/playwright/` artifacts.
