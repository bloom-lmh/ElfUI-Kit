# AiStreamingText plan

Streamed AI answer with inline sources, action chips, and follow-ups, ported from the Beautiful UI "Streaming Text" primitive.

## Contract

- Props: `content`, `sources` (`AiStreamSource[]`), `actions` (`AiStreamAction[]`), `followUps` (`string[]`), `streaming`, `streamSpeed`, `showSources` / `showActions` / `showFollowUps`, `labels`, `ariaLabel`.
- Events: `action` (`AiStreamAction`), `follow-up` (`string`), `complete`.
- Expose: `revealAll()`, `reset()`.
- Slots: default (answer), `actions`, `sources`, `follow-ups`.
- Host: `data-streaming` / `data-complete` flags, `aria-label`.

## Behavior

- While `streaming`, words reveal at `streamSpeed` intervals with a blinking caret; `complete` fires when all words are visible.
- Sources render as pill links (with domain), actions as tonal chips, follow-ups as dashed suggestion chips; every region can be replaced through its named slot.
