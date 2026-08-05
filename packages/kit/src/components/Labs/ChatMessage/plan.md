# ChatMessage plan

Render a single AI chat bubble with role semantics, streaming state, copy action, and content slots.

## Contract

- Props: `role`, `shape`, `content`, `name`, `time`, `status`, `error`, `copyable`, `avatar`, `labels`, `ariaLabel`.
- Events: `copy` (`{ content }`), `copy-error` (unknown).
- Slots: default (content), `actions`, `footer`.
- Expose: `copy()`.
- Host: `data-role`, `data-status`, `streaming`/`error` flags, `aria-label`.

## Accessibility

- `role="listitem"` for list contexts; host carries an accessible label.
- Copy button has an `aria-label` that reflects copied state.
- Error state renders `role="alert"`.

## Notes

- Content is plain text (`pre-wrap`); rich content goes through the default slot.
- Clipboard uses `navigator.clipboard` with an `execCommand` fallback.

## Regression notes

- 2026-08-04: Added the `shape` prop (`rounded | sharp | glass | terminal | outline`) reflected as `data-shape`, with a five-style bubble demo on the page.
