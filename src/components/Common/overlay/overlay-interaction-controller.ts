import {
  overlayStack,
  type OverlayStack,
} from "./overlay-stack";
import {
  createOverlayLifecycleController,
  type OverlayCloseReason,
  type OverlayLifecycleController,
  type OverlayLifecycleState,
} from "./overlay-protocol";

export interface OverlayInteractionControllerOptions {
  kind: string;
  stack?: OverlayStack;
}

/** Coordinates dismissal events against one overlay stack entry. */
export interface OverlayInteractionController {
  activate: () => void;
  beginClose: (reason?: OverlayCloseReason) => boolean;
  completeClose: () => boolean;
  deactivate: (reason?: OverlayCloseReason) => void;
  dispose: () => void;
  isActive: () => boolean;
  isTopmost: () => boolean;
  claim: (event: Event) => boolean;
  state: () => OverlayLifecycleState;
  closeReason: () => OverlayCloseReason | null;
}

/**
 * Stateless-rendering interaction controller shared by modal and anchored
 * overlays. It knows only stack membership and event ownership.
 */
export const createOverlayInteractionController = (
  options: OverlayInteractionControllerOptions,
): OverlayInteractionController => {
  const id = Symbol(options.kind);
  const stack = options.stack ?? overlayStack;
  const lifecycle: OverlayLifecycleController = createOverlayLifecycleController();

  const deactivate = (reason?: OverlayCloseReason): void => {
    stack.unregister(id);
    lifecycle.deactivate(reason);
  };

  return {
    activate: () => {
      stack.register({ id, kind: options.kind });
      lifecycle.activate();
    },
    beginClose: (reason) => {
      if (!lifecycle.beginClose(reason)) return false;
      stack.unregister(id);
      return true;
    },
    completeClose: lifecycle.completeClose,
    deactivate,
    dispose: deactivate,
    isActive: () => lifecycle.state() === "active",
    isTopmost: () => lifecycle.state() === "active" && stack.isTopmost(id),
    claim: (event) => lifecycle.state() === "active" && stack.claim(id, event),
    state: lifecycle.state,
    closeReason: lifecycle.closeReason,
  };
};
