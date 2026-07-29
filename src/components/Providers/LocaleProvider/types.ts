import type { LocaleDirection, LocaleMessages } from "../context";
import type { LocaleAdapter } from "../../../adapters";

export interface LocaleProviderProps {
  name: string;
  dir: LocaleDirection;
  rtl: boolean;
  messages: LocaleMessages;
  timeZone: string;
  adapter?: LocaleAdapter;
}

export type { LocaleAdapter, LocaleDirection, LocaleMessages };
