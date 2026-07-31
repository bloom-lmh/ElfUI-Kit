import type { DirectiveDefinition, ElfUIApp } from "@elfui/core";

import {
  createControllerDirective,
  registerDirective,
  type DirectiveController,
} from "./controller";

export type IntersectHandler = (
  entries: readonly IntersectionObserverEntry[],
  observer: IntersectionObserver,
) => void;

export interface IntersectOptions extends IntersectionObserverInit {
  handler: IntersectHandler;
  disabled?: boolean;
  once?: boolean;
}

export type IntersectDirectiveValue = IntersectHandler | IntersectOptions;

interface NormalizedIntersect extends IntersectionObserverInit {
  handler: IntersectHandler;
  disabled: boolean;
  once: boolean;
}

const normalizeIntersect = (value: IntersectDirectiveValue): NormalizedIntersect => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    handler: options.handler,
    disabled: options.disabled ?? false,
    once: options.once ?? false,
    root: options.root ?? null,
    rootMargin: options.rootMargin ?? "0px",
    threshold: options.threshold ?? 0,
  };
};

export const createIntersectController = (
  element: HTMLElement,
  initialValue: IntersectDirectiveValue,
): DirectiveController<IntersectDirectiveValue> => {
  let options = normalizeIntersect(initialValue);
  let observer: IntersectionObserver | undefined;

  const disconnect = (): void => {
    observer?.disconnect();
    observer = undefined;
  };

  const connect = (): void => {
    disconnect();
    if (options.disabled || typeof IntersectionObserver === "undefined") return;
    observer = new IntersectionObserver((entries, instance) => {
      options.handler(entries, instance);
      if (options.once && entries.some((entry) => entry.isIntersecting)) {
        disconnect();
      }
    }, options);
    observer.observe(element);
  };

  connect();
  return {
    update(value) {
      options = normalizeIntersect(value);
      connect();
    },
    dispose: disconnect,
  };
};

export const intersectDirective = createControllerDirective(createIntersectController);

export type MutateHandler = (
  records: readonly MutationRecord[],
  observer: MutationObserver,
) => void;

export interface MutateOptions {
  handler: MutateHandler;
  disabled?: boolean;
  observer?: MutationObserverInit;
}

export type MutateDirectiveValue = MutateHandler | MutateOptions;

const normalizeMutate = (
  value: MutateDirectiveValue,
): Required<Pick<MutateOptions, "handler" | "disabled" | "observer">> => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    handler: options.handler,
    disabled: options.disabled ?? false,
    observer: options.observer ?? {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    },
  };
};

/**
 * Observes mutations on any DOM node while retaining the directive controller lifecycle.
 *
 * @param element - Element, document, or shadow root that owns the observed subtree.
 * @param initialValue - Mutation callback and native observer configuration.
 * @returns A controller that can reconnect or dispose the observer deterministically.
 */
export const createMutateController = (
  element: Node,
  initialValue: MutateDirectiveValue,
): DirectiveController<MutateDirectiveValue> => {
  let options = normalizeMutate(initialValue);
  let observer: MutationObserver | undefined;

  const disconnect = (): void => {
    observer?.disconnect();
    observer = undefined;
  };

  const connect = (): void => {
    disconnect();
    if (options.disabled || typeof MutationObserver === "undefined") return;
    observer = new MutationObserver((records, instance) => {
      options.handler(records, instance);
    });
    observer.observe(element, options.observer);
  };

  connect();
  return {
    update(value) {
      options = normalizeMutate(value);
      connect();
    },
    dispose: disconnect,
  };
};

export const mutateDirective = createControllerDirective(createMutateController);

export type ResizeHandler = (
  entries: readonly ResizeObserverEntry[],
  observer: ResizeObserver,
) => void;

export interface ResizeOptions {
  handler: ResizeHandler;
  disabled?: boolean;
  box?: ResizeObserverBoxOptions | undefined;
}

export type ResizeDirectiveValue = ResizeHandler | ResizeOptions;

const normalizeResize = (
  value: ResizeDirectiveValue,
): Required<Pick<ResizeOptions, "handler" | "disabled">> & Pick<ResizeOptions, "box"> => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    handler: options.handler,
    disabled: options.disabled ?? false,
    box: options.box,
  };
};

export const createResizeController = (
  element: HTMLElement,
  initialValue: ResizeDirectiveValue,
): DirectiveController<ResizeDirectiveValue> => {
  let options = normalizeResize(initialValue);
  let observer: ResizeObserver | undefined;

  const disconnect = (): void => {
    observer?.disconnect();
    observer = undefined;
  };

  const connect = (): void => {
    disconnect();
    if (options.disabled || typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver((entries, instance) => {
      options.handler(entries, instance);
    });
    observer.observe(element, options.box ? { box: options.box } : undefined);
  };

  connect();
  return {
    update(value) {
      options = normalizeResize(value);
      connect();
    },
    dispose: disconnect,
  };
};

export const resizeDirective = createControllerDirective(createResizeController);

export const registerIntersectDirective = (app: Pick<ElfUIApp, "directive">): void =>
  registerDirective(app, "intersect", intersectDirective as DirectiveDefinition);

export const registerMutateDirective = (app: Pick<ElfUIApp, "directive">): void =>
  registerDirective(app, "mutate", mutateDirective as DirectiveDefinition);

export const registerResizeDirective = (app: Pick<ElfUIApp, "directive">): void =>
  registerDirective(app, "resize", resizeDirective as DirectiveDefinition);
