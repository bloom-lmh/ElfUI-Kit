import { afterEach, beforeAll, describe, expect, it } from "vitest";

let exampleTag = "";

beforeAll(async () => {
  await import("../../../components");
  const { ensureCustomElement } = await import("@elfui/core");
  const { PageConfigProviderEx5 } = await import("./ex5");
  exampleTag = ensureCustomElement(PageConfigProviderEx5);
});

const wait = (ms = 20): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const deepQueryAll = <T extends Element>(
  root: ParentNode,
  selector: string,
): T[] => {
  const matches = Array.from(root.querySelectorAll<T>(selector));
  for (const element of Array.from(root.querySelectorAll("*"))) {
    if (element.shadowRoot) {
      matches.push(...deepQueryAll<T>(element.shadowRoot, selector));
    }
  }
  return matches;
};

afterEach(async () => {
  const { ElfMessage, ElfMessageBox, ElfNotification } =
    await import("../../../components/Feedback");
  ElfMessage.closeAll();
  ElfNotification.closeAll();
  ElfMessageBox.closeAll();
  document.querySelector<HTMLElement>("elf-loading")?.dispatchEvent(
    new CustomEvent("close"),
  );
  await wait(230);
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  document.documentElement.lang = "zh-CN";
});

describe("ConfigProvider service defaults", () => {
  it("scopes defaults for all service APIs while method variants stay explicit", async () => {
    document.documentElement.lang = "en-US";
    const example = document.createElement(exampleTag);
    document.body.appendChild(example);
    await wait();
    await wait();

    const buttons = deepQueryAll<HTMLElement>(example.shadowRoot!, "elf-button");
    expect(buttons).toHaveLength(4);

    buttons[0]!.click();
    await wait();
    const message = document.body.querySelector<HTMLElement>("elf-message");
    expect(message?.getAttribute("position")).toBe("bottom");
    expect(message?.getAttribute("type")).toBe("success");

    buttons[1]!.click();
    await wait();
    const notification = document.body.querySelector<HTMLElement>("elf-notification");
    expect(notification?.getAttribute("position")).toBe("bottom-right");
    expect(notification?.getAttribute("type")).toBe("success");

    buttons[2]!.click();
    await wait();
    const loading = document.body.querySelector<HTMLElement & { variant?: string }>(
      "elf-loading",
    );
    expect(loading?.variant).toBe("bars");
    expect(document.body.style.overflow).toBe("hidden");
    loading?.dispatchEvent(new CustomEvent("close"));

    buttons[3]!.click();
    await wait();
    const messageBox = document.body.querySelector<HTMLElement & { type?: string }>(
      "elf-message-box",
    );
    expect(messageBox?.type).toBe("warning");
    expect(messageBox?.shadowRoot?.querySelector(".confirm")?.textContent)
      .toContain("Leave anyway");
    expect(messageBox?.shadowRoot?.querySelector(".cancel")?.textContent)
      .toContain("Stay here");
    messageBox?.shadowRoot?.querySelector<HTMLButtonElement>(".cancel")?.click();
  });
});
