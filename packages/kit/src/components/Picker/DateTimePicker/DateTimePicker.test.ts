import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { DateTimePickerElement } from "./types";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

const mount = async (
  patch: Partial<DateTimePickerElement> = {},
): Promise<DateTimePickerElement> => {
  const element = document.createElement("elf-date-time-picker") as DateTimePickerElement;
  Object.assign(element, patch);
  document.body.appendChild(element);
  await tick();
  await tick();
  return element;
};

describe("elf-date-time-picker", () => {
  it("splits a controlled date-time value across public picker components", async () => {
    const element = await mount({
      modelValue: "2026-07-29 18:30:00",
      valueFormat: "YYYY-MM-DD HH:mm:ss",
    });
    const date = element.shadowRoot!.querySelector("elf-date-picker") as HTMLElement & {
      modelValue: string;
    };
    const time = element.shadowRoot!.querySelector("elf-time-picker") as HTMLElement & {
      modelValue: string;
    };

    expect(date.modelValue).toBe("2026-07-29");
    expect(time.modelValue).toBe("18:30:00");
  });

  it("composes date and time updates into one semantic value", async () => {
    const element = await mount({
      modelValue: "2026-07-29 09:00:00",
    });
    const onUpdate = vi.fn();
    element.addEventListener("update:modelValue", onUpdate as EventListener);
    const date = element.shadowRoot!.querySelector("elf-date-picker")!;

    date.dispatchEvent(
      new CustomEvent("update:modelValue", {
        detail: "2026-08-01",
        bubbles: true,
        composed: true,
      }),
    );
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("2026-08-01 09:00:00");
  });

  it("supports range values without leaking child-specific contracts", async () => {
    const element = await mount({
      range: true,
      modelValue: ["2026-07-29 09:00:00", "2026-07-31 18:00:00"],
    });
    const time = element.shadowRoot!.querySelector("elf-time-picker") as HTMLElement & {
      modelValue: [string, string];
    };

    expect(time.modelValue).toEqual(["09:00:00", "18:00:00"]);
    expect(element.hasAttribute("range")).toBe(true);
  });

  it("uses the configured adapter for parsing and output formatting", async () => {
    const provider = document.createElement("elf-config-provider") as HTMLElement & {
      config: Record<string, unknown>;
    };
    const parse = vi.fn(() => new Date(2026, 6, 29, 8, 15, 0));
    provider.config = {
      date: {
        adapter: {
          now: () => new Date(2026, 6, 29),
          create: (...parts: number[]) => new Date(...(parts as [number, number])),
          parse,
          format: (value: Date, pattern: string) =>
            pattern === "YYYY-MM-DD"
              ? "2026-07-29"
              : pattern === "HH:mm:ss"
                ? "08:15:00"
                : "adapter-value",
          toISODate: () => "2026-07-29",
          toISODateTime: () => "2026-07-29T08:15:00",
          add: (value: Date) => value,
          compare: () => 0,
          daysInMonth: () => 31,
          isValid: () => true,
        },
      },
    };
    const element = document.createElement("elf-date-time-picker") as DateTimePickerElement;
    element.modelValue = "custom";
    provider.appendChild(element);
    document.body.appendChild(provider);
    await tick();
    await tick();

    expect(parse).toHaveBeenCalledWith("custom", "YYYY-MM-DD HH:mm:ss");
  });

  it("clears through the form control contract and exposes focus methods", async () => {
    const element = await mount({
      modelValue: "2026-07-29 18:30:00",
      clearable: true,
    });
    const onClear = vi.fn();
    const onUpdate = vi.fn();
    element.addEventListener("clear", onClear);
    element.addEventListener("update:modelValue", onUpdate as EventListener);

    (element.shadowRoot!.querySelector(".clear") as HTMLButtonElement).click();
    await tick();

    expect((onUpdate.mock.calls[0]![0] as CustomEvent).detail).toBe("");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(() => element.focus()).not.toThrow();
    expect(() => element.blur()).not.toThrow();
  });
});
