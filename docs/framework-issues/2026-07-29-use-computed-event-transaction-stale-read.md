# `useComputed` stale read inside an event transaction

Status: resolved in ElfUI Core / Runtime 0.1.0-beta.18 and retained as a regression test.

## Expected behavior

After a reactive source is written, reading a computed value synchronously in the same event handler should return the value derived from the new source.

```ts
const source = useRef(1);
const doubled = useComputed(() => source.value * 2);

void doubled.value; // prime cache with 2

const onClick = () => {
  source.set(2);
  console.log(doubled.value); // expected: 4
};
```

## Actual behavior

The event handler reads `2`. After the event transaction finishes, a later read returns `4`.

The isolated reproduction is:

- `src/framework-repros/UseComputedEventTransactionRepro.ts`
- `src/framework-repros/UseComputedEventTransactionRepro.test.ts`

The regression test now asserts the expected synchronous value directly.

## Root cause boundary

Runtime wraps template event handlers in `batch()`. During a batch, `triggerEffects()` queues computed effects instead of running their schedulers immediately. The computed remains `dirty === false` until the batch flushes, so a synchronous read returns its old cache.

The framework should invalidate computed caches immediately while continuing to defer ordinary downstream effects until the batch boundary. The component library should not call `flushSync()`, schedule microtasks, add timeouts, or duplicate derived logic merely to refresh framework state.

## Impact

Any component that writes a source and immediately consumes a previously read computed value inside a template event can commit stale data. ColorPicker encountered this in its synchronous commit path.

ColorPicker currently calls its existing O(1) pure formatting function directly for the commit value. This is an algorithm boundary, not a timing workaround, and no additional component-side patch should be added.

## Verification

Run:

```text
pnpm vitest run src/framework-repros/UseComputedEventTransactionRepro.test.ts
```

Framework versions must remain aligned at beta.18: `@elfui/core`, `@elfui/compiler`, and `@elfui/vite-plugin`.
