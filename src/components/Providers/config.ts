import { createInjectionKey, inject } from "@elfui/core";

import type { IconOptions } from "../Basic/Icon/types";
import type { ProviderDefaults, DefaultsStrategy } from "./context";
import type { LocaleDirection, LocaleMessages } from "./context";
import type { IconProviderProps } from "./IconProvider/types";
import type { LocaleProviderProps } from "./LocaleProvider/types";
import type {
  ThemeDefinition,
  ThemeProviderProps,
  ThemeProviderTheme,
} from "./ThemeProvider/types";

export type DisplayBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface DisplayThresholds {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface DisplayProviderOptions {
  mobileBreakpoint?: number | DisplayBreakpoint;
  thresholds?: Partial<DisplayThresholds>;
  ssr?: {
    clientWidth: number;
    clientHeight?: number;
  };
}

export type MotionPreference = "system" | "full" | "reduced";

export interface ElfUIDefaultsOptions {
  values?: ProviderDefaults;
  strategy?: DefaultsStrategy;
  deep?: boolean;
  disabled?: boolean;
  reset?: boolean;
}

export type ElfUIThemeOptions = Partial<ThemeProviderProps> & {
  theme?: ThemeProviderTheme;
  themes?: Record<string, ThemeDefinition>;
};

export type ElfUILocaleOptions = Partial<LocaleProviderProps> & {
  name?: string;
  dir?: LocaleDirection;
  rtl?: boolean;
  messages?: LocaleMessages;
  timeZone?: string;
};

export type ElfUIIconOptions = Partial<IconProviderProps> & IconOptions;

export interface ElfUIConfig {
  defaults?: ProviderDefaults;
  defaultsOptions?: Omit<ElfUIDefaultsOptions, "values">;
  theme?: ElfUIThemeOptions;
  locale?: ElfUILocaleOptions;
  icons?: ElfUIIconOptions;
  display?: DisplayProviderOptions;
  motion?: MotionPreference;
}

export interface DisplayProviderContext {
  readonly width: number;
  readonly height: number;
  readonly name: DisplayBreakpoint;
  readonly mobile: boolean;
  readonly thresholds: DisplayThresholds;
  readonly prefersReducedMotion: boolean;
  is(name: DisplayBreakpoint): boolean;
  up(name: DisplayBreakpoint): boolean;
  down(name: DisplayBreakpoint): boolean;
  update(): void;
}

export interface ConfigProviderContext {
  readonly config: ElfUIConfig;
  readonly display: DisplayProviderContext;
  readonly reducedMotion: boolean;
}

export const DEFAULT_DISPLAY_THRESHOLDS: DisplayThresholds = {
  xs: 0,
  sm: 600,
  md: 840,
  lg: 1145,
  xl: 1545,
  xxl: 2138,
};

export const DEFAULT_DISPLAY_OPTIONS: Required<
  Pick<DisplayProviderOptions, "mobileBreakpoint" | "thresholds">
> = {
  mobileBreakpoint: "lg",
  thresholds: DEFAULT_DISPLAY_THRESHOLDS,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (Object.getPrototypeOf(value) === Object.prototype ||
        Object.getPrototypeOf(value) === null),
  );

const mergeValue = (left: unknown, right: unknown): unknown => {
  if (!isRecord(left) || !isRecord(right)) return right;

  const output: Record<string, unknown> = { ...left };
  for (const [key, value] of Object.entries(right)) {
    output[key] = key in output ? mergeValue(output[key], value) : value;
  }
  return output;
};

export const defineElfUIConfig = <T extends ElfUIConfig>(config: T): T => config;

export const mergeElfUIConfig = (...sources: unknown[]): ElfUIConfig =>
  sources.reduce<ElfUIConfig>(
    (output, source) => mergeValue(output, source) as ElfUIConfig,
    {},
  );

export const CONFIG_PROVIDER_KEY =
  createInjectionKey<ConfigProviderContext>("elfui.config-provider");

const DEFAULT_DISPLAY_CONTEXT: DisplayProviderContext = {
  width: 0,
  height: 0,
  name: "xs",
  mobile: true,
  thresholds: DEFAULT_DISPLAY_THRESHOLDS,
  prefersReducedMotion: false,
  is: () => false,
  up: (name) => name === "xs",
  down: (name) => name !== "xs",
  update: () => undefined,
};

export const DEFAULT_CONFIG_CONTEXT: ConfigProviderContext = {
  config: {},
  display: DEFAULT_DISPLAY_CONTEXT,
  reducedMotion: false,
};

export const useConfigProvider = (): ConfigProviderContext =>
  inject(CONFIG_PROVIDER_KEY, DEFAULT_CONFIG_CONTEXT) ?? DEFAULT_CONFIG_CONTEXT;

export const useDisplayProvider = (): DisplayProviderContext =>
  useConfigProvider().display;
