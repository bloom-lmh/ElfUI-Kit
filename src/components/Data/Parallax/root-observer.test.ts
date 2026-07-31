import { afterEach, describe, expect, it, vi } from "vitest";

import { subscribeRootMutations } from "./root-observer";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Parallax root mutation coordinator", () => {
  it("shares one root observer and disposes it after the final subscriber", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let callback!: MutationCallback;
    vi.stubGlobal(
      "MutationObserver",
      class {
        constructor(next: MutationCallback) {
          callback = next;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    const releaseFirst = subscribeRootMutations(document, firstHandler);
    const releaseSecond = subscribeRootMutations(document, secondHandler);

    expect(observe).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledWith(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const records = [] as MutationRecord[];
    callback(records, {} as MutationObserver);
    expect(firstHandler).toHaveBeenCalledWith(records);
    expect(secondHandler).toHaveBeenCalledWith(records);

    releaseFirst();
    releaseFirst();
    expect(disconnect).not.toHaveBeenCalled();

    releaseSecond();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
