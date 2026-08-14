# ElfUI Kit current repository baseline

Captured at: 2026-08-14T01:03:50.909Z.

Generation base: `main` at `21a80803fa6dc62d364af3b195bc92796b96107b`, plus the current working tree.

This report is generated from the current checkout. It does not reuse counts or timing from an older plan. Regenerate it with `pnpm baseline:collect`.

## Source and tests

| Area    | Production TS | Production lines | Test files | Test lines |
| ------- | ------------- | ---------------- | ---------- | ---------- |
| kit     | 357           | 58115            | 164        | 32009      |
| website | 603           | 66932            | 122        | 12001      |
| scripts | 2             | 562              | 9          | 1399       |

- Macro component definitions: 141 in 141 files.
- Test files: 295; direct `it()/test()` declarations: 1898; source-annotated skipped: 0; source-annotated todo: 0.

## Public package and bundle

- Published entries: `.` (1 total).
- Root named symbols: 1232.
- `sideEffects`: `false`. External dependencies are excluded from consumer bundle figures.

| Bundle                      | Raw        | Gzip       | Brotli     | Internal modules |
| --------------------------- | ---------- | ---------- | ---------- | ---------------- |
| Button + Input named import | 66.3 KiB   | 10.9 KiB   | 9.1 KiB    | 8                |
| registerAllComponents       | 3900.2 KiB | 611.0 KiB  | 364.1 KiB  | 340              |
| Website JavaScript total    | 9737.3 KiB | 2067.5 KiB | 1560.6 KiB | 151              |

## Style API

- Component style files: 138; macro files with a sibling style: 140.
- Public Shadow DOM parts: 109 across 75 component files.
- Public `--elf-*` custom properties: 136; internal `--_*` properties: 136.
- Core host-state API calls: `useHostAttr` 187, `useHostFlag` 258, `useHostCssVar` 128, `useHostClass` 0, `useHostStyle` 0.

## Dependency graph

- Nodes: 357; internal edges: 865; type-only edges: 406; dynamic edges: 1.
- Strongly connected components: 0; unresolved relative TypeScript imports: 0.

No source SCC was found by the current full non-test TypeScript scan.

## Critical-page performance

Browser: chromium 151.0.7922.34; viewport: 1440 × 1000; statistic: median of five isolated runs.

| Scenario     | Route                | Source items | Workload met | Render | Settled action | Target DOM before/after | Rendered items |
| ------------ | -------------------- | ------------ | ------------ | ------ | -------------- | ----------------------- | -------------- |
| table-v2     | /data/virtual-table  | 5000         | yes          | 308 ms | 41.5 ms        | 261/351                 | 20             |
| virtual-list | /data/virtual-list   | 10000        | yes          | 150 ms | 30.2 ms        | 69/69                   | 16             |
| tree         | /data/tree           | 2004         | yes          | 277 ms | 26.5 ms        | 79/110                  | 20             |
| select       | /form/select         | 10000        | yes          | 294 ms | 95.5 ms        | 11/57                   | 14             |
| cascader     | /form/cascader       | 9            | yes          | 251 ms | 59.2 ms        | 31/31                   | 5              |
| dropdown     | /navigation/dropdown | 6            | yes          | 182 ms | 36.8 ms        | 43/43                   | 6              |

Workloads below 10k are recorded as current coverage gaps, not presented as 10k evidence. Expanding those fixtures and adding regression thresholds belongs to the NG-700 performance gate.

## Listener, observer and timer inventory

| Pattern                 | Occurrences | Files |
| ----------------------- | ----------- | ----- |
| addEventListener        | 103         | 30    |
| removeEventListener     | 81          | 26    |
| useEventListener        | 23          | 13    |
| mutationObserver        | 5           | 5     |
| resizeObserver          | 6           | 6     |
| useResizeObserver       | 4           | 4     |
| intersectionObserver    | 4           | 3     |
| useIntersectionObserver | 1           | 1     |
| observerDisconnect      | 20          | 11    |
| setTimeout              | 36          | 25    |
| clearTimeout            | 39          | 20    |
| setInterval             | 5           | 5     |
| clearInterval           | 6           | 5     |
| requestAnimationFrame   | 34          | 22    |
| cancelAnimationFrame    | 40          | 19    |
| abortController         | 1           | 1     |
| createObjectURL         | 1           | 1     |
| revokeObjectURL         | 1           | 1     |

> Occurrence counts locate resource owners; unequal acquire/release totals do not prove a leak. Dynamic mount/unmount release gates belong to NG-703.

## Browser matrix

| Engine   | Configured | Measured | Version       | Status                       |
| -------- | ---------- | -------- | ------------- | ---------------------------- |
| chromium | yes        | yes      | 151.0.7922.34 | current-performance-baseline |
| firefox  | no         | no       | —             | not-automated-yet (NG-700)   |
| webkit   | no         | no       | —             | not-automated-yet (NG-700)   |

- Documentation navigation browser audit is in `scripts/audit-doc-navigation.playwright.js`; CI wired: false.
- Light/dark browser audit is in `scripts/theme-light-dark-audit.playwright.js`; CI wired: false.
- Firefox/WebKit automation is deliberately reported as missing until NG-700; Chromium evidence must not be described as a three-browser gate.

## Reproduce

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm baseline:collect
```
