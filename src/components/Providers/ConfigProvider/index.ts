import {
  defineHtml,
  defineProps,
  defineStyle,
  onMounted,
  provide,
  useComponents,
  useEffect,
  useHost,
  useRef,
} from "@elfui/core";

import { DefaultsProvider } from "../DefaultsProvider/index";
import { IconProvider } from "../IconProvider/index";
import { LocaleProvider } from "../LocaleProvider/index";
import { ThemeProvider } from "../ThemeProvider/index";
import {
  CONFIG_PROVIDER_KEY,
  DEFAULT_DISPLAY_OPTIONS,
  DEFAULT_DISPLAY_THRESHOLDS,
  type ConfigProviderContext,
  type DisplayBreakpoint,
  type DisplayProviderContext,
  type DisplayProviderOptions,
  type ElfUIConfig,
  mergeElfUIConfig,
  useConfigProvider,
} from "../config";
import styles from "./style.scss?inline";

export type {
  ConfigProviderContext,
  DisplayBreakpoint,
  DisplayProviderContext,
  DisplayProviderOptions,
  ElfUIConfig,
  ElfUIDefaultsOptions,
  ElfUIIconOptions,
  ElfUILocaleOptions,
  ElfUIThemeOptions,
  MotionPreference,
} from "../config";

export interface ConfigProviderProps {
  config: ElfUIConfig;
  blueprint: ElfUIConfig;
  inherit: boolean;
  theme: string;
  locale: string;
  motion: string;
}

const props = defineProps<ConfigProviderProps>({
  config: { type: Object, default: () => ({}) },
  blueprint: { type: Object, default: () => ({}) },
  inherit: { type: Boolean, default: true },
  theme: { type: String, default: "" },
  locale: { type: String, default: "" },
  motion: { type: String, default: "" },
});

const host = useHost();
const parent = useConfigProvider();
const viewportWidth = useRef(0);
const viewportHeight = useRef(0);
const systemReducedMotion = useRef(false);

useComponents({
  "elf-defaults-provider": DefaultsProvider,
  "elf-icon-provider": IconProvider,
  "elf-locale-provider": LocaleProvider,
  "elf-theme-provider": ThemeProvider,
});

const readConfig = (): ElfUIConfig =>
  mergeElfUIConfig(
    props.inherit ? parent.config : {},
    props.blueprint,
    props.config,
    props.theme ? { theme: { theme: props.theme } } : {},
    props.locale ? { locale: { name: props.locale } } : {},
    props.motion ? { motion: props.motion } : {},
  );

const readDisplayOptions = (): DisplayProviderOptions => {
  const configured = readConfig().display ?? {};
  return {
    ...DEFAULT_DISPLAY_OPTIONS,
    ...configured,
    thresholds: {
      ...DEFAULT_DISPLAY_THRESHOLDS,
      ...(configured.thresholds ?? {}),
    },
  };
};

const displayName = (): DisplayBreakpoint => {
  const width = viewportWidth.value;
  const thresholds = readDisplayOptions().thresholds as Record<DisplayBreakpoint, number>;
  if (width < thresholds.sm) return "xs";
  if (width < thresholds.md) return "sm";
  if (width < thresholds.lg) return "md";
  if (width < thresholds.xl) return "lg";
  if (width < thresholds.xxl) return "xl";
  return "xxl";
};

const breakpointRank = (name: DisplayBreakpoint): number =>
  ["xs", "sm", "md", "lg", "xl", "xxl"].indexOf(name);

const isMobile = (): boolean => {
  const { mobileBreakpoint, thresholds } = readDisplayOptions();
  const breakpoint = (
    typeof mobileBreakpoint === "number" ? "lg" : mobileBreakpoint ?? "lg"
  ) as DisplayBreakpoint;
  const limit =
    typeof mobileBreakpoint === "number"
      ? mobileBreakpoint
      : (thresholds as Record<DisplayBreakpoint, number>)[breakpoint];
  return viewportWidth.value < limit;
};

const updateDisplay = (): void => {
  if (typeof window === "undefined") {
    const ssr = readDisplayOptions().ssr;
    viewportWidth.set(ssr?.clientWidth ?? 0);
    viewportHeight.set(ssr?.clientHeight ?? 0);
    return;
  }
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
};

const reducedMotion = (): boolean => {
  const preference = readConfig().motion ?? "system";
  return preference === "reduced" ||
    (preference === "system" && systemReducedMotion.value);
};

const display: DisplayProviderContext = {
  get width() {
    return viewportWidth.value;
  },
  get height() {
    return viewportHeight.value;
  },
  get name() {
    return displayName();
  },
  get mobile() {
    return isMobile();
  },
  get thresholds() {
    return readDisplayOptions().thresholds as typeof DEFAULT_DISPLAY_THRESHOLDS;
  },
  get prefersReducedMotion() {
    return reducedMotion();
  },
  is(name) {
    return displayName() === name;
  },
  up(name) {
    return breakpointRank(displayName()) >= breakpointRank(name);
  },
  down(name) {
    return breakpointRank(displayName()) <= breakpointRank(name);
  },
  update: updateDisplay,
};

const context: ConfigProviderContext = {
  get config() {
    return readConfig();
  },
  display,
  get reducedMotion() {
    return reducedMotion();
  },
};

const defaultsOptions = () => {
  const config = readConfig();
  return {
    ...(config.defaultsOptions ?? {}),
    defaults: config.defaults ?? {},
  };
};

const localeOptions = () => ({
  ...(readConfig().locale ?? {}),
});

const themeOptions = () => ({
  ...(readConfig().theme ?? {}),
  inherit: props.inherit,
  theme: readConfig().theme?.theme ?? "light",
});

const iconOptions = () => ({
  ...(readConfig().icons ?? {}),
  inherit: props.inherit,
});

const motionData = (): "full" | "reduced" => (reducedMotion() ? "reduced" : "full");

provide(CONFIG_PROVIDER_KEY, context);

onMounted(() => {
  updateDisplay();

  const cleanups: Array<() => void> = [];
  if (typeof window !== "undefined") {
    const onResize = (): void => updateDisplay();
    window.addEventListener("resize", onResize, { passive: true });
    cleanups.push(() => window.removeEventListener("resize", onResize));

    if (typeof window.matchMedia === "function") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const syncReducedMotion = (): void => systemReducedMotion.set(media.matches);
      syncReducedMotion();
      media.addEventListener?.("change", syncReducedMotion);
      cleanups.push(() => media.removeEventListener?.("change", syncReducedMotion));
    }
  }

  return () => cleanups.forEach((cleanup) => cleanup());
});

useEffect(() => {
  display.width;
  display.height;
  display.name;
  display.mobile;
  display.prefersReducedMotion;
  host.setAttribute("data-breakpoint", display.name);
  host.setAttribute("data-mobile", display.mobile ? "true" : "false");
  host.setAttribute("data-motion", motionData());
});

defineStyle(styles);

const ConfigProvider = defineHtml<ConfigProviderProps>(`
  <elf-locale-provider
    :name=${localeOptions().name || "zh-CN"}
    :dir=${localeOptions().dir || "ltr"}
    :rtl=${Boolean(localeOptions().rtl)}
    :messages.prop=${localeOptions().messages || {}}
    :timeZone=${localeOptions().timeZone || ""}
  >
    <elf-theme-provider
      :theme=${themeOptions().theme}
      :themes.prop=${themeOptions().themes || {}}
      :tokens.prop=${themeOptions().tokens || {}}
      :primary=${themeOptions().primary || ""}
      :secondary=${themeOptions().secondary || ""}
      :success=${themeOptions().success || ""}
      :warning=${themeOptions().warning || ""}
      :danger=${themeOptions().danger || ""}
      :info=${themeOptions().info || ""}
      :background=${themeOptions().background || ""}
      :surface=${themeOptions().surface || ""}
      :textColor=${themeOptions().textColor || ""}
      :inherit=${themeOptions().inherit}
    >
      <elf-icon-provider :options.prop=${iconOptions()}>
        <elf-defaults-provider
          :defaults.prop=${defaultsOptions().defaults}
          :strategy=${defaultsOptions().strategy || "missing"}
          :deep=${defaultsOptions().deep !== false}
          :disabled=${Boolean(defaultsOptions().disabled)}
          :reset=${Boolean(defaultsOptions().reset)}
        >
          <slot></slot>
        </elf-defaults-provider>
      </elf-icon-provider>
    </elf-theme-provider>
  </elf-locale-provider>
`);

export { ConfigProvider };
