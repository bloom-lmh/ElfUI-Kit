import {
  createFocusScope,
  type FocusScopeController
} from "./focus-scope";
import {
  overlayStack,
  type OverlayStack
} from "./overlay-stack";
import {
  createOverlayInteractionController,
  type OverlayInteractionController
} from "./overlay-interaction-controller";

export interface ModalOverlayControllerOptions {
  kind: string;
  panel: () => HTMLElement | null;
  onInitialFocus?: () => void;
  onRestoreFocus?: () => void;
  stack?: OverlayStack;
}

export interface ModalOverlayController {
  activate: () => void;
  beginClose: () => void;
  completeClose: () => void;
  dispose: () => void;
  focusInitial: () => boolean;
  isActive: () => boolean;
  isTopmost: () => boolean;
  claim: (event: Event) => boolean;
  trapFocus: (event: KeyboardEvent) => boolean;
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

  const release = (): void => {
    interaction.deactivate();
  };

  return {
    activate: () => {
      focus.capture();
      interaction.activate();
      initialFocusDone = false;
    },
    beginClose: release,
    completeClose: () => {
      initialFocusDone = false;
      focus.restore();
    },
    dispose: () => {
      release();
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
      interaction.isActive() && interaction.isTopmost() && focus.trap(event)
  };
};
