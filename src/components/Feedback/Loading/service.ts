import { registerComponents } from "@elfui/core";

import { Loading } from "./index";
import {
  resolveServiceOptions,
  useServiceDefaults,
  type ServiceDefaultsReader,
} from "../../Providers/service-defaults";
import type { LoadingApi, LoadingInstance, LoadingOptions, LoadingTarget } from "./types";

interface LoadingElement extends HTMLElement {
  loading: boolean;
  text: string;
  fullscreen: boolean;
  closable: boolean;
  background: string;
  variant: string;
  svg: string;
  svgViewBox: string;
  lock: boolean;
}

interface TargetPositionState {
  count: number;
  inlinePosition: string;
}

const targetPositionStates = new WeakMap<HTMLElement, TargetPositionState>();

const resolveTarget = (target: LoadingTarget | undefined): HTMLElement => {
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string") {
    try {
      const matched = document.querySelector<HTMLElement>(target);
      if (matched) return matched;
    } catch {
      // Invalid selectors fall back to the document body.
    }
  }
  return document.body;
};

const acquireTargetPosition = (target: HTMLElement): void => {
  const current = targetPositionStates.get(target);
  if (current) {
    current.count += 1;
    return;
  }

  const state: TargetPositionState = { count: 1, inlinePosition: target.style.position };
  targetPositionStates.set(target, state);
  if (getComputedStyle(target).position === "static") target.style.position = "relative";
};

const releaseTargetPosition = (target: HTMLElement): void => {
  const state = targetPositionStates.get(target);
  if (!state) return;
  state.count -= 1;
  if (state.count > 0) return;
  target.style.position = state.inlinePosition;
  targetPositionStates.delete(target);
};

const applyBodyTargetGeometry = (el: HTMLElement, target: HTMLElement): (() => void) => {
  const update = (): void => {
    if (target === document.body) {
      el.style.inset = "0";
      el.style.width = `${Math.max(document.documentElement.scrollWidth, window.innerWidth)}px`;
      el.style.height = `${Math.max(document.documentElement.scrollHeight, window.innerHeight)}px`;
      return;
    }

    const rect = target.getBoundingClientRect();
    el.style.inset = "auto";
    el.style.left = `${rect.left + window.scrollX}px`;
    el.style.top = `${rect.top + window.scrollY}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
  };

  update();
  window.addEventListener("resize", update);
  window.addEventListener("scroll", update, true);
  return () => {
    window.removeEventListener("resize", update);
    window.removeEventListener("scroll", update, true);
  };
};

registerComponents(Loading);

/**
 * Creates an imperative Loading host around the public component contract.
 *
 * @remarks Target geometry remains service-owned, while the connected
 * component delegates body locking to Core's shared `useScrollLock` owner.
 */
const createLoading = (
  input: LoadingOptions = {},
  defaults?: Partial<LoadingOptions>,
): LoadingInstance => {
  const options = resolveServiceOptions(defaults, input);
  const target = resolveTarget(options.target);
  const fullscreen = options.fullscreen ?? options.target == null;
  const closable = fullscreen && (options.closable ?? true);
  const appendToBody = fullscreen || Boolean(options.body);
  const appendTarget = appendToBody ? document.body : target;
  const el = document.createElement("elf-loading") as LoadingElement;
  const previousActive = closable ? (document.activeElement as HTMLElement | null) : null;

  el.loading = true;
  el.text = options.text ?? "";
  el.fullscreen = fullscreen;
  el.closable = closable;
  el.background = options.background ?? "rgba(255,255,255,0.72)";
  el.variant = options.variant ?? "spinner";
  el.svg = options.svg ?? "";
  el.svgViewBox = options.svgViewBox ?? "0 0 50 50";
  el.lock = options.lock ?? false;
  el.setAttribute("data-loading-service", "");
  el.style.zIndex = "10000";

  for (const className of options.customClass?.split(/\s+/) ?? []) {
    if (className) el.classList.add(className);
  }

  let releaseGeometry: (() => void) | undefined;
  if (fullscreen) {
    el.style.position = "fixed";
    el.style.inset = "0";
  } else if (appendToBody) {
    el.style.position = "absolute";
    releaseGeometry = applyBodyTargetGeometry(el, target);
  } else {
    acquireTargetPosition(target);
    el.style.position = "absolute";
    el.style.inset = "0";
  }

  appendTarget.appendChild(el);

  let closed = false;
  const close = (): void => {
    if (closed) return;
    closed = true;
    releaseGeometry?.();
    if (!fullscreen && !appendToBody) releaseTargetPosition(target);
    el.loading = false;
    el.remove();
    if (previousActive?.isConnected) previousActive.focus();
    options.onClose?.();
  };

  el.addEventListener("close", close, { once: true });
  if (closable) {
    queueMicrotask(() => el.shadowRoot?.querySelector<HTMLButtonElement>(".close")?.focus());
  }

  return {
    close,
    setText(text: string): void {
      if (!closed) el.text = text;
    },
  };
};

const createLoadingApi =
  (readDefaults?: ServiceDefaultsReader<"loading">): LoadingApi =>
  (options = {}) =>
    createLoading(options, readDefaults?.());

export const ElfLoading = createLoadingApi();

/** Returns a Loading API bound to the nearest ConfigProvider. */
export const useLoading = (): LoadingApi => createLoadingApi(useServiceDefaults("loading"));
