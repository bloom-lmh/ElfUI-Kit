# AiApprovalCard plan

Human-in-the-loop approval card, ported from the Beautiful UI "Approval Card" primitive.

## Contract

- Props: `questions` (`AiApprovalQuestion[]`), `defaultIndex`, `confirmLabel`, `dismissLabel`, `required`, `showProgress`, `labels`, `ariaLabel`.
- Events: `confirm` (`{ index, question, value, custom }`), `dismiss` (`{ index }`), `change` (`{ index, value }`), `question-change` (`index`).
- Expose: `next()`, `previous()`, `confirm()`, `reset()`.
- Host: `data-index` attribute, `aria-label`.

## Behavior

- The card presents one question at a time with preset options plus an optional custom answer.
- Confirmation is disabled until an answer exists when `required`; answers are parent-owned notifications.
- Previous/next navigates the question list and resets the answer; progress shows `1 of N`.
