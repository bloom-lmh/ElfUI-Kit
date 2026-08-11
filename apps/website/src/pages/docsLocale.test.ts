import { afterEach, describe, expect, it } from "vitest";

import { createDocsPicker, createDocsTranslator } from "./docsLocale";

afterEach(() => {
  document.documentElement.lang = "zh-CN";
});

describe("docs locale helpers", () => {
  it("reads the active locale when each message is rendered", () => {
    document.documentElement.lang = "zh-CN";
    const translate = createDocsTranslator({
      title: { zh: "按钮", en: "Button" },
    });
    const pick = createDocsPicker();

    expect(translate("title")).toBe("按钮");
    expect(pick("中文", "English")).toBe("中文");

    document.documentElement.lang = "en-US";

    expect(translate("title")).toBe("Button");
    expect(pick("中文", "English")).toBe("English");
  });
});
