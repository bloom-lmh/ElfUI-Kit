# Installation page plan

## 2026-08-02 installation structure revision

- [x] Focus the page on consuming and registering `@elfui/kit`.
- [x] Add Requirements, Create a project, Install, Register, Use, Verify, and Next sections.
- [x] Render every code block with the public `elf-code-card` component.
- [x] Keep macro authoring as a link to Build and styles instead of expanding the toolchain setup.
- [x] Add a bilingual page test covering headings, code-card usage, and English Han-free rendering.

## 2026-08-02 quote, code groups, and typography

- [x] Use `elf-quote` for browser, existing-project, and macro-authoring notes.
- [x] Group scaffold variants, package managers, and optional entries into `elf-code-card` tabbed items.
- [x] Move create-project descriptions into a `-` bullet list below the lead paragraph.
- [x] Remove the create-project lead sentence and add an Existing project tab to the scaffold code group.
- [x] Align the public entries table with code-card width and align both Use-component cards on the same horizontal baseline.
- [x] Reduce installation section spacing, keep a margin under the Create a project heading, and render Next steps as a right-aligned compact card.
- [x] Keep only one forward action in the Next card, pointing to Global configuration.
- [x] Place Verify installation and the Next card on the same horizontal row and polish the Next card surface.
- [x] Add numbered section markers and an accent bar to installation headings.
- [x] Match the DocsHero title accent with installation section headings.
- [x] Unify documentation paragraph and checklist line-height through `--docs-line-height`.
- [x] Embed browser support matrix, platform capabilities, and acceptance checklist into Requirements.
- [x] Remove the standalone Browser support route and navigation entry.
- [x] Share numbered section and h3 accent styles with the Upgrade guide.
- [x] Remove the h3 accent decoration again and keep only the base heading style.
- [x] Normalize Requirements line-height, use `elf-table` for both matrices, and keep the report quote full width.
- [x] Match both elf-quote cards to code-card width and style h3 subheadings as soft primary chips with balanced vertical margins.
- [x] Fix the quote width selector so it covers quotes nested inside sections, not only direct children of guide-content.
- [x] Wrap standalone section leads and small explanatory paragraphs in compact `elf-quote` cards.
- [x] Distinguish quote semantics: general leads use `info`, cross-browser and verification cautions use `warning`, macro authoring uses `warning`.
- [x] Add a Recommended reading card below Next steps with a secondary-color surface so the right column balances the verify column.
