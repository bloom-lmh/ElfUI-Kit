# AIChat plan

Full AI agent client chat panel: header, message log, typing indicator, tool-call cards, and composer.

## Contract

- Props: `items` (`AIChatMessageItem[]`), `loading`, `title`, `subtitle`, `placeholder`, `disabled`, `height`, `emptyText`, `showHeader`, `autofocus`, `labels`, `ariaLabel`.
- Events: `send` (`string`), `stop`, `clear`, `message-copy` (`{ item, content }`), `retry` (`AIChatToolCallItem`).
- Slots: `welcome`, `header-extra`, `composer`.
- Expose: `clear()`, `scrollToBottom()`, `focus()`, `getItemCount()`.
- Host: `--_chat-height` CSS variable, `loading`/`data-empty` flags, `aria-label`.

## Behavior

- Messages are parent-owned; `send`/`clear`/`retry` are notifications.
- Tool calls render below their assistant message.
- The message log is `role="log"` and scrolls to the bottom on updates; loading renders a typing indicator.
