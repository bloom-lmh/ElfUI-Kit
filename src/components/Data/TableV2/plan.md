# TableV2 upgrade plan

## 2026-07-27 Stage C

- [x] Fixed-height virtualization, overscan, fixed columns, sorting, horizontal/vertical scrolling, and public scroll methods.
- [x] Variable-height virtualization based on cumulative offsets rather than average-height approximation.
- [x] Pinned `fixed-data` region with synchronized horizontal scrolling.
- [x] Typed cell/header renderer contracts and empty / overlay / footer slots.
- [x] Focused component tests and complete Template / Script documentation examples.

## 2026-07-29 Controlled expansion contract

- [x] Add `expand-column-key`, controlled `expanded-row-keys`, uncontrolled `default-expanded-row-keys`, and `indent-size`.
- [x] Emit Element Plus-compatible `expanded-rows-change` and `row-expand` notifications.
- [x] Keep expansion in the virtualized row projection instead of enabling classic Table tree mode, which intentionally disables windowing.
- [x] Use native buttons with `aria-expanded`, localized labels, Enter/Space activation, and ArrowLeft/ArrowRight collapse/expand behavior.
- [x] Reuse the shared pure tree projection while keeping Table selection collection state in the classic Table adapter.
- [x] Cover controlled and uncontrolled expansion, emitted payloads, keyboard behavior, ARIA, and bounded DOM rendering in focused tests.
- [x] Pass the beta.18 unsupported-macro scan and macro-aware TypeScript check with no suppressed errors.
- [x] Complete full build, browser interaction, and screenshot acceptance in Material/Midnight, Chinese/English, and desktop/mobile viewports with zero console warnings or errors.

## 2026-07-29 VirtualTable documentation and fixed-data composition

- [x] Move TableV2 examples, API reference, and page tests from Table into the independent `/data/virtual-table` documentation route.
- [x] Keep the public `elf-table-v2` tag stable; `VirtualTable` is a documentation category, not a new public component alias.
- [x] Join the pinned and scrolling table shells through the public `scroll` part so adjacent borders and radii render as one table.
- [x] Apply dynamic `row-height` to pinned rows as `rowStyle`, keeping the reserved fixed-region height equal to the rendered height.
- [x] Verify that the pinned header and summary remain visible after the body scrolls to the middle.
- [x] Keep Playground titles and the generated DocsToc entries identical for all three examples.
- [x] Capture `output/playwright/virtual-table-fixed-data-zh.png` and `output/playwright/virtual-table-fixed-header-scrolled-zh.png`.

## 2026-07-29 Native scrollbar alignment and virtual sticky header

- [x] Make the virtualized `thead` the sticky positioning container so the 5,000-row header remains at the viewport top after pixel scrolling.
- [x] Reserve the same stable vertical scrollbar gutter in pinned and scrolling tables, keeping fixed and body column boundaries aligned on Windows.
- [x] Measure the pinned table bottom, body viewport top, first rendered row, and first visible row across ten `scrollTop` positions; the fixed/body shell gap remains `0px`.
- [x] Verify the fixed and body `clientWidth` values and all three column boundaries are pixel-identical.
- [x] Localize the 5,000-row headers, health states, pinned example source, runtime content, and API page in both languages.
- [x] Add focused English-mode coverage and capture `virtual-table-sticky-header-scrolled-zh.png` plus `virtual-table-pinned-aligned-zh.png`.

## Boundaries

- TableV2 owns large-data windowing. Controlled hierarchical expansion is supported through a dedicated virtual row projection. Selection, span cells, and editable rows stay in semantic `elf-table` until their virtualized contracts can preserve keyboard and ARIA behavior.
- Repeated cell/header customization uses typed renderer functions; named slots are reserved for single-instance states where scoped-slot ownership is stable.
