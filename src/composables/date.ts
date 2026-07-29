import type { DateAdapter, DateAdapterContext, DateOptions } from "../adapters";
import { nativeDateAdapter } from "../adapters";
import { useConfigProvider } from "../components/Providers/config";
import { useLocaleProvider } from "../components/Providers/context";

export interface DateAdapterService {
  readonly adapter: DateAdapter;
  readonly context: DateAdapterContext;
  readonly firstDayOfWeek: number;
}

const normalizeFirstDayOfWeek = (value: unknown): number => {
  const day = Number(value);
  return Number.isInteger(day) && day >= 0 && day <= 6 ? day : 1;
};

export const useDateAdapter = (): DateAdapterService => {
  const config = useConfigProvider();
  const locale = useLocaleProvider();

  return {
    get adapter() {
      return (config.config.date as DateOptions | undefined)?.adapter ?? nativeDateAdapter;
    },
    get context() {
      const options = config.config.date as DateOptions | undefined;
      const timeZone = options?.timeZone || config.config.locale?.timeZone;
      return {
        locale: options?.locale || locale.name,
        ...(timeZone ? { timeZone } : {}),
        ...(options?.formats ? { formats: options.formats } : {}),
      };
    },
    get firstDayOfWeek() {
      return normalizeFirstDayOfWeek(
        (config.config.date as DateOptions | undefined)?.firstDayOfWeek,
      );
    },
  };
};
