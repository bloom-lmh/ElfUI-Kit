import {
  createFocusScope,
  type FocusScopeController
} from "../focus/focus-scope";
import {
  overlayStack,
  type OverlayStack
} from "./overlay-stack";
import {
  createOverlayInteractionController,
  type OverlayInteractionController
} from "./overlay-interaction-controller";
import type {
  OverlayCloseReason,
  OverlayLifecycleState
} from "./overlay-protocol";

export interface ModalOverlayControllerOptions {
  kind: string;
  panel: () => HTMLElement | null;
  onInitialFocus?: () => void;
  onRestoreFocus?: () => void;
  stack?: OverlayStack;
}

export interface ModalOverlayController {
  activate: () => void;
  beginClose: (reason?: OverlayCloseReason) => boolean;
  completeClose: () => boolean;
  dispose: () => void;
  focusInitial: () => boolean;
  isActive: () => boolean;
  isTopmost: () => boolean;
  claim: (event: Event) => boolean;
  trapFocus: (event: KeyboardEvent) => boolean;
  state: () => OverlayLifecycleState;
  closeReason: () => OverlayCloseReason | null;
}

/**
 * Coordinates one modal overlay without knowing its template, animation, or model.
 * Dialog and Drawer remain responsible for rendering and their component-specific close guards.
 */
export const createModalOverlayController = (
  options: ModalOverlayControllerOptions
): ModalOverlayController => {
  const interaction: OverlayInteractionController =
    createOverlayInteractionController({
      kind: options.kind,
      stack: options.stack ?? overlayStack
    });
  const focus: FocusScopeController = createFocusScope({
    panel: options.panel,
    onInitialFocus: options.onInitialFocus,
    onRestoreFocus: options.onRestoreFocus
  });
  let initialFocusDone = false;

  return {
    activate: () => {
      focus.capture();
      interaction.activate();
      initialFocusDone = false;
    },
    beginClose: interaction.beginClose,
    completeClose: () => {
      const completed = interaction.completeClose();
      if (!completed) return false;
      initialFocusDone = false;
      focus.restore();
      return true;
    },
    dispose: () => {
      interaction.deactivate();
      focus.restore();
    },
    focusInitial: () => {
      if (!interaction.isActive() || initialFocusDone || !interaction.isTopmost()) return false;
      initialFocusDone = focus.focusInitial();
      return initialFocusDone;
    },
    isActive: interaction.isActive,
    isTopmost: interaction.isTopmost,
    claim: interaction.claim,
    trapFocus: (event) =>
      interaction.isActive() && interaction.isTopmost() && focus.trap(event),
    state: interaction.state,
    closeReason: interaction.closeReason
  };
};
