import type {
  DirectiveBinding,
  DirectiveDefinition,
  ElfUIApp
} from "@elfui/core";

export interface DirectiveController<Value> {
  update(value: Value): void;
  dispose(): void;
}

export type DirectiveControllerFactory<Value, ElementType extends HTMLElement> = (
  element: ElementType,
  value: Value
) => DirectiveController<Value>;

/**
 * Adapts an imperative behavior controller to ElfUI's directive lifecycle.
 * Controllers remain the single behavior core and can also be reused by
 * components or composables without duplicating listener/cleanup logic.
 */
export const createControllerDirective = <
  Value,
  ElementType extends HTMLElement = HTMLElement
>(
  factory: DirectiveControllerFactory<Value, ElementType>
): DirectiveDefinition<Value, ElementType> => {
  const controllers = new WeakMap<ElementType, DirectiveController<Value>>();

  const mount = (
    element: ElementType,
    binding: DirectiveBinding<Value>
  ): void => {
    controllers.get(element)?.dispose();
    controllers.set(element, factory(element, binding.value));
  };

  return {
    mounted: mount,
    updated(element, binding) {
      const controller = controllers.get(element);
      if (controller) controller.update(binding.value);
      else mount(element, binding);
    },
    beforeUnmount(element) {
      controllers.get(element)?.dispose();
      controllers.delete(element);
    }
  };
};

export const registerDirective = (
  app: Pick<ElfUIApp, "directive">,
  name: string,
  definition: DirectiveDefinition
): void => {
  app.directive(name, definition);
};
