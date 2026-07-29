import {
  onBeforeUnmount,
  onMounted,
} from "@elfui/core";
import { isEventInside } from "../components/Common/overlay/anchored-overlay";
import {
  createOverlayInteractionController,
  type OverlayInteractionController,
} from "../components/Common/overlay/overlay-interaction-controller";
import type { OverlayCloseReason } from "../components/Common/overlay/overlay-protocol";

export type DismissibleOverlayCloseReason = Extract<
  OverlayCloseReason,
  "escape" | "outside"
>;

export interface UseDismissibleOverlayOptions {
  kind: string;
  containers: () => Array<Element | null | undefined>;
  closeOnEscape: () => boolean;
  closeOnOutside: () => boolean;
  outsideEvent?: "click" | "pointerdown";
  outsideCapture?: boolean;
  onRequestClose: (
    reason: DismissibleOverlayCloseReason,
    event: KeyboardEvent | MouseEvent | PointerEvent,
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
  const outsideEvent = options.outsideEvent ?? "click";
  const outsideCapture = options.outsideCapture ?? false;

  const onDocumentOutside = (event: MouseEvent | PointerEvent): void => {
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
    document.addEventListener(
      outsideEvent,
      onDocumentOutside as EventListener,
      outsideCapture,
    );
    document.addEventListener("keydown", onDocumentKeydown);
  });
  onBeforeUnmount(() => {
    document.removeEventListener(
      outsideEvent,
      onDocumentOutside as EventListener,
      outsideCapture,
    );
    document.removeEventListener("keydown", onDocumentKeydown);
    controller.dispose();
  });

  return controller;
};
