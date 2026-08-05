# AiContextCard plan

Retrieved knowledge chunk with its source, ported from the Beautiful UI "Context Cards" primitive.

## Contract

- Props: `title`, `content`, `characters`, `sourceKind` (`pdf` | `csv` | `web` | `doc`), `sourceName`, `selectable`, `labels`, `ariaLabel`.
- Events: `select`.
- Host: `data-kind` attribute, `data-selectable` flag, `aria-label`.

## Behavior

- The card shows a title, character count, a clamped content preview, and a source chip with a kind-specific icon.
- When `selectable`, a "Use chunk" action emits `select` so the parent can pull the chunk into context.
