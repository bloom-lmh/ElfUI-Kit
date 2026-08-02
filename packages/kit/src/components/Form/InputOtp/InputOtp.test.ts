import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { InputOtp } from "./index";

beforeAll(() => {
  registerComponents(InputOtp);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface InputOtpEl extends HTMLElement {
  modelValue?: string;
  length?: number;
  type?: string;
  mask?: boolean;
  parser?: (value: string) => string;
}

describe("elf-input-otp", () => {
  it("renders cells from length and modelValue", async () => {
    const el = document.createElement("elf-input-otp") as InputOtpEl;
    el.modelValue = "12";
    el.length = 4;
    document.body.appendChild(el);
    await tick();

    expect(el.shadowRoot!.querySelectorAll("input")).toHaveLength(4);
    expect((el.shadowRoot!.querySelector("input") as HTMLInputElement).value).toBe("1");
  });

  it("emits update when typing", async () => {
    const el = document.createElement("elf-input-otp") as InputOtpEl;
    el.length = 4;
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();

    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    input.value = "7";
    input.dispatchEvent(new Event("input", { bubbles: true }));

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("7");
  });

  it("masks cells and applies parser output", async () => {
    const el = document.createElement("elf-input-otp") as InputOtpEl;
    el.modelValue = "12";
    el.mask = true;
    el.parser = (value) => value.replace(/\D/g, "");
    const onUpdate = vi.fn();
    el.addEventListener("update:modelValue", onUpdate as EventListener);
    document.body.appendChild(el);
    await tick();
    const input = el.shadowRoot!.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("•");
    input.value = "x7";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("72");
  });
});
