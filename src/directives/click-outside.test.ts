import type { DirectiveBinding } from "@elfui/core";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clickOutsideDirective,
  createClickOutsideController,
  registerClickOutsideDirective,
  type ClickOutsideDirectiveValue
} from "./click-outside";

const hooks = clickOutsideDirective as {
  mounted: (element: HTMLElement, binding: DirectiveBinding<ClickOutsideDirectiveValue>) => void;
  updated: (element: HTMLElement, binding: DirectiveBinding<ClickOutsideDirectiveValue>) => void;
  beforeUnmount: (element: HTMLElement) => void;
};

const binding = (
  value: ClickOutsideDirectiveValue
): DirectiveBinding<ClickOutsideDirectiveValue> => ({
  value,
  oldValue: undefined,
  modifiers: {}
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("clickOutsideDirective", () => {
  it("fires outside the target but ignores its composed event path", () => {
    const target = document.createElement("section");
    const child = document.createElement("button");
    const outside = document.createElement("button");
    target.appendChild(child);
    document.body.append(target, outside);
    const handler = vi.fn();

    hooks.mounted(target, binding(handler));
    child.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    expect(handler).not.toHaveBeenCalled();

    outside.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    hooks.beforeUnmount(target);
  });

  it("supports excluded targets, disabled updates and event rebinding", () => {
    const target = document.createElement("section");
    const excluded = document.createElement("button");
    excluded.className = "trigger";
    document.body.append(target, excluded);
    const handler = vi.fn();

    hooks.mounted(target, binding({ handler, exclude: ".trigger" }));
    excluded.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    expect(handler).not.toHaveBeenCalled();

    hooks.updated(target, binding({ handler, disabled: true }));
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    expect(handler).not.toHaveBeenCalled();

    hooks.updated(target, binding({ handler, event: "click", capture: false }));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    expect(handler).toHaveBeenCalledTimes(1);
    hooks.beforeUnmount(target);
  });

  it("controller cleanup removes the document listener", () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    const handler = vi.fn();
    const controller = createClickOutsideController(target, handler);

    controller.dispose();
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true, composed: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("registers an application-level v-click-outside directive", () => {
    const directive = vi.fn();
    registerClickOutsideDirective({ directive } as never);
    expect(directive).toHaveBeenCalledWith("click-outside", clickOutsideDirective);
  });
});
