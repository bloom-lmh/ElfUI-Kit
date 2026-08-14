import { expect, test, type Page } from "@playwright/test";

const openRegisteredWebsite = async (page: Page): Promise<void> => {
  await page.goto("/");
  await page.waitForFunction(
    () =>
      Boolean(customElements.get("elf-input")) &&
      Boolean(customElements.get("elf-select")) &&
      Boolean(customElements.get("elf-upload")),
  );
};

test.describe("native form-associated Kit controls", () => {
  test.beforeEach(async ({ page }) => {
    await openRegisteredWebsite(page);
  });

  test("submits a scalar value and participates in native submit from Shadow DOM", async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const settle = async (): Promise<void> => {
        await Promise.resolve();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
      };
      const container = document.createElement("div");
      const form = document.createElement("form");
      const input = document.createElement("elf-input") as HTMLElement & {
        modelValue: string;
      };
      input.setAttribute("name", "user");
      input.modelValue = "Ada";
      form.append(input);
      container.append(form);
      document.body.append(container);
      await settle();

      let submitted = "";
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitted = String(new FormData(form).get("user") ?? "");
      });
      form.requestSubmit();
      await settle();

      const value = String(new FormData(form).get("user") ?? "");
      const hasShadowInput = Boolean(input.shadowRoot?.querySelector("input"));
      container.remove();
      return { value, submitted, hasShadowInput };
    });

    expect(result).toEqual({ value: "Ada", submitted: "Ada", hasShadowInput: true });
  });

  test("keeps every declared value owner in the FormData contract", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const settle = async (): Promise<void> => {
        await Promise.resolve();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
      };
      const container = document.createElement("div");
      const form = document.createElement("form");
      const file = new File(["hello"], "all-controls.txt", { type: "text/plain" });
      const controls: Array<{
        tag: string;
        name: string;
        props: Record<string, unknown>;
      }> = [
        { tag: "elf-autocomplete", name: "autocomplete", props: { modelValue: "a" } },
        { tag: "elf-cascader", name: "cascader", props: { modelValue: ["a", "b"] } },
        { tag: "elf-checkbox", name: "checkbox", props: { modelValue: true } },
        {
          tag: "elf-checkbox-group",
          name: "checkboxGroup",
          props: { modelValue: ["a", "b"] },
        },
        { tag: "elf-input", name: "input", props: { modelValue: "a" } },
        { tag: "elf-input-number", name: "inputNumber", props: { modelValue: 7 } },
        { tag: "elf-input-otp", name: "inputOtp", props: { modelValue: "123" } },
        { tag: "elf-input-tag", name: "inputTag", props: { modelValue: ["a", "b"] } },
        { tag: "elf-mention", name: "mention", props: { modelValue: "@ada" } },
        { tag: "elf-radio", name: "radio", props: { modelValue: "r", value: "r" } },
        { tag: "elf-radio-group", name: "radioGroup", props: { modelValue: "r" } },
        { tag: "elf-rate", name: "rate", props: { modelValue: 3 } },
        { tag: "elf-segmented", name: "segmented", props: { modelValue: "one" } },
        { tag: "elf-select", name: "select", props: { modelValue: "one" } },
        { tag: "elf-slider", name: "slider", props: { modelValue: 5 } },
        { tag: "elf-switch", name: "switch", props: { modelValue: true } },
        { tag: "elf-textarea", name: "textarea", props: { modelValue: "a" } },
        { tag: "elf-tree-select", name: "treeSelect", props: { modelValue: "node" } },
        {
          tag: "elf-upload",
          name: "upload",
          props: {
            modelValue: [
              {
                uid: "all",
                name: file.name,
                size: file.size,
                type: file.type,
                status: "ready",
                percentage: 0,
                raw: file,
              },
            ],
          },
        },
        { tag: "elf-color-picker", name: "colorPicker", props: { modelValue: "#112233" } },
        { tag: "elf-date-picker", name: "datePicker", props: { modelValue: "2026-08-14" } },
        {
          tag: "elf-date-time-picker",
          name: "dateTimePicker",
          props: { modelValue: "2026-08-14 13:30:00" },
        },
        { tag: "elf-time-picker", name: "timePicker", props: { modelValue: "13:30" } },
        { tag: "elf-time-select", name: "timeSelect", props: { modelValue: "13:30" } },
      ];

      for (const control of controls) {
        const element = document.createElement(control.tag) as HTMLElement &
          Record<string, unknown>;
        element.setAttribute("name", control.name);
        Object.assign(element, control.props);
        form.append(element);
      }
      container.append(form);
      document.body.append(container);
      await settle();
      await settle();

      const data = new FormData(form);
      const entries = Object.fromEntries(
        controls.map((control) => [
          control.name,
          data
            .getAll(control.name)
            .map((entry) => (entry instanceof File ? `[file:${entry.name}]` : String(entry))),
        ]),
      );
      container.remove();
      return entries;
    });

    expect(result).toEqual({
      autocomplete: ["a"],
      cascader: ["a", "b"],
      checkbox: ["true"],
      checkboxGroup: ["a", "b"],
      input: ["a"],
      inputNumber: ["7"],
      inputOtp: ["123"],
      inputTag: ["a", "b"],
      mention: ["@ada"],
      radio: ["r"],
      radioGroup: ["r"],
      rate: ["3"],
      segmented: ["one"],
      select: ["one"],
      slider: ["5"],
      switch: ["true"],
      textarea: ["a"],
      treeSelect: ["node"],
      upload: ["[file:all-controls.txt]"],
      colorPicker: ["#112233"],
      datePicker: ["2026-08-14"],
      dateTimePicker: ["2026-08-14 13:30:00"],
      timePicker: ["13:30"],
      timeSelect: ["13:30"],
    });
  });

  test("restores the connection snapshot and browser state without fake input events", async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const settle = async (): Promise<void> => {
        await Promise.resolve();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
      };
      const container = document.createElement("div");
      const form = document.createElement("form");
      const input = document.createElement("elf-input") as HTMLElement & {
        modelValue: string;
        formStateRestoreCallback(state: string, mode: "restore" | "autocomplete"): void;
      };
      input.setAttribute("name", "query");
      input.modelValue = "initial";
      form.append(input);
      container.append(form);
      document.body.append(container);
      await settle();

      const updates: string[] = [];
      let inputEvents = 0;
      input.addEventListener("update:modelValue", (event) => {
        updates.push(String((event as CustomEvent).detail ?? ""));
      });
      input.addEventListener("input", () => inputEvents++);
      const inner = input.shadowRoot?.querySelector<HTMLInputElement>("input");
      if (!inner) throw new Error("missing Shadow DOM input");
      inner.value = "changed";
      inner.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      await settle();
      const userInputEvents = inputEvents;

      form.reset();
      await settle();
      const resetValue = inner.value;
      const resetInputEvents = inputEvents;
      input.formStateRestoreCallback("restored", "restore");
      await settle();
      const restoredValue = inner.value;
      const restoreInputEvents = inputEvents;
      const submitted = String(new FormData(form).get("query") ?? "");
      container.remove();
      return {
        resetValue,
        restoredValue,
        submitted,
        updates,
        userInputEvents,
        resetInputEvents,
        restoreInputEvents,
      };
    });

    expect(result.resetValue).toBe("initial");
    expect(result.restoredValue).toBe("restored");
    expect(result.submitted).toBe("restored");
    expect(result.updates).toContain("initial");
    expect(result.updates).toContain("restored");
    expect(result.userInputEvents).toBeGreaterThan(0);
    expect(result.resetInputEvents).toBe(result.userInputEvents);
    expect(result.restoreInputEvents).toBe(result.userInputEvents);
  });

  test("supports required and custom validity", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const settle = async (): Promise<void> => {
        await Promise.resolve();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
      };
      const container = document.createElement("div");
      const form = document.createElement("form");
      const input = document.createElement("elf-input") as HTMLElement & {
        modelValue: string;
        checkValidity(): boolean;
        setCustomValidity(message: string): void;
      };
      input.setAttribute("name", "title");
      input.setAttribute("required", "");
      form.append(input);
      container.append(form);
      document.body.append(container);
      await settle();

      const emptyValid = form.checkValidity();
      input.modelValue = "ready";
      await settle();
      const populatedValid = form.checkValidity();
      input.setCustomValidity("blocked");
      await settle();
      const customValid = form.checkValidity();
      input.setCustomValidity("");
      await settle();
      const clearedValid = input.checkValidity() && form.checkValidity();
      container.remove();
      return { emptyValid, populatedValid, customValid, clearedValid };
    });

    expect(result).toEqual({
      emptyValid: false,
      populatedValid: true,
      customValid: false,
      clearedValid: true,
    });
  });

  test("supports external form ownership and disabled fieldset propagation", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const settle = async (): Promise<void> => {
        await Promise.resolve();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
      };
      const container = document.createElement("div");
      const form = document.createElement("form");
      form.id = "external-owner";
      const external = document.createElement("elf-input") as HTMLElement & {
        modelValue: string;
      };
      external.setAttribute("name", "external");
      external.setAttribute("form", form.id);
      external.modelValue = "outside";

      const fieldset = document.createElement("fieldset");
      fieldset.disabled = true;
      const nested = document.createElement("elf-input") as HTMLElement & {
        modelValue: string;
      };
      nested.setAttribute("name", "nested");
      nested.modelValue = "inside";
      fieldset.append(nested);
      form.append(fieldset);
      container.append(form, external);
      document.body.append(container);
      await settle();

      const disabledEntries = Array.from(new FormData(form).entries()).map(([key, value]) => [
        key,
        String(value),
      ]);
      fieldset.disabled = false;
      await settle();
      const enabledEntries = Array.from(new FormData(form).entries()).map(([key, value]) => [
        key,
        String(value),
      ]);
      container.remove();
      return { disabledEntries, enabledEntries };
    });

    expect(result.disabledEntries).toEqual([["external", "outside"]]);
    expect(result.enabledEntries).toEqual([
      ["nested", "inside"],
      ["external", "outside"],
    ]);
  });

  test("serializes repeated, Boolean, date and file values", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const settle = async (): Promise<void> => {
        await Promise.resolve();
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await Promise.resolve();
      };
      const container = document.createElement("div");
      const form = document.createElement("form");

      const select = document.createElement("elf-select") as HTMLElement & {
        modelValue: Array<number>;
        multiple: boolean;
      };
      select.setAttribute("name", "role");
      select.multiple = true;
      select.modelValue = [1, 2];

      const toggle = document.createElement("elf-switch") as HTMLElement & {
        modelValue: boolean;
      };
      toggle.setAttribute("name", "enabled");
      toggle.modelValue = false;

      const date = document.createElement("elf-date-picker") as HTMLElement & {
        modelValue: string;
      };
      date.setAttribute("name", "date");
      date.modelValue = "2026-08-14";

      const file = new File(["hello"], "hello.txt", { type: "text/plain" });
      const upload = document.createElement("elf-upload") as HTMLElement & {
        modelValue: Array<Record<string, unknown>>;
      };
      upload.setAttribute("name", "attachment");
      upload.modelValue = [
        {
          uid: "1",
          name: file.name,
          size: file.size,
          type: file.type,
          status: "ready",
          percentage: 0,
          raw: file,
        },
      ];

      form.append(select, toggle, date, upload);
      container.append(form);
      document.body.append(container);
      await settle();

      const data = new FormData(form);
      const uploaded = data.get("attachment");
      const output = {
        roles: data.getAll("role").map(String),
        enabled: String(data.get("enabled")),
        date: String(data.get("date")),
        fileName: uploaded instanceof File ? uploaded.name : "",
      };
      container.remove();
      return output;
    });

    expect(result).toEqual({
      roles: ["1", "2"],
      enabled: "false",
      date: "2026-08-14",
      fileName: "hello.txt",
    });
  });
});
