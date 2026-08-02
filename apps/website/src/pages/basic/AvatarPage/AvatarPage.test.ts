import { afterEach, beforeAll, describe, expect, it } from "vitest";

let fallbackExampleTag = "";
let groupExampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageAvatarEx2 } = await import("./ex2");
  const { PageAvatarEx3 } = await import("./ex3");
  fallbackExampleTag = ensureCustomElement(PageAvatarEx2);
  groupExampleTag = ensureCustomElement(PageAvatarEx3);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

describe("Avatar documentation", () => {
  it("shows an accessible fallback and retries with a new source", async () => {
    const page = document.createElement(fallbackExampleTag);
    document.body.appendChild(page);
    await tick();

    const avatar = page.shadowRoot!.querySelector<HTMLElement>("elf-avatar")!;
    avatar.shadowRoot!.querySelector("img")!.dispatchEvent(new Event("error"));
    await tick();

    const fallback = avatar.shadowRoot!.querySelector(".avatar")!;
    expect(fallback.getAttribute("role")).toBe("img");
    expect(fallback.getAttribute("aria-label")).toBe("Ada Lovelace");
    expect(page.shadowRoot!.textContent).toContain("加载失败");

    const retry = Array.from(page.shadowRoot!.querySelectorAll<HTMLElement>("elf-button")).find(
      (button) => button.textContent?.includes("重试"),
    )!;
    retry.click();
    await tick();
    expect((avatar as HTMLElement & { src?: string }).src).toContain("i.pravatar.cc");
  });

  it("collapses the team and keeps hidden members available in the tooltip", async () => {
    const page = document.createElement(groupExampleTag);
    document.body.appendChild(page);
    await tick();

    const group = page.shadowRoot!.querySelector<HTMLElement>("elf-avatar-group")!;
    const avatars = Array.from(group.querySelectorAll<HTMLElement>("elf-avatar"));
    expect(avatars.map((avatar) => avatar.hidden)).toEqual([false, false, false, true, true, true]);

    const collapse = group.shadowRoot!.querySelector<HTMLButtonElement>(".collapse")!;
    expect(collapse.getAttribute("aria-label")).toBe("3 个未显示头像");
    collapse.click();
    await tick();
    expect(group.shadowRoot!.querySelector(".popover")?.textContent).toContain("Alan Turing");
  });
});
