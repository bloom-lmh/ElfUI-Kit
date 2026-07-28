export interface ModalOverlayEntry {
  id: symbol;
  kind: string;
}

export interface ModalOverlayStack {
  register: (entry: ModalOverlayEntry) => void;
  unregister: (id: symbol) => void;
  isTopmost: (id: symbol) => boolean;
  top: () => ModalOverlayEntry | null;
}

/** Creates an isolated stack for tests, documents, or a future application-scoped adapter. */
export const createModalOverlayStack = (): ModalOverlayStack => {
  const entries: ModalOverlayEntry[] = [];

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
    top: () => entries.at(-1) ?? null
  };
};

/**
 * Modal overlays share one process-level interaction stack.
 * This is coordination state, not component state: each overlay keeps its own model locally.
 */
export const modalOverlayStack = createModalOverlayStack();
