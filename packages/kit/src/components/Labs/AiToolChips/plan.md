# AiToolChips plan

Compact tool-call and code-edit chips with expandable details, ported from the Beautiful UI "Tool Chips" primitive.

## Contract

- Props: `summary`, `items` (`AiToolChipItem[]` with `kind` / `status` / `detail` / `meta`), `files` (`AiToolChipFile[]`), `collapsible`, `defaultExpanded`, `labels`, `ariaLabel`.
- Events: `toggle` (`boolean`), `item-click` (`AiToolChipItem`).
- Expose: `expand()`, `collapse()`, `toggle()`, `isExpanded()`.
- Slots: `footer`.
- Host: `data-expanded` flag, `aria-label`.

## Behavior

- The summary pill shows a stacked icon, free-form summary text, and a chevron; expanding reveals item rows and file-change chips.
- Item rows map `kind` to icons (`tool` / `edit` / `think` / `shell` / `image`) and `status` to spinner / check / error states; clicking emits the full item.
- Extra fields on `AiToolChipItem` are preserved for parent-driven rendering; the footer slot accepts any trailing content.
