# AiThinking plan

Expandable AI thinking trace, ported from the Beautiful UI "Thinking" primitive.

## Contract

- Props: `title`, `steps` (`AiThinkingStep[]`), `status` (`running` | `done`), `collapsible`, `defaultExpanded`, `showHeader`, `labels`, `ariaLabel`.
- Events: `toggle` (`boolean`).
- Expose: `expand()`, `collapse()`, `toggle()`, `isExpanded()`.
- Host: `data-status` and `data-expanded` attributes, `aria-label`.

## Behavior

- A summary row shows a pulsing status dot, title, and running/done chip; the trace expands below it.
- Steps are grouped by `kind` (`steps` / `reasoning` / `search` / `coding`) and can be filtered by kind tabs with counts.
- While running, the latest visible step breathes with the primary color; done traces render in success state.
