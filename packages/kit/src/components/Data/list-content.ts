import type { DirectiveBinding, DirectiveDefinition } from "@elfui/core";

export type ListRenderValue = Node | string | number | boolean | null | undefined;

const mount = (element: HTMLElement, value: ListRenderValue): void => {
  element.replaceChildren();
  if (value == null) return;
  if (typeof value === "object" && "nodeType" in value) element.appendChild(value);
  else element.textContent = String(value);
};

export const listContentDirective: DirectiveDefinition<ListRenderValue, HTMLElement> = (
  element: HTMLElement,
  binding: DirectiveBinding<ListRenderValue>,
) => {
  mount(element, binding.value);
};
