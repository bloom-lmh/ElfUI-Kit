import type { DirectiveBinding, DirectiveDefinition, ElfUIApp } from "@elfui/core";

export type DraggableAxis = "x" | "y";
export type DraggablePlacement = "before" | "after" | "inside";
export type DraggableMode = "sort" | "inside";

export interface DraggableContext<T = unknown> {
  element: HTMLElement;
  key: string;
  data: T;
  index: number;
}

export interface DraggableDropDetail<T = unknown> {
  source: DraggableContext<T>;
  target: DraggableContext<T>;
  placement: DraggablePlacement;
  event: DragEvent;
}

export interface DraggableOptions<T = unknown> {
  key?: string | number;
  data?: T;
  group?: string;
  draggable?: boolean;
  droppable?: boolean;
  disabled?: boolean;
  handle?: string;
  axis?: DraggableAxis;
  mode?: DraggableMode;
  canDrop?: (detail: DraggableDropDetail<T>) => boolean;
  onStart?: (context: DraggableContext<T>, event: DragEvent) => void;
  onOver?: (detail: DraggableDropDetail<T>) => void;
  onLeave?: (context: DraggableContext<T>, event: DragEvent) => void;
  onDrop?: (detail: DraggableDropDetail<T>) => void;
  onEnd?: (context: DraggableContext<T>, event: DragEvent) => void;
}

export type DraggableDirectiveValue<T = unknown> = DraggableOptions<T>;

interface DraggableState {
  value: DraggableDirectiveValue;
  listeners: {
    dragstart: (event: DragEvent) => void;
    dragenter: (event: DragEvent) => void;
    dragover: (event: DragEvent) => void;
    dragleave: (event: DragEvent) => void;
    drop: (event: DragEvent) => void;
    dragend: (event: DragEvent) => void;
  };
}

interface ActiveDrag {
  element: HTMLElement;
  options: DraggableOptions;
}

const states = new WeakMap<HTMLElement, DraggableState>();
let activeDrag: ActiveDrag | null = null;
let activeTarget: HTMLElement | null = null;

const optionsOf = (element: HTMLElement): DraggableOptions => states.get(element)?.value ?? {};

const itemIndex = (element: HTMLElement): number =>
  Array.from(element.parentElement?.children ?? []).indexOf(element);

const contextOf = <T>(element: HTMLElement, options: DraggableOptions<T>): DraggableContext<T> => ({
  element,
  key: String(options.key ?? element.dataset.draggableKey ?? itemIndex(element)),
  data: options.data as T,
  index: itemIndex(element),
});

const sameGroup = (source: DraggableOptions, target: DraggableOptions): boolean =>
  String(source.group ?? "default") === String(target.group ?? "default");

const placementOf = (
  target: HTMLElement,
  options: DraggableOptions,
  event: DragEvent,
): DraggablePlacement => {
  if (options.mode === "inside") return "inside";
  const rect = target.getBoundingClientRect();
  const axis = options.axis === "x" ? "x" : "y";
  const pointer = axis === "x" ? event.clientX : event.clientY;
  const midpoint = axis === "x" ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
  return pointer < midpoint ? "before" : "after";
};

const clearTarget = (): void => {
  if (!activeTarget) return;
  activeTarget.classList.remove("is-drag-over");
  activeTarget.removeAttribute("data-drag-placement");
  activeTarget = null;
};

const dropDetail = (
  targetElement: HTMLElement,
  targetOptions: DraggableOptions,
  event: DragEvent,
): DraggableDropDetail | null => {
  if (!activeDrag || activeDrag.element === targetElement) return null;
  if (!sameGroup(activeDrag.options, targetOptions)) return null;
  const detail: DraggableDropDetail = {
    source: contextOf(activeDrag.element, activeDrag.options),
    target: contextOf(targetElement, targetOptions),
    placement: placementOf(targetElement, targetOptions, event),
    event,
  };
  return targetOptions.canDrop?.(detail) === false ? null : detail;
};

const dispatch = (element: HTMLElement, name: string, detail: unknown): void => {
  element.dispatchEvent(
    new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail,
    }),
  );
};

const syncElement = (element: HTMLElement, options: DraggableOptions): void => {
  const enabled = options.disabled !== true;
  const canDrag = enabled && options.draggable !== false;
  element.draggable = canDrag;
  element.toggleAttribute("data-draggable", canDrag);
  element.toggleAttribute("data-droppable", enabled && options.droppable !== false);
  if (options.key == null) element.removeAttribute("data-draggable-key");
  else element.dataset.draggableKey = String(options.key);
};

const mount = (element: HTMLElement, binding: DirectiveBinding<DraggableDirectiveValue>): void => {
  const listeners = {
    dragstart: (event: DragEvent): void => {
      const options = optionsOf(element);
      if (options.disabled || options.draggable === false) {
        event.preventDefault();
        return;
      }
      const origin = event.composedPath()[0];
      if (options.handle && origin instanceof Element && !origin.closest(options.handle)) {
        event.preventDefault();
        return;
      }
      clearTarget();
      activeDrag = { element, options };
      element.classList.add("is-dragging");
      element.setAttribute("aria-grabbed", "true");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(options.key ?? ""));
      }
      const context = contextOf(element, options);
      options.onStart?.(context, event);
      dispatch(element, "elf-drag-start", { context, event });
    },
    dragenter: (event: DragEvent): void => {
      const options = optionsOf(element);
      if (options.disabled || options.droppable === false) return;
      const detail = dropDetail(element, options, event);
      if (!detail) return;
      event.preventDefault();
      clearTarget();
      activeTarget = element;
      element.classList.add("is-drag-over");
      element.dataset.dragPlacement = detail.placement;
      options.onOver?.(detail);
      dispatch(element, "elf-drag-over", detail);
    },
    dragover: (event: DragEvent): void => {
      const options = optionsOf(element);
      if (options.disabled || options.droppable === false) return;
      const detail = dropDetail(element, options, event);
      if (!detail) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      if (activeTarget !== element) {
        clearTarget();
        activeTarget = element;
        element.classList.add("is-drag-over");
      }
      element.dataset.dragPlacement = detail.placement;
    },
    dragleave: (event: DragEvent): void => {
      if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
      if (activeTarget === element) clearTarget();
      optionsOf(element).onLeave?.(contextOf(element, optionsOf(element)), event);
    },
    drop: (event: DragEvent): void => {
      const options = optionsOf(element);
      const detail = dropDetail(element, options, event);
      if (!detail) return;
      event.preventDefault();
      clearTarget();
      options.onDrop?.(detail);
      dispatch(element, "elf-drop", detail);
    },
    dragend: (event: DragEvent): void => {
      const options = optionsOf(element);
      element.classList.remove("is-dragging");
      element.removeAttribute("aria-grabbed");
      clearTarget();
      const context = contextOf(element, options);
      options.onEnd?.(context, event);
      dispatch(element, "elf-drag-end", { context, event });
      activeDrag = null;
    },
  };

  states.set(element, { value: binding.value ?? {}, listeners });
  syncElement(element, binding.value ?? {});
  for (const [name, listener] of Object.entries(listeners)) {
    element.addEventListener(name, listener as EventListener);
  }
};

const update = (element: HTMLElement, binding: DirectiveBinding<DraggableDirectiveValue>): void => {
  const state = states.get(element);
  if (!state) {
    mount(element, binding);
    return;
  }
  state.value = binding.value ?? {};
  syncElement(element, state.value);
};

const unmount = (element: HTMLElement): void => {
  const state = states.get(element);
  if (!state) return;
  for (const [name, listener] of Object.entries(state.listeners)) {
    element.removeEventListener(name, listener as EventListener);
  }
  if (activeDrag?.element === element) activeDrag = null;
  if (activeTarget === element) clearTarget();
  element.classList.remove("is-dragging", "is-drag-over");
  element.removeAttribute("aria-grabbed");
  element.removeAttribute("data-drag-placement");
  states.delete(element);
};

export const draggableDirective: DirectiveDefinition<DraggableDirectiveValue, HTMLElement> = {
  mounted: mount,
  updated: update,
  beforeUnmount: unmount,
};

export const registerDraggableDirective = (app: Pick<ElfUIApp, "directive">): void => {
  app.directive("draggable", draggableDirective as DirectiveDefinition);
};
