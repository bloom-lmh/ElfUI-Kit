import type {
  LocaleAdapter,
  LocaleAdapterContext,
  LocaleAdapterDateValue,
  LocaleAdapterParams,
} from "../../adapters";
import {
  createTranslator,
  localeMessagesFor,
  mergeMessages,
  type LocaleDirection,
  type LocaleMessages,
  type LocaleProviderContext,
} from "./context";

export interface LocaleContextSource {
  name(): string;
  direction(): LocaleDirection;
  messages(): LocaleMessages;
  timeZone(): string;
  adapter(): LocaleAdapter | undefined;
}

const toDate = (value: LocaleAdapterDateValue): Date =>
  value instanceof Date ? value : new Date(typeof value === "string" ? Date.parse(value) : value);

export const createLocaleContext = (source: LocaleContextSource): LocaleProviderContext => {
  const readMessages = (): LocaleMessages =>
    mergeMessages(localeMessagesFor(source.name()), source.messages());
  const readAdapterContext = (): LocaleAdapterContext => ({
    name: source.name(),
    direction: source.direction(),
    messages: readMessages(),
    ...(source.timeZone() ? { timeZone: source.timeZone() } : {}),
  });

  return {
    get name() {
      return source.name();
    },
    get dir() {
      return source.direction();
    },
    get messages() {
      return readMessages();
    },
    t(path, params) {
      const normalizedParams: LocaleAdapterParams = params ?? {};
      const translated = source.adapter()?.translate(path, normalizedParams, readAdapterContext());
      return typeof translated === "string"
        ? translated
        : createTranslator(readMessages())(path, normalizedParams);
    },
    formatNumber(value, options) {
      const formatted = source.adapter()?.formatNumber?.(value, options, readAdapterContext());
      return typeof formatted === "string"
        ? formatted
        : new Intl.NumberFormat(source.name(), options).format(value);
    },
    formatDate(value, options) {
      const formatted = source.adapter()?.formatDate?.(value, options, readAdapterContext());
      if (typeof formatted === "string") return formatted;

      const timeZone = source.timeZone();
      return new Intl.DateTimeFormat(source.name(), {
        ...options,
        ...(timeZone && !options?.timeZone ? { timeZone } : {}),
      }).format(toDate(value));
    },
  };
};
