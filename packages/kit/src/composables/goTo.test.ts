import { afterEach, describe, expect, it, vi } from "vitest";

import { goTo } from "./goTo";

const createContainer = (): HTMLElement => {
  const container = document.createElement("div");
  Object.defineProperties(container, {
    clientHeight: { configurable: true, value: 200 },
    scrollHeight: { configurable: true, value: 1000 },
    scrollTop: { configurable: true, value: 0, writable: true },
  });
  container.getBoundingClientRect = vi.fn(() => ({
    top: 100,
    left: 0,
    right: 400,
    bottom: 300,
    width: 400,
    height: 200,
    x: 0,
    y: 100,
    toJSON: () => ({}),
  })) as unknown as Element["getBoundingClientRect"];
  container.scrollTo = vi.fn((options?: ScrollToOptions) => {
    container.scrollTop = Number(options?.top ?? container.scrollTop);
  }) as unknown as HTMLElement["scrollTo"];
  document.body.appendChild(container);
  return container;
};

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("goTo", () => {
  it("resolves an element relative to its container and applies offset", async () => {
    const container = createContainer();
    container.scrollTop = 40;
    const target = document.createElement("section");
    target.id = "target";
    target.getBoundingClientRect = vi.fn(() => ({
      top: 460,
      left: 0,
      right: 400,
      bottom: 560,
      width: 400,
      height: 100,
      x: 0,
      y: 460,
      toJSON: () => ({}),
    })) as unknown as Element["getBoundingClientRect"];
    container.appendChild(target);

    const task = goTo("#target", {
      container,
      offset: 24,
      duration: 0,
    });

    await expect(task.finished).resolves.toEqual({
      status: "completed",
      position: 376,
    });
    expect(container.scrollTo).toHaveBeenCalledWith({
      top: 376,
      behavior: "auto",
    });
  });

  it("animates with a configured easing and reports completion", async () => {
    const container = createContainer();
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    const task = goTo(200, {
      container,
      duration: 100,
      easing: "linear",
    });
    frames.shift()?.(50);
    expect(container.scrollTop).toBe(100);
    frames.shift()?.(100);

    await expect(task.finished).resolves.toEqual({
      status: "completed",
      position: 200,
    });
    expect(container.scrollTop).toBe(200);
  });

  it("cancels the previous task when a new scroll starts", async () => {
    const container = createContainer();
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    const first = goTo(400, { container, duration: 300 });
    const second = goTo(100, { container, duration: 0 });

    await expect(first.finished).resolves.toMatchObject({ status: "cancelled" });
    await expect(second.finished).resolves.toEqual({
      status: "completed",
      position: 100,
    });
    expect(container.scrollTop).toBe(100);
  });

  it("falls back to immediate scrolling for reduced motion", async () => {
    const container = createContainer();
    const request = vi.spyOn(globalThis, "requestAnimationFrame");

    const task = goTo(240, {
      container,
      duration: 500,
      reducedMotion: true,
    });

    await expect(task.finished).resolves.toEqual({
      status: "completed",
      position: 240,
    });
    expect(request).not.toHaveBeenCalled();
    expect(container.scrollTop).toBe(240);
  });

  it("reports invalid selectors without mutating the container", async () => {
    const container = createContainer();
    const task = goTo("[invalid", { container });

    await expect(task.finished).resolves.toEqual({
      status: "not-found",
      position: 0,
    });
    expect(container.scrollTo).not.toHaveBeenCalled();
  });
});
