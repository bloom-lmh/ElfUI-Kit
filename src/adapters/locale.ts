export type LocaleAdapterDirection = "ltr" | "rtl";
export type LocaleAdapterParams = Record<string, string | number>;
export type LocaleAdapterDateValue = Date | number | string;

export interface LocaleAdapterContext {
  name: string;
  direction: LocaleAdapterDirection;
  messages: Record<string, unknown>;
  timeZone?: string;
}

export interface LocaleAdapter {
  translate(
    path: string,
    params: LocaleAdapterParams,
    context: LocaleAdapterContext,
  ): string | undefined;
  formatNumber?(
    value: number,
    options: Intl.NumberFormatOptions | undefined,
    context: LocaleAdapterContext,
  ): string | undefined;
  formatDate?(
    value: LocaleAdapterDateValue,
    options: Intl.DateTimeFormatOptions | undefined,
    context: LocaleAdapterContext,
  ): string | undefined;
}

export const defineLocaleAdapter = <T extends LocaleAdapter>(adapter: T): T =>
  adapter;
