import { afterEach, describe, expect, it, vi } from "vitest";
import { createModalOverlayController } from "./modal-overlay-controller";
import { createOverlayInteractionController } from "./overlay-interaction-controller";
import { createModalOverlayStack } from "./modal-overlay-stack";

afterEach(() => {
  document.body.innerHTML = "";
});

const panelWithButton = (label: string): {
  panel: HTMLElement;
  button: HTMLButtonElement;
} => {
  const panel = document.createElement("section");
  panel.tabIndex = -1;
  const button = document.createElement("button");
  button.textContent = label;
  panel.appendChild(button);
  document.body.appendChild(panel);
  return { panel, button };
};

describe("modal overlay coordination", () => {
  it("coordinates different modal kinds through one interaction stack", () => {
    const stack = createModalOverlayStack();
    const dialogPanel = panelWithButton("dialog").panel;
    const drawerPanel = panelWithButton("drawer").panel;
    const dialog = createModalOverlayController({
      kind: "dialog",
      panel: () => dialogPanel,
      stack
    });
    const drawer = createModalOverlayController({
      kind: "drawer",
      panel: () => drawerPanel,
      stack
    });

    dialog.activate();
    drawer.activate();

    expect(dialog.isTopmost()).toBe(false);
    expect(drawer.isTopmost()).toBe(true);
    expect(stack.top()?.kind).toBe("drawer");

    drawer.beginClose();
    expect(dialog.isTopmost()).toBe(true);
  });

  it("allows only the top overlay to claim one physical close event", () => {
    const stack = createModalOverlayStack();
    const dialog = createModalOverlayController({
      kind: "dialog",
      panel: () => null,
      stack,
    });
    const menu = createOverlayInteractionController({
      kind: "dropdown",
      stack,
    });
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });

    dialog.activate();
    menu.activate();

    expect(menu.claim(escapeEvent)).toBe(true);
    menu.deactivate();
    expect(dialog.isTopmost()).toBe(true);
    expect(dialog.claim(escapeEvent)).toBe(false);

    const nextEscapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    expect(dialog.claim(nextEscapeEvent)).toBe(true);
  });

  it("focuses once per activation and restores the captured trigger after closing", () => {
    const stack = createModalOverlayStack();
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const { panel, button } = panelWithButton("confirm");
    const onInitialFocus = vi.fn();
    const onRestoreFocus = vi.fn();
    const overlay = createModalOverlayController({
      kind: "dialog",
      panel: () => panel,
      stack,
      onInitialFocus,
      onRestoreFocus
    });

    overlay.activate();
    expect(overlay.focusInitial()).toBe(true);
    expect(overlay.focusInitial()).toBe(false);
    expect(document.activeElement).toBe(button);
    expect(onInitialFocus).toHaveBeenCalledTimes(1);

    overlay.beginClose();
    overlay.completeClose();
    expect(document.activeElement).toBe(trigger);
    expect(onRestoreFocus).toHaveBeenCalledTimes(1);

    overlay.dispose();
    expect(onRestoreFocus).toHaveBeenCalledTimes(1);
  });
});
