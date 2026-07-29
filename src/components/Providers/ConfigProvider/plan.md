# ConfigProvider Plan

## Contract

- [x] Merge `blueprint`, inherited configuration, local `config`, and shortcut props with stable precedence.
- [x] Coordinate theme, locale, icons, component defaults, display, motion, scrolling, date behavior, field values, and service defaults.
- [x] Keep strategy objects such as date and locale adapters atomic during nested configuration merges.
- [x] Reflect locale, direction, breakpoint, mobile state, and motion preference on the host.
- [x] Preserve focused Providers as composable lower-level entry points.

## Documentation and verification

- [x] Publish a complete `ElfUIConfig` API table instead of documenting only the Provider wrapper props.
- [x] Demonstrate global `emptyValues` and `valueOnClear` behavior with local override precedence.
- [x] Cover nested configuration, Provider propagation, responsive state, locale adapters, and strategy replacement with focused tests.
- [ ] Add application-layout coordination after its ownership and registration protocol is stable.
- [ ] Add typed component aliases only after the framework exposes an application-scoped resolver contract.
