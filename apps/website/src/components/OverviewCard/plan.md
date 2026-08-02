# OverviewCard plan

Status: implemented for the component overview page.

## Contract

- Documentation-only card with `title`, `href`, `badge`, and `ariaLabel` props.
- The default slot owns the component-specific preview; the card owns navigation, framing, focus, and hover feedback.
- Public parts: `root`, `header`, and `preview`.
- Native anchor semantics provide keyboard navigation and link behavior.

## Verification

- [x] Focused component and Overview page tests: 3 files, 8 tests passed on 2026-07-31.
- [ ] Typecheck, full test suite, app build, and library build.
- [x] Desktop/mobile, Material/Midnight, Chinese/English browser matrix.

The Overview catalog now carries a specific `data-detail` for every route and uses 23 preview
kinds across 98 cards. Browser audits reported no unknown details, card overflow, page overflow,
or gradients. The final app build attempt timed out after 244 seconds without output, so the full
repository gate remains open.
