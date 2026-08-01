# BottomNavigation component plan

- [x] Controlled items/value API with update and change events.
- [x] Grow, horizontal, shift, active, color, border, height, and elevation states.
- [x] Arrow/Home/End keyboard focus, Enter/Space activation, disabled items, and aria-current.
- [x] Public types, registration, focused tests, bilingual examples, and API tables.

## 2026-07-31 Shift stability follow-up

- [x] Removed selected-icon translation and selected-item growth so shift labels can change without moving icons; all shift items keep an equal width and shared vertical position.
- [x] Isolated base, grow, horizontal, shift, and visibility example values so one Playground cannot update another.
- [x] BottomNavigation and navigation-page regression tests pass 15/15; Chromium mobile inspection reports four 63.5px items with identical icon tops and `transform: none`.
