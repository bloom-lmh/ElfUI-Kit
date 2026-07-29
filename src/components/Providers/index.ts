// Providers
import { registerComponents } from "@elfui/core";

import { DefaultsProvider } from "./DefaultsProvider/index";
import { ConfigProvider } from "./ConfigProvider/index";
import { IconProvider } from "./IconProvider/index";
import { LocaleProvider } from "./LocaleProvider/index";
import { ThemeProvider } from "./ThemeProvider/index";

export * from "./context";
export * from "./config";
export * from "./service-defaults";
export { ConfigProvider } from "./ConfigProvider/index";
export type { ConfigProviderProps } from "./ConfigProvider/index";
export { DefaultsProvider } from "./DefaultsProvider/index";
export type { DefaultsProviderProps } from "./DefaultsProvider/types";
export { IconProvider } from "./IconProvider/index";
export type { IconProviderProps } from "./IconProvider/types";
export { LocaleProvider } from "./LocaleProvider/index";
export type { LocaleAdapter, LocaleProviderProps } from "./LocaleProvider/types";
export { ThemeProvider } from "./ThemeProvider/index";
export type { ThemeDefinition, ThemeProviderProps } from "./ThemeProvider/types";

registerComponents(
  ConfigProvider,
  DefaultsProvider,
  IconProvider,
  LocaleProvider,
  ThemeProvider,
);
