import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { Main } from "./index";

beforeAll(() => {
  registerComponents(Main);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("elf-main", () => {
  it("renders and projects default slot content", async () => {
    const el = document.createElement("elf-main");
    el.innerHTML = "<section>业务内容</section>";
    document.body.appendChild(el);
    await tick();
    expect(el.querySelector("section")?.textContent).toBe("业务内容");
    expect(el.shadowRoot?.querySelector("slot")).toBeTruthy();
  });

  it("has no accidental interactive surface", async () => {
    const el = document.createElement("elf-main");
    document.body.appendChild(el);
    await tick();
    expect(el.shadowRoot?.querySelector("button, input, [tabindex]")).toBeNull();
  });
});
