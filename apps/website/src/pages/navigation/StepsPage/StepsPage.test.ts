import { registerAllComponents } from "@elfui/kit";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

let stepsExampleTag = "";

beforeAll(async () => {
  registerAllComponents();
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageStepsEx1 } = await import("./ex1");
  stepsExampleTag = ensureCustomElement(PageStepsEx1);
});

afterEach(() => {
  document.body.innerHTML = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

describe("Steps documentation", () => {
  it("keeps the controlled example synchronized with integrated actions", async () => {
    const page = document.createElement(stepsExampleTag);
    document.body.appendChild(page);
    await tick();
    await tick();

    const steps = page.shadowRoot!.querySelector("elf-steps")!;
    const next = steps.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-action.is-next")!;
    next.click();
    await tick();
    await tick();

    expect(page.shadowRoot!.querySelector('[slot="status"]')?.textContent).toContain("2");
    expect(steps.shadowRoot!.querySelector(".stepper-panel")?.textContent).toContain(
      "完善个人资料",
    );
  });
});
