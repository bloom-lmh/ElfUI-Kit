# Documentation locale coverage baseline

Date: 2026-07-29

Command:

```text
pnpm docs:locale-audit
```

## Repository coverage

| Surface | Localized | Total | Missing |
| --- | ---: | ---: | ---: |
| Page entries | 51 | 87 | 36 |
| Examples | 198 | 342 | 144 |
| Props/API files | 34 | 65 | 31 |
| Total | 283 | 494 | 211 |

The audit counts explicit `createDocsTranslator()` / `createDocsPicker()` participation. It does not treat component names, API identifiers, CSS values, or source code syntax as untranslated prose.

## Strictly verified routes

The following routes were switched in the running application and recursively scanned through open Shadow DOM:

- `/data/virtual-table`
- `/layout/grid`
- `/layout/flex`
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

## Remaining gate

Repository participation is not complete while `missing > 0`. Each batch must update its page entry, every example, Props/API data, runtime status, source snippets, tests, and browser scan together.
