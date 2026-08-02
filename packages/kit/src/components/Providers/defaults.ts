import type { ProviderDefaults } from "./context";

export interface ResolvedComponentDefaults {
  global?: Record<string, unknown>;
  component?: Record<string, unknown>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const toPascalCase = (value: string): string =>
  value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export const toAttributeName = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const normalizeProviderDefaults = (value: unknown): ProviderDefaults => {
  if (typeof value === "string") {
    try {
      return normalizeProviderDefaults(JSON.parse(value));
    } catch {
      return {};
    }
  }

  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, Record<string, unknown>] =>
      isRecord(entry[1]),
    ),
  );
};

export const mergeProviderDefaults = (...sources: unknown[]): ProviderDefaults => {
  const output: ProviderDefaults = {};

  for (const source of sources) {
    for (const [component, defaults] of Object.entries(normalizeProviderDefaults(source))) {
      output[component] = { ...(output[component] || {}), ...defaults };
    }
  }

  return output;
};

export const resolveComponentDefaults = (
  defaults: ProviderDefaults,
  tagName: string,
): ResolvedComponentDefaults => {
  const tag = tagName.toLowerCase();
  const short = tag.startsWith("elf-") ? tag.slice(4) : tag;
  const component =
    defaults[tag] ??
    defaults[short] ??
    defaults[toPascalCase(tag)] ??
    defaults[toPascalCase(short)];
  const global = defaults.global ?? defaults.Global ?? defaults["*"];

  return {
    ...(global ? { global } : {}),
    ...(component ? { component } : {}),
  };
};
