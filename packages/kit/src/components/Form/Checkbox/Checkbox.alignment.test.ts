import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(async () => {
  await import("../../../components");
});

afterEach(() => {
  document.body.innerHTML = "";
});

const flush = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

describe("elf-checkbox alignment", () => {
  it("maps standalone checked state through true-value and false-value", async () => {
    const el = document.createElement("elf-checkbox") as HTMLElement & {
      modelValue?: string;
      trueValue?: string;
      falseValue?: string;
    };
    el.modelValue = "no";
    el.trueValue = "yes";
    el.falseValue = "no";
    document.body.appendChild(el);
    await flush();

    const update = vi.fn();
    el.addEventListener("update:modelValue", update as EventListener);
    (el.shadowRoot!.querySelector(".box") as HTMLElement).click();
    await flush();
    expect((update.mock.calls[0][0] as CustomEvent).detail).toBe("yes");

    el.modelValue = "yes";
    await flush();
    expect(el.getAttribute("data-checked")).not.toBeNull();
    expect(el.shadowRoot!.querySelector(".box")?.getAttribute("aria-checked")).toBe("true");
  });

  it("renders border, aria attributes, and a disabled tab stop correctly", async () => {
    const el = document.createElement("elf-checkbox") as HTMLElement & {
      border?: boolean;
      label?: string;
      ariaControls?: string;
      ariaLabel?: string;
      tabindex?: number;
      disabled?: boolean;
    };
    el.border = true;
    el.label = "Terms";
    el.ariaLabel = "Accept terms";
    el.ariaControls = "terms-panel";
    el.tabindex = 4;
    document.body.appendChild(el);
    await flush();

    const box = el.shadowRoot!.querySelector(".box") as HTMLElement;
    expect(el.hasAttribute("bordered")).toBe(true);
    expect(box.getAttribute("aria-label")).toBe("Accept terms");
    expect(box.getAttribute("aria-controls")).toBe("terms-panel");
    expect(box.tabIndex).toBe(4);

    el.disabled = true;
    await flush();
    expect(box.tabIndex).toBe(-1);
  });

  it("labels checkbox groups for assistive technology", async () => {
    const group = document.createElement("elf-checkbox-group") as HTMLElement & {
      ariaLabel?: string;
    };
    group.ariaLabel = "Available features";
    document.body.appendChild(group);
    await flush();
    expect(group.shadowRoot!.querySelector(".group")?.getAttribute("aria-label")).toBe(
      "Available features",
    );
  });

  it("announces an indeterminate checkbox as mixed", async () => {
    const el = document.createElement("elf-checkbox") as HTMLElement & { indeterminate?: boolean };
    el.indeterminate = true;
    document.body.appendChild(el);
    await flush();

    expect(el.shadowRoot!.querySelector(".box")?.getAttribute("aria-checked")).toBe("mixed");
  });
});
