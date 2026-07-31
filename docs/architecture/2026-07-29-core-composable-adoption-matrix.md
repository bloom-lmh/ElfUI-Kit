# Core composable adoption matrix

Date: 2026-07-29

Scope: ElfUI Core / Runtime 0.1.0-beta.15 and ElfUI Kit 0.0.2-beta.1.

> Historical snapshot: the current beta.20 ownership lookup is `docs/architecture/2026-07-31-capability-ownership-and-reuse-inventory.md`. In particular, Core fixed concurrent `useScrollLock()` ownership in beta.20; the gap analysis below is retained only as the decision history that led to that fix.

The goal is one authoritative owner per capability. A Core resource helper should be used when its contract fully matches the component need. Kit keeps an adapter when cross-instance coordination, overlay ownership, multiple dynamic targets, or component-specific policy is required.

## Matrix

| Core API                  | Current Kit use                                                    | Contract fit                                                                                                              | Decision                                                                                                                                                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useEventListener`        | 13 component modules                                               | Strong for a stable setup-time target and automatic mount/unmount cleanup                                                 | Adopt for stable targets. Candidate cleanup: document listeners in `useDismissibleOverlay` and `useModalOverlay`. Keep manual listeners for dynamic scroll ancestors, visual viewport targets, drag sessions, service-created elements, directives, and open-only positioning resources.                     |
| `useClickOutside`         | 1 module: AvatarGroup                                              | Fits one always-active host and a bubbling `click`                                                                        | Keep for simple local popovers. Do not use for Dropdown, Select, Cascader, Picker, Tooltip, Menu, Pagination, Table filters, or PopConfirm because they require multiple containers, pointerdown/capture choices, topmost event claiming, and teleported content. Those stay behind `useDismissibleOverlay`. |
| `useEscapeKey`            | 2 modules: AvatarGroup and Tour                                    | Fits one unconditional document Escape listener                                                                           | Keep for simple isolated behavior. Do not expand to coordinated overlays until Core exposes active state and topmost claiming. Tour should move behind the shared overlay protocol in Batch B rather than adding another Escape listener.                                                                    |
| `useScrollLock`           | 4 source modules, serving Dialog, Drawer, Tour, Loading, and Image | Single owner only                                                                                                         | Block broader adoption. beta.15 stores previous overflow per hook instance and has no owner count; concurrent locks can unlock early. Kit must not duplicate another process-wide lock. Resolve the Core contract or explicitly make the Kit modal controller the sole coordinated owner.                    |
| `useFocusTrap`            | 1 module: PopConfirm                                               | Basic single-root trap                                                                                                    | Do not use as the modal authority. It does not coordinate topmost ownership and does not recursively traverse nested Shadow Roots. Dialog and Drawer correctly keep focus policy in `modal-overlay-controller`; PopConfirm must be reviewed with the shared overlay protocol.                                |
| `useResizeObserver`       | 3 modules: Steps, Descriptions, Tour                               | Strong for one stable or reactive target observed for the component lifetime                                              | Adopt when observation is continuous and single-target. Keep manual observers for open-only overlays, multiple targets, virtual measurement maps, directives, and observers that intentionally disconnect after success.                                                                                     |
| `useIntersectionObserver` | 1 module: Tour                                                     | Strong for continuous single-target visibility tracking                                                                   | Keep in Tour. Image remains manual because lazy loading disconnects permanently after the terminal load/error path; adopting the current Core helper would retain an unnecessary observer until unmount.                                                                                                     |
| `useFormControlContext`   | 0 modules                                                          | Core owns native `ElementInternals`; Kit owns Form/FormItem validation, provider inheritance, events, and model semantics | Defer. It is not a drop-in replacement for `src/composables/form.ts`. Define an integration contract for native form value/reset/restore/disabled plus FormItem validation before any field opts in. Adoption must be component-by-component because it changes native form behavior.                        |

## Ownership rules

- Core owns lifecycle-safe primitives for one component instance and one resource target.
- Kit owns overlay stacks, close reasons, topmost event claiming, focus capture/return, `inert`, teleport/visual viewport positioning, and shared virtual-window algorithms.
- A component owns its data model, selection semantics, measurement policy, and business state machine.
- Direct DOM resource management is valid when the resource target is dynamic, exists only during an active transaction, spans multiple elements, or must terminate before component unmount.
- Manual resources must still return or register deterministic cleanup in the same lifecycle boundary where they are created.

## Concrete follow-up

1. Batch B may replace the static document listener plumbing inside `useDismissibleOverlay` and `useModalOverlay` with `useEventListener`; event claiming and controller disposal remain Kit-owned.
2. Do not expand `useScrollLock` until concurrent-owner behavior is defined and tested.
3. Move Tour Escape, scroll lock, focus, and overlay ownership into the shared overlay protocol as one change.
4. Review Image, Parallax, InfiniteScroll, Table, Dropdown, Cascader, Autocomplete, Pagination, PopConfirm, Menu, and DocsToc observer lifetimes individually; do not bulk-rewrite them.
5. Design native form association as an adapter beneath the existing Form/FormItem contract, with explicit reset, restore, disabled, validation, and serialization tests.

## Framework gap: concurrent scroll locks

In beta.15, each `useScrollLock` instance remembers and restores `document.body.style.overflow` independently:

1. owner A locks and records `""`;
2. owner B locks and records `"hidden"`;
3. owner A unlocks and restores `""` while B is still active.

Expected behavior is for the body to remain locked until the final owner releases. This needs an owner-counted Core implementation or an explicit statement that Core only supports one global lock owner. ElfUI Kit must not hide the ambiguity with an additional unrelated singleton.

Minimal reproduction and impact record: `docs/framework-issues/2026-07-29-use-scroll-lock-concurrent-owners.md`.
