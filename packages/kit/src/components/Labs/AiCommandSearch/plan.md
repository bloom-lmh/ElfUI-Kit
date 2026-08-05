# AiCommandSearch plan

Command search with live filtering and an empty state, ported from the Beautiful UI "Search" primitive.

## Contract

- Props: `items` (`AiCommandItem[]`), `placeholder`, `emptyText`, `maxResults`, `autofocus`, `labels`, `ariaLabel`.
- Events: `select` (`AiCommandItem`), `query-change` (`string`), `submit` (`{ query, item }`).
- Expose: `focus()`, `blur()`, `clear()`, `getQuery()`.
- Host: `data-empty` / `data-open` flags, `aria-label`.

## Behavior

- Results filter live against title, description, and keywords; `maxResults` caps the list.
- Arrow keys move an `aria-activedescendant` selection; Enter selects the active item or submits the raw query; Escape clears.
- The empty state renders when nothing matches; selecting an item emits both `select` and `submit`.
