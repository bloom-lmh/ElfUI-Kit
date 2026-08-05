# AiTaskRow plan

Live agent task status row, ported from the Beautiful UI "Task Rows" primitive.

## Contract

- Props: `task` (`AiTaskItem`), `variant` (`list` | `capsule`), `collapsible`, `defaultExpanded`, `showRetry`, `labels`, `ariaLabel`.
- Events: `toggle` (`boolean`), `retry`, `select`.
- Expose: `expand()`, `collapse()`, `toggle()`, `isExpanded()`.
- Host: `data-status`, `data-variant`, `data-expanded` attributes, `aria-label`.

## Behavior

- The summary shows a status icon (spinner / check / cross), title, subtitle, and status chip.
- Expanded tasks render sub-steps; the last step runs while the task runs, failed tasks show a retry action.
- The `capsule` variant compacts the summary into a pill.
