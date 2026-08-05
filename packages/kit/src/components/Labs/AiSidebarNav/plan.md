# AiSidebarNav plan

Workspace navigation with quick search, ported from the Beautiful UI "Sidebar Nav" primitive.

## Contract

- Props: `workspace` (`AiSidebarWorkspace`), `sections` (`AiSidebarSection[]`), `activeKey`, `newTaskLabel`, `searchPlaceholder`, `showSearch`, `showNewTask`, `labels`, `ariaLabel`.
- Events: `select` (`AiSidebarItem`), `new-task`, `query-change` (`string`).
- Expose: `focusSearch()`, `clearSearch()`, `getQuery()`.
- Slots: `header` (replaces the workspace identity), `footer`.

## Behavior

- The quick search filters items live across sections; sections without matches collapse.
- `activeKey` is parent-owned so the highlight can follow routing; items may carry arbitrary extra fields and a badge.
