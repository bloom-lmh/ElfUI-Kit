import { afterEach, beforeAll, describe, expect, it } from "vitest";

interface ReproElement extends HTMLElement {
  resetRepro: () => void;
  setFirstOwner: (locked: boolean) => void;
  setSecondOwner: (locked: boolean) => void;
}

let reproTag = "";

beforeAll(async () => {
  const { ensureCustomElement } = await import("@elfui/core");
  const { UseScrollLockConcurrentOwnersRepro } = await import(
    "./UseScrollLockConcurrentOwnersRepro"
  );
  reproTag = ensureCustomElement(UseScrollLockConcurrentOwnersRepro);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("ElfUI beta.18 concurrent useScrollLock regression", () => {
  it("keeps the body locked until the final owner releases", () => {
    const element = document.createElement(reproTag) as ReproElement;
    document.body.appendChild(element);
    element.resetRepro();
    document.body.style.overflow = "";

    try {
      element.setFirstOwner(true);
      element.setSecondOwner(true);
      element.setFirstOwner(false);

      expect(document.body.style.overflow).toBe("hidden");
    } finally {
      element.setFirstOwner(false);
      element.setSecondOwner(false);
      element.remove();
      document.body.style.overflow = "";
    }
  });
});
