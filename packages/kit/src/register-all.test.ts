import { describe, expect, it } from "vitest";

import { Button } from "./components/Basic/Button";
import { AiLoading } from "./components/Labs/AiLoading";
import { Heatmap } from "./components/Labs/Heatmap";
import { ALL_COMPONENTS, registerAllComponents } from "./register-all";

describe("registerAllComponents", () => {
  it("keeps root imports side-effect free and registers stable, AI, and Labs components explicitly", () => {
    expect(customElements.get("elf-button")).toBeUndefined();
    expect(customElements.get("elf-ai-loading")).toBeUndefined();
    expect(customElements.get("elf-heatmap")).toBeUndefined();
    expect(document.querySelector('style[data-elfui-utilities=""]')).toBeNull();

    registerAllComponents();

    expect(customElements.get("elf-button")).toBe(Button);
    expect(customElements.get("elf-ai-loading")).toBe(AiLoading);
    expect(customElements.get("elf-heatmap")).toBe(Heatmap);
    for (const component of ALL_COMPONENTS) {
      const tag = (component as typeof component & { __elfDefinition: { tag: string } })
        .__elfDefinition.tag;
      expect(customElements.get(tag), tag).toBe(component);
    }
    expect(document.querySelector('style[data-elfui-utilities=""]')).toBeTruthy();
    expect(() => registerAllComponents()).not.toThrow();
    expect(document.querySelectorAll('style[data-elfui-utilities=""]')).toHaveLength(1);
  });
});
