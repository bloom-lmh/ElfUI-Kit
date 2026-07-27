import { defineHtml, defineProps, defineStyle, inject, useHostCssVar } from "@elfui/core";

import styles from "./style.scss?inline";
import type { IconProps, IconSlots } from "./types";

import { ICON_PROVIDER_KEY, resolveIcon } from "./registry";

export {
  configureIcons,
  createClassIconSet,
  createSvgIconSet,
  getIconOptions,
  ICON_PROVIDER_KEY,
  mergeIconOptions,
  resetIcons,
  resolveIcon
} from "./registry";
export type {
  ClassIconValue,
  IconOptions,
  IconProviderContext,
  IconProps,
  IconSet,
  IconSetKind,
  IconSlots,
  IconValue,
  ResolvedIcon,
  SvgIconValue,
} from "./types";

const props = defineProps<IconProps>({
  name: { type: String, default: "" },
  set: { type: String, default: "" },
  fallback: { type: String, default: "?" },
  size: { type: [Number, String], default: "1em" },
  color: { type: String, default: "" },
  ariaLabel: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});

const iconProvider = inject(ICON_PROVIDER_KEY);

const size = (): string => {
  const value = props.size;
  if (typeof value === "number") return `${Math.max(1, value)}px`;
  const s = String(value || "");
  // 纯数字字符串如 "16" → "16px"
  if (/^\d+$/.test(s)) return `${s}px`;
  return s || "1em";
};

const resolved = () => resolveIcon(props.name, props.set, iconProvider?.options);

const isSvg = (): boolean => resolved().kind === "svg" && resolved().paths.length > 0;

const isClass = (): boolean => resolved().kind === "class" && resolved().classes.length > 0;

const isText = (): boolean => resolved().kind === "text" && Boolean(resolved().content);

const pathEntries = (): Array<{ path: string; key: string }> =>
  resolved().paths.map((path, index) => ({ path, key: `${index}-${path}` }));

useHostCssVar("--_icon-size", size);
useHostCssVar("--_icon-color", () => props.color || "currentColor");

defineStyle(styles);

const Icon = defineHtml<IconProps, Record<string, never>, IconSlots>(`
  <span
    :class=${{ icon: true, "is-loading": props.loading }}
    part="icon"
    :aria-hidden=${props.ariaLabel ? "false" : "true"}
    :aria-label=${props.ariaLabel || null}
    :role=${props.ariaLabel ? "img" : null}
  >
    <slot>
      <svg v-if=${isSvg()} class="svg-icon" :viewBox=${resolved().viewBox} aria-hidden="true" focusable="false">
        <path v-for="entry in pathEntries()" :key="entry.key" :d="entry.path"></path>
      </svg>
      <i v-else-if=${isClass()} :class=${["class-icon", ...resolved().classes]} aria-hidden="true"></i>
      <span v-else-if=${isText()} class="text-icon">${resolved().content}</span>
      <slot v-else name="fallback">
        <span class="fallback-icon" aria-hidden="true">${props.fallback}</span>
      </slot>
    </slot>
  </span>
`);

export { Icon };
