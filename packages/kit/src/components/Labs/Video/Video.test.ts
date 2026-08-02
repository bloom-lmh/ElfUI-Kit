import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Video } from "./index";

beforeAll(() => registerComponents(Video));

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface VideoEl extends HTMLElement {
  src?: string;
  title?: string;
  volume?: number;
  playbackRate?: number;
  controls?: boolean;
  seekTo?: (seconds: number) => void;
  setVolumeLevel?: (volume: number) => void;
  getMediaElement?: () => HTMLVideoElement | null;
}

describe("elf-video", () => {
  it("renders accessible custom media controls", async () => {
    const el = document.createElement("elf-video") as VideoEl;
    el.src = "demo.mp4";
    el.title = "Product overview";
    document.body.appendChild(el);
    await tick();

    const video = el.getMediaElement!()!;
    expect(video.getAttribute("src")).toBe("demo.mp4");
    expect(el.shadowRoot!.querySelector(".center-action")?.getAttribute("aria-label")).toBe("Play");
    expect(el.shadowRoot!.querySelector(".video-shell")?.getAttribute("aria-label")).toBe(
      "Product overview",
    );
    expect(el.shadowRoot!.querySelector<HTMLButtonElement>(".rate")?.textContent).toContain("1x");
    expect(el.shadowRoot!.querySelector(".fullscreen-icon")).toBeTruthy();
  });

  it("clamps exposed seek and volume actions", async () => {
    const el = document.createElement("elf-video") as VideoEl;
    document.body.appendChild(el);
    await tick();
    const video = el.getMediaElement!()!;
    Object.defineProperty(video, "duration", { configurable: true, value: 40 });

    el.seekTo!(80);
    el.setVolumeLevel!(2);
    expect(video.currentTime).toBe(40);
    expect(video.volume).toBe(1);
  });

  it("opens custom volume and playback-rate menus", async () => {
    const el = document.createElement("elf-video") as VideoEl;
    document.body.appendChild(el);
    await tick();
    const root = el.shadowRoot!;
    root.querySelector<HTMLButtonElement>(".volume-control")!.click();
    await tick();
    expect(root.querySelector(".volume-popover")).toBeTruthy();

    const volumeInput = root.querySelector<HTMLInputElement>(".volume-slider")!;
    volumeInput.value = "0.4";
    volumeInput.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(el.getMediaElement!()!.volume).toBeCloseTo(0.4);
    expect(root.querySelector(".volume-popover output")?.textContent).toBe("40%");
    expect(root.querySelectorAll(".volume-meter i.active")).toHaveLength(2);
    expect(root.querySelectorAll(".volume-icon i.active")).toHaveLength(2);
    expect(el.style.getPropertyValue("--_video-volume")).toBe("40%");

    root.querySelector<HTMLButtonElement>(".rate")!.click();
    await tick();
    expect(root.querySelectorAll(".rate-option")).toHaveLength(5);
    root.querySelector<HTMLButtonElement>('.rate-option[data-rate="1.5"]')!.click();
    expect(el.getMediaElement!()!.playbackRate).toBe(1.5);
    expect(root.querySelector(".rate-popover")).toBeNull();
  });

  it("maps native media lifecycle to semantic events", async () => {
    const el = document.createElement("elf-video") as VideoEl;
    const onPlay = vi.fn();
    const onPause = vi.fn();
    el.addEventListener("play", onPlay as EventListener);
    el.addEventListener("pause", onPause as EventListener);
    document.body.appendChild(el);
    await tick();

    const video = el.getMediaElement!()!;
    video.dispatchEvent(new Event("play"));
    video.dispatchEvent(new Event("pause"));
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPause).toHaveBeenCalledTimes(1);
  });
});
