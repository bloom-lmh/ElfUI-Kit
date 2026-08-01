import { readFileSync } from "node:fs";
import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Watermark } from "./index";

beforeAll(() => {
  registerComponents(Watermark);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface WatermarkEl extends HTMLElement {
  content?: string | string[];
  gapX?: number;
  font?: {
    fontSize?: number;
    color?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    fontFamily?: string;
    textAlign?: "left" | "center" | "right" | "start" | "end";
  };
  appendTo?: string | HTMLElement;
  antiTamper?: boolean;
  refresh?: () => void;
}

describe("elf-watermark", () => {
  it("reuses the public mutation controller for anti-tamper ownership", () => {
    const source = readFileSync("src/components/Data/Watermark/index.ts", "utf8");

    expect(source).toContain("createMutateController(overlayTarget");
    expect(source).toContain("createMutateController(overlay");
    expect(source).not.toContain("new MutationObserver");
  });

  it("generates svg background from content", async () => {
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "ElfUI";
    el.gapX = 80;
    el.innerHTML = "<p>content</p>";
    document.body.appendChild(el);
    await tick();

    expect(el.style.getPropertyValue("--_watermark-bg")).toContain("data:image/svg+xml");
    expect(el.shadowRoot!.querySelector("slot")).toBeTruthy();
  });

  it("uses font object values ahead of legacy font props", async () => {
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "ElfUI";
    el.font = { fontSize: 22, color: "#123456" };
    document.body.appendChild(el);
    await tick();

    const background = decodeURIComponent(el.style.getPropertyValue("--_watermark-bg"));
    expect(background).toContain('font-size="22"');
    expect(background).toContain('fill="#123456"');
  });

  it("serializes all supported font object settings into the SVG tile", async () => {
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "Internal";
    el.font = {
      fontWeight: 600,
      fontStyle: "italic",
      fontFamily: "Inter, sans-serif",
      textAlign: "right",
    };
    document.body.appendChild(el);
    await tick();

    const background = decodeURIComponent(el.style.getPropertyValue("--_watermark-bg"));
    expect(background).toContain('font-weight="600"');
    expect(background).toContain('font-style="italic"');
    expect(background).toContain('font-family="Inter, sans-serif"');
    expect(background).toContain('x="100%"');
    expect(background).toContain('text-anchor="end"');
  });

  it("mounts an external overlay and restores it after tampering", async () => {
    const target = document.createElement("section");
    target.id = "watermark-target";
    document.body.appendChild(target);
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = ["ElfUI", "Confidential"];
    el.appendTo = target;
    el.antiTamper = true;
    target.appendChild(el);
    await tick();
    await tick();

    const overlay = target.querySelector<HTMLElement>("[data-elf-watermark-overlay]")!;
    expect(overlay.style.getPropertyValue("--_watermark-image")).toContain("data:image/svg+xml");
    expect(el.hasAttribute("data-external")).toBe(true);
    overlay.remove();
    await tick();
    await tick();
    const restored = target.querySelector<HTMLElement>("[data-elf-watermark-overlay]")!;
    expect(restored).toBeTruthy();

    restored.className = "tampered";
    restored.style.backgroundImage = "none";
    restored.style.display = "none";
    restored.style.opacity = "0";
    restored.style.visibility = "hidden";
    await tick();
    await tick();

    expect(restored.className).toBe("");
    expect(restored.style.backgroundImage).toBe("var(--_watermark-image)");
    expect(restored.style.display).toBe("");
    expect(restored.style.opacity).toBe("");
    expect(restored.style.visibility).toBe("");
  });

  it("keeps a shared positioning context until the final external watermark unmounts", async () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);
    const first = document.createElement("elf-watermark") as WatermarkEl;
    const second = document.createElement("elf-watermark") as WatermarkEl;
    first.content = "First";
    second.content = "Second";
    first.appendTo = target;
    second.appendTo = target;
    document.body.append(first, second);
    await tick();

    expect(target.style.position).toBe("relative");
    expect(target.querySelectorAll("[data-elf-watermark-overlay]")).toHaveLength(2);

    first.remove();
    await tick();
    expect(target.style.position).toBe("relative");
    expect(target.querySelectorAll("[data-elf-watermark-overlay]")).toHaveLength(1);

    second.remove();
    await tick();
    expect(target.style.position).toBe("static");
  });

  it("releases the old target before acquiring a new append target", async () => {
    const firstTarget = document.createElement("section");
    const secondTarget = document.createElement("section");
    firstTarget.style.position = "static";
    secondTarget.style.position = "static";
    document.body.append(firstTarget, secondTarget);
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "Movable";
    el.appendTo = firstTarget;
    document.body.appendChild(el);
    await tick();

    expect(firstTarget.style.position).toBe("relative");
    el.appendTo = secondTarget;
    await tick();

    expect(firstTarget.style.position).toBe("static");
    expect(secondTarget.style.position).toBe("relative");
    expect(firstTarget.querySelector("[data-elf-watermark-overlay]")).toBeNull();
    expect(secondTarget.querySelector("[data-elf-watermark-overlay]")).toBeTruthy();

    el.remove();
    await tick();
    expect(secondTarget.style.position).toBe("static");
  });

  it("does not reconnect anti-tamper resources after unmount", async () => {
    const target = document.createElement("section");
    document.body.appendChild(target);
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "Disposable";
    el.appendTo = target;
    el.antiTamper = true;
    document.body.appendChild(el);
    await tick();

    el.remove();
    await tick();
    expect(target.querySelector("[data-elf-watermark-overlay]")).toBeNull();

    target.appendChild(document.createElement("div"));
    await tick();
    expect(target.querySelector("[data-elf-watermark-overlay]")).toBeNull();
  });

  it("cancels an anti-tamper restore that was queued before unmount", async () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);
    const el = document.createElement("elf-watermark") as WatermarkEl;
    el.content = "Disposable";
    el.appendTo = target;
    el.antiTamper = true;
    document.body.appendChild(el);
    await tick();

    const overlay = target.querySelector<HTMLElement>("[data-elf-watermark-overlay]")!;
    overlay.style.opacity = "0";
    queueMicrotask(() => el.remove());
    await tick();
    await tick();

    expect(el.isConnected).toBe(false);
    expect(target.querySelector("[data-elf-watermark-overlay]")).toBeNull();
    expect(target.style.position).toBe("static");
  });
});
