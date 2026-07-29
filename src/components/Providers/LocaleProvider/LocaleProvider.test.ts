import { registerComponents } from "@elfui/core";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { defineLocaleAdapter, type LocaleAdapter } from "../../../adapters";
import { LocaleProviderFormatProbe, LocaleProviderProbe } from "./probe.test-component";

beforeAll(async () => {
  await import("../../index");
  registerComponents(LocaleProviderProbe, LocaleProviderFormatProbe);
});

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "zh-CN";
  document.documentElement.dir = "";
});

const tick = (): Promise<void> => new Promise((resolve) => queueMicrotask(resolve));

interface LocaleProviderEl extends HTMLElement {
  name?: string;
  rtl?: boolean;
  messages?: Record<string, unknown>;
  timeZone?: string;
  adapter?: LocaleAdapter;
}

describe("elf-locale-provider", () => {
  it("无 Provider 时默认上下文跟随文档 lang 和 dir", async () => {
    const { DEFAULT_LOCALE_CONTEXT } = await import("../context");
    document.documentElement.lang = "en-US";
    document.documentElement.dir = "rtl";

    expect(DEFAULT_LOCALE_CONTEXT.name).toBe("en-US");
    expect(DEFAULT_LOCALE_CONTEXT.dir).toBe("rtl");
    expect(DEFAULT_LOCALE_CONTEXT.t("a11y.closeMessage")).toBe("Close message");
    expect(DEFAULT_LOCALE_CONTEXT.t("a11y.closeNotification")).toBe("Close notification");
  });

  it("向子组件提供 locale context", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.rtl = true;
    provider.messages = {
      common: { confirm: "OK" }
    };
    provider.innerHTML = `<elf-locale-provider-probe></elf-locale-provider-probe>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const probe = provider.querySelector("elf-locale-provider-probe")!;
    expect(provider.getAttribute("lang")).toBe("en-US");
    expect(provider.getAttribute("dir")).toBe("rtl");
    expect(probe.shadowRoot?.textContent?.trim()).toBe("en-US|rtl|OK");
  });

  it("英文 locale 使用内置英文文案", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.innerHTML = `<elf-locale-provider-probe></elf-locale-provider-probe>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const probe = provider.querySelector("elf-locale-provider-probe")!;
    expect(probe.shadowRoot?.textContent?.trim()).toBe("en-US|ltr|Confirm");
  });

  it("为常用表单和数据组件提供英文默认文案", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.innerHTML = [
      "<elf-select></elf-select>",
      "<elf-date-picker></elf-date-picker>",
      "<elf-tree></elf-tree>",
      "<elf-pagination total=20></elf-pagination>"
    ].join("");

    document.body.appendChild(provider);
    await tick();
    await tick();

    const select = provider.querySelector("elf-select")!;
    const datePicker = provider.querySelector("elf-date-picker")!;
    const tree = provider.querySelector("elf-tree")!;
    const pagination = provider.querySelector("elf-pagination")!;

    expect(select.shadowRoot?.textContent).toContain("Select");
    expect(datePicker.shadowRoot?.textContent).toContain("Select date");
    expect(tree.shadowRoot?.textContent).toContain("No data");
    expect(pagination.shadowRoot?.querySelector("nav")?.getAttribute("aria-label")).toBe(
      "Pagination"
    );
    expect(pagination.shadowRoot?.textContent).toContain("20 items");
  });

  it("显式组件文案优先于 LocaleProvider 默认文案", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.innerHTML = `<elf-select placeholder="Custom choice"></elf-select>`;

    document.body.appendChild(provider);
    await tick();
    await tick();

    const select = provider.querySelector("elf-select")!;
    expect(select.shadowRoot?.textContent).toContain("Custom choice");
  });

  it("嵌套 provider 只覆盖自己的子树", async () => {
    const outer = document.createElement("elf-locale-provider") as LocaleProviderEl;
    outer.name = "en-US";
    outer.innerHTML = `
      <elf-locale-provider-probe id="outer"></elf-locale-provider-probe>
      <elf-locale-provider id="inner" name="zh-CN">
        <elf-locale-provider-probe id="inner-probe"></elf-locale-provider-probe>
      </elf-locale-provider>
    `;
    document.body.appendChild(outer);
    await tick();
    await tick();

    expect(outer.querySelector("#outer")!.shadowRoot?.textContent).toContain("en-US|ltr|Confirm");
    expect(outer.querySelector("#inner-probe")!.shadowRoot?.textContent).toContain("zh-CN|ltr|确认");
  });

  it("格式化数字和日期时使用当前 locale 与时区", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "en-US";
    provider.timeZone = "UTC";
    provider.innerHTML = `<elf-locale-provider-format-probe></elf-locale-provider-format-probe>`;
    document.body.appendChild(provider);
    await tick();
    await tick();

    const text = provider.querySelector("elf-locale-provider-format-probe")!.shadowRoot?.textContent || "";
    expect(text).toContain("$1,234.50");
    expect(text).toContain("Jul 22, 2026");
  });

  it("委托外部 i18n adapter 并为缺失键保留内置回退", async () => {
    const provider = document.createElement("elf-locale-provider") as LocaleProviderEl;
    provider.name = "fr-FR";
    provider.adapter = defineLocaleAdapter({
      translate(path, _params, context) {
        return path === "common.confirm"
          ? `Valider · ${context.name}`
          : undefined;
      },
      formatNumber: () => "NOMBRE EXTERNE",
      formatDate: () => "DATE EXTERNE",
    });
    provider.innerHTML = [
      "<elf-locale-provider-probe></elf-locale-provider-probe>",
      "<elf-locale-provider-format-probe></elf-locale-provider-format-probe>",
      "<elf-select></elf-select>",
    ].join("");
    document.body.appendChild(provider);
    await tick();
    await tick();

    expect(
      provider.querySelector("elf-locale-provider-probe")?.shadowRoot?.textContent,
    ).toContain("fr-FR|ltr|Valider · fr-FR");
    const formatted =
      provider.querySelector("elf-locale-provider-format-probe")?.shadowRoot
        ?.textContent ?? "";
    expect(formatted).toContain("NOMBRE EXTERNE");
    expect(formatted).toContain("DATE EXTERNE");
    expect(provider.querySelector("elf-select")?.shadowRoot?.textContent).toContain(
      "Select",
    );
  });
});
