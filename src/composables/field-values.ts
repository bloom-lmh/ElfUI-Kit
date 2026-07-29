import { useConfigProvider } from "../components/Providers/config";

export const DEFAULT_EMPTY_VALUES: readonly unknown[] = Object.freeze([
  undefined,
  null,
  "",
]);

export interface FieldValueDefaultsResolver {
  emptyValues: (local?: readonly unknown[]) => readonly unknown[];
  isEmpty: (value: unknown, local?: readonly unknown[]) => boolean;
  valueOnClear: <T>(
    local: T | (() => T) | undefined,
    fallback: () => T
  ) => T;
}

export const useFieldValueDefaults = (): FieldValueDefaultsResolver => {
  const provider = useConfigProvider();

  const emptyValues = (local?: readonly unknown[]): readonly unknown[] =>
    local ?? provider.config.field?.emptyValues ?? DEFAULT_EMPTY_VALUES;

  return {
    emptyValues,
    isEmpty: (value, local) =>
      emptyValues(local).some((candidate) => Object.is(candidate, value)),
    valueOnClear: <T>(
      local: T | (() => T) | undefined,
      fallback: () => T
    ): T => {
      const configured = local !== undefined
        ? local
        : provider.config.field?.valueOnClear;
      if (typeof configured === "function") {
        return (configured as () => T)();
      }
      return configured !== undefined ? configured as T : fallback();
    },
  };
};
