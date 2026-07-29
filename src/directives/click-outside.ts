import type {
  DirectiveBinding,
  DirectiveDefinition,
  ElfUIApp
} from "@elfui/core";

export type ClickOutsideEventName = "click" | "pointerdown";
export type ClickOutsideHandler = (event: MouseEvent | PointerEvent) => void;
export type ClickOutsideExclude =
  | Element
  | string
  | null
  | undefined
  | (() => Element | readonly Element[] | null | undefined);

export interface ClickOutsideOptions {
  handler: ClickOutsideHandler;
  disabled?: boolean;
  event?: ClickOutsideEventName;
  capture?: boolean;
  exclude?: ClickOutsideExclude | readonly ClickOutsideExclude[];
}

export type ClickOutsideDirectiveValue = ClickOutsideHandler | ClickOutsideOptions;

export interface ClickOutsideController {
  update(value: ClickOutsideDirectiveValue): void;
  dispose(): void;
}

interface NormalizedOptions extends ClickOutsideOptions {
  event: ClickOutsideEventName;
  capture: boolean;
}

const normalize = (value: ClickOutsideDirectiveValue): NormalizedOptions => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    ...options,
    event: options.event ?? "pointerdown",
    capture: options.capture ?? true
  };
};

const resolveExclude = (
  element: Element,
  exclude: ClickOutsideOptions["exclude"]
): Element[] => {
  const values = Array.isArray(exclude) ? exclude : [exclude];
  const root = element.getRootNode();
  const targets: Element[] = [];

  for (const value of values) {
    const resolved = typeof value === "function" ? value() : value;
    const entries = Array.isArray(resolved) ? resolved : [resolved];
    for (const entry of entries) {
      if (entry instanceof Element) targets.push(entry);
      const queryRoot = root as ParentNode;
      if (typeof entry === "string" && typeof queryRoot.querySelectorAll === "function") {
        targets.push(...Array.from(queryRoot.querySelectorAll<Element>(entry)));
      }
    }
  }

  return targets;
};

export const createClickOutsideController = (
  element: Element,
  initialValue: ClickOutsideDirectiveValue
): ClickOutsideController => {
  let options = normalize(initialValue);
  let listeningEvent = options.event;
  let listeningCapture = options.capture;

  const onDocumentEvent = (event: Event): void => {
    if (options.disabled) return;
    const path = event.composedPath();
    if (path.includes(element)) return;
    if (resolveExclude(element, options.exclude).some((target) => path.includes(target))) return;
    options.handler(event as MouseEvent | PointerEvent);
  };

  const listen = (): void => {
    if (typeof document === "undefined") return;
    document.addEventListener(listeningEvent, onDocumentEvent, listeningCapture);
  };

  const unlisten = (): void => {
    if (typeof document === "undefined") return;
    document.removeEventListener(listeningEvent, onDocumentEvent, listeningCapture);
  };

  listen();

  return {
    update(value) {
      const next = normalize(value);
      const shouldRebind =
        next.event !== listeningEvent || next.capture !== listeningCapture;
      if (shouldRebind) unlisten();
      options = next;
      if (shouldRebind) {
        listeningEvent = next.event;
        listeningCapture = next.capture;
        listen();
      }
    },
    dispose: unlisten
  };
};

const controllers = new WeakMap<Element, ClickOutsideController>();

const mount = (
  element: HTMLElement,
  binding: DirectiveBinding<ClickOutsideDirectiveValue>
): void => {
  controllers.get(element)?.dispose();
  controllers.set(element, createClickOutsideController(element, binding.value));
};

const update = (
  element: HTMLElement,
  binding: DirectiveBinding<ClickOutsideDirectiveValue>
): void => {
  const controller = controllers.get(element);
  if (controller) controller.update(binding.value);
  else mount(element, binding);
};

const unmount = (element: HTMLElement): void => {
  controllers.get(element)?.dispose();
  controllers.delete(element);
};

export const clickOutsideDirective: DirectiveDefinition<
  ClickOutsideDirectiveValue,
  HTMLElement
> = {
  mounted: mount,
  updated: update,
  beforeUnmount: unmount
};

export const registerClickOutsideDirective = (
  app: Pick<ElfUIApp, "directive">
): void => {
  app.directive("click-outside", clickOutsideDirective as DirectiveDefinition);
};
