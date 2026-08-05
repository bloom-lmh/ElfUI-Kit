# AiFineTuneCard plan

Inspector where the agent adjusts design properties, ported from the Beautiful UI "Fine-tune Card" primitive.

## Contract

- Props: `title`, `adjustLabel`, `properties` (`AiFineTuneProperty[]` with `kind` `number` / `select` / `text`), `labels`, `ariaLabel`.
- Events: `change` (`{ key, value, property }`).
- Expose: `getValues()`, `setValue(key, value)`.
- Slots: `header-extra`, `footer`.

## Behavior

- Number properties render a range plus a numeric input with unit; select properties render segmented options; text properties render a text field.
- Values are internal but parent-observable through `change`; external property changes resync the internal store.
