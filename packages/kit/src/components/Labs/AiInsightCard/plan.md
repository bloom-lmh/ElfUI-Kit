# AiInsightCard plan

Paged agent insights with metric sparks and a follow-up CTA, ported from the Beautiful UI "Insight Cards" primitive.

## Contract

- Props: `insights` (`AiInsight[]` with `segments` / `sparks` / `cta`), `defaultIndex`, `title`, `showPager`, `labels`, `ariaLabel`.
- Events: `change` (`index`), `cta` (`{ index, cta }`).
- Expose: `next()`, `previous()`, `goTo(index)`.
- Slots: `header-extra`, `chart` (replaces the spark rows), `footer`.
- Host: `data-index` attribute, `aria-label`.

## Behavior

- Insights page internally; segments render mentions and inline code, sparks render color-coded deltas with amounts.
- The chart slot lets parents drop in sparklines or custom visualizations while keeping the pager behavior.
