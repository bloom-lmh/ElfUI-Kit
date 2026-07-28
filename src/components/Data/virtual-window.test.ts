import { describe, expect, it } from "vitest";
import {
  buildVirtualOffsets,
  computeVariableVirtualWindow,
  computeVirtualWindow
} from "./virtual-window";

describe("virtual-window", () => {
  it("clamps and overscans a fixed-size range", () => {
    expect(computeVirtualWindow({
      count: 1000,
      itemSize: 40,
      viewportSize: 200,
      scrollOffset: 400,
      overscan: 2
    })).toEqual({ start: 8, end: 17, offset: 320, totalSize: 40000 });

    expect(computeVirtualWindow({
      count: 0,
      itemSize: 0,
      viewportSize: 200,
      scrollOffset: -10
    })).toEqual({ start: 0, end: 0, offset: 0, totalSize: 0 });
  });

  it("builds monotonic variable-size offsets with stable fallbacks", () => {
    expect(buildVirtualOffsets(
      [48, Number.NaN, 0, 72],
      (size) => size,
      40
    )).toEqual([0, 48, 88, 128, 200]);
  });

  it("uses binary-search ranges for variable-size collections", () => {
    const offsets = buildVirtualOffsets([40, 80, 60, 100, 50], (size) => size);

    expect(computeVariableVirtualWindow({
      offsets,
      viewportSize: 100,
      scrollOffset: 90,
      overscan: 1
    })).toEqual({ start: 0, end: 5, offset: 0, totalSize: 330 });

    expect(computeVariableVirtualWindow({
      offsets,
      viewportSize: 100,
      scrollOffset: 1000,
      overscan: 0
    })).toEqual({ start: 3, end: 5, offset: 180, totalSize: 330 });
  });

  it("returns an empty window for an empty offset model", () => {
    expect(computeVariableVirtualWindow({
      offsets: [0],
      viewportSize: 200,
      scrollOffset: 100
    })).toEqual({ start: 0, end: 0, offset: 0, totalSize: 0 });
  });
});
