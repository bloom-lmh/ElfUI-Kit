import {
  createFocusScope,
  type FocusScopeController
} from "./focus-scope";
import {
  modalOverlayStack,
  type ModalOverlayStack
} from "./modal-overlay-stack";

export interface ModalOverlayControllerOptions {
  kind: string;
  panel: () => HTMLElement | null;
  onInitialFocus?: () => void;
  onRestoreFocus?: () => void;
  stack?: ModalOverlayStack;
}

export interface ModalOverlayController {
  activate: () => void;
  beginClose: () => void;
  completeClose: () => void;
  dispose: () => void;
  focusInitial: () => boolean;
  isActive: () => boolean;
  isTopmost: () => boolean;
  trapFocus: (event: KeyboardEvent) => boolean;
}

/**
 * Coordinates one modal overlay without knowing its template, animation, or model.
 * Dialog and Drawer remain responsible for rendering and their component-specific close guards.
 */
export const createModalOverlayController = (
  options: ModalOverlayControllerOptions
): ModalOverlayController => {
  const id = Symbol(options.kind);
  const stack = options.stack ?? modalOverlayStack;
  const focus: FocusScopeController = createFocusScope({
    panel: options.panel,
    onInitialFocus: options.onInitialFocus,
    onRestoreFocus: options.onRestoreFocus
  });
  let active = false;
  let initialFocusDone = false;

  const release = (): void => {
    stack.unregister(id);
    active = false;
  };

  return {
    activate: () => {
      focus.capture();
      stack.register({ id, kind: options.kind });
      active = true;
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
      if (!active || initialFocusDone || !stack.isTopmost(id)) return false;
      initialFocusDone = focus.focusInitial();
      return initialFocusDone;
    },
    isActive: () => active,
    isTopmost: () => active && stack.isTopmost(id),
    trapFocus: (event) =>
      active && stack.isTopmost(id) && focus.trap(event)
  };
};
