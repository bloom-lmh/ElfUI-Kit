import { afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = async (): Promise<void> => {
  await new Promise<void>((resolve) => queueMicrotask(resolve));
  await new Promise<void>((resolve) => queueMicrotask(resolve));
};

const appendAvatars = (group: HTMLElement, count: number): HTMLElement[] => {
  const avatars = Array.from({ length: count }, (_, index) => {
    const avatar = document.createElement("elf-avatar");
    avatar.setAttribute("alt", `Person ${index + 1}`);
    group.appendChild(avatar);
    return avatar;
  });
  return avatars;
};

describe("elf-avatar-group", () => {
  it("keeps every avatar visible unless collapse-avatars is enabled", async () => {
    const group = document.createElement("elf-avatar-group");
    const avatars = appendAvatars(group, 4);
    document.body.appendChild(group);
    await tick();

    expect(avatars.every((avatar) => !avatar.hidden)).toBe(true);
    expect(group.shadowRoot!.querySelector(".collapse")).toBeNull();
  });

  it("collapses avatars after max-collapse-avatars and renders the overflow count", async () => {
    const group = document.createElement("elf-avatar-group");
    group.setAttribute("collapse-avatars", "");
    group.setAttribute("max-collapse-avatars", "2");
    const avatars = appendAvatars(group, 4);
    document.body.appendChild(group);
    await tick();

    expect(avatars.map((avatar) => avatar.hidden)).toEqual([false, false, true, true]);
    expect(group.shadowRoot!.querySelector(".collapse")?.textContent?.trim()).toBe("+2");
    expect(avatars[2]!.getAttribute("aria-hidden")).toBe("true");
  });

  it("inherits group size and shape only for avatars that do not set their own values", async () => {
    const group = document.createElement("elf-avatar-group");
    group.setAttribute("size", "lg");
    group.setAttribute("shape", "square");
    const avatars = appendAvatars(group, 2);
    avatars[1]!.setAttribute("size", "sm");
    document.body.appendChild(group);
    await tick();

    expect(avatars[0]!.getAttribute("size")).toBe("lg");
    expect(avatars[0]!.getAttribute("shape")).toBe("square");
    expect(avatars[1]!.getAttribute("size")).toBe("sm");
  });

  it("shows an accessible popover only when collapse-avatars-tooltip is enabled", async () => {
    const group = document.createElement("elf-avatar-group");
    group.setAttribute("collapse-avatars", "");
    group.setAttribute("collapse-avatars-tooltip", "");
    group.setAttribute("max-collapse-avatars", "1");
    group.collapseClass = "custom-collapse";
    group.collapseStyle = { color: "rgb(1, 2, 3)" };
    group.popperClass = "custom-popper";
    group.popperStyle = { width: "160px" };
    appendAvatars(group, 3);
    document.body.appendChild(group);
    await tick();

    const button = group.shadowRoot!.querySelector(".collapse") as HTMLButtonElement;
    expect(button.getAttribute("title")).toBe("2 个未显示头像");
    expect(button.classList.contains("custom-collapse")).toBe(true);
    expect(button.style.color).toBe("rgb(1, 2, 3)");
    button.click();
    await tick();

    const popover = group.shadowRoot!.querySelector(".popover");
    expect(popover?.getAttribute("role")).toBe("tooltip");
    expect(popover?.textContent).toContain("Person 2");
    expect(popover?.classList.contains("custom-popper")).toBe(true);
    expect((popover as HTMLElement).style.width).toBe("160px");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick();
    expect(group.shadowRoot!.querySelector(".popover")).toBeNull();
  });

  it("updates when avatars are added and restores managed attributes on disconnect", async () => {
    const group = document.createElement("elf-avatar-group");
    group.setAttribute("collapse-avatars", "");
    group.setAttribute("max-collapse-avatars", "1");
    const first = appendAvatars(group, 1)[0]!;
    document.body.appendChild(group);
    await tick();

    const second = document.createElement("elf-avatar");
    second.setAttribute("alt", "Second");
    group.appendChild(second);
    await tick();
    expect(second.hidden).toBe(true);

    group.remove();
    await tick();
    expect(first.hidden).toBe(false);
    expect(first.hasAttribute("size")).toBe(false);
    expect(second.hidden).toBe(false);
    expect(second.hasAttribute("aria-hidden")).toBe(false);
  });
});
