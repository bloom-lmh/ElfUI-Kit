// elf-grid-item - grid child item

import {
  defineHtml,
  defineProps,
  defineStyle,
  useHostAttr,
  useHostCssVar
} from "@elfui/core";

import itemStyles from "../Grid/item.scss?inline";
import type {
  GridItemBreakpoint,
  GridItemProps,
  GridItemResponsiveValue,
  GridItemSlots
} from "../Grid/types";

export type { GridItemBreakpoint, GridItemProps, GridItemResponsiveValue, GridItemSlots };

interface GridItemState {
  span: number;
  offset: number;
  push: number;
  pull: number;
}

const props = defineProps<GridItemProps>({
  span: { type: Number, default: 1 },
  offset: { type: Number, default: 0 },
  push: { type: Number, default: 0 },
  pull: { type: Number, default: 0 },
  xs: { type: [Number, Object], default: undefined },
  sm: { type: [Number, Object], default: undefined },
  md: { type: [Number, Object], default: undefined },
  lg: { type: [Number, Object], default: undefined },
  xl: { type: [Number, Object], default: undefined }
});

const toSpan = (value: unknown, fallback = 1): number => {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) ? Math.min(24, Math.max(1, number)) : fallback;
};

const toMetric = (value: unknown, fallback = 0): number => {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) ? Math.min(24, Math.max(0, number)) : fallback;
};

const mergeResponsive = (previous: GridItemState, value?: GridItemResponsiveValue): GridItemState => {
  if (value == null) return previous;
  if (typeof value === "number") return { ...previous, span: toSpan(value, previous.span) };
  return {
    span: value.span == null ? previous.span : toSpan(value.span, previous.span),
    offset: value.offset == null ? previous.offset : toMetric(value.offset, previous.offset),
    push: value.push == null ? previous.push : toMetric(value.push, previous.push),
    pull: value.pull == null ? previous.pull : toMetric(value.pull, previous.pull)
  };
};

const responsiveStates = (): Record<"base" | "xs" | "sm" | "md" | "lg" | "xl", GridItemState> => {
  const base: GridItemState = {
    span: toSpan(props.span),
    offset: toMetric(props.offset),
    push: toMetric(props.push),
    pull: toMetric(props.pull)
  };
  const xs = mergeResponsive(base, props.xs);
  const sm = mergeResponsive(xs, props.sm);
  const md = mergeResponsive(sm, props.md);
  const lg = mergeResponsive(md, props.lg);
  const xl = mergeResponsive(lg, props.xl);
  return { base, xs, sm, md, lg, xl };
};

const variablesOf = (state: GridItemState): GridItemState & {
  total: number;
  contentWidth: string;
  offsetWidth: string;
  shift: string;
} => {
  const total = Math.max(1, state.span + state.offset);
  return {
    ...state,
    total,
    contentWidth: `${state.span / total * 100}%`,
    offsetWidth: `${state.offset / total * 100}%`,
    shift: `${(state.push - state.pull) / state.span * 100}%`
  };
};

const bindBreakpointVariables = (breakpoint: keyof ReturnType<typeof responsiveStates>): void => {
  const metrics = (): ReturnType<typeof variablesOf> => variablesOf(responsiveStates()[breakpoint]);
  useHostCssVar(`--_${breakpoint}-span`, () => metrics().span);
  useHostCssVar(`--_${breakpoint}-total`, () => metrics().total);
  useHostCssVar(`--_${breakpoint}-content-width`, () => metrics().contentWidth);
  useHostCssVar(`--_${breakpoint}-offset-width`, () => metrics().offsetWidth);
  useHostCssVar(`--_${breakpoint}-shift`, () => metrics().shift);
};

(["base", "xs", "sm", "md", "lg", "xl"] as const).forEach(bindBreakpointVariables);

useHostAttr("span", () => toSpan(props.span));
useHostAttr("offset", () => toMetric(props.offset));
useHostAttr("push", () => toMetric(props.push));
useHostAttr("pull", () => toMetric(props.pull));

defineStyle(itemStyles);

const GridItem = defineHtml<GridItemProps, Record<string, never>, GridItemSlots>(`
  <div class="grid-item" part="item"><slot></slot></div>
`);

export { GridItem };
