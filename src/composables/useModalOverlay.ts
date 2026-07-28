import {
  onBeforeUnmount,
  onMounted,
  useScrollLock
} from "@elfui/core";
import {
  createModalOverlayController,
  type ModalOverlayController
} from "../components/Common/modal-overlay-controller";

export type ModalOverlayCloseReason = "escape";

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
export const useModalOverlay = (
  options: UseModalOverlayOptions
): ModalOverlayHandle => {
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
  onMounted(() => document.addEventListener("keydown", onDocumentKeydown));
  onBeforeUnmount(() => {
    document.removeEventListener("keydown", onDocumentKeydown);
    controller.dispose();
  });

  return {
    ...controller,
    scheduleInitialFocus: () => {
      queueMicrotask(() => queueMicrotask(() => controller.focusInitial()));
    }
  };
};
