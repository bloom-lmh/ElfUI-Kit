import { afterEach, describe, expect, it, vi } from "vitest";
import {
  connectAnchoredOverlayLifecycle,
  readOverlayViewport,
} from "./anchored-overlay";

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("anchored overlay lifecycle and viewport", () => {
  it("reads the layout viewport when Visual Viewport is unavailable", () => {
    expect(readOverlayViewport()).toEqual({
      width: window.innerWidth,
      height: window.innerHeight,
      offsetLeft: 0,
      offsetTop: 0,
    });
  });

  it("connects resize and external-motion resources and releases them", () => {
    const observed: Element[] = [];
    const disconnect = vi.fn();
    let resizeObserverCallback: ResizeObserverCallback = () => {};
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback;
      }
      observe(target: Element): void {
        observed.push(target);
      }
      disconnect(): void {
        disconnect();
      }
      unobserve(): void {}
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    const panel = document.createElement("section");
    const trigger = document.createElement("button");
    document.body.append(trigger, panel);
    const onResize = vi.fn();
    const onExternalMotion = vi.fn();
    const cleanup = connectAnchoredOverlayLifecycle({
      resizeTargets: [trigger, panel],
      motionContainers: () => [panel],
      onResize,
      onExternalMotion,
    });

    expect(observed).toEqual([trigger, panel]);
    resizeObserverCallback([], {} as ResizeObserver);
    expect(onResize).toHaveBeenCalledTimes(1);

    panel.dispatchEvent(new WheelEvent("wheel", { bubbles: true, composed: true }));
    expect(onExternalMotion).not.toHaveBeenCalled();
    document.body.dispatchEvent(new WheelEvent("wheel", { bubbles: true, composed: true }));
    expect(onExternalMotion).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("resize"));
    expect(onResize).toHaveBeenCalledTimes(2);

    cleanup();
    expect(disconnect).toHaveBeenCalledTimes(1);
    document.body.dispatchEvent(new WheelEvent("wheel", { bubbles: true, composed: true }));
    window.dispatchEvent(new Event("resize"));
    expect(onExternalMotion).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledTimes(2);
  });
});
