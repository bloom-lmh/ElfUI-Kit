<!-- cspell:ignore shiki vitesse palenight -->

# CodeCard Plan

## OP-13 Labs CodeCard

- [x] One component owns workbench, window, and minimal visual variants.
- [x] Shiki grammars provide line-preserving highlighting for supported languages.
- [x] Prettier parsers format JavaScript, TypeScript, Vue, HTML, CSS, SCSS, JSON, and Markdown.
- [x] Expand/collapse, line-number control, copy, themes, range-based focus/highlight/error/warning/diff lines, and code groups are public contracts.
- [ ] Record full repository and browser gate evidence after the implementation settles.

## Ownership

- `model.ts` owns language aliases, tokenization, theme mapping, and formatter selection; `highlighter.ts` is one lazy Shiki chunk.
- `index.ts` owns active-tab state, models, clipboard interaction, asynchronous request races, and semantic events.
- `style.scss` owns the three shells and line-decoration presentation.

## 2026-07-31 Evidence

- Focused Vitest: 6 files / 29 tests passed, covering the pure model, component, page, Overview entry, and both information-architecture suites.
- Target Prettier, ESLint, and CSpell checks passed. The shared `src/library.ts` Prettier check and shared route CSpell check remain blocked by concurrent non-CodeCard changes; `git diff --check` passed with line-ending warnings only.
- Application build passed with 1099 modules. Library Vite build passed with 438 modules; `tsc -p tsconfig.lib.json` and `scripts/prepare-package.mjs` passed. Full macro typecheck produced no output before the 244-second command limit and is not recorded as passing.
- Chromium `/labs/code-card` passed at 1440x1000 Material Chinese and 390x844 Midnight English with zero page overflow and zero console warnings/errors. The mobile toolbar now has equal `clientWidth` and `scrollWidth` at 274px, so all 44px action targets stay inside the card.
- Screenshots: `docs/screenshots/2026-07-31/code-card-desktop-material-zh.png` and `docs/screenshots/2026-07-31/code-card-mobile-midnight-en.png`.
- Formatting was verified through a real toolbar action. The current browser-control channel still cannot dispatch nested Shadow DOM tab/keyboard actions or grant page clipboard access; grouped navigation and clipboard fallback remain covered by component tests rather than being marked as browser-verified.
- The figure-one refinement adds typed single/range line selection, error and warning diagnostics with non-color markers, file-style workbench chrome, and `elf-select` controls. Literal whitespace around the `<pre><code>` line loop was removed; measured desktop whitespace fell from 58/68px to 10/20px. The latest 1440x1000 and 390x844 checks had zero page/header/action overflow and zero console warnings/errors. After a transient concurrent `ThemeStudioPage` parse failure cleared, the final application build passed with 1106 modules.

## 2026-08-01 Reference alignment evidence

- The workbench language selector now uses the library's underlined `elf-select` inside the header; the redundant footer/status strip was removed. Explicit light and dark surface tokens keep the header, editor, controls, diagnostics, and code-group tabs coherent without depending on page theme variables.
- Reference-aligned examples cover a VitePress-style Vue card, one-line focus with surrounding dimming, full-line error/warning/add/remove/highlight annotations, and a JavaScript/TypeScript code group. Each Playground source panel shows the actual public configuration, including `{ start, end }` ranges.
- Diagnostic backgrounds now mix their semantic colors with `transparent`, so error, warning, added, removed, highlighted, and focused states span the complete code row instead of silently resolving to an invalid background.
- Chromium `/labs/code-card` passed visual checks at 1440x1000 Material Chinese and 390x844 Material Indigo English with zero page overflow and zero console warnings/errors. Screenshots are `docs/screenshots/2026-08-01/code-card-desktop-material-zh.png`, `code-card-dark-desktop-material-zh.png`, `code-card-diagnostics-desktop-material-zh.png`, and `code-card-mobile-midnight-en.png`.
- CodeCard component and page tests pass 10/10. The six-file focused suite is 35/36; its only failure is the unrelated app routing loading-overlay exit transition, while the CodeCard model, component, page, Overview entry, and information-architecture coverage pass.
- Target Prettier, ESLint, and CSpell checks pass. Application build passes with 1108 modules; library Vite build passes with 441 modules; `tsc -p tsconfig.lib.json` and package preparation pass. Full macro typecheck is still not recorded as passing.
- Browser clipboard permission and nested Shadow DOM event delivery remain restricted by the current control channel; copy success/fallback, formatting, collapse, and grouped keyboard navigation remain covered by component tests rather than being marked as browser-verified.

## 2026-08-01 Compact ElfUI example evidence

- The first workbench example now shows a directly runnable `@elfui/kit` HTML button instead of unrelated VitePress source. Its six live `elf-select` controls use a two-column desktop layout and the same Playground horizontal padding as the other examples.
- Chromium measured desktop card widths at `530 / 680 / 818 / 818 / 818px`; at 390px all five cards are exactly `274px`. Page, toolbar, and code-scroll overflow are all 0, and the workbench keeps only its normal 24px lower inset.
- Focused Vitest passes 3 files / 15 tests. Target Prettier, ESLint, and CSpell pass; the application build passes with 1111 transformed modules.
- Final screenshot: `docs/screenshots/2026-08-01/code-card-elfui-compact-desktop-zh.png`; the final 390px state is recorded by measured browser evidence rather than attaching the pre-padding mobile capture.

## 2026-08-01 Source margin correction

- CodeCard now removes template-literal common indentation and outer blank lines while preserving nested source indentation. Rows without diagnostics no longer reserve the 22px marker column, and the line-number/content gutter is tighter.
- Installation examples use one minimal CodeCard per row, disable line numbers for short commands, and provide footer context on all six cards.
- Focused regression is included in the current 7-file / 68-test passing batch. Formatting, locale audit `540/540`, unsupported-macro scan, and the 1111-module application build pass. Browser verification is intentionally left to the user for this batch.

## 2026-08-01 Literal source and installation header correction

- The first HTML example now constructs its source outside a multiline template literal, preventing the macro compiler from adding template-level indentation to later code lines.
- The rendered `<pre><code>` loop contains no whitespace text nodes; framework `v-for` comment anchors remain non-visual.
- All six installation examples use the workbench shell with filenames and footers, so every card has a visible header and contextual footer.
- Focused Vitest passes 4 files / 19 tests, including exact source-line and installation-header regression coverage. Browser verification remains assigned to the user.

## 2026-08-02 Icon overrides and surface polish

- [x] Add the public `icons` prop for SVG path overrides of file, toolbar, and copy-state icons while keeping MDI defaults.
- [x] Normalize all card shells to the semantic `--elf-radius-md` token and strengthen the border.
- [x] Remove card shadows; light themes render dark cards and dark themes render light cards, with matched inverse Shiki palettes.
- [x] Add a component regression covering every icon override path.
- [x] The installation page now uses grouped `elf-code-card` tabs and `elf-quote` notes; docs paragraphs use one fixed line-height variable.
- Browser screenshot acceptance remains pending.

## 2026-08-04 Code snippet vertical breathing room

- The internal code snippet now keeps 10px of top/bottom padding inside the scroll area (previously 3px), so the first and last lines no longer sit flush against the card edge.
- Default, workbench, and minimal shells share the same 10px block padding.

## 2026-08-05 Theme normalization

- The surface scheme now follows the document theme instead of inverting it: dark pages render a dark card shell with dark Shiki palettes (github-dark / material palenight / vitesse-dark), and light pages render a light shell with light palettes.
- Swapped the token values of `scheme-light` / `scheme-dark`, updated the paired-theme unit expectations, and corrected the `theme` prop description on the demo page.
