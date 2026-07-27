export interface IconProps {
  name: string;
  set: string;
  fallback: string;
  size: number | string;
  color: string;
  ariaLabel: string;
  loading: boolean;
}

export type IconSetKind = "text" | "svg" | "class";

export interface SvgIconValue {
  path: string | string[];
  viewBox?: string;
}

export interface ClassIconValue {
  class: string | string[];
}

export type IconValue = string | SvgIconValue | ClassIconValue;

export interface IconSet {
  kind: IconSetKind;
  icons?: Record<string, IconValue>;
  resolve?: (name: string) => IconValue | undefined;
}

export interface IconOptions {
  defaultSet?: string;
  aliases?: Record<string, string>;
  sets?: Record<string, IconSet>;
}

export interface IconProviderContext {
  readonly options: Required<IconOptions>;
}

export interface ResolvedIcon {
  kind: IconSetKind;
  content: string;
  paths: string[];
  classes: string[];
  viewBox: string;
}

export interface IconSlots {
  default?: unknown;
  fallback?: unknown;
}
