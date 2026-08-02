// path 工具测试

import { describe, expect, it } from "vitest";

import { getPath, setPath } from "../../utils/path";

describe("getPath", () => {
  it("一级", () => {
    expect(getPath({ a: 1 }, "a")).toBe(1);
  });
  it("嵌套", () => {
    expect(getPath({ a: { b: { c: 5 } } }, "a.b.c")).toBe(5);
  });
  it("数组下标", () => {
    expect(getPath({ list: [{ x: 1 }, { x: 2 }] }, "list.1.x")).toBe(2);
  });
  it("路径不存在返回 undefined", () => {
    expect(getPath({ a: 1 }, "x.y")).toBeUndefined();
  });
});

describe("setPath", () => {
  it("一级", () => {
    const o: Record<string, unknown> = {};
    setPath(o, "a", 1);
    expect(o.a).toBe(1);
  });
  it("嵌套自动建路径", () => {
    const o: Record<string, unknown> = {};
    setPath(o, "a.b.c", 5);
    expect((o.a as { b: { c: number } }).b.c).toBe(5);
  });
  it("已存在路径覆盖", () => {
    const o = { a: { b: 1 } };
    setPath(o as Record<string, unknown>, "a.b", 99);
    expect(o.a.b).toBe(99);
  });
});
