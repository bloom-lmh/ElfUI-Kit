import { createInjectionKey } from "@elfui/core";

import type {
  ClassIconValue,
  IconOptions,
  IconProviderContext,
  IconSet,
  IconValue,
  ResolvedIcon,
  SvgIconValue
} from "./types";

const textSet: IconSet = {
  kind: "text",
  resolve: (name) => name
};

const defaultOptions = (): Required<IconOptions> => ({
  defaultSet: "elf",
  aliases: {},
  sets: { elf: textSet }
});

let options = defaultOptions();

export const ICON_PROVIDER_KEY =
  createInjectionKey<IconProviderContext>("elfui.icon-provider");

const words = (value: string | string[] | undefined): string[] => {
  const list = Array.isArray(value) ? value : String(value || "").split(/\s+/);
  return list.map((item) => item.trim()).filter(Boolean);
};

const parseReference = (
  reference: string,
  requestedSet: string,
  source: Required<IconOptions>
): [string, string] => {
  const aliased = reference.startsWith("$")
    ? source.aliases[reference.slice(1)] || reference.slice(1)
    : reference;
  const separator = aliased.indexOf(":");
  if (separator > 0) return [aliased.slice(0, separator), aliased.slice(separator + 1)];
  return [requestedSet || source.defaultSet, aliased];
};

const readValue = (set: IconSet, name: string): IconValue | undefined =>
  set.icons?.[name] ?? set.resolve?.(name);

const normalize = (set: IconSet, value: IconValue | undefined, fallback: string): ResolvedIcon => {
  const base = { content: "", paths: [], classes: [], viewBox: "0 0 24 24" };
  if (set.kind === "svg") {
    const svg = (typeof value === "string" ? { path: value } : value) as SvgIconValue | undefined;
    return {
      ...base,
      kind: "svg",
      paths: Array.isArray(svg?.path) ? svg.path : svg?.path ? [svg.path] : [],
      viewBox: svg?.viewBox || base.viewBox
    };
  }
  if (set.kind === "class") {
    const classValue = (typeof value === "string" ? { class: value } : value) as
      | ClassIconValue
      | undefined;
    return { ...base, kind: "class", classes: words(classValue?.class) };
  }
  return {
    ...base,
    kind: "text",
    content: typeof value === "string" ? value : fallback
  };
};

export const createSvgIconSet = (icons: Record<string, string | SvgIconValue>): IconSet => ({
  kind: "svg",
  icons
});

export const createClassIconSet = (
  options: { baseClass?: string | string[]; prefix?: string } = {}
): IconSet => ({
  kind: "class",
  resolve: (name) => ({
    class: [...words(options.baseClass), `${options.prefix || ""}${name}`]
  })
});

export const mergeIconOptions = (
  base: IconOptions = defaultOptions(),
  next: IconOptions = {}
): Required<IconOptions> => ({
  defaultSet: next.defaultSet || base.defaultSet || "elf",
  aliases: { ...(base.aliases || {}), ...(next.aliases || {}) },
  sets: { elf: textSet, ...(base.sets || {}), ...(next.sets || {}) }
});

export const getIconOptions = (): Required<IconOptions> => options;

export const configureIcons = (next: IconOptions = {}): Required<IconOptions> => {
  options = mergeIconOptions(defaultOptions(), next);
  return options;
};

export const resetIcons = (): void => {
  options = defaultOptions();
};

export const resolveIcon = (
  reference: string,
  requestedSet = "",
  source: Required<IconOptions> = options
): ResolvedIcon => {
  const [setName, iconName] = parseReference(String(reference || ""), requestedSet, source);
  const set = source.sets[setName] || source.sets.elf || textSet;
  return normalize(set, readValue(set, iconName), iconName);
};
