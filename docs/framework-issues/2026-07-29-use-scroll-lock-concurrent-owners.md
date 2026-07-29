# `useScrollLock` unlocks before the final owner releases

Status: resolved in ElfUI Core / Runtime 0.1.0-beta.18 and retained as a regression test.

## Expected behavior

When two mounted owners request scroll locking, `document.body` must remain locked until both owners release.

## Previous behavior

Owner A records the original overflow value and sets `hidden`. Owner B then records `hidden`. When A releases first, it restores the original value even though B is still active.

The isolated reproduction is:

- `src/framework-repros/UseScrollLockConcurrentOwnersRepro.ts`
- `src/framework-repros/UseScrollLockConcurrentOwnersRepro.test.ts`

The regression test now asserts the final-owner contract directly.

## Impact

Dialog and Drawer consume `useScrollLock` through `useModalOverlay`; Tour, fullscreen Loading, and Image preview use it directly. Concurrent overlays can therefore restore page scrolling too early.

## Resolution boundary

Core now coordinates concurrent owners and restores the original body style only after the final release. ElfUI Kit continues to consume the shared helper and does not maintain a second process-wide lock registry.

## Verification

Run:

```text
pnpm vitest run src/framework-repros/UseScrollLockConcurrentOwnersRepro.test.ts
```

Framework versions must remain aligned at beta.18: `@elfui/core`, `@elfui/compiler`, and `@elfui/vite-plugin`.
