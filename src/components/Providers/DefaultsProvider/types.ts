import type { DefaultsStrategy, ProviderDefaults } from "../context";

export interface DefaultsProviderProps {
  defaults: ProviderDefaults;
  disabled: boolean;
  deep: boolean;
  strategy: DefaultsStrategy;
  reset: boolean;
}

export type { DefaultsStrategy, ProviderDefaults };
