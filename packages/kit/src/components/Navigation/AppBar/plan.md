# AppBar component plan

- [x] Vuetify-inspired prepend, title, action, append, background, and extension regions.
- [x] Density, custom height, color, elevation, border, rounded, fixed, sticky, and collapsed states.
- [x] Responsive desktop/mobile height behavior and theme-token styling.
- [x] Public types, registration, focused tests, bilingual examples, and API tables.

## 2026-08-01 Scroll hysteresis and Material demo

- [x] Direction detection uses a 4px tolerance, preventing small layout corrections from being interpreted as an opposite scroll gesture.
- [x] Collapse behavior keeps a separate release point, preventing prominent-height reflow from repeatedly crossing the same threshold.
- [x] Scroll state resets when behavior changes or listeners disconnect.
- [x] The scroll-behavior example uses realistic Material content cards and has a regression test for the former threshold flash.
