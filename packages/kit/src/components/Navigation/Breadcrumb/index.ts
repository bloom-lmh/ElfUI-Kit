import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  onBeforeUnmount,
  onMounted,
  useEventListener,
  useHost,
  useRef,
  useEffect,
} from "@elfui/core";

import styles from "./style.scss?inline";
import { useLocaleProvider } from "../../Providers/context";
import { normalizeBreadcrumbSeparatorIcon } from "./separator";
import type {
  BreadcrumbFieldNames,
  BreadcrumbProps,
  BreadcrumbRouteLocation,
  BreadcrumbSlots,
} from "./types";

export type {
  BreadcrumbFieldNames,
  BreadcrumbItem,
  BreadcrumbItemProps,
  BreadcrumbItemSlots,
  BreadcrumbProps,
  BreadcrumbRouteLocation,
  BreadcrumbSlots,
} from "./types";

type BreadcrumbRawItem = Record<string, unknown>;

interface BreadcrumbViewItem {
  raw: BreadcrumbRawItem;
  key: string;
  label: string;
  to: string;
  replace: boolean;
  disabled: boolean;
  current: boolean;
  ellipsis: boolean;
  last: boolean;
}

interface BreadcrumbItemElement extends HTMLElement {
  to?: string | BreadcrumbRouteLocation;
  replace?: boolean;
  current?: boolean;
  last?: boolean;
  separator?: string;
  separatorIcon?: string;
}

interface BreadcrumbItemRequest {
  to: string | BreadcrumbRouteLocation;
  replace: boolean;
}

const props = defineProps<BreadcrumbProps>({
  items: { type: Array, default: () => [] },
  separator: { type: String, default: "/" },
  separatorIcon: { type: String, default: "" },
  router: { type: Boolean, default: false },
  currentPath: { type: String, default: "" },
  maxItems: { type: Number, default: 0 },
  props: {
    type: Object,
    default: () => ({ label: "label", to: "to", disabled: "disabled", replace: "replace" }),
  },
});

const locale = useLocaleProvider();

const emit = defineEmits<{
  click: [item: BreadcrumbRawItem, to: string];
  "update:currentPath": [to: string];
}>();

const host = useHost();
const hashPath = useRef("");
const innerPath = useRef("");
const hasItemChildren = useRef(false);
let cleanupHash: (() => void) | null = null;

const readHash = (): string => {
  if (typeof window === "undefined") return "";
  return window.location.hash ? window.location.hash.slice(1) || "/" : "";
};

const routerEnabled = (): boolean => props.router || host.hasAttribute("router");

const fieldNames = (): Required<BreadcrumbFieldNames> => {
  const value = props.props || {};
  return {
    label: value.label || "label",
    to: value.to || "to",
    disabled: value.disabled || "disabled",
    replace: value.replace || "replace",
  };
};

const activePath = (): string =>
  String(props.currentPath || (routerEnabled() ? hashPath.value : innerPath.value));

const normalizeTo = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string") return value.replace(/^#/, "");
  if (typeof value !== "object") return String(value);
  const route = value as BreadcrumbRouteLocation;
  return String(route.path || route.hash || route.name || "").replace(/^#/, "");
};

const markLast = (items: BreadcrumbViewItem[]): BreadcrumbViewItem[] =>
  items.map((item, index) => ({ ...item, last: index === items.length - 1 }));

const normalizeItems = (): BreadcrumbViewItem[] => {
  const fields = fieldNames();
  const source = Array.isArray(props.items) ? props.items : [];
  const currentPath = activePath();
  return source.map((raw, index) => {
    const item = (raw || {}) as BreadcrumbRawItem;
    const to = normalizeTo(item[fields.to]);
    const label = String(item[fields.label] ?? (to || index + 1));
    return {
      raw: item,
      key: to || `${label}-${index}`,
      label,
      to,
      replace: Boolean(item[fields.replace]),
      disabled: Boolean(item[fields.disabled]),
      current: currentPath ? to === currentPath : index === source.length - 1,
      ellipsis: false,
      last: false,
    };
  });
};

const visibleItems = (): BreadcrumbViewItem[] => {
  const source = normalizeItems();
  const maxItems = Math.max(0, Math.trunc(Number(props.maxItems) || 0));
  if (maxItems <= 0 || source.length <= maxItems) return markLast(source);
  const limit = Math.max(3, maxItems);
  return markLast([
    source[0]!,
    {
      raw: {},
      key: "__ellipsis",
      label: "...",
      to: "",
      replace: false,
      disabled: true,
      current: false,
      ellipsis: true,
      last: false,
    },
    ...source.slice(-Math.max(1, limit - 2)),
  ]);
};

const itemChildren = (): BreadcrumbItemElement[] =>
  Array.from(host.children).filter(
    (child): child is BreadcrumbItemElement =>
      child.tagName.toLowerCase() === "elf-breadcrumb-item",
  );

const syncItemChildren = (): void => {
  const children = itemChildren();
  hasItemChildren.set(children.length > 0);
  const currentPath = activePath();
  children.forEach((child, index) => {
    const to = normalizeTo(child.to);
    child.current = currentPath ? to === currentPath : index === children.length - 1;
    child.last = index === children.length - 1;
    child.separator = props.separator || "/";
    child.separatorIcon = normalizeBreadcrumbSeparatorIcon(props.separatorIcon);
  });
};

const navigate = (raw: BreadcrumbRawItem, to: string, replace: boolean): void => {
  if (!to || to === activePath()) return;
  innerPath.set(to);
  emit("click", raw, to);
  emit("update:currentPath", to);
  if (routerEnabled() && typeof window !== "undefined") {
    hashPath.set(to);
    if (replace && window.history?.replaceState) window.history.replaceState(null, "", `#${to}`);
    else window.location.hash = to;
  }
};

const onItemClick = (item: BreadcrumbViewItem, event: Event): void => {
  // Router items keep a real hash href as a resilient navigation fallback.
  // Non-router items are command buttons and must not trigger navigation.
  if (
    item.disabled ||
    item.current ||
    item.ellipsis ||
    !(event.currentTarget instanceof HTMLAnchorElement)
  ) {
    event.preventDefault();
  }
  event.stopPropagation();
  if (!item.disabled && !item.current && !item.ellipsis) navigate(item.raw, item.to, item.replace);
};

const routerHref = (item: BreadcrumbViewItem): string => `#${item.to}`;

const onItemsSlotChange = (): void => syncItemChildren();

useEventListener(host, "elf-breadcrumb-item-click", (event) => {
  event.stopPropagation();
  const customEvent = event as CustomEvent<BreadcrumbItemRequest>;
  const child = customEvent.target as BreadcrumbItemElement;
  navigate(
    { to: child.to, replace: child.replace },
    normalizeTo(customEvent.detail.to),
    customEvent.detail.replace,
  );
});

useEffect(() => {
  void props.separator;
  void props.separatorIcon;
  void props.currentPath;
  void hashPath.value;
  void innerPath.value;
  syncItemChildren();
});

onMounted(() => {
  hashPath.set(readHash());
  syncItemChildren();
  const onHashChange = (): void => hashPath.set(readHash());
  window.addEventListener("hashchange", onHashChange);
  cleanupHash = () => window.removeEventListener("hashchange", onHashChange);
});

onBeforeUnmount(() => {
  cleanupHash?.();
  cleanupHash = null;
});

defineStyle(styles);

const Breadcrumb = defineHtml<BreadcrumbProps, Record<string, never>, BreadcrumbSlots>(`
  <nav class="breadcrumb" :aria-label=${locale.t("a11y.breadcrumb")}>
    <ol class="breadcrumb-list">
      <slot v-if=${hasItemChildren} @slotchange=${onItemsSlotChange}></slot>
      <template v-if=${!hasItemChildren}>
        <li
          v-for="item in visibleItems()"
          :key="item.key + ':' + (item.current ? 'active' : 'idle') + ':' + (item.last ? 'last' : 'mid')"
          :class="['breadcrumb-item', { 'is-current': item.current, 'is-disabled': item.disabled, 'is-ellipsis': item.ellipsis }]"
        >
          <a
            v-if="!item.current && !item.ellipsis && router"
            :href="routerHref(item)"
            class="breadcrumb-link"
            :aria-disabled="item.disabled ? 'true' : null"
            @click="onItemClick(item, $event)"
          >
            {{ item.label }}
          </a>
          <button
            v-else-if="!item.current && !item.ellipsis"
            type="button"
            class="breadcrumb-link"
            :disabled="item.disabled"
            @click="onItemClick(item, $event)"
          >
            {{ item.label }}
          </button>
          <span v-else class="breadcrumb-text" :aria-current="item.current ? 'page' : ''">{{ item.label }}</span>
          <span v-if="!item.last" class="breadcrumb-separator" aria-hidden="true">
            <elf-icon
              v-if=${props.separatorIcon}
              class="breadcrumb-separator-icon"
              :name=${normalizeBreadcrumbSeparatorIcon(props.separatorIcon)}
            ></elf-icon>
            <span v-else>${props.separator || "/"}</span>
          </span>
        </li>
      </template>
    </ol>
  </nav>
`);

export { Breadcrumb };
