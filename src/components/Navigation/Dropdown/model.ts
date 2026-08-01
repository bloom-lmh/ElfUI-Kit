import type {
  DropdownButtonType,
  DropdownCommand,
  DropdownFieldNames,
  DropdownPlacement,
  DropdownPopperModifier,
  DropdownPopperOptions,
  DropdownSize,
  DropdownTriggerMode,
} from "./types";

type RawItem = Record<string, unknown>;

export interface DropdownViewItem {
  raw: RawItem;
  key: string;
  label: string;
  command: DropdownCommand;
  icon: string;
  disabled: boolean;
  divided: boolean;
  shortcut: string;
  children: DropdownViewItem[];
}

export interface DropdownPopperConfig {
  options: DropdownPopperOptions;
  placement: DropdownPlacement;
  offset: [number, number];
  overflowPadding: number;
  flip: boolean;
}

const DEFAULT_FIELDS: Required<DropdownFieldNames> = {
  label: "label",
  command: "command",
  icon: "icon",
  disabled: "disabled",
  divided: "divided",
  shortcut: "shortcut",
  children: "children",
};

const BUTTON_TYPES = new Set<DropdownButtonType>([
  "primary",
  "success",
  "warning",
  "danger",
  "info",
]);
const TRIGGER_MODES = new Set<DropdownTriggerMode>(["click", "hover", "contextmenu"]);
const PLACEMENTS = new Set<DropdownPlacement>([
  "bottom",
  "bottom-start",
  "bottom-end",
  "top",
  "top-start",
  "top-end",
]);

export const DEFAULT_TRIGGER_KEYS = ["Enter", " ", "Space", "ArrowDown", "NumpadEnter"];

export const resolveFieldNames = (
  partial?: DropdownFieldNames | null,
): Required<DropdownFieldNames> => {
  const source = partial ?? {};
  return {
    label: source.label || DEFAULT_FIELDS.label,
    command: source.command || DEFAULT_FIELDS.command,
    icon: source.icon || DEFAULT_FIELDS.icon,
    disabled: source.disabled || DEFAULT_FIELDS.disabled,
    divided: source.divided || DEFAULT_FIELDS.divided,
    shortcut: source.shortcut || DEFAULT_FIELDS.shortcut,
    children: source.children || DEFAULT_FIELDS.children,
  };
};

export const normalizeItems = (
  source: unknown[],
  fields: Required<DropdownFieldNames>,
  path = "",
): DropdownViewItem[] =>
  source.map((raw, index) => {
    const item = (raw || {}) as RawItem;
    const childSource = Array.isArray(item[fields.children])
      ? (item[fields.children] as unknown[])
      : [];
    const label = String(item[fields.label] ?? item[fields.command] ?? index);
    const command = (item[fields.command] ?? label) as DropdownCommand;
    const commandKey = typeof command === "object" ? String(index) : String(command || index);
    const key = path ? `${path}/${commandKey}` : commandKey;

    return {
      raw: item,
      key,
      label,
      command,
      icon: String(item[fields.icon] ?? ""),
      disabled: Boolean(item[fields.disabled]),
      divided: Boolean(item[fields.divided]),
      shortcut: String(item[fields.shortcut] ?? ""),
      children: normalizeItems(childSource, fields, key),
    };
  });

export const toStyleObject = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, string | number>).map(([key, item]) => [
      key,
      String(item),
    ]),
  );
};

export const resolveTriggers = (value: unknown): DropdownTriggerMode[] => {
  const source = Array.isArray(value) ? value : [value || "click"];
  const resolved = source
    .map((item) => String(item) as DropdownTriggerMode)
    .filter((item) => TRIGGER_MODES.has(item));
  return resolved.length > 0 ? Array.from(new Set(resolved)) : ["click"];
};

export const resolvePlacement = (value: unknown): DropdownPlacement => {
  const next = String(value || "bottom-start") as DropdownPlacement;
  return PLACEMENTS.has(next) ? next : "bottom-start";
};

export const resolveButtonType = (value: unknown): DropdownButtonType => {
  const next = String(value || "default") as DropdownButtonType;
  return BUTTON_TYPES.has(next) ? next : "default";
};

export const resolveSize = (value: unknown): DropdownSize => {
  const next = String(value || "md");
  if (next === "small") return "sm";
  if (next === "large") return "lg";
  if (next === "default") return "md";
  return next === "sm" || next === "lg" ? next : "md";
};

export const asStringList = (value: unknown, fallback: string[]): string[] =>
  Array.isArray(value) ? value.map((key) => String(key)) : fallback;

export const positiveDelay = (value: unknown): number => Math.max(0, Number(value) || 0);

export const cssSize = (value: unknown, fallback: string): string => {
  if (value == null || value === "") return fallback;
  return typeof value === "number" ? `${Math.max(0, value)}px` : String(value);
};

const findModifier = (
  options: DropdownPopperOptions,
  name: string,
): DropdownPopperModifier | undefined => {
  const modifiers = Array.isArray(options.modifiers) ? options.modifiers : [];
  return modifiers.find((item) => item?.name === name);
};

export const resolvePopperConfig = (
  value: unknown,
  fallbackPlacement: unknown,
): DropdownPopperConfig => {
  const options = value && typeof value === "object" ? (value as DropdownPopperOptions) : {};
  const placement = resolvePlacement(options.placement || fallbackPlacement);
  const offsetValue = findModifier(options, "offset")?.options?.offset;
  const offset: [number, number] =
    Array.isArray(offsetValue) && offsetValue.length >= 2
      ? [Number(offsetValue[0]) || 0, Number(offsetValue[1]) || 0]
      : [0, 0];

  return {
    options,
    placement,
    offset,
    overflowPadding: Math.max(
      0,
      Number(findModifier(options, "preventOverflow")?.options?.padding) || 8,
    ),
    flip: findModifier(options, "flip")?.enabled !== false,
  };
};
