import { createMutateController } from "../../../directives/observers";

type RootMutationHandler = (records: readonly MutationRecord[]) => void;

interface RootMutationCoordinator {
  controller: ReturnType<typeof createMutateController>;
  handlers: Set<RootMutationHandler>;
}

const coordinators = new WeakMap<Document | ShadowRoot, RootMutationCoordinator>();

/**
 * Subscribes to DOM ownership changes through one mutation controller per root.
 *
 * @param root - Document or shadow root shared by Parallax instances.
 * @param handler - Instance-level filter and refresh callback.
 * @returns An idempotent release function that disposes the root observer when unused.
 */
export const subscribeRootMutations = (
  root: Document | ShadowRoot,
  handler: RootMutationHandler,
): (() => void) => {
  let coordinator = coordinators.get(root);
  if (!coordinator) {
    const handlers = new Set<RootMutationHandler>();
    const controller = createMutateController(root, {
      handler: (records) => {
        for (const current of [...handlers]) current(records);
      },
      observer: {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      },
    });
    coordinator = { controller, handlers };
    coordinators.set(root, coordinator);
  }

  coordinator.handlers.add(handler);
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    coordinator?.handlers.delete(handler);
    if (coordinator?.handlers.size) return;
    coordinator?.controller.dispose();
    coordinators.delete(root);
  };
};
