// elf-locale-provider — 为子树提供本地化文案与方向

import { defineProps, defineStyle, provide, useEffect, useHost, defineHtml } from "@elfui/core";

import {
  LOCALE_PROVIDER_KEY,
  createTranslator,
  mergeMessages,
  type LocaleDirection,
  type LocaleMessages,
  type LocaleProviderContext,
  localeMessagesFor,
} from "../context";
import styles from "./style.scss?inline";
import type { LocaleProviderProps } from "./types";

export type { LocaleDirection, LocaleMessages, LocaleProviderProps } from "./types";

const props = defineProps<LocaleProviderProps>({
  name: { type: String, default: "zh-CN" },
  dir: { type: String, default: "ltr" },
  rtl: { type: Boolean, default: false },
  messages: { type: Object, default: () => ({}) },
  timeZone: { type: String, default: "" },
});

const host = useHost();

const readMessages = (): LocaleMessages =>
  mergeMessages(localeMessagesFor(String(props.name || "zh-CN")), (props.messages || {}) as LocaleMessages);

const readDir = (): LocaleDirection => {
  if (props.rtl) return "rtl";
  return props.dir === "rtl" ? "rtl" : "ltr";
};

const context: LocaleProviderContext = {
  get name() {
    return String(props.name || "zh-CN");
  },
  get dir() {
    return readDir();
  },
  get messages() {
    return readMessages();
  },
  t(path, params) {
    return createTranslator(readMessages())(path, params);
  },
  formatNumber(value, options) {
    return new Intl.NumberFormat(context.name, options).format(value);
  },
  formatDate(value, options) {
    const date = value instanceof Date
      ? value
      : new Date(typeof value === "string" ? Date.parse(value) : value);
    const timeZone = String(props.timeZone || "");
    return new Intl.DateTimeFormat(context.name, {
      ...options,
      ...(timeZone && !options?.timeZone ? { timeZone } : {})
    }).format(date);
  },
};

provide(LOCALE_PROVIDER_KEY, context);

useEffect(() => {
  host.setAttribute("lang", context.name);
  host.setAttribute("dir", context.dir);
  host.setAttribute("data-locale", context.name);
});

defineStyle(styles);

const LocaleProvider = defineHtml(`<slot></slot>`);

export { LocaleProvider };
