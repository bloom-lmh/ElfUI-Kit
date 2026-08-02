import type { DirectiveBinding, DirectiveDefinition, ElfUIApp } from "@elfui/core";

import type { InfiniteScrollDirectiveOptions, InfiniteScrollDirectiveValue } from "./types";

interface InfiniteScrollDirectiveState {
  value: InfiniteScrollDirectiveValue;
  timer?: ReturnType<typeof setTimeout>;
  onScroll: () => void;
  observer?: ResizeObserver;
}

const states = new WeakMap<HTMLElement, InfiniteScrollDirectiveState>();

const readAttribute = (el: HTMLElement, name: string): string | null =>
  el.getAttribute(`infinite-scroll-${name}`);

const readBoolean = (el: HTMLElement, name: string, fallback: boolean): boolean => {
  const propertyName = `infiniteScroll${name[0]!.toUpperCase()}${name.slice(1)}`;
  const propertyValue = (el as unknown as Record<string, unknown>)[propertyName];
  if (typeof propertyValue === "boolean") return propertyValue;
  const value = readAttribute(el, name);
  if (value == null) return fallback;
  return value !== "false";
};

const readNumber = (el: HTMLElement, name: string, fallback: number): number => {
  const propertyName = `infiniteScroll${name[0]!.toUpperCase()}${name.slice(1)}`;
  const propertyValue = (el as unknown as Record<string, unknown>)[propertyName];
  const raw = propertyValue ?? readAttribute(el, name);
  const value = Number(raw);
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
};

const optionsOf = (
  el: HTMLElement,
  value: InfiniteScrollDirectiveValue,
): InfiniteScrollDirectiveOptions => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    handler: options.handler,
    disabled: options.disabled ?? readBoolean(el, "disabled", false),
    distance: options.distance ?? readNumber(el, "distance", 0),
    delay: options.delay ?? readNumber(el, "delay", 200),
    immediate: options.immediate ?? readBoolean(el, "immediate", true),
  };
};

const clearTimer = (state: InfiniteScrollDirectiveState): void => {
  if (state.timer) clearTimeout(state.timer);
  delete state.timer;
};

const nearBottom = (el: HTMLElement, distance: number): boolean => {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= distance;
};

const schedule = (el: HTMLElement, state: InfiniteScrollDirectiveState): void => {
  const options = optionsOf(el, state.value);
  if (options.disabled || !nearBottom(el, options.distance ?? 0) || state.timer) return;
  if (!options.delay) {
    options.handler();
    return;
  }
  state.timer = setTimeout(() => {
    delete state.timer;
    const latest = optionsOf(el, state.value);
    if (!latest.disabled && nearBottom(el, latest.distance ?? 0)) latest.handler();
  }, options.delay);
};

const mount = (el: HTMLElement, binding: DirectiveBinding<InfiniteScrollDirectiveValue>): void => {
  const state: InfiniteScrollDirectiveState = {
    value: binding.value,
    onScroll: () => undefined,
  };
  state.onScroll = () => schedule(el, state);
  states.set(el, state);
  el.addEventListener("scroll", state.onScroll, { passive: true });
  if (typeof ResizeObserver !== "undefined") {
    state.observer = new ResizeObserver(state.onScroll);
    state.observer.observe(el);
  }
  if (optionsOf(el, binding.value).immediate) queueMicrotask(() => schedule(el, state));
};

const update = (el: HTMLElement, binding: DirectiveBinding<InfiniteScrollDirectiveValue>): void => {
  const state = states.get(el);
  if (!state) {
    mount(el, binding);
    return;
  }
  state.value = binding.value;
  clearTimer(state);
  if (optionsOf(el, binding.value).immediate) queueMicrotask(() => schedule(el, state));
};

const unmount = (el: HTMLElement): void => {
  const state = states.get(el);
  if (!state) return;
  clearTimer(state);
  el.removeEventListener("scroll", state.onScroll);
  state.observer?.disconnect();
  states.delete(el);
};

export const infiniteScrollDirective: DirectiveDefinition<
  InfiniteScrollDirectiveValue,
  HTMLElement
> = {
  mounted: mount,
  updated: update,
  beforeUnmount: unmount,
};

export const registerInfiniteScrollDirective = (app: Pick<ElfUIApp, "directive">): void => {
  app.directive("infinite-scroll", infiniteScrollDirective as DirectiveDefinition);
};
