# Documentation locale coverage baseline

Date: 2026-07-29

Command:

```text
pnpm docs:locale-audit
```

## Repository coverage

| Surface | Localized | Total | Missing |
| --- | ---: | ---: | ---: |
| Page entries | 84 | 88 | 4 |
| Examples | 301 | 346 | 45 |
| Props/API files | 64 | 66 | 2 |
| Total | 449 | 500 | 51 |

The audit counts explicit `createDocsTranslator()` / `createDocsPicker()` participation. It does not treat component names, API identifiers, CSS values, or source code syntax as untranslated prose.

## Strictly verified routes

The following routes were switched in the running application and recursively scanned through open Shadow DOM:

- `/data/virtual-table`
- `/layout/container`
- `/layout/grid`
- `/layout/flex`
- `/layout/shell`
- `/layout/masonry`
- `/feedback/alert`
- `/feedback/dialog`
- `/feedback/drawer`
- `/feedback/loading`
- `/feedback/message`
- `/feedback/notification`
- `/feedback/pop-confirm`
- `/feedback/tooltip`
- `/feedback/tour`
- `/providers/config`
- `/providers/defaults`
- `/providers/locale`
- `/providers/theme`

For each route, English mode returned no Han text in visible content or localized attributes. The language switch command `中文` is the only intentional exception. VirtualTable additionally has a focused test covering English headers, runtime status/data, pinned rows, and Template / Script source. Provider page tests cover all DefaultsProvider, LocaleProvider, and ThemeProvider examples plus the ConfigProvider Chinese and English paths. Message and Notification were scanned with detached service overlays open, including action content, four screen corners, rich DOM content, and close-button accessible names. Dialog and Drawer were scanned with their modal content open; focus entry, localized close labels, Escape closing, and keyboard resizing from 420px to 430px were verified. Loading was scanned with controlled local and declarative fullscreen overlays active; its exit action, Material / Midnight themes, 1440px desktop viewport, and 390px mobile viewport were verified. PopConfirm was scanned through basic confirmation, async failure and retry, and custom actions. Tooltip was scanned through focus, click, and context-menu triggers; Escape removed the tooltip while preserving focus, and the touch long-press contract was covered by its focused test. Tour was scanned with the overlay open, ArrowRight navigation, Escape closing, and dynamic-target removal fallback; its focused page test covers Chinese, strict English, and target removal. All three routes were captured in Material / Midnight themes at 1440px desktop and 390px mobile viewports. The focused Tooltip and PopConfirm page results are 1 file / 4 tests each; Tour is 1 file / 3 tests. Their clean beta.20 Playwright CLI sessions produced 0 warnings and 0 errors.

Container covers the page entry, both example files, runtime copy, Template / Script, Props, Slots, and a focused Chinese / strict-English test (1 file / 2 tests). Its page class was mounted under the running application's existing provider tree for Material / Midnight and 1440px / 390px browser verification, producing no untranslated English-mode text, warnings, or errors. The current `/layout/container` route still loads `GridPage`; this route ownership issue is recorded for Thread A and was not worked around in page source.

LayoutShell covers eight distinct application structures, including localized semantic region labels in both the live diagrams and Template source, plus complete Props and Slots descriptions. Its focused page suite passes 1 file / 4 tests, and the formal route passed strict English Shadow DOM scanning plus Material / Midnight desktop and mobile visual checks with 0 warnings and 0 errors.

Masonry localizes all seven card titles and metadata values, status copy, Script data, Props, and Slots. Its focused page suite passes 1 file / 3 tests, and the formal route passed strict English Shadow DOM scanning with 0 warnings and 0 errors.

## Thread B locale sweep

Thread B completed its assigned localization surface: the remaining Feedback pages; Container, LayoutShell, Masonry, Scrollbar, Splitter, and Sticky; Accessibility, BuildStyles, Utilities, Home, and the remaining Basic API copy; the safe Data and Navigation pages; and the assigned Form pages. Each page now participates in the shared docs translator across its entry, examples, runtime state, Template / Script source, and API tables, with focused Chinese and strict-English page tests.

Per the maintainer's final verification direction, this sweep did not add another screenshot batch. The 51 audit entries still missing are exclusively owned by Thread A: Table, Upload, Tabs, Calendar, DatePicker, and TimePicker.

## Remaining gate

Thread B's assigned surface is complete. Repository-wide participation remains incomplete while `missing > 0`; the remaining Thread A batches must update their page entry, every example, Props/API data, runtime status, source snippets, and tests together.
