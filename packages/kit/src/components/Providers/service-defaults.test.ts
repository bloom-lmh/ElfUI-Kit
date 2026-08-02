import { describe, expect, it } from "vitest";

import { resolveServiceOptions } from "./service-defaults";

describe("service defaults", () => {
  it("applies configured defaults before call-site options", () => {
    const resolved = resolveServiceOptions(
      { duration: 5000, closable: true, position: "top" },
      { message: "saved", duration: 0 },
    );

    expect(resolved).toEqual({
      message: "saved",
      duration: 0,
      closable: true,
      position: "top",
    });
  });

  it("does not mutate either input object", () => {
    const defaults = { duration: 5000 };
    const options = { message: "saved" };
    const resolved = resolveServiceOptions(defaults, options);

    expect(resolved).not.toBe(defaults);
    expect(resolved).not.toBe(options);
    expect(defaults).toEqual({ duration: 5000 });
    expect(options).toEqual({ message: "saved" });
  });
});
