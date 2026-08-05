# ChatToolCall plan

Render a tool-call activity card for AI agent transcripts.

## Contract

- Props: `name`, `status` (`pending | running | success | error`), `duration`, `arguments`, `result`, `error`, `collapsible`, `defaultExpanded`, `labels`, `ariaLabel`.
- Events: `toggle` (`boolean`), `retry`.
- Expose: `expand()`, `collapse()`, `toggle()`, `isExpanded()`.
- Host: `data-status`, `data-expanded`, `aria-label`.

## Behavior

- Status maps to icon, badge, and progress styling.
- `collapsible=false` keeps details always visible.
- Error state shows a retry action.
