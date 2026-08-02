import type { DirectiveDefinition, ElfUIApp } from "@elfui/core";
import {
  createControllerDirective,
  registerDirective,
  type DirectiveController,
} from "./controller";

export type ClickOutsideEventName = "click" | "pointerdown";
export type ClickOutsideHandler = (event: MouseEvent | PointerEvent) => void;
export type ClickOutsideExclude =
  Element | string | null | undefined | (() => Element | readonly Element[] | null | undefined);

export interface ClickOutsideOptions {
  handler: ClickOutsideHandler;
  disabled?: boolean;
  event?: ClickOutsideEventName;
  capture?: boolean;
  exclude?: ClickOutsideExclude | readonly ClickOutsideExclude[];
}

export type ClickOutsideDirectiveValue = ClickOutsideHandler | ClickOutsideOptions;

export type ClickOutsideController = DirectiveController<ClickOutsideDirectiveValue>;

interface NormalizedOptions extends ClickOutsideOptions {
  event: ClickOutsideEventName;
  capture: boolean;
}

const normalize = (value: ClickOutsideDirectiveValue): NormalizedOptions => {
  const options = typeof value === "function" ? { handler: value } : value;
  return {
    ...options,
    event: options.event ?? "pointerdown",
    capture: options.capture ?? true,
  };
};

const resolveExclude = (element: Element, exclude: ClickOutsideOptions["exclude"]): Element[] => {
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

const pathIntersects = (path: readonly EventTarget[], target: Element): boolean =>
  path.some((entry) => {
    if (entry === target) return true;
    if (!(entry instanceof Node)) return false;
    if (target.contains(entry)) return true;
    return target instanceof HTMLElement && Boolean(target.shadowRoot?.contains(entry));
  });

export const createClickOutsideController = (
  element: Element,
  initialValue: ClickOutsideDirectiveValue,
): ClickOutsideController => {
  let options = normalize(initialValue);
  let listeningEvent = options.event;
  let listeningCapture = options.capture;
  const ownerDocument = element.ownerDocument;

  const handleEvent = (event: Event): void => {
    if (options.disabled) return;
    const path = event.composedPath();
    if (pathIntersects(path, element)) return;
    if (resolveExclude(element, options.exclude).some((target) => pathIntersects(path, target)))
      return;
    options.handler(event as MouseEvent | PointerEvent);
  };

  const listen = (): void => {
    ownerDocument.addEventListener(listeningEvent, handleEvent, listeningCapture);
  };

  const unlisten = (): void => {
    ownerDocument.removeEventListener(listeningEvent, handleEvent, listeningCapture);
  };

  listen();

  return {
    update(value) {
      const next = normalize(value);
      const shouldRebind = next.event !== listeningEvent || next.capture !== listeningCapture;
      if (shouldRebind) unlisten();
      options = next;
      if (shouldRebind) {
        listeningEvent = next.event;
        listeningCapture = next.capture;
        listen();
      }
    },
    dispose: unlisten,
  };
};

export const clickOutsideDirective: DirectiveDefinition<ClickOutsideDirectiveValue, HTMLElement> =
  createControllerDirective(createClickOutsideController);

export const registerClickOutsideDirective = (app: Pick<ElfUIApp, "directive">): void => {
  registerDirective(app, "click-outside", clickOutsideDirective as DirectiveDefinition);
};
