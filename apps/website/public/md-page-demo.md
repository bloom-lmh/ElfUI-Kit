# Remote markdown

This file is fetched through the `src` prop.

- Relative links resolve against `base`: [guide](guide.md)
- Root-relative images stay untouched: ![logo](/logo.png)

```ts
export const remote = true;
```

::: tip Remote callouts
Remote content supports containers, footnotes, task lists, and code groups.
:::

## Checklist

- [x] Fetched from `src`
- [ ] Not fetched yet
