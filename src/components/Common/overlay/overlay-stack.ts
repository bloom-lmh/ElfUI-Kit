/** One registered overlay participating in topmost-event arbitration. */
export interface OverlayEntry {
  id: symbol;
  kind: string;
}

export interface OverlayStack {
  register: (entry: OverlayEntry) => void;
  unregister: (id: symbol) => void;
  isTopmost: (id: symbol) => boolean;
  claim: (id: symbol, event: Event) => boolean;
  top: () => OverlayEntry | null;
}

/**
 * Creates an isolated interaction stack.
 *
 * `claim()` gives one physical event to exactly one overlay. This prevents a
 * child overlay from closing and exposing its parent to the same Escape key or
 * outside click during the current dispatch.
 */
export const createOverlayStack = (): OverlayStack => {
  const entries: OverlayEntry[] = [];
  const claimedEvents = new WeakSet<Event>();

  return {
    register: (entry) => {
      const currentIndex = entries.findIndex((item) => item.id === entry.id);
      if (currentIndex >= 0) entries.splice(currentIndex, 1);
      entries.push(entry);
    },
    unregister: (id) => {
      const index = entries.findIndex((entry) => entry.id === id);
      if (index >= 0) entries.splice(index, 1);
    },
    isTopmost: (id) => entries.at(-1)?.id === id,
    claim: (id, event) => {
      if (claimedEvents.has(event) || entries.at(-1)?.id !== id) return false;
      claimedEvents.add(event);
      return true;
    },
    top: () => entries.at(-1) ?? null,
  };
};

/**
 * Overlays share one process-level interaction stack.
 * This is coordination state, not component state: each overlay keeps its own
 * rendering, model, and transitions local.
 */
export const overlayStack = createOverlayStack();
