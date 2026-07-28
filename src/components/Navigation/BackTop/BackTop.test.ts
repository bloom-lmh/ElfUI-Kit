import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface BackTopEl extends HTMLElement {
  target?: string | HTMLElement;
  visibilityHeight?: number;
  smooth?: boolean;
  duration?: number;
  shape?: string;
  disabled?: boolean;
  scrollToTop?: () => void;
}

interface MountedBackTop {
  el: BackTopEl;
  target: HTMLElement;
  scrollToMock: ReturnType<typeof vi.fn>;
}

const createTarget = (): { target: HTMLElement; scrollToMock: ReturnType<typeof vi.fn> } => {
  const target = document.createElement("div");
  target.id = "scroll-box";
  target.scrollTop = 0;
  const scrollToMock = vi.fn((options?: ScrollToOptions) => {
    target.scrollTop = Number(options?.top ?? 0);
  });
  target.scrollTo = scrollToMock as unknown as HTMLElement["scrollTo"];
  document.body.appendChild(target);
  return { target, scrollToMock };
};

const mount = async (patch: Partial<BackTopEl> = {}): Promise<MountedBackTop> => {
  const { target, scrollToMock } = createTarget();
  const el = document.createElement("elf-back-top") as BackTopEl;
  Object.assign(el, {
    target: "#scroll-box",
    visibilityHeight: 100,
    smooth: false,
    ...patch
  });
  document.body.appendChild(el);
  await tick();
  await tick();
  return { el, target, scrollToMock };
};

const scrollTo = async (target: HTMLElement, top: number): Promise<void> => {
  target.scrollTop = top;
  target.dispatchEvent(new Event("scroll"));
  await tick();
  await tick();
};

describe("elf-back-top", () => {
  it("stays hidden before threshold and becomes visible after scrolling", async () => {
    const { el, target } = await mount();
    const onVisible = vi.fn();
    el.addEventListener("visible-change", onVisible as unknown as EventListener);

    expect(el.shadowRoot!.querySelector(".backtop")).toBeNull();

    await scrollTo(target, 120);

    expect(el.shadowRoot!.querySelector(".backtop")).toBeTruthy();
    expect((onVisible.mock.calls[0]![0] as CustomEvent).detail).toBe(true);
  });

  it("emits click detail and scrolls target back to top", async () => {
    const { el, target, scrollToMock } = await mount();
    const onClick = vi.fn();
    el.addEventListener("click", onClick as unknown as EventListener);
    await scrollTo(target, 160);

    (el.shadowRoot!.querySelector(".backtop") as HTMLButtonElement).click();
    await tick();
    await tick();

    expect((onClick.mock.calls[0]![0] as CustomEvent).detail).toBeInstanceOf(MouseEvent);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
    expect(target.scrollTop).toBe(0);
    expect(el.shadowRoot!.querySelector(".backtop")).toBeNull();
  });

  it("uses configurable smooth animation", async () => {
    const frame = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockImplementation((callback) => {
        queueMicrotask(() => callback(performance.now() + 100));
        return 1;
      });
    const { el, target, scrollToMock } = await mount({
      smooth: true,
      duration: 20
    });
    await scrollTo(target, 160);

    el.scrollToTop?.();
    await tick();
    await tick();

    expect(frame).toHaveBeenCalled();
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("supports disabled state", async () => {
    const { el, target, scrollToMock } = await mount({ disabled: true });

    await scrollTo(target, 180);
    el.scrollToTop?.();

    expect(el.shadowRoot!.querySelector(".backtop")).toBeNull();
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("reflects square shape for styling", async () => {
    const { el, target } = await mount({ shape: "square" });

    await scrollTo(target, 140);

    expect(el.getAttribute("shape")).toBe("square");
    expect(el.shadowRoot!.querySelector(".backtop")).toBeTruthy();
  });

  it("uses Element Plus compatible defaults and normalizes numeric strings", async () => {
    const { el } = await mount();
    expect(el.style.getPropertyValue("--backtop-right")).toBe("40px");
    expect(el.style.getPropertyValue("--backtop-bottom")).toBe("40px");
    expect(el.style.getPropertyValue("--backtop-size")).toBe("40px");

    (el as BackTopEl & { right: string }).right = "64";
    await tick();
    expect(el.style.getPropertyValue("--backtop-right")).toBe("64px");
  });

  it("rebinds the scroll listener when target changes", async () => {
    const { el, target } = await mount();
    const next = document.createElement("div");
    next.id = "next-scroll-box";
    document.body.appendChild(next);
    el.target = "#next-scroll-box";
    await tick();
    await tick();

    await scrollTo(target, 200);
    expect(el.shadowRoot!.querySelector(".backtop")).toBeNull();
    await scrollTo(next, 200);
    expect(el.shadowRoot!.querySelector(".backtop")).toBeTruthy();
  });
});
