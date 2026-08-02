# Utilities Playground plan

## 2026-07-19 unified interactive page

- [x] Consolidate all 14 utility categories into the single `/utilities` page while preserving legacy deep-link routes.
- [x] Provide category tabs, composable class controls, live preview, reset, generated markup and clipboard copy.
- [x] Provide search, quick navigation and responsive breakpoint reference in the same page.
- [x] Support dark design tokens and collapse the preview/config workspace to one column without horizontal overflow on narrow screens.
- [x] Cover category rendering, interaction, search, copy behavior and navigation compatibility with focused tests.
- [x] Verify the result in a real browser at desktop and narrow viewport sizes.

## 2026-07-19 restrained playground revision

- [x] Return to the existing Playground's flat border/header/source structure without gradients, grid decoration, large radii or decorative cards.
- [x] Put each utility title in its header, keep preview on the left and place every control/action in the right configuration panel.
- [x] Replace tabs and checkbox composition with two ElfUI Select controls and a single active utility class.
- [x] Rename the top-level navigation item to `样式和动画` and place it immediately after 首页 while preserving legacy routes.
- [x] Cover single-selection replacement, generated code, reset/copy and navigation position with focused tests and real-browser dark-theme interaction.

## 2026-07-19 standard source and outer-scroll revision

- [x] Remove the page description, search, horizontal directory, per-lab descriptions and notes.
- [x] Reuse the shared `elf-playground` source area for all 14 labs, including Template/Script tabs, language label, copy action and code panel.
- [x] Keep preview and controls in the flat two-column workspace while removing page-owned scrolling and source overflow.
- [x] Group Utilities under the no-icon `样式和动画` parent and verify the hierarchy, dark theme and standard source area in a real browser.

## 2026-07-22 topic-specific Playground revision

- [x] Rename the navigation leaf and page heading to `Utilities 工具类` so the bilingual label is consistent with other component menus.
- [x] Migrate all 14 categories to the latest Playground `status` and `controls` slots instead of maintaining a second page-owned workspace.
- [x] Replace the repeated ElfUI/A/B/C card with a topic-specific preview for borders, shape, accessibility, cursor, display, elevation, flex, float, opacity, overflow, position, sizing, spacing and typography.
- [x] Keep category/class selection, generated source, reset and copy behavior synchronized with each specialized preview.

## 2026-07-27 reusable draggable directive

- [x] Export a reusable `draggableDirective` with source, target, group, handle, axis and placement contracts.
- [x] Keep sorting state consumer-owned and report `before` / `after` / `inside` placement through typed callbacks.
- [x] Reuse the directive in Tree rows and provide a Utilities example for list sorting and target drops.
- [x] Cover registration, lifecycle cleanup, group isolation, disabled updates and drop details with focused tests.
