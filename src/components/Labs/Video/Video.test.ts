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
    expect(el.shadowRoot!.querySelector(".video-shell")?.getAttribute("aria-label")).toBe("Product overview");
    expect(el.shadowRoot!.querySelector<HTMLSelectElement>(".rate")?.value).toBe("1");
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
