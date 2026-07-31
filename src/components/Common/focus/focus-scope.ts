const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

const isFocusable = (element: HTMLElement): boolean =>
  !element.hasAttribute("disabled") &&
  !element.hasAttribute("hidden") &&
  element.getAttribute("aria-hidden") !== "true" &&
  !element.closest("[inert]");

/** Collects focusable descendants across nested custom-element shadow roots. */
export const collectFocusable = (root: ParentNode): HTMLElement[] => {
  const result: HTMLElement[] = [];
  const visited = new Set<HTMLElement>();

  const visitElement = (element: HTMLElement): void => {
    if (visited.has(element)) return;
    visited.add(element);
    if (element.matches(FOCUSABLE_SELECTOR) && isFocusable(element)) result.push(element);
    if (element.shadowRoot) visit(element.shadowRoot);

    if (element instanceof HTMLSlotElement) {
      const assigned = element.assignedElements({ flatten: true });
      if (assigned.length > 0) {
        for (const child of assigned) {
          if (child instanceof HTMLElement) visitElement(child);
        }
        return;
      }
    }
    visit(element);
  };

  const visit = (parent: ParentNode): void => {
    for (const child of Array.from(parent.children)) {
      if (!(child instanceof HTMLElement)) continue;
      visitElement(child);
    }
  };

  visit(root);
  return result;
};

/** Returns the innermost active element when focus is inside nested shadow roots. */
export const deepActiveElement = (): HTMLElement | null => {
  let active = document.activeElement as HTMLElement | null;
  while (active?.shadowRoot) {
    let nested: Element | null = null;
    try {
      nested = active.shadowRoot.activeElement;
    } catch {
      // A test DOM or browser teardown can leave a detached shadow root behind.
      return active.isConnected ? active : null;
    }
    if (!(nested instanceof HTMLElement)) break;
    active = nested;
  }
  return active?.isConnected ? active : null;
};

export interface FocusScopeController {
  capture: () => void;
  focusInitial: () => boolean;
  restore: () => boolean;
  trap: (event: KeyboardEvent) => boolean;
}

export interface FocusScopeOptions {
  panel: () => HTMLElement | null;
  onInitialFocus?: (() => void) | undefined;
  onRestoreFocus?: (() => void) | undefined;
}

/** Checks containment through assigned slots and nested shadow-host boundaries. */
const isFocusInside = (panel: HTMLElement, active: HTMLElement | null): boolean => {
  let current: Node | null = active;
  const visited = new Set<Node>();
  while (current && !visited.has(current)) {
    if (current === panel) return true;
    visited.add(current);
    if (current instanceof Element && current.assignedSlot) {
      current = current.assignedSlot;
      continue;
    }
    if (current.parentNode) {
      current = current.parentNode;
      continue;
    }
    const root = current.getRootNode();
    current = root instanceof ShadowRoot ? root.host : null;
  }
  return false;
};

/** Keeps Tab focus inside one panel, including focusable descendants in nested shadow roots. */
export const trapFocus = (event: KeyboardEvent, panel: HTMLElement): boolean => {
  if (event.key !== "Tab") return false;

  const focusable = collectFocusable(panel);
  if (focusable.length === 0) {
    event.preventDefault();
    panel.focus({ preventScroll: true });
    return true;
  }

  const eventPath = event.composedPath();
  const activeFromEvent = focusable.find((element) => eventPath.includes(element));
  const activeFromRoot = focusable.find((element) => {
    const root = element.getRootNode() as Document | ShadowRoot;
    try {
      return root.activeElement === element;
    } catch {
      // Happy DOM can expose a detached ShadowRoot while focus is moving between owners.
      return false;
    }
  });
  const active = activeFromEvent ?? activeFromRoot ?? deepActiveElement();
  const activeIsInside = Boolean(activeFromEvent || activeFromRoot) || isFocusInside(panel, active);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return false;

  if (event.shiftKey && (active === first || !activeIsInside)) {
    event.preventDefault();
    last.focus({ preventScroll: true });
    return true;
  }
  if (!event.shiftKey && (active === last || !activeIsInside)) {
    event.preventDefault();
    first.focus({ preventScroll: true });
    return true;
  }
  return false;
};

/**
 * Stateful focus policy for one overlay instance.
 * The caller owns visibility and animation state; this controller only owns focus state.
 */
export const createFocusScope = (options: FocusScopeOptions): FocusScopeController => {
  let returnTarget: HTMLElement | null = null;
  let captured = false;

  return {
    capture: () => {
      if (captured) return;
      returnTarget = deepActiveElement();
      captured = true;
    },
    focusInitial: () => {
      const panel = options.panel();
      if (!panel) return false;
      const focusable = collectFocusable(panel);
      const target =
        focusable.find(
          (element) => element.hasAttribute("autofocus") || element.hasAttribute("data-autofocus"),
        ) ??
        focusable[0] ??
        panel;
      target.focus({ preventScroll: true });
      options.onInitialFocus?.();
      return true;
    },
    restore: () => {
      if (!captured) return false;
      const target = returnTarget;
      returnTarget = null;
      captured = false;
      if (target?.isConnected) target.focus({ preventScroll: true });
      options.onRestoreFocus?.();
      return Boolean(target?.isConnected);
    },
    trap: (event) => {
      const panel = options.panel();
      return panel ? trapFocus(event, panel) : false;
    },
  };
};
