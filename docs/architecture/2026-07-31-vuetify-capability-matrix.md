# Vuetify Capability Matrix

> The **[machine-readable JSON](./vuetify-4.1.8-capability-matrix.json)** is the single source of truth.
> This Markdown is a human-readable summary. Owner paths, test paths, docs paths,
> and full difference descriptions are in the JSON matrix.

- Authority: `vuetify@4.1.8` · Kit: `@elfui/kit@0.0.2-beta.2`
- Scope: Cross-component ownership and alignment per Batch 5 (NG-500–NG-510) and Batch 3 (NG-305, NG-307).

## Status Distribution

| Status       | Count | Entries                                                                            |
| ------------ | ----- | ---------------------------------------------------------------------------------- |
| `equivalent` | 10    | Defaults, Theme, Locale, Icons, Display, Date, GoTo, Overlay, Directives, Tokens   |
| `implement`  | 4     | **Layout** (NG-500), **Platform** (NG-502), **Aliases** (NG-506), **SSR** (NG-502) |
| `combined`   | 0     | —                                                                                  |
| `non-goal`   | 1     | **Services** — Kit has its own Web Components-native service layer (NG-307)        |

## Gap Summary

- **Layout** (`vuetify.layout`): No shared Kit owner; AppBar, BottomNavigation, Footer, Aside, and Main own local structure. Vuetify provides a layout registry with position, priority, size, z-index, and content insets. Planned: NG-500.
- **Platform** (`vuetify.platform`): ConfigProvider has display dimensions only; no complete platform owner with safe SSR/user-agent detection. Planned: NG-502.
- **Aliases** (`vuetify.aliases`): No shared alias resolver; `resolveComponentTag()` is a Core tag resolver, not a Kit alias registry with props merge. Planned: NG-506.
- **SSR** (`vuetify.ssr`): ConfigProvider has display.ssr dimensions but no single platform/hydration owner coordinating boot classes and hydration checks. Planned: NG-502.
- **Services** (`vuetify.services`): Vuetify has no equivalent service registry. Kit implements its own service facade via `service-defaults.ts` — a Web Components-native imperative layer, not a parity target.

## Cross-Cutting Decisions

- Vuetify's plugin-only options are configuration authorities, not copied as Vue-specific APIs into Custom Elements.
- Kit's 11 directives include the eight Vuetify names plus Kit-owned Draggable, Loading, and Infinite Scroll — not a parity defect.
- This document records ownership and gaps; it does not close the listed NG-* tasks.
