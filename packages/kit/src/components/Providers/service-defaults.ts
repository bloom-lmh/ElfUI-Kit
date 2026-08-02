import type { ElfUIServiceDefaults } from "./config";
import { useConfigProvider } from "./config";

export type ServiceDefaultsReader<K extends keyof ElfUIServiceDefaults> = () =>
  ElfUIServiceDefaults[K] | undefined;

/**
 * Service options are intentionally shallow. Every service owns the meaning of
 * its callbacks, targets, content nodes, and other non-mergeable values.
 */
export const resolveServiceOptions = <T extends object>(
  defaults: Partial<T> | undefined,
  options: T,
): T => ({ ...(defaults ?? {}), ...options });

/** Captures the nearest ConfigProvider during component setup. */
export const useServiceDefaults = <K extends keyof ElfUIServiceDefaults>(
  service: K,
): ServiceDefaultsReader<K> => {
  const provider = useConfigProvider();
  return () => provider.config.services?.[service];
};
