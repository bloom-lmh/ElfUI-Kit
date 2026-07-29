# ElfUI Kit critical-page baseline

Date: 2026-07-29

This baseline protects architecture refactors from visual and performance regressions. It is not a benchmark comparison against Element Plus or Vuetify.

## Fixed environment

- Browser: Chromium 150.0.7871.125.
- Viewport: 1440 x 1000 CSS pixels.
- Statistic: median of five isolated full-page runs.
- Development server: local Vite server with no test or build process running concurrently.
- Regression threshold: investigate any median regression greater than 10%. Do not fail on a single-run fluctuation.

Captured at: 2026-07-29T01:04:09.977Z.

## Critical scenarios

| Scenario | Route | Fixed workload | Required invariant |
| --- | --- | --- | --- |
| TableV2 | `/data/virtual-table` | 5,000 rows | Rendered row window remains bounded after `scrollToRow(4500)` |
| VirtualList | `/data/virtual-list` | 10,000 items | Rendered item window remains bounded after end scroll |
| Tree | `/data/tree` | 2,004 expanded nodes | Rendered tree-node window remains bounded after `scrollToNode("asset-1500")` |
| Select | `/form/select` | 10,000 options | Opening and `scrollToOption(9000)` keep option DOM bounded |
| Cascader | `/form/cascader` | Current page fixtures | Opening does not duplicate the overlay tree |
| Dropdown | `/navigation/dropdown` | Current page fixtures | Opening does not duplicate menu nodes or regress top-layer behavior |

Run `scripts/benchmark-critical-pages.playwright.js` through Playwright CLI `run-code` from an already-open local docs page. The script records render duration, deep Shadow DOM element counts, target element counts before and after interaction, rendered item counts, interaction duration, and Long Task timing.

## Recorded medians

| Scenario | Render | Page elements | Target elements before / after | Rendered items after | Settled action | Render long tasks | Action long tasks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| TableV2 | 596 ms | 4,327 | 261 / 351 | 20 | 11.2 ms | 2, max 215 ms | 0 |
| VirtualList | 228 ms | 465 | 68 / 68 | 16 | 11.7 ms | 0 | 0 |
| Tree | 375 ms | 1,524 | 79 / 110 | 20 | 11.0 ms | 2, max 60 ms | 0 |
| Select | 336 ms | 961 | 11 / 57 | 14 | 63.5 ms | 0 | 0 |
| Cascader | 302 ms | 1,306 | 31 / 31 | 5 | 11.8 ms | 1, max 53 ms | 0 |
| Dropdown | 244 ms | 1,116 | 41 / 41 | 6 | 14.6 ms | 0 | 0 |

The recorded TableV2 median predates the 2026-07-29 documentation split and came from the combined `/data/table` page. The repeatable benchmark now targets `/data/virtual-table`; recapture its five-run median before using the old page-level timing as a regression threshold. The bounded 20-row result remains the component invariant.

## Canonical visual references

| Capability | Reference |
| --- | --- |
| Dropdown selected and split states | `docs/screenshots/2026-07-28-dropdown-beta12-refactor/` |
| Select virtualized options, Chinese and English | `docs/screenshots/2026-07-28-select-virtual/` |
| Tree collection, Chinese and English | `docs/screenshots/2026-07-28-tree-collection/` |
| VirtualList dynamic window | `docs/screenshots/2026-07-28-virtual-window/` |
| VirtualTable fixed data and sticky header | `output/playwright/virtual-table-fixed-data-zh.png` and `output/playwright/virtual-table-fixed-header-scrolled-zh.png` |
| VirtualList dynamic bottom after append | `output/playwright/virtual-list-dynamic-bottom-zh.png` |
| Table virtual sort and overlay behavior | `docs/screenshots/2026-07-26-regressions/` |
| Cascader compact, adaptive, and lazy states | `docs/screenshots/2026-07-22-component-demo-gaps-batch2/` and `docs/screenshots/2026-07-22-component-demo-gaps-batch3/` |
| Anchored and modal overlay coordination | `docs/screenshots/2026-07-28-overlay-stack/` |

Visual review must keep the same DOM order, classes, parts, ARIA, CSS selectors, spacing, typography, color tokens, and interaction states unless a separate visual-change task explicitly approves a difference.

## Resource checks

Page-level timing does not replace component resource tests. Any refactor touching listeners, observers, timers, object URLs, teleport targets, or overlay coordination must also verify:

- registrations are not duplicated after repeated open/close;
- disconnect removes component-owned resources;
- data replacement does not retain stale models or DOM nodes;
- virtual windows remain bounded after large jumps;
- overlay stacks release global listeners when the final overlay closes.
