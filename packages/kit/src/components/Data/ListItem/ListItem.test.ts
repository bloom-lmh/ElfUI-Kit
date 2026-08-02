import { registerComponents } from "@elfui/core";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ListItem } from "./index";

beforeAll(() => registerComponents(ListItem));
const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-list-item", () => {
  it("renders structured content and named slots", async () => {
    const element = document.createElement("elf-list-item") as HTMLElement &
      Record<string, unknown>;
    element.title = "Build completed";
    element.subtitle = "Two minutes ago";
    element.innerHTML = '<span slot="leading">A</span><span slot="trailing">Open</span>';
    document.body.appendChild(element);
    await tick();
    expect(element.shadowRoot?.querySelector(".title")?.textContent).toBe("Build completed");
    expect(element.shadowRoot?.querySelector(".subtitle")?.textContent).toBe("Two minutes ago");
  });

  it("emits select only for enabled clickable rows", async () => {
    const element = document.createElement("elf-list-item") as HTMLElement &
      Record<string, unknown>;
    element.clickable = true;
    element.value = "task-1";
    const selected = vi.fn();
    element.addEventListener("select", selected);
    document.body.appendChild(element);
    await tick();
    (element.shadowRoot?.querySelector("button") as HTMLButtonElement).click();
    expect(selected).toHaveBeenCalledOnce();
  });
});
