// elf-icon-provider — 为局部子树提供图标集合、默认集与语义别名

import { defineHtml, defineProps, defineStyle, inject, provide, useEffect, useHost } from "@elfui/core";

import {
  getIconOptions,
  ICON_PROVIDER_KEY,
  mergeIconOptions,
  type IconOptions,
  type IconProviderContext,
} from "../../Basic/Icon";
import styles from "./style.scss?inline";
import type { IconProviderProps } from "./types";

export type { IconProviderProps } from "./types";

const props = defineProps<IconProviderProps>({
  options: { type: Object, default: () => ({}) },
  defaultSet: { type: String, default: "" },
  aliases: { type: Object, default: () => ({}) },
  sets: { type: Object, default: () => ({}) },
  inherit: { type: Boolean, default: true },
});

const host = useHost();
const parent = inject(ICON_PROVIDER_KEY);

const readOwnOptions = (): IconOptions => {
  const configured = (props.options || {}) as IconOptions;
  return {
    ...configured,
    ...(props.defaultSet ? { defaultSet: String(props.defaultSet) } : {}),
    aliases: { ...(configured.aliases || {}), ...((props.aliases || {}) as IconOptions["aliases"]) },
    sets: { ...(configured.sets || {}), ...((props.sets || {}) as IconOptions["sets"]) },
  };
};

const readOptions = (): Required<IconOptions> => {
  const base = props.inherit ? parent?.options ?? getIconOptions() : {};
  return mergeIconOptions(base, readOwnOptions());
};

const context: IconProviderContext = {
  get options() {
    return readOptions();
  },
};

provide(ICON_PROVIDER_KEY, context);

useEffect(() => {
  host.setAttribute("data-icon-set", readOptions().defaultSet);
});

defineStyle(styles);

const IconProvider = defineHtml<IconProviderProps>(`<slot></slot>`);

export { IconProvider };
