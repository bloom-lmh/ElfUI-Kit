# Documentation locale coverage baseline

Date: 2026-07-29

Command:

```text
pnpm docs:locale-audit
```

## 2026-07-31 current coverage

| Surface         | Localized | Total | Missing |
| --------------- | --------: | ----: | ------: |
| Page entries    |       109 |   109 |       0 |
| Examples        |       356 |   356 |       0 |
| Props/API files |        70 |    70 |       0 |
| Total           |       535 |   535 |       0 |

This update was captured after the Table EP-11 page-family batch. Explicit helper participation is complete for the current audit inventory. This does not replace strict visible-text, attribute, source, layout, interaction, and screenshot review for every route.

## 2026-07-29 repository coverage

| Surface         | Localized | Total | Missing |
| --------------- | --------: | ----: | ------: |
| Page entries    |        85 |    89 |       4 |
| Examples        |       305 |   350 |      45 |
| Props/API files |        65 |    67 |       2 |
| Total           |       455 |   506 |      51 |

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
- `/form/upload`
- `/data/table`

For each route, English mode returned no Han text in visible content or localized attributes. The language switch command `中文` is the only intentional exception. VirtualTable additionally has a focused test covering English headers, runtime status/data, pinned rows, and Template / Script source. Provider page tests cover all DefaultsProvider, LocaleProvider, and ThemeProvider examples plus the ConfigProvider Chinese and English paths. Message and Notification were scanned with detached service overlays open, including action content, four screen corners, rich DOM content, and close-button accessible names. Dialog and Drawer were scanned with their modal content open; focus entry, localized close labels, Escape closing, and keyboard resizing from 420px to 430px were verified. Loading was scanned with controlled local and declarative fullscreen overlays active; its exit action, Material / Midnight themes, 1440px desktop viewport, and 390px mobile viewport were verified. PopConfirm was scanned through basic confirmation, async failure and retry, and custom actions. Tooltip was scanned through focus, click, and context-menu triggers; Escape removed the tooltip while preserving focus, and the touch long-press contract was covered by its focused test. Tour was scanned with the overlay open, ArrowRight navigation, Escape closing, and dynamic-target removal fallback; its focused page test covers Chinese, strict English, and target removal. All three routes were captured in Material / Midnight themes at 1440px desktop and 390px mobile viewports. The focused Tooltip and PopConfirm page results are 1 file / 4 tests each; Tour is 1 file / 3 tests. Their clean beta.20 Playwright CLI sessions produced 0 warnings and 0 errors.

Upload covers 9 Playgrounds, 9 shared centered stages, 9 title-row live statuses, bilingual runnable Template/Script, and current Props/Events/Slots/Methods tables. Its final Chromium matrix used 1440x1000 and 390x844 with Material/Midnight and Chinese/English coverage; the English Shadow DOM scan found no unexpected Han text, the mobile page had no horizontal overflow, and the final session produced 0 warnings and 0 errors.

Table covers 22 Playgrounds, 22 shared centered stages, 12 direct title-row live statuses, bilingual runnable Template/Script, and current Props/Column/Events/Slots/Methods tables. Its Chromium matrix used 1440x1000 and 390x844 across Material/Midnight and Chinese/English; the English visible-text and localized-attribute scan found no unexpected Han text, both viewports had no page-level horizontal overflow, and the final session produced 0 warnings and 0 errors. Table Shadow DOM controls did not change state under this browser automation session despite passing focused interaction tests, so browser interaction completion remains open and is not implied by this strict localization entry.

Container covers the page entry, both example files, runtime copy, Template / Script, Props, Slots, and a focused Chinese / strict-English test (1 file / 2 tests). Its page class was mounted under the running application's existing provider tree for Material / Midnight and 1440px / 390px browser verification, producing no untranslated English-mode text, warnings, or errors. The current `/layout/container` route still loads `GridPage`; this route ownership issue is recorded for Thread A and was not worked around in page source.

LayoutShell covers eight distinct application structures, including localized semantic region labels in both the live diagrams and Template source, plus complete Props and Slots descriptions. Its focused page suite passes 1 file / 4 tests, and the formal route passed strict English Shadow DOM scanning plus Material / Midnight desktop and mobile visual checks with 0 warnings and 0 errors.

Masonry localizes all seven card titles and metadata values, status copy, Script data, Props, and Slots. Its focused page suite passes 1 file / 3 tests, and the formal route passed strict English Shadow DOM scanning with 0 warnings and 0 errors.

## Thread B locale sweep

Thread B completed its assigned localization surface: the remaining Feedback pages; Container, LayoutShell, Masonry, Scrollbar, Splitter, and Sticky; Accessibility, BuildStyles, Utilities, Home, and the remaining Basic API copy; the safe Data and Navigation pages; and the assigned Form pages. Each page now participates in the shared docs translator across its entry, examples, runtime state, Template / Script source, and API tables, with focused Chinese and strict-English page tests.

Per the maintainer's final verification direction, this sweep did not add another screenshot batch. The 51 audit entries still missing are exclusively owned by Thread A: Table, Upload, Tabs, Calendar, DatePicker, and TimePicker.

## Remaining gate

Repository-wide helper participation is complete for the current `535`-file inventory. The remaining gate is strict per-route verification and enforcement: visible text, localized attributes, Template/Script, layout, interactions, themes, desktop/mobile screenshots, and clean console output must still be recorded route by route.
