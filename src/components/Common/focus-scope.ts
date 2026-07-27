const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']"
].join(",");

const isFocusable = (element: HTMLElement): boolean =>
  !element.hasAttribute("disabled") &&
  !element.hasAttribute("hidden") &&
  element.getAttribute("aria-hidden") !== "true" &&
  !element.closest("[inert]");

/** Collects focusable descendants across nested custom-element shadow roots. */
export const collectFocusable = (root: ParentNode): HTMLElement[] => {
  const result: HTMLElement[] = [];

  const visit = (parent: ParentNode): void => {
    for (const child of Array.from(parent.children)) {
      if (!(child instanceof HTMLElement)) continue;
      if (child.matches(FOCUSABLE_SELECTOR) && isFocusable(child)) result.push(child);
      if (child.shadowRoot) visit(child.shadowRoot);
      visit(child);
    }
  };

  visit(root);
  return result;
};

/** Returns the innermost active element when focus is inside nested shadow roots. */
export const deepActiveElement = (): HTMLElement | null => {
  let active = document.activeElement as HTMLElement | null;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement as HTMLElement;
  }
  return active;
};
