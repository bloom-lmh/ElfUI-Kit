# Documentation locale coverage baseline

Date: 2026-07-29

Command:

```text
pnpm docs:locale-audit
```

## Repository coverage

| Surface | Localized | Total | Missing |
| --- | ---: | ---: | ---: |
| Page entries | 45 | 85 | 40 |
| Examples | 169 | 332 | 163 |
| Props/API files | 28 | 63 | 35 |
| Total | 242 | 480 | 238 |

The audit counts explicit `createDocsTranslator()` / `createDocsPicker()` participation. It does not treat component names, API identifiers, CSS values, or source code syntax as untranslated prose.

## Strictly verified routes

The following routes were switched in the running application and recursively scanned through open Shadow DOM:

- `/data/virtual-table`
- `/layout/grid`
- `/layout/flex`
- `/feedback/alert`
- `/feedback/dialog`
- `/feedback/drawer`
- `/feedback/message`
- `/feedback/notification`
- `/providers/config`
- `/providers/defaults`
- `/providers/locale`
- `/providers/theme`

For each route, English mode returned no Han text in visible content or localized attributes. The language switch command `中文` is the only intentional exception. VirtualTable additionally has a focused test covering English headers, runtime status/data, pinned rows, and Template / Script source. Provider page tests cover all DefaultsProvider, LocaleProvider, and ThemeProvider examples plus the ConfigProvider Chinese and English paths. Message and Notification were scanned with detached service overlays open, including action content, four screen corners, rich DOM content, and close-button accessible names. Dialog and Drawer were scanned with their modal content open; focus entry, localized close labels, Escape closing, and keyboard resizing from 420px to 430px were verified. The latest Dialog / Drawer focused result is 4 files / 44 tests, and the clean beta.20 Playwright CLI session produced 0 warnings and 0 errors.

## Remaining gate

Repository participation is not complete while `missing > 0`. Each batch must update its page entry, every example, Props/API data, runtime status, source snippets, tests, and browser scan together.
