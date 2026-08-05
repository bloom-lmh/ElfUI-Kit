# Heading plan

## 2026-08-02 component introduction

- [x] Add `elf-heading` to `Basic/Heading` with semantic `level` 1-6 and Material title variants.
- [x] Support display, hero, page, section, subsection, card, overline, eyebrow, stat, label, and caption styles.
- [x] Support align, semantic color, weight, single-line truncation, and multi-line clamp.
- [x] Support eyebrow, index, accent, and chip composition props for numbered and decorated headings.
- [x] Document the component with a bilingual page, Playground examples, and API tables.
- [x] Add a stylized composition example with 10 numbered, accent, eyebrow, and chip heading styles.

## 2026-08-03 heading suite redesign

- [x] Replace the Material variant scale with three built-in heading families: `guide`, `editorial`, and `terminal`.
- [x] Add `numbered` auto counters scoped to a page or container, with per-family formats (`01`, `1`, `1.1`).
- [x] Keep `index` as a manual override and compose `eyebrow`, `accent`, and `chip` as decorations with family defaults.
- [x] Rework the bilingual docs page to demonstrate the three families as drop-in page heading skeletons.
- [x] Update the API table and tests; remove the former three hand-styled demo families.

## 2026-08-03 six suites and style overrides

- [x] Extend heading families to `guide`, `editorial`, `terminal`, `brand`, `neon`, and `minimal`.
- [x] Add `gradient` decoration with a brand h1 default, plus style override props `lineHeight`, `marginTop`, `marginBottom`, `fontSize`, and `letterSpacing`.
- [x] Add brand, neon, minimal, and style-configuration playgrounds to the bilingual docs page; update the API table.
- [x] Extend tests for family numbering formats, brand gradient defaults, and typography/spacing overrides.

## 2026-08-04 markdown list headings

- [x] Add `markdown="bullet | ordered"` so headings can render converted Markdown list forms (`-` and `1. 2. 3.`).
- [x] Ordered markdown auto-numbers per level within the same heading scope; `index` still overrides.
- [x] Guide level 3 skips the chip default in markdown mode; guide markers lead and use the accent color.
- [x] Demonstrate the conversion in the guide playground and update the API table and tests.
