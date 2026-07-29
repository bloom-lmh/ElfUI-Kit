# Documentation locale coverage baseline

Date: 2026-07-29

Command:

```text
pnpm docs:locale-audit
```

## Repository coverage

| Surface | Localized | Total | Missing |
| --- | ---: | ---: | ---: |
| Page entries | 48 | 86 | 38 |
| Examples | 185 | 337 | 152 |
| Props/API files | 31 | 64 | 33 |
| Total | 264 | 487 | 223 |

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
- `/providers/config`
- `/providers/defaults`
- `/providers/locale`
- `/providers/theme`

For each route, English mode returned no Han text in visible content or localized attributes. The language switch command `中文` is the only intentional exception. VirtualTable additionally has a focused test covering English headers, runtime status/data, pinned rows, and Template / Script source. Provider page tests cover all DefaultsProvider, LocaleProvider, and ThemeProvider examples plus the ConfigProvider Chinese and English paths. Message and Notification were scanned with detached service overlays open, including action content, four screen corners, rich DOM content, and close-button accessible names. Dialog and Drawer were scanned with their modal content open; focus entry, localized close labels, Escape closing, and keyboard resizing from 420px to 430px were verified. Loading was scanned with controlled local and declarative fullscreen overlays active; its exit action, Material / Midnight themes, 1440px desktop viewport, and 390px mobile viewport were verified. PopConfirm was scanned through basic confirmation, async failure and retry, and custom actions; Material / Midnight themes and 1440px desktop / 390px mobile viewports were captured. Its focused page result is 1 file / 4 tests, and the clean beta.20 Playwright CLI session produced 0 warnings and 0 errors.

## Remaining gate

Repository participation is not complete while `missing > 0`. Each batch must update its page entry, every example, Props/API data, runtime status, source snippets, tests, and browser scan together.
