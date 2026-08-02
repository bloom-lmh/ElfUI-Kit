import { getActiveRouter, type RouteLocation, type RouteLocationRaw } from "@elfui/router";
import {
  defineEmits,
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostFlag,
} from "@elfui/core";

import styles from "./style.scss?inline";
import type { LinkEmits, LinkProps, LinkSlots, LinkType } from "./types";

export type { LinkEmits, LinkProps, LinkSlots, LinkType } from "./types";

const props = defineProps<LinkProps>({
  type: { type: String, default: "default" },
  underline: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  href: { type: String, default: "" },
  to: { type: [String, Object], default: "" },
  replace: { type: Boolean, default: false },
  target: { type: String, default: "" },
  rel: { type: String, default: "" },
  activeClass: { type: String, default: "" },
  exactActiveClass: { type: String, default: "" },
  icon: { type: String, default: "" },
});

const emit = defineEmits<LinkEmits>();

const normalizedType = (): LinkType => {
  const value = String(props.type || "default") as LinkType;
  return ["primary", "success", "warning", "danger", "info"].includes(value) ? value : "default";
};

const hasRouterTarget = (): boolean => {
  if (typeof props.to === "string") return props.to.length > 0;
  return Boolean(props.to && typeof props.to === "object");
};

const resolvedRoute = (): RouteLocation | null => {
  if (!hasRouterTarget()) return null;
  const router = getActiveRouter();
  if (!router) return null;
  void router.current.value.fullPath;
  return router.resolve(props.to as RouteLocationRaw);
};

const fallbackRouteHref = (): string => {
  if (typeof props.to === "string") return props.to;
  if (!props.to || typeof props.to !== "object") return "";
  return "path" in props.to ? String(props.to.path || "") : "";
};

const linkHref = (): string | null => {
  if (props.disabled) return null;
  if (hasRouterTarget()) return resolvedRoute()?.href || fallbackRouteHref() || null;
  return props.href || null;
};

const normalizedRel = (): string | null => {
  if (props.disabled) return null;
  const tokens = new Set(
    String(props.rel || "")
      .split(/\s+/)
      .filter(Boolean),
  );
  if (props.target === "_blank") {
    tokens.add("noopener");
    tokens.add("noreferrer");
  }
  return tokens.size > 0 ? Array.from(tokens).join(" ") : null;
};

const isExactActive = (): boolean => {
  const router = getActiveRouter();
  const target = resolvedRoute();
  if (!router || !target) return false;
  return router.current.value.fullPath === target.fullPath;
};

const isActive = (): boolean => {
  const router = getActiveRouter();
  const target = resolvedRoute();
  if (!router || !target) return false;
  const currentPath = router.current.value.path;
  return (
    currentPath === target.path ||
    (target.path !== "/" && currentPath.startsWith(`${target.path}/`))
  );
};

const linkClasses = (): string[] => {
  const classes = ["link"];
  const router = getActiveRouter();
  if (isActive()) classes.push(props.activeClass || router?.options.linkActiveClass || "active");
  if (isExactActive())
    classes.push(props.exactActiveClass || router?.options.linkExactActiveClass || "exact-active");
  return classes;
};

const blocksClientNavigation = (event: MouseEvent): boolean =>
  event.button !== 0 ||
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey ||
  (Boolean(props.target) && props.target !== "_self");

const stopDisabledInteraction = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
};

const onClick = (event: MouseEvent): void => {
  if (props.disabled) {
    stopDisabledInteraction(event);
    return;
  }
  if (!hasRouterTarget() || blocksClientNavigation(event)) return;
  const router = getActiveRouter();
  if (!router) return;
  event.preventDefault();
  emit("navigate", props.to as RouteLocationRaw);
  void (props.replace
    ? router.replace(props.to as RouteLocationRaw)
    : router.push(props.to as RouteLocationRaw));
};

const onKeydown = (event: KeyboardEvent): void => {
  if (!props.disabled || (event.key !== "Enter" && event.key !== " ")) return;
  stopDisabledInteraction(event);
};

useHostAttr("type", normalizedType);
useHostFlag("disabled", () => Boolean(props.disabled));
useHostFlag("data-active", isActive);
useHostFlag("data-exact-active", isExactActive);

defineStyle(styles);

const Link = defineHtml<LinkProps, Record<string, never>, LinkSlots>(`
  <a
    :class=${linkClasses()}
    part="link"
    :href=${linkHref()}
    :target=${props.disabled ? null : props.target || null}
    :rel=${normalizedRel()}
    :tabindex=${props.disabled ? -1 : null}
    :aria-disabled=${props.disabled ? "true" : null}
    :aria-current=${isExactActive() ? "page" : null}
    :data-underline=${props.underline ? "true" : "false"}
    @click=${onClick}
    @keydown=${onKeydown}
  >
    <span class="icon">
      <slot name="icon"><span v-if=${props.icon} class="prop-icon" aria-hidden="true">${props.icon}</span></slot>
    </span>
    <slot></slot>
  </a>
`);

export { Link };
