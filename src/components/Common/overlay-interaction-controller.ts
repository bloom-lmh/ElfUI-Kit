import {
  overlayStack,
  type OverlayStack,
} from "./overlay-stack";

export interface OverlayInteractionControllerOptions {
  kind: string;
  stack?: OverlayStack;
}

export interface OverlayInteractionController {
  activate: () => void;
  deactivate: () => void;
  dispose: () => void;
  isActive: () => boolean;
  isTopmost: () => boolean;
  claim: (event: Event) => boolean;
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
  let active = false;

  const deactivate = (): void => {
    stack.unregister(id);
    active = false;
  };

  return {
    activate: () => {
      stack.register({ id, kind: options.kind });
      active = true;
    },
    deactivate,
    dispose: deactivate,
    isActive: () => active,
    isTopmost: () => active && stack.isTopmost(id),
    claim: (event) => active && stack.claim(id, event),
  };
};
