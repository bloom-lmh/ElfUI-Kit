// elf-locale-provider — 为子树提供本地化文案与方向

import {
  defineHtml,
  defineProps,
  defineStyle,
  provide,
  useEffect,
  useHost,
} from "@elfui/core";

import { LOCALE_PROVIDER_KEY, type LocaleDirection } from "../context";
import { createLocaleContext } from "../locale-context";
import styles from "./style.scss?inline";
import type { LocaleProviderProps } from "./types";

export type {
  LocaleAdapter,
  LocaleDirection,
  LocaleMessages,
  LocaleProviderProps,
} from "./types";

const props = defineProps<LocaleProviderProps>({
  name: { type: String, default: "zh-CN" },
  dir: { type: String, default: "ltr" },
  rtl: { type: Boolean, default: false },
  messages: { type: Object, default: () => ({}) },
  timeZone: { type: String, default: "" },
  adapter: { type: Object, default: undefined },
});

const host = useHost();

const readDir = (): LocaleDirection => {
  if (props.rtl) return "rtl";
  return props.dir === "rtl" ? "rtl" : "ltr";
};
const context = createLocaleContext({
  name: () => String(props.name || "zh-CN"),
  direction: readDir,
  messages: () => props.messages || {},
  timeZone: () => String(props.timeZone || ""),
  adapter: () => props.adapter,
});

provide(LOCALE_PROVIDER_KEY, context);

useEffect(() => {
  host.setAttribute("lang", context.name);
  host.setAttribute("dir", context.dir);
  host.setAttribute("data-locale", context.name);
});

defineStyle(styles);

const LocaleProvider = defineHtml(`<slot></slot>`);

export { LocaleProvider };
