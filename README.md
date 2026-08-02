# ELFUI-KIT

ELFUI-KIT is a Web Components library built on ElfUI. Components register as Custom Elements and work with native HTML or any framework.

## Monorepo

- `packages/kit` contains the publishable `@elfui/kit` package.
- `apps/website` contains the private documentation website deployed to Vercel.
- `docs` retains architecture records, implementation plans, maintenance handoff notes, and visual evidence.

The website is never included in the npm package.

## Install

```bash
npm install @elfui/kit@beta
```

## Use

Import the package once at the application entry to register all `elf-*` elements:

```ts
import "@elfui/kit";
```

```html
<elf-button color="primary">Create project</elf-button>
<elf-input label="Project name" variant="outlined"></elf-input>
```

Optional layout and typography utilities are published separately:

```ts
import "@elfui/kit/styles/utilities.css";
```

ELFUI-KIT includes TypeScript declarations for its Custom Elements, component services, Providers, form composables, and utility APIs.

## Requirements

- Modern browsers with Custom Elements and Shadow DOM support.
- `@elfui/core` is the single direct ElfUI runtime dependency. Internal runtime and reactivity packages are resolved transitively; applications do not install or import them directly.

## License

MIT
