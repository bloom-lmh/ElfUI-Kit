import type { DirectiveBinding } from "@elfui/core";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  draggableDirective,
  registerDraggableDirective,
  type DraggableDirectiveValue
} from "./draggable";

const hooks = draggableDirective as {
  mounted: (element: HTMLElement, binding: DirectiveBinding<DraggableDirectiveValue>) => void;
  updated: (element: HTMLElement, binding: DirectiveBinding<DraggableDirectiveValue>) => void;
  beforeUnmount: (element: HTMLElement) => void;
};

const binding = (
  value: DraggableDirectiveValue,
  oldValue?: DraggableDirectiveValue
): DirectiveBinding<DraggableDirectiveValue> => ({
  value,
  oldValue,
  modifiers: {}
});

const dragEvent = (
  type: string,
  patch: Partial<DragEvent> = {}
): DragEvent => {
  const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent;
  Object.assign(event, patch);
  return event;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("draggableDirective", () => {
  it("connects a drag source to a same-group target with placement details", () => {
    const source = document.createElement("article");
    const target = document.createElement("article");
    const parent = document.createElement("div");
    parent.append(source, target);
    document.body.appendChild(parent);
    target.getBoundingClientRect = () => ({
      top: 100, right: 200, bottom: 140, left: 0, width: 200, height: 40,
      x: 0, y: 100, toJSON: () => ({})
    });

    const onDrop = vi.fn();
    const dataTransfer = {
      effectAllowed: "all",
      dropEffect: "none",
      setData: vi.fn(),
      getData: vi.fn()
    };
    hooks.mounted(source, binding({ key: "source", data: { id: 1 }, group: "tasks" }));
    hooks.mounted(target, binding({
      key: "target",
      data: { id: 2 },
      group: "tasks",
      onDrop
    }));

    source.dispatchEvent(dragEvent("dragstart", { dataTransfer } as Partial<DragEvent>));
    target.dispatchEvent(dragEvent("dragenter", { clientY: 132 } as Partial<DragEvent>));
    expect(target.classList.contains("is-drag-over")).toBe(true);
    expect(target.dataset.dragPlacement).toBe("after");

    target.dispatchEvent(dragEvent("drop", { clientY: 132 } as Partial<DragEvent>));
    expect(onDrop).toHaveBeenCalledWith(expect.objectContaining({
      placement: "after",
      source: expect.objectContaining({ key: "source", index: 0 }),
      target: expect.objectContaining({ key: "target", index: 1 })
    }));
    expect(target.classList.contains("is-drag-over")).toBe(false);

    source.dispatchEvent(dragEvent("dragend"));
    expect(source.classList.contains("is-dragging")).toBe(false);
  });

  it("supports handles, disabled updates, inside targets and group isolation", () => {
    const source = document.createElement("article");
    source.innerHTML = '<button class="handle">Move</button><span>Body</span>';
    const target = document.createElement("article");
    document.body.append(source, target);
    const onDrop = vi.fn();

    hooks.mounted(source, binding({ key: "source", group: "a", handle: ".handle" }));
    hooks.mounted(target, binding({ key: "target", group: "b", mode: "inside", onDrop }));
    source.querySelector("span")!.dispatchEvent(dragEvent("dragstart"));
    expect(source.classList.contains("is-dragging")).toBe(false);

    source.querySelector(".handle")!.dispatchEvent(dragEvent("dragstart"));
    target.dispatchEvent(dragEvent("dragover"));
    expect(target.classList.contains("is-drag-over")).toBe(false);

    hooks.updated(target, binding({ key: "target", group: "a", mode: "inside", onDrop }));
    target.dispatchEvent(dragEvent("dragover"));
    target.dispatchEvent(dragEvent("drop"));
    expect(onDrop).toHaveBeenCalledWith(expect.objectContaining({ placement: "inside" }));

    hooks.updated(source, binding({ key: "source", disabled: true }));
    expect(source.draggable).toBe(false);
    expect(source.hasAttribute("data-draggable")).toBe(false);

    hooks.beforeUnmount(source);
    hooks.beforeUnmount(target);
  });

  it("registers as an application-level v-draggable directive", () => {
    const directive = vi.fn();
    registerDraggableDirective({ directive } as never);
    expect(directive).toHaveBeenCalledWith("draggable", draggableDirective);
  });
});
