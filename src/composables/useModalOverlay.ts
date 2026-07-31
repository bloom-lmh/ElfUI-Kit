import { onBeforeUnmount, useEventListener, useScrollLock } from "@elfui/core";
import {
  createModalOverlayController,
  type ModalOverlayController,
} from "../components/Common/overlay/modal-overlay-controller";
import type { OverlayCloseReason } from "../components/Common/overlay/overlay-protocol";

export type ModalOverlayCloseReason = Extract<OverlayCloseReason, "escape">;

export interface UseModalOverlayOptions {
  kind: string;
  panel: () => HTMLElement | null;
  rendered: () => boolean;
  closing: () => boolean;
  closeOnEscape: () => boolean;
  lockScroll: () => boolean;
  onRequestClose: (reason: ModalOverlayCloseReason, event: KeyboardEvent) => void;
  onInitialFocus?: () => void;
  onRestoreFocus?: () => void;
}

export interface ModalOverlayHandle extends ModalOverlayController {
  scheduleInitialFocus: () => void;
}

/**
 * Lifecycle adapter for modal components.
 * It centralizes document keyboard listeners and scroll locking while keeping rendering local.
 */
export const useModalOverlay = (options: UseModalOverlayOptions): ModalOverlayHandle => {
  const controller = createModalOverlayController(options);

  const onDocumentKeydown = (event: KeyboardEvent): void => {
    if (!options.rendered() || options.closing() || !controller.isTopmost()) return;
    if (event.key === "Escape" && options.closeOnEscape()) {
      if (!controller.claim(event)) return;
      options.onRequestClose("escape", event);
      return;
    }
    controller.trapFocus(event);
  };

  useScrollLock(() => options.lockScroll() && options.rendered());
  useEventListener(typeof document === "undefined" ? null : document, "keydown", onDocumentKeydown);
  onBeforeUnmount(() => controller.dispose());

  return {
    ...controller,
    scheduleInitialFocus: () => {
      queueMicrotask(() => queueMicrotask(() => controller.focusInitial()));
    },
  };
};
