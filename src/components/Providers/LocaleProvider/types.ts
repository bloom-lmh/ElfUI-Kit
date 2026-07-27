import type { LocaleDirection, LocaleMessages } from "../context";

export interface LocaleProviderProps {
  name: string;
  dir: LocaleDirection;
  rtl: boolean;
  messages: LocaleMessages;
  timeZone: string;
}

export type { LocaleDirection, LocaleMessages };
