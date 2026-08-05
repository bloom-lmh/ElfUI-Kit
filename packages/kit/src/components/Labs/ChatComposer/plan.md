# ChatComposer plan

Autosizing message composer with Enter-to-send and stop action for AI clients.

## Contract

- Model: `modelValue` (`update:modelValue`).
- Props: `placeholder`, `disabled`, `loading`, `maxlength`, `rows`, `maxRows`, `submitOnEnter`, `labels`, `ariaLabel`, `autofocus`.
- Events: `send` (`string`), `stop`, `focus`, `blur`.
- Expose: `focus()`, `blur()`, `clear()`, `getValue()`.
- Host: `disabled`/`loading`/`data-empty` flags.

## Behavior

- Enter submits (Shift+Enter inserts a newline); IME composition is respected.
- Loading swaps the send button for a stop button.
- Textarea autosizes up to `maxRows` and scrolls beyond that.
