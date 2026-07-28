import {
  onBeforeUnmount,
  onMounted,
} from "@elfui/core";
import { isEventInside } from "../components/Common/anchored-overlay";
import {
  createOverlayInteractionController,
  type OverlayInteractionController,
} from "../components/Common/overlay-interaction-controller";

export type DismissibleOverlayCloseReason = "escape" | "outside";

export interface UseDismissibleOverlayOptions {
  kind: string;
  containers: () => Array<Element | null | undefined>;
  closeOnEscape: () => boolean;
  closeOnOutside: () => boolean;
  onRequestClose: (
    reason: DismissibleOverlayCloseReason,
    event: KeyboardEvent | MouseEvent,
  ) => void;
}

export type DismissibleOverlayHandle = OverlayInteractionController;

/**
 * Lifecycle adapter for non-modal overlays such as menus and confirmation
 * popovers. Rendering, positioning, and focus policy stay component-owned.
 */
export const useDismissibleOverlay = (
  options: UseDismissibleOverlayOptions,
): DismissibleOverlayHandle => {
  const controller = createOverlayInteractionController({ kind: options.kind });

  const onDocumentClick = (event: MouseEvent): void => {
    if (
      !controller.isActive() ||
      !options.closeOnOutside() ||
      isEventInside(event, options.containers()) ||
      !controller.claim(event)
    ) {
      return;
    }
    options.onRequestClose("outside", event);
  };

  const onDocumentKeydown = (event: KeyboardEvent): void => {
    if (
      event.key !== "Escape" ||
      !controller.isActive() ||
      !options.closeOnEscape() ||
      !controller.claim(event)
    ) {
      return;
    }
    options.onRequestClose("escape", event);
  };

  onMounted(() => {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onDocumentKeydown);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onDocumentKeydown);
    controller.dispose();
  });

  return controller;
};
