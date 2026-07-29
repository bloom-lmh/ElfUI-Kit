export type ScrollAxis = "x" | "y";

export type ScrollContainer = Window | HTMLElement;

export type ScrollContainerTarget =
  | string
  | ScrollContainer
  | (() => ScrollContainer | null)
  | null;

export type ScrollTarget = number | string | Element;

export type ScrollRoot = Document | ShadowRoot;

const query = <T extends Element>(
  root: ParentNode | null | undefined,
  selector: string,
): T | null => {
  if (!root || !selector) return null;
  try {
    return root.querySelector<T>(selector);
  } catch {
    return null;
  }
};

export const isWindowContainer = (
  container: ScrollContainer,
): container is Window =>
  typeof window !== "undefined" && container === window;

export const resolveScrollContainer = (
  target: ScrollContainerTarget | undefined,
  root?: ScrollRoot | null,
): ScrollContainer | null => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }
  if (typeof target === "function") return target() ?? window;
  if (typeof target === "string" && target) {
    return query<HTMLElement>(root, target) ??
      query<HTMLElement>(document, target) ??
      window;
  }
  if (
    target &&
    typeof target === "object" &&
    "addEventListener" in target
  ) {
    return target;
  }
  return window;
};

export const resolveScrollTarget = (
  target: ScrollTarget,
  root?: ScrollRoot | null,
): number | Element | null => {
  if (typeof target === "number") {
    return Number.isFinite(target) ? target : null;
  }
  if (typeof target === "string") {
    if (typeof document === "undefined") return null;
    return query(root, target) ?? query(document, target);
  }
  return target && typeof target.getBoundingClientRect === "function"
    ? target
    : null;
};

const composedParent = (element: Element): HTMLElement | null => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host as HTMLElement : null;
};

export const findScrollContainer = (element: Element): HTMLElement | null => {
  let current = composedParent(element);
  while (current && current !== document.documentElement) {
    const overflowY = getComputedStyle(current).overflowY;
    if (/(auto|scroll|overlay)/.test(overflowY) && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = composedParent(current);
  }
  return null;
};

export const getScrollPosition = (
  container: ScrollContainer,
  axis: ScrollAxis = "y",
): number => {
  if (!isWindowContainer(container)) {
    return axis === "x" ? container.scrollLeft : container.scrollTop;
  }
  if (axis === "x") {
    return window.scrollX ||
      document.documentElement.scrollLeft ||
      document.body.scrollLeft ||
      0;
  }
  return window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;
};

export const getMaxScrollPosition = (
  container: ScrollContainer,
  axis: ScrollAxis = "y",
): number => {
  if (!isWindowContainer(container)) {
    return Math.max(
      0,
      axis === "x"
        ? container.scrollWidth - container.clientWidth
        : container.scrollHeight - container.clientHeight,
    );
  }
  const documentElement = document.documentElement;
  const body = document.body;
  const extent = axis === "x"
    ? Math.max(documentElement.scrollWidth, body.scrollWidth)
    : Math.max(documentElement.scrollHeight, body.scrollHeight);
  const viewport = axis === "x" ? window.innerWidth : window.innerHeight;
  return Math.max(0, extent - viewport);
};

export const getElementScrollPosition = (
  element: Element,
  container: ScrollContainer,
  axis: ScrollAxis = "y",
): number => {
  const rect = element.getBoundingClientRect();
  const current = getScrollPosition(container, axis);
  if (isWindowContainer(container)) {
    return current + (axis === "x" ? rect.left : rect.top);
  }
  const containerRect = container.getBoundingClientRect();
  return current +
    (axis === "x"
      ? rect.left - containerRect.left
      : rect.top - containerRect.top);
};

export const setScrollPosition = (
  container: ScrollContainer,
  position: number,
  axis: ScrollAxis = "y",
): void => {
  const options: ScrollToOptions = axis === "x"
    ? { left: position, behavior: "auto" }
    : { top: position, behavior: "auto" };
  if (isWindowContainer(container)) {
    window.scrollTo(options);
    return;
  }
  if (typeof container.scrollTo === "function") {
    container.scrollTo(options);
  } else if (axis === "x") {
    container.scrollLeft = position;
  } else {
    container.scrollTop = position;
  }
};
