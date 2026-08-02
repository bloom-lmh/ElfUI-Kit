export type OverlayLifecycleState = "inactive" | "active" | "closing";

/** User and programmatic reasons accepted by overlay lifecycle controllers. */
export type OverlayCloseReason =
  "escape" | "outside" | "backdrop" | "action" | "selection" | "external-motion" | "programmatic";

export interface OverlayLifecycleController {
  activate: () => void;
  beginClose: (reason?: OverlayCloseReason) => boolean;
  completeClose: () => boolean;
  deactivate: (reason?: OverlayCloseReason) => void;
  state: () => OverlayLifecycleState;
  closeReason: () => OverlayCloseReason | null;
}

/**
 * Owns only the lifecycle contract for an overlay. Rendering, animation,
 * focus, positioning, and stack membership stay in their dedicated layers.
 */
export const createOverlayLifecycleController = (): OverlayLifecycleController => {
  let currentState: OverlayLifecycleState = "inactive";
  let lastCloseReason: OverlayCloseReason | null = null;

  return {
    activate: () => {
      currentState = "active";
      lastCloseReason = null;
    },
    beginClose: (reason = "programmatic") => {
      if (currentState !== "active") return false;
      currentState = "closing";
      lastCloseReason = reason;
      return true;
    },
    completeClose: () => {
      if (currentState !== "closing") return false;
      currentState = "inactive";
      return true;
    },
    deactivate: (reason) => {
      currentState = "inactive";
      if (reason) lastCloseReason = reason;
    },
    state: () => currentState,
    closeReason: () => lastCloseReason,
  };
};
