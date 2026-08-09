import { describe, expect, it } from "vitest";

import { installUtilityStyles } from "./utilities";

describe("installUtilityStyles", () => {
  it("installs into a document head across DOM realms", () => {
    const target = document.implementation.createHTMLDocument("consumer");
    const dispose = installUtilityStyles(target);

    const style = target.head.querySelector('style[data-elfui-utilities=""]');
    expect(style?.ownerDocument).toBe(target);

    dispose();
    expect(target.head.querySelector("style")).toBeNull();
  });

  it("installs once per target and removes owned styles after the final disposer", () => {
    const root = document.createElement("div").attachShadow({ mode: "open" });
    const disposeFirst = installUtilityStyles(root);
    const disposeSecond = installUtilityStyles(root);

    expect(root.querySelectorAll('style[data-elfui-utilities=""]')).toHaveLength(1);

    disposeFirst();
    disposeFirst();
    expect(root.querySelector("style")).toBeTruthy();
    disposeSecond();
    expect(root.querySelector("style")).toBeNull();
  });
});
