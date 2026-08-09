import { DEFAULT_LOCALE_CONTEXT, useLocaleProvider } from "@elfui/kit";

export type DocsMessage = Readonly<{ zh: string; en: string }>;
export type DocsMessages<Key extends string> = Readonly<Record<Key, DocsMessage>>;

const localizeChineseTitle = (value: string): string => {
  const match = value.match(/^[A-Za-z][A-Za-z0-9+&./ -]{0,36}\s+([\u3400-\u9fff].*)$/u);
  return match?.[1]?.trim() || value;
};

const resolveDocsLocaleName = (): string => {
  const locale = useLocaleProvider();
  if (locale !== DEFAULT_LOCALE_CONTEXT || typeof document === "undefined") {
    return locale.name;
  }
  return document.documentElement.lang || locale.name;
};

/**
 * Creates a Provider-backed translator for documentation copy.
 * Keep each page's copy next to that page while sharing locale detection here.
 * Routed pages may be mounted after RouterView connects; document.lang mirrors
 * AppShell's locale when that async boundary cannot observe the injected context.
 */
export const createDocsTranslator = <Key extends string>(messages: DocsMessages<Key>) => {
  const localeName = resolveDocsLocaleName();
  const isEnglish = (): boolean => localeName.toLowerCase().startsWith("en");

  return (key: Key): string => {
    const message = messages[key];
    return isEnglish()
      ? message.en
      : String(key).toLowerCase() === "title"
        ? localizeChineseTitle(message.zh)
        : message.zh;
  };
};

/**
 * Selects inline bilingual copy for data-driven documentation such as API rows.
 * Keep structured rows as functions so locale changes are reflected at render time.
 */
export const createDocsPicker = () => {
  const localeName = resolveDocsLocaleName();
  const isEnglish = (): boolean => localeName.toLowerCase().startsWith("en");

  return (zh: string, en: string): string => (isEnglish() ? en : zh);
};
