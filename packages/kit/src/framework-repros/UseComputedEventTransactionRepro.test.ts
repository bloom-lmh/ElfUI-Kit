import { afterEach, beforeAll, describe, expect, it } from "vitest";

interface ReproElement extends HTMLElement {
  resetRepro: () => void;
  readObservedInsideHandler: () => number;
  readCurrentComputed: () => number;
}

let reproTag = "";

beforeAll(async () => {
  const { ensureCustomElement } = await import("@elfui/core");
  const { UseComputedEventTransactionRepro } = await import("./UseComputedEventTransactionRepro");
  reproTag = ensureCustomElement(UseComputedEventTransactionRepro);
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ElfUI beta.18 useComputed event transaction regression", () => {
  it("returns the updated computed value after a source write in the same event", () => {
    const element = document.createElement(reproTag) as ReproElement;
    document.body.appendChild(element);
    element.resetRepro();

    element.shadowRoot?.querySelector<HTMLButtonElement>("button")?.click();

    expect(element.readObservedInsideHandler()).toBe(4);
    expect(element.readCurrentComputed()).toBe(4);
  });
});
