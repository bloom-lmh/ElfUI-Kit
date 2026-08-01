import { afterEach, describe, expect, it } from "vitest";

import { acquireTargetPositionContext } from "./positioning-context";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("target positioning context", () => {
  it("restores the original inline value after the final concurrent lease", () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);

    const first = acquireTargetPositionContext(target)!;
    const second = acquireTargetPositionContext(target)!;
    expect(target.style.position).toBe("relative");

    first();
    expect(target.style.position).toBe("relative");
    second();
    expect(target.style.position).toBe("static");
  });

  it("returns no lease for a target that already owns its positioning context", () => {
    const target = document.createElement("section");
    target.style.position = "absolute";
    document.body.appendChild(target);

    expect(acquireTargetPositionContext(target)).toBeNull();
    expect(target.style.position).toBe("absolute");
  });

  it("makes each release idempotent", () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);

    const first = acquireTargetPositionContext(target)!;
    const second = acquireTargetPositionContext(target)!;
    first();
    first();
    expect(target.style.position).toBe("relative");

    second();
    expect(target.style.position).toBe("static");
  });

  it("preserves an external position update made while a lease is active", () => {
    const target = document.createElement("section");
    target.style.position = "static";
    document.body.appendChild(target);

    const release = acquireTargetPositionContext(target)!;
    target.style.position = "absolute";
    release();

    expect(target.style.position).toBe("absolute");
  });
});
