import { describe, expect, it } from "vitest";
import { createOverlayLifecycleController } from "./overlay-protocol";

describe("overlay lifecycle close protocol", () => {
  it("records an accepted close reason across the closing transition", () => {
    const lifecycle = createOverlayLifecycleController();

    lifecycle.activate();
    expect(lifecycle.state()).toBe("active");
    expect(lifecycle.closeReason()).toBeNull();

    expect(lifecycle.beginClose("escape")).toBe(true);
    expect(lifecycle.state()).toBe("closing");
    expect(lifecycle.closeReason()).toBe("escape");

    expect(lifecycle.completeClose()).toBe(true);
    expect(lifecycle.state()).toBe("inactive");
    expect(lifecycle.closeReason()).toBe("escape");
  });

  it("rejects invalid close transitions and resets the reason on reactivation", () => {
    const lifecycle = createOverlayLifecycleController();

    expect(lifecycle.beginClose("outside")).toBe(false);
    expect(lifecycle.completeClose()).toBe(false);

    lifecycle.activate();
    lifecycle.beginClose("outside");
    lifecycle.activate();

    expect(lifecycle.state()).toBe("active");
    expect(lifecycle.closeReason()).toBeNull();
  });

  it("supports immediate teardown with an optional reason", () => {
    const lifecycle = createOverlayLifecycleController();

    lifecycle.activate();
    lifecycle.deactivate("external-motion");

    expect(lifecycle.state()).toBe("inactive");
    expect(lifecycle.closeReason()).toBe("external-motion");
  });
});
