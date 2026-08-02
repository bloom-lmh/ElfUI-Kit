import {
  createOverlayStack,
  overlayStack,
  type OverlayEntry,
  type OverlayStack,
} from "./overlay-stack";

/** @deprecated Internal compatibility alias. Use the generic overlay stack directly. */
export type ModalOverlayEntry = OverlayEntry;
/** @deprecated Internal compatibility alias. Use the generic overlay stack. */
export type ModalOverlayStack = OverlayStack;
/** @deprecated Internal compatibility alias. Use `createOverlayStack`. */
export const createModalOverlayStack = createOverlayStack;
/** @deprecated Internal compatibility alias. Modal and anchored overlays now coordinate together. */
export const modalOverlayStack = overlayStack;
