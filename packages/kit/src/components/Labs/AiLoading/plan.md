# AiLoading plan

Pixel-grid loader for long-running AI work, ported from the Beautiful UI "Loading State" primitive.

## Contract

- Props: `label`, `variant` (`drive` | `dots` | `orbit`), `showTimer`, `labels`, `ariaLabel`.
- Events: none.
- Expose: `resetTimer()`.
- Host: `data-variant` attribute, `data-timer` flag, `aria-label`.

## Behavior

- A 3x3 pixel grid animates a chevron wavefront (`drive`), a circular wavefront (`dots`), or a comet lapping the perimeter (`orbit`).
- The label uses a shimmering text gradient; the elapsed timer ticks every 100 ms and formats as `0.0s` / `1m 23.4s`.
- Reduced motion freezes the grid and shimmer; the timer keeps ticking.
