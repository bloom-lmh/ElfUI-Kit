// Providers
import { registerComponents } from "@elfui/core";

import { DefaultsProvider } from "./DefaultsProvider/index";
import { IconProvider } from "./IconProvider/index";
import { LocaleProvider } from "./LocaleProvider/index";
import { ThemeProvider } from "./ThemeProvider/index";

export * from "./context";
export { IconProvider } from "./IconProvider/index";
export type { IconProviderProps } from "./IconProvider/types";

registerComponents(DefaultsProvider, IconProvider, LocaleProvider, ThemeProvider);
