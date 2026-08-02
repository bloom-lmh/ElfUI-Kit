<!-- cspell:words Sparkline -->

# Capability Ownership and Reuse Inventory

- Date: 2026-07-31
- ElfUI Kit: `0.0.2-beta.1`
- ElfUI Core / Compiler / Vite Plugin: `0.1.0-beta.20`
- Status: authoritative `OP-01` lookup for current repository work

This inventory is the required first lookup before changing a component. It records the current owner, consumers, and duplication boundary for shared capabilities. Detailed protocol documents remain the authority for behavior inside a capability; this file owns the cross-repository index.

## Lookup Rule

1. Find the capability in the matrix before adding a listener, observer, state model, Provider, controller, style protocol, or service.
2. Depend on the public owner or its documented adapter. Components must not query or mutate another component's Shadow DOM.
3. If the matrix says `missing`, implement the planned owner first. Do not hide the gap in one consumer.
4. Add a new shared abstraction only for three semantically aligned consumers or one proven cross-component protocol split.
5. Update this inventory and its drift test in the same atomic commit whenever a listed source or owner changes.

## Ownership Matrix

| Capability                                                    | Authoritative owner                                                                                                   | Current consumers                                                                                                | Prohibited duplication                                                                                                                   | Status / next owner                                                                                       |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Macro components, reactivity, lifecycle, host synchronization | `@elfui/core` macros and composables                                                                                  | All macro components                                                                                             | Local render engines, copied lifecycle dispatch, polling in place of reactive effects, manual host-attribute mirrors                     | Supported by beta.20                                                                                      |
| Stable DOM events and observers                               | Core `useEventListener`, `useClickOutside`, `useResizeObserver`, `useIntersectionObserver`                            | Stable single-target component resources                                                                         | Manual stable-target listeners or observers without a contract-specific reason                                                           | Core owns lifecycle; dynamic/open-only resources stay in a Kit controller                                 |
| Structural rendering                                          | Core `teleport`, `transition`, `transitionGroup`, `keepAlive`, `suspense`, `dynamicComponent`, `projectLightDom`      | Overlays, structural enter/leave, keyed movement, dynamic views, async boundaries                                | Manual DOM moves, lifecycle copies, component caches, or hand-written structural transition coordinators                                 | Adopt when the documented contract fits; record non-applicability                                         |
| Injection and application context                             | Core `provide`, `inject`, `createInjectionKey`, `useAppConfig`                                                        | Providers, scoped defaults, theme, locale, icon and service policies                                             | Process-global mutable Provider registries or manual tree walking                                                                        | Supported by beta.20                                                                                      |
| Public directives                                             | `src/directives/*`, `src/components/Feedback/Loading/directive.ts`, `src/components/Data/InfiniteScroll/directive.ts` | Component templates and application registration                                                                 | Reimplementing Click Outside, Intersect, Mutate, Resize, Ripple, Scroll, Tooltip, Touch, Draggable, Loading, or Infinite Scroll behavior | Eleven public directive capabilities                                                                      |
| Overlay state and close reasons                               | `src/components/Common/overlay/overlay-protocol.ts`                                                                   | Dialog, Drawer, Menu, Dropdown, Select, Cascader, Pickers, Tooltip, PopConfirm, Table filters                    | Per-component close-reason enums or competing open/closing state machines                                                                | Supported                                                                                                 |
| Overlay stack and event claiming                              | `overlay-stack.ts`, `modal-overlay-stack.ts`, `overlay-interaction-controller.ts`                                     | Modal and dismissible overlays                                                                                   | Independent z-index counters, duplicate Escape/outside listeners, multiple owners claiming one physical event                            | Layer allocation still continues in `OP-07`                                                               |
| Modal focus and scroll lock                                   | `modal-overlay-controller.ts`, `useModalOverlay.ts`, Core `useScrollLock`                                             | Dialog, Drawer, MessageBox, Loading; fullscreen owners should consume Core scroll lock                           | A second global scroll-lock registry, shallow focus traps, timers for focus return                                                       | Core beta.20 is the sole lock owner; Loading services delegate through the component's public `lock` prop |
| Anchored positioning resources                                | `anchored-overlay.ts`, `useDismissibleOverlay.ts`                                                                     | Dropdown, Autocomplete, Cascader, Pagination, PopConfirm, DatePicker, TimePicker, ColorPicker, TreeSelect, Table | Repeated viewport/scroll/resize listeners, copied placement math, direct child Shadow DOM access                                         | Container and scaled-coordinate gaps continue in `OP-07`                                                  |
| Field, Form and clear defaults                                | `src/composables/form.ts`, `field-values.ts`, Provider `config.field`                                                 | Form, FormItem, Input family, Select, Cascader, Pickers, Rate, Switch, TreeSelect                                | Parallel validation contexts, copied disabled/size inheritance, component-local Provider precedence                                      | Native form association adapter remains a planned integration                                             |
| Date service                                                  | `src/composables/date.ts` and nearest ConfigProvider date adapter                                                     | Calendar, DatePicker, DateTimePicker, TimePicker consumers                                                       | Duplicate parsing, comparison, range or locale-date arithmetic                                                                           | Component-specific range state stays component-owned                                                      |
| Scroll discovery and GoTo                                     | `scroll.ts`, `goTo.ts`, `useGoTo.ts`                                                                                  | Anchor, BackTop, Tour, DocsToc, AppBar and Scroll directive                                                      | Duplicate scroll-container discovery, easing tables, cancellation protocols                                                              | Supported                                                                                                 |
| Virtual window                                                | `src/utils/virtual-window.ts`                                                                                         | VirtualList, Table, TableV2, Tree, Transfer, Select                                                              | A second window algorithm or full-data mapping in the scroll hot path                                                                    | `src/components/Data/virtual-window.ts` is compatibility re-export only                                   |
| Service defaults                                              | `Providers/service-defaults.ts` plus each service controller                                                          | Message, Notification, Loading, MessageBox                                                                       | Provider-owned instances/timers, process-global service settings, copied queue cleanup                                                   | Calls override Provider defaults; services own resources                                                  |
| Defaults and component configuration                          | DefaultsProvider and ConfigProvider context                                                                           | All opted-in components and services                                                                             | Per-component global defaults registries or string-based prop patching                                                                   | `blueprint -> config -> explicit props` priority                                                          |
| Locale and direction                                          | LocaleProvider, `locale-context.ts`, `useLocaleProvider()`                                                            | Components, detached services, documentation shell                                                               | Hard-coded labels, a second locale registry, ignoring document locale for detached services                                              | Supported                                                                                                 |
| Theme and semantic tokens                                     | ThemeProvider and theme context                                                                                       | Components, services and documentation previews                                                                  | Cross-theme hard-coded color/elevation/motion values or copied preset state                                                              | Token schema and preset closure continue in `VU-04`                                                       |
| Icons                                                         | IconProvider and icon context                                                                                         | Icon consumers and components exposing icon props                                                                | Per-component icon maps or direct dependency on one icon vendor                                                                          | Alias resolution remains distinct from component aliases                                                  |
| Application layout coordination                               | No shared owner yet                                                                                                   | AppBar, BottomNavigation, Footer, Aside, Main                                                                    | Consumer-specific main insets or a second layout skeleton                                                                                | Missing; implement in `VU-02`                                                                             |
| Platform, display and SSR state                               | ConfigProvider display context is a partial owner; no complete platform/SSR owner yet                                 | Responsive and browser-dependent components                                                                      | Direct setup-time DOM/media reads or separate viewport registries                                                                        | Partial; close the ownership and hydration gaps in `VU-03`                                                |
| Component domain state                                        | The component's pure model/state machine and public contract                                                          | Its component and documented composition consumers                                                               | Universal base classes or a generic collection that merges unrelated semantics                                                           | Component-owned unless promoted by the three-consumer rule                                                |
| Documentation presentation                                    | Playground, PropsTable, DocsToc, OverviewCard                                                                         | All docs pages                                                                                                   | Per-page Playground shells, copied status/controls layout, page-local API table renderers                                                | Status belongs in title; previews centered; multi-variant demos use controls                              |

## Core API Inventory

These names come from the current beta.20 Core and composable documentation. `@elfui/core/internal` is compiler-only and is forbidden in authored Kit source.

- Macros: `defineHtml`, `defineProps`, `defineEmits`, `defineModel`, `defineSlots`, `defineStyle`, `defineOptions`, `defineDirective`, `defineName`, `useComponents`.
- Reactivity: `useRef`, `useReactive`, `useShallowRef`, `useShallowReactive`, `useComputed`, `useEffect`, `watch`, `onWatcherCleanup`, `batch`, `nextTick`.
- Lifecycle: `onBeforeMount`, `onMounted`, `onBeforeUpdate`, `onUpdated`, `onBeforeUnmount`, `onUnmounted`, `onActivated`, `onDeactivated`, `onAttributeChanged`, `onErrorCaptured`.
- Application/runtime: `createApp`, `registerComponents`, `resolveComponentTag`, `defineComponent`, `defineCustomElement`, `ensureCustomElement`, `useModel`, `configure`, `getConfig`, `usePlugin`.
- Context and component access: `provide`, `inject`, `hasInjectionContext`, `createInjectionKey`, `useScopedSlot`, `useAppConfig`, `useTemplateRef`, `defineExpose`, `useId`.
- Host and root: `useHost`, `useRenderRoot`, `useShadowRoot`, `useAttrs`, `useHostAttr`, `useHostFlag`, `useHostCssVar`, `useHostStyle`, `useHostClass`.
- DOM resources: `useEventListener`, `useClickOutside`, `useEscapeKey`, `useScrollLock`, `useFocusTrap`, `useResizeObserver`, `useIntersectionObserver`.
- Form controls: `useFormControlContext`, `createFormControlContext`.
- Rendering: `teleport`, `transition`, `transitionGroup`, `keepAlive`, `suspense`, `dynamicComponent`, `projectLightDom`.

## Shared Source Inventory

### Composables (9)

```text
src/composables/date.ts
src/composables/field-values.ts
src/composables/form.ts
src/composables/goTo.ts
src/composables/index.ts
src/composables/scroll.ts
src/composables/useDismissibleOverlay.ts
src/composables/useGoTo.ts
src/composables/useModalOverlay.ts
```

### Directives (11 capabilities, 8 owner files)

```text
src/directives/click-outside.ts
src/directives/controller.ts
src/directives/draggable.ts
src/directives/index.ts
src/directives/interactions.ts
src/directives/observers.ts
src/components/Data/InfiniteScroll/directive.ts
src/components/Feedback/Loading/directive.ts
```

The public capability names are Click Outside, Intersect, Mutate, Resize, Ripple, Scroll, Tooltip, Touch, Draggable, Loading and Infinite Scroll. Component-local renderer directives remain private to their component and do not become competing public behavior owners.

### Common Controllers (9)

```text
src/components/Common/focus/focus-scope.ts
src/components/Common/overlay/anchored-overlay.ts
src/components/Common/overlay/modal-overlay-controller.ts
src/components/Common/overlay/modal-overlay-stack.ts
src/components/Common/overlay/overlay-interaction-controller.ts
src/components/Common/overlay/overlay-protocol.ts
src/components/Common/overlay/positioning-context.ts
src/components/Common/overlay/overlay-stack.ts
src/components/Common/index.ts
```

### Providers (17 source files)

```text
src/components/Providers/config.ts
src/components/Providers/ConfigProvider/index.ts
src/components/Providers/context.ts
src/components/Providers/defaults.ts
src/components/Providers/DefaultsProvider/index.ts
src/components/Providers/DefaultsProvider/types.ts
src/components/Providers/IconProvider/index.ts
src/components/Providers/IconProvider/types.ts
src/components/Providers/index.ts
src/components/Providers/locale-context.ts
src/components/Providers/LocaleProvider/index.ts
src/components/Providers/LocaleProvider/types.ts
src/components/Providers/service-defaults.ts
src/components/Providers/ThemeProvider/index.ts
src/components/Providers/ThemeProvider/material-colors.ts
src/components/Providers/ThemeProvider/presets.ts
src/components/Providers/ThemeProvider/types.ts
```

## Macro Component Inventory (123)

The inventory includes public components and internal macro components that own rendering, such as service bodies and panel renderers. Test probes are excluded.

```text
src/components/Basic/Avatar/index.ts
src/components/Basic/AvatarGroup/index.ts
src/components/Basic/Badge/index.ts
src/components/Basic/Button/index.ts
src/components/Basic/Icon/index.ts
src/components/Basic/Link/index.ts
src/components/Basic/Quote/index.ts
src/components/Basic/Tag/index.ts
src/components/Basic/Text/index.ts
src/components/Common/DocsToc/index.ts
src/components/Common/OverviewCard/index.ts
src/components/Common/Playground/index.ts
src/components/Common/PropsTable/index.ts
src/components/Data/Card/index.ts
src/components/Data/Carousel/index.ts
src/components/Data/CarouselItem/index.ts
src/components/Data/Collapse/index.ts
src/components/Data/CollapseItem/index.ts
src/components/Data/Countdown/index.ts
src/components/Data/Descriptions/index.ts
src/components/Data/DescriptionsItem/index.ts
src/components/Data/Divider/index.ts
src/components/Data/Empty/index.ts
src/components/Data/Image/index.ts
src/components/Data/InfiniteScroll/index.ts
src/components/Data/List/index.ts
src/components/Data/ListItem/index.ts
src/components/Data/Pagination/index.ts
src/components/Data/Parallax/index.ts
src/components/Data/Progress/index.ts
src/components/Data/Result/index.ts
src/components/Data/Skeleton/index.ts
src/components/Data/Sparkline/index.ts
src/components/Data/Statistic/index.ts
src/components/Data/Table/index.ts
src/components/Data/TableV2/index.ts
src/components/Data/Timeline/index.ts
src/components/Data/Transfer/index.ts
src/components/Data/Tree/index.ts
src/components/Data/VirtualList/index.ts
src/components/Data/Watermark/index.ts
src/components/Feedback/Alert/index.ts
src/components/Feedback/Dialog/index.ts
src/components/Feedback/Drawer/index.ts
src/components/Feedback/Loading/index.ts
src/components/Feedback/Message/component.ts
src/components/Feedback/MessageBox/component.ts
src/components/Feedback/Notification/component.ts
src/components/Feedback/PopConfirm/index.ts
src/components/Feedback/Tooltip/index.ts
src/components/Feedback/Tour/index.ts
src/components/Form/Autocomplete/index.ts
src/components/Form/Cascader/index.ts
src/components/Form/Cascader/Panel.ts
src/components/Form/Checkbox/index.ts
src/components/Form/CheckboxGroup/index.ts
src/components/Form/Form/index.ts
src/components/Form/FormItem/index.ts
src/components/Form/Input/index.ts
src/components/Form/InputNumber/index.ts
src/components/Form/InputOtp/index.ts
src/components/Form/InputTag/index.ts
src/components/Form/Mention/index.ts
src/components/Form/Radio/index.ts
src/components/Form/RadioGroup/index.ts
src/components/Form/Rate/index.ts
src/components/Form/Segmented/index.ts
src/components/Form/Select/index.ts
src/components/Form/Slider/index.ts
src/components/Form/Switch/index.ts
src/components/Form/Textarea/index.ts
src/components/Form/TreeSelect/index.ts
src/components/Form/Upload/index.ts
src/components/Labs/CodeCard/index.ts
src/components/Labs/Heatmap/index.ts
src/components/Labs/Video/index.ts
src/components/Layout/Aside/index.ts
src/components/Layout/Container/index.ts
src/components/Layout/Flex/index.ts
src/components/Layout/Footer/index.ts
src/components/Layout/Grid/index.ts
src/components/Layout/GridItem/index.ts
src/components/Layout/Header/index.ts
src/components/Layout/Layout/index.ts
src/components/Layout/Main/index.ts
src/components/Layout/Masonry/index.ts
src/components/Layout/Scrollbar/index.ts
src/components/Layout/Space/index.ts
src/components/Layout/Spacer/index.ts
src/components/Layout/Splitter/index.ts
src/components/Layout/Splitter/panel.ts
src/components/Layout/Sticky/index.ts
src/components/Layout/Toolbar/index.ts
src/components/Navigation/Anchor/index.ts
src/components/Navigation/AnchorLink/index.ts
src/components/Navigation/AppBar/index.ts
src/components/Navigation/BackTop/index.ts
src/components/Navigation/BottomNavigation/index.ts
src/components/Navigation/Breadcrumb/index.ts
src/components/Navigation/BreadcrumbItem/index.ts
src/components/Navigation/Dropdown/index.ts
src/components/Navigation/DropdownItem/index.ts
src/components/Navigation/DropdownMenu/index.ts
src/components/Navigation/Menu/index.ts
src/components/Navigation/MenuItem/index.ts
src/components/Navigation/MenuItemGroup/index.ts
src/components/Navigation/PageHeader/index.ts
src/components/Navigation/Step/index.ts
src/components/Navigation/Steps/index.ts
src/components/Navigation/SubMenu/index.ts
src/components/Navigation/TabPane/index.ts
src/components/Navigation/Tabs/index.ts
src/components/Picker/Calendar/index.ts
src/components/Picker/ColorPicker/index.ts
src/components/Picker/DatePicker/index.ts
src/components/Picker/DateTimePicker/index.ts
src/components/Picker/TimePicker/index.ts
src/components/Picker/TimeSelect/index.ts
src/components/Providers/ConfigProvider/index.ts
src/components/Providers/DefaultsProvider/index.ts
src/components/Providers/IconProvider/index.ts
src/components/Providers/LocaleProvider/index.ts
src/components/Providers/ThemeProvider/index.ts
```

## Detailed Protocol Sources

- Overlay lifecycle, focus and positioning: `docs/architecture/2026-07-29-overlay-lifecycle-focus-and-positioning-protocol.md`.
- Collection and virtual window boundaries: `docs/architecture/2026-07-29-collection-and-virtual-window-boundaries.md`.
- Field empty and clear defaults: `docs/architecture/2026-07-29-field-empty-and-clear-defaults.md`.
- Core composable adoption history: `docs/architecture/2026-07-29-core-composable-adoption-matrix.md`; its beta.15 gap notes are historical, while this inventory records beta.20 ownership.
- Layering, state ownership, pattern admission and known migration violations: `docs/architecture/2026-07-31-layering-and-state-ownership.md`.
