import { describe, expect, it } from "vitest";

import {
  deserializeNativeFormValue,
  isNativeFormValueEmpty,
  serializeNativeFormValue,
} from "../native-form";

describe("native form value protocol", () => {
  it("serializes named scalar values without changing their public model type", () => {
    expect(serializeNativeFormValue("Ada", { name: "user" })).toBe("Ada");
    expect(serializeNativeFormValue(42, { name: "count" })).toBe("42");
    expect(serializeNativeFormValue(true, { name: "enabled" })).toBe("true");
    expect(serializeNativeFormValue(false, { name: "enabled", omitFalse: true })).toBeNull();
  });

  it("excludes unnamed and nullish values", () => {
    expect(serializeNativeFormValue("Ada", { name: "" })).toBeNull();
    expect(serializeNativeFormValue(null, { name: "user" })).toBeNull();
    expect(serializeNativeFormValue(undefined, { name: "user" })).toBeNull();
    expect(serializeNativeFormValue(Number.NaN, { name: "count" })).toBeNull();
  });

  it("serializes arrays as repeated FormData entries", () => {
    const serialized = serializeNativeFormValue(["a", 2, true], { name: "tag" });

    expect(serialized).toBeInstanceOf(FormData);
    expect((serialized as FormData).getAll("tag")).toEqual(["a", "2", "true"]);
    expect(serializeNativeFormValue([], { name: "tag" })).toBeNull();
  });

  it("preserves files and uses ISO strings for dates", () => {
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const date = new Date("2026-08-14T00:00:00.000Z");

    expect(serializeNativeFormValue(file, { name: "avatar" })).toBe(file);
    expect(serializeNativeFormValue(date, { name: "createdAt" })).toBe("2026-08-14T00:00:00.000Z");
  });

  it("restores primitive and repeated values using the current model shape", () => {
    const repeated = new FormData();
    repeated.append("count", "1");
    repeated.append("count", "2");

    expect(deserializeNativeFormValue("7", 0, "count")).toBe(7);
    expect(deserializeNativeFormValue("true", false, "enabled")).toBe(true);
    expect(deserializeNativeFormValue(repeated, [0], "count")).toEqual([1, 2]);
  });

  it("defines required-value emptiness consistently", () => {
    expect(isNativeFormValueEmpty("")).toBe(true);
    expect(isNativeFormValueEmpty(false)).toBe(true);
    expect(isNativeFormValueEmpty([])).toBe(true);
    expect(isNativeFormValueEmpty(0)).toBe(false);
    expect(isNativeFormValueEmpty([0])).toBe(false);
  });
});
