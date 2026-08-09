# @elfui/kit

ElfUI component library built with native Custom Elements, Shadow DOM, and Material tokens.

## Install

```bash
pnpm add @elfui/kit
```

## Use

Every component and public type is exported from one entry. Importing a constructor does not register it.

```ts
import { registerComponents } from "@elfui/core";
import { Button, Input } from "@elfui/kit";

registerComponents(Button, Input);
```

Register the complete stable, AI, and Labs set when bundle size is not a concern:

```ts
import { registerAllComponents } from "@elfui/kit";

registerAllComponents();
```

```html
<elf-button color="primary">Create project</elf-button>
<elf-input label="Project name" variant="outlined"></elf-input>
```

Component styles stay inside their Shadow DOM. Customize them with ConfigProvider tokens, CSS custom properties, Core `theme()`, and documented `::part()` names. Derive a real custom tag with Core `useVariant()`.

## Requirements

- Modern evergreen browsers with Custom Elements and Shadow DOM support.
- Safari 16.4 or later as the minimum verified target.
- Install compatible `@elfui/core` explicitly when using its authoring or registration APIs.

## License

MIT
