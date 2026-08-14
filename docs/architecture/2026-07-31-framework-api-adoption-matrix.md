# Framework API Adoption Matrix

This matrix records where ElfUI Core and Runtime beta.21 own lifecycle,
reactivity, resource, interaction, form, and structural rendering behavior. It
is an adoption audit, not a claim that every Kit adapter has already been
removed. `adapter` means the current ownership boundary or protocol is wider
than the framework helper and the reason is recorded here.

## Status Vocabulary

- `native`: the current implementation directly uses the matching Core or
  Runtime contract.
- `equivalent`: the Kit owner composes the framework contract without changing
  its lifecycle or cleanup semantics.
- `adapter`: a small Kit boundary remains because the framework contract does
  not own the dynamic target, domain state, or cross-component protocol.
- `missing`: the framework built-in applies to a current structural path but
  has not been adopted yet; it is a follow-up, not an invented compatibility
  API.

## Adoption Matrix

| **Capability**      | **Framework authority**                                                                                                                                    | **Kit owner and consumers**                                                                                                                                                                | **Status**   | **Contract reason and follow-up**                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lifecycle**       | `E:\elfui-docs\en\lifecycle\overview.md` and `mounting-and-unmounting.md`; hooks register synchronously and mounted cleanup owns resources.                | `@elfui/core` lifecycle hooks across `src/components`; `src/composables/useModalOverlay.ts` and `src/composables/useDismissibleOverlay.ts` own controller disposal.                        | `equivalent` | DOM-owning setup happens in `onMounted`; cleanup is returned or registered beside the resource. Imperative services remain outside component scope and return explicit close handles.                                                               |
| **Reactivity**      | `E:\elfui-docs\en\api\reactivity.md` and `composables\overview.md`; Core refs, computed values, and effects own reactive invalidation.                     | `src/components` and `src/composables` use `useRef`, `useComputed`, `useEffect`, and `useReactive`; no second reactive runtime is introduced.                                              | `native`     | Effects are used for derived synchronization; timers and microtasks are not used to hide framework ordering defects.                                                                                                                                |
| **DOM events**      | `E:\elfui-docs\en\composables\dom-events.md`; `useEventListener` binds at mount and removes before uninstall.                                              | `src/composables/useModalOverlay.ts` and `src/composables/useDismissibleOverlay.ts` now use Core listeners; dynamic trigger sets and active drag transactions remain component-owned.      | `equivalent` | Global listeners in setup use Core cleanup. Dynamic light-DOM trigger replacement, resize gestures, and external media resources need target-specific attach/detach adapters; audit continues in `OP-04` / `OP-05`.                                 |
| **Observers**       | `E:\elfui-docs\en\composables\observers.md`; Core observers follow target replacement and disconnect during teardown.                                      | `src/components/Common/DocsToc/index.ts`, Data components, Menu, Steps, and Tour consume observer owners; legacy one-shot targets are recorded for migration.                              | `adapter`    | Core observer wrappers cover component-scoped targets. Dynamic service geometry and the existing Image lazy-load observer need a dedicated target replacement audit; no polling or repeated ticks are added.                                        |
| **Scroll lock**     | `E:\elfui-docs\en\composables\interaction-control.md`; `useScrollLock` counts concurrent owners and restores the original overflow after the last release. | `src/composables/useModalOverlay.ts`, Image, Tour, `src/components/Feedback/Loading/index.ts`, and service-created Loading elements delegate body locking to Core.                         | `equivalent` | The service-created element sets `lock` before connection, so the same Core owner handles imperative and declarative instances. A regression covers mixed owners and restoration of a pre-existing overflow value.                                  |
| **Focus**           | `E:\elfui-docs\en\composables\interaction-control.md`; `useFocusTrap` provides simple component-local Tab trapping.                                        | `src/components/Common/focus/focus-scope.ts` and modal overlay controller coordinate deep Shadow DOM focus, topmost stack ownership, callbacks, and restoration.                           | `adapter`    | Core focus trap does not own the Kit overlay stack or close/focus callbacks. Replacing the controller would lose topmost arbitration; consumers retain the shared focus owner.                                                                      |
| **Form**            | `E:\elfui-docs\en\composables\form-controls.md`; form-associated elements use `defineOptions({ formControl: true })` and Runtime callbacks.                | `src/composables/form.ts`, `src/composables/native-form.ts`, Form/FormItem, and 24 value-owning Form/Picker controls compose native association with validation and inherited field state. | `adapter`    | Kit Form/FormItem owns aggregate rules, triggers, messages, typed serialization and controlled priority. Core remains the sole ElementInternals/native-callback owner; contract guards and Chromium/Firefox/WebKit tests prevent a second registry. |
| **Teleport**        | `E:\elfui-docs\en\built-ins\teleport.md`; physical placement changes without changing logical ownership or teardown.                                       | Core `<Teleport>` is used by `src/components/Feedback/Dialog/index.ts`, Drawer, Image, and Tour; overlay protocols keep positioning and focus ownership in Kit.                            | `native`     | Teleported nodes remain in the owner scope and are removed with the owner. No manual DOM move or detached cache is used as a replacement.                                                                                                           |
| **Transition**      | `E:\elfui-docs\en\built-ins\transition.md`; individual conditional nodes own enter/leave classes and completion.                                           | `src/components/Feedback/Dialog/index.ts` is the first verified Core `<Transition>` owner; remaining picker, overlay, and content paths still require component-by-component audit.        | `missing`    | Dialog now delegates enter/leave completion to Core without a close timer. `OP-04` must migrate the remaining applicable structural paths before this capability can leave `missing`.                                                               |
| **TransitionGroup** | `E:\elfui-docs\en\built-ins\transition-group.md`; keyed lists own insertion, removal, and move transitions.                                                | `src/components/Data/Table/index.ts`, `src/components/Form/Upload/index.ts`, and other keyed collections retain local rendering protocols while lifecycle contracts are audited.           | `missing`    | `OP-04` owns keyed movement and rapid-toggle verification. Stable keys, reduced motion, leave completion, and unmount cleanup must be proven before migration.                                                                                      |

## Decisions

- Core APIs are preferred when their setup and ownership contract fits. A
  remaining adapter must name its dynamic target, transaction, or richer
  protocol; “framework bug” alone is not a boundary.
- `useScrollLock` is the only body-lock owner. Imperative services delegate to
  a registered component instance instead of maintaining a second counter.
- `Transition` and `TransitionGroup` gaps are explicit work, not reasons to
  build manual mounting, DOM moves, polling, or lifecycle copies.
- Dialog is the first verified structural `<Transition>` consumer; its rapid
  reopen path preserves Light DOM identity, lifecycle events, focus, and overlay ownership.
- This audit does not close `OP-04`, `OP-05`, `OP-06`, or `OP-07`; those packages
  own the remaining transition, directive, style, and overlay migrations.

## Evidence

- Core and Runtime version: `0.1.0-beta.21`, as declared in `package.json`.
- Framework contracts were read from `E:\elfui-docs` and the installed Core
  declaration/runtime files, including the concurrent-owner scroll-lock fix.
- Focused code evidence: Loading `11/11`, Dialog/Drawer/LoadingPage `39/39`,
  Overlay controller `3/3`, Tooltip `15/15`, Dropdown `35/35`, and PopConfirm
  `9/9` tests passed after the listener and lock migrations.
- Native form evidence: all 24 value-owning controls pass focused tests and
  FormData contribution checks; submit/reset/restore/validity/external form,
  fieldset, Shadow DOM, array/date/file serialization pass 18/18 scenarios
  across Chromium, Firefox and WebKit.
- Architecture drift evidence: the framework matrix, Loading regression, and
  architecture boundary suites pass `3/3` files and `19/19` tests; lower-layer
  direct body overflow writers and Loading-specific lock counters are both zero.
- Dialog Transition evidence: component, page, and framework-adoption suites
  pass `3/3` files and `28/28` tests, including rapid reopen, Light DOM identity,
  lifecycle events, reduced motion, focus restoration, and unmount cleanup.
- Chromium static evidence: `/feedback/loading` at 1440x1000 Material Chinese
  and 390x844 Midnight English has no page-level horizontal overflow and emits
  `0` warnings / `0` errors. Screenshots are
  `docs/screenshots/2026-07-31/op03-loading-desktop-material-zh.png` and
  `docs/screenshots/2026-07-31/op03-loading-mobile-midnight-en.png`.
- Browser interaction remains unverified: the current control channel cannot
  deliver user events to the nested Shadow DOM example button. The service
  overlay, lock state, exit action, and focus restoration must be rerun in an
  independent Chromium session or manually; direct API calls are not evidence.
