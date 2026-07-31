import type { DirectiveBinding } from "@elfui/core";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createMutateController,
  intersectDirective,
  mutateDirective,
  registerIntersectDirective,
  registerMutateDirective,
  registerResizeDirective,
  resizeDirective,
  type IntersectDirectiveValue,
  type MutateDirectiveValue,
  type ResizeDirectiveValue,
} from "./observers";

const binding = <Value>(value: Value): DirectiveBinding<Value> => ({
  value,
  oldValue: undefined,
  modifiers: {},
});

const hooks = <Value>(definition: unknown) =>
  definition as {
    mounted: (element: HTMLElement, binding: DirectiveBinding<Value>) => void;
    updated: (element: HTMLElement, binding: DirectiveBinding<Value>) => void;
    beforeUnmount: (element: HTMLElement) => void;
  };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("observer directives", () => {
  it("observes intersection once and disconnects", () => {
    const handler = vi.fn();
    const observe = vi.fn();
    const disconnect = vi.fn();
    let callback!: IntersectionObserverCallback;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(next: IntersectionObserverCallback) {
          callback = next;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const element = document.createElement("div");
    const directive = hooks<IntersectDirectiveValue>(intersectDirective);
    directive.mounted(element, binding({ handler, once: true }));
    callback([{ isIntersecting: true }] as IntersectionObserverEntry[], {} as IntersectionObserver);

    expect(observe).toHaveBeenCalledWith(element);
    expect(handler).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
    directive.beforeUnmount(element);
  });

  it("reconnects mutation observation when options update", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    const instances: MutationObserverCallback[] = [];
    vi.stubGlobal(
      "MutationObserver",
      class {
        constructor(callback: MutationObserverCallback) {
          instances.push(callback);
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const element = document.createElement("div");
    const handler = vi.fn();
    const directive = hooks<MutateDirectiveValue>(mutateDirective);
    directive.mounted(element, binding(handler));
    directive.updated(element, binding({ handler, observer: { childList: true } }));
    instances.at(-1)?.([], {} as MutationObserver);

    expect(observe).toHaveBeenLastCalledWith(element, { childList: true });
    expect(disconnect).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledOnce();
    directive.beforeUnmount(element);
  });

  it("supports document and shadow-root mutation targets", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "MutationObserver",
      class {
        observe = observe;
        disconnect = disconnect;
      },
    );
    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });

    const documentController = createMutateController(document, vi.fn());
    const shadowController = createMutateController(shadowRoot, vi.fn());

    expect(observe).toHaveBeenNthCalledWith(1, document, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    expect(observe).toHaveBeenNthCalledWith(2, shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    documentController.dispose();
    shadowController.dispose();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it("forwards resize entries and supports disabled updates", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let callback!: ResizeObserverCallback;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(next: ResizeObserverCallback) {
          callback = next;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const element = document.createElement("div");
    const handler = vi.fn();
    const directive = hooks<ResizeDirectiveValue>(resizeDirective);
    directive.mounted(element, binding({ handler, box: "border-box" }));
    callback([], {} as ResizeObserver);
    directive.updated(element, binding({ handler, disabled: true }));

    expect(observe).toHaveBeenCalledWith(element, { box: "border-box" });
    expect(handler).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalled();
    directive.beforeUnmount(element);
  });

  it("registers all observer directives at application scope", () => {
    const directive = vi.fn();
    const app = { directive } as never;
    registerIntersectDirective(app);
    registerMutateDirective(app);
    registerResizeDirective(app);
    expect(directive.mock.calls.map(([name]) => name)).toEqual(["intersect", "mutate", "resize"]);
  });
});
