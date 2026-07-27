# TableV2 upgrade plan

## 2026-07-27 Stage C

- [x] Fixed-height virtualization, overscan, fixed columns, sorting, horizontal/vertical scrolling, and public scroll methods.
- [x] Variable-height virtualization based on cumulative offsets rather than average-height approximation.
- [x] Pinned `fixed-data` region with synchronized horizontal scrolling.
- [x] Typed cell/header renderer contracts and empty / overlay / footer slots.
- [x] Focused component tests and complete Template / Script documentation examples.

## Boundaries

- TableV2 owns large-data windowing. Selection, tree rows, span cells, and editable rows stay in semantic `elf-table` until their virtualized contracts can preserve keyboard and ARIA behavior.
- Repeated cell/header customization uses typed renderer functions; named slots are reserved for single-instance states where scoped-slot ownership is stable.
