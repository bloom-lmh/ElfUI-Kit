# ELFUI-KIT

ELFUI-KIT is a Web Components library built on ElfUI. Components work with native HTML and framework applications through standard Custom Elements.

## Workspace

- `packages/kit` contains the publishable `@elfui/kit` package.
- `apps/website` contains the private documentation website deployed to Vercel.
- `docs/NEXT_GENERATION_PLAN.md` is the single active implementation plan.

## Install

```bash
pnpm add @elfui/kit
```

## Use

```ts
import { registerAllComponents } from "@elfui/kit";

registerAllComponents();
```

For an on-demand build, import constructors from the same root and register them with ElfUI Core:

```ts
import { registerComponents } from "@elfui/core";
import { Button, Input } from "@elfui/kit";

registerComponents(Button, Input);
```

Component styles are bundled with their Shadow DOM definitions; no separate stylesheet is required.

## License

MIT
