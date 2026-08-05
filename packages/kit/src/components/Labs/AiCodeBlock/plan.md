# AiCodeBlock plan

Agent-written code that streams in line by line, ported from the Beautiful UI "Code Block" primitive.

## Contract

- Props: `code`, `filename`, `language`, `status` (`idle` | `streaming` | `complete` | `error`), `streamSpeed`, `showLineNumbers`, `copyable`, `labels`, `ariaLabel`.
- Events: `complete`, `copy` (`{ filename, language, code }`), `copy-error`.
- Expose: `copy()`, `revealAll()`, `reset()`.
- Host: `data-status` and `data-streaming` attributes, `aria-label`.

## Behavior

- While `status` is `streaming`, lines are revealed one by one with a blinking caret on the active line; `complete` fires once all lines are visible.
- `idle`, `complete`, and `error` render the full source; `revealAll()` and `reset()` control the reveal manually.
- Copy uses the clipboard API with a textarea fallback and flashes a success state.

## Regression notes

- 2026-08-04: Code panel now detects an ancestor `data-theme="dark"` so dark demo surfaces render dark instead of white; pre padding increased to 14px/16px. Theme family mapping in `CodeCard/model.ts` was corrected so dark surfaces resolve to dark Shiki themes.
