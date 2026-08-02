# @elfui/kit

ElfUI component library built with native Web Components and Material Design tokens.

## Install

```bash
npm install @elfui/kit
```

Or with pnpm:

```bash
pnpm add @elfui/kit
```

## Use

Import the Kit once at your application entry. This registers every `elf-*`
component as a Custom Element.

```ts
import "@elfui/kit";
```

```html
<elf-button color="primary">Create project</elf-button>
<elf-input label="Project name" variant="outlined"></elf-input>
```

Optional layout and typography utilities:

```ts
import "@elfui/kit/styles/utilities.css";
```

Labs components such as CodeCard, Video, and Heatmap use a separate entry:

```ts
import "@elfui/kit/labs";
```

## Requirements

- Modern evergreen browsers with Custom Elements and Shadow DOM support.
- Safari 16.4 or later as the minimum verified target.
- `@elfui/core` is installed automatically as a dependency.

## License

MIT
