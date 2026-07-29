# TimeSelect

## Contract

- Controlled string value using canonical `HH:mm`.
- Fixed options from `start`, `end`, and `step`.
- Linked availability through `minTime` and `maxTime`.
- End-exclusive by default; `includeEndTime` opts into the exact end value.
- Display formatting is independent from the stored value.
- Reuses Select for field surfaces, keyboard navigation, clear behavior, Form
  integration, ConfigProvider empty-value defaults, and dropdown lifecycle.

## Verification

- Pure boundary-model tests.
- Component interaction, controlled event, disabled, format, and expose tests.
- Bilingual documentation examples and API tables.
- Typecheck, full regression, production build, and browser screenshot.
